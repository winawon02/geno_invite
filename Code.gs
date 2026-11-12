const SPREADSHEET_ID='1EXvuiDujuuckrf4m87eMLzFaI5ZhM1blLE_FzyO8iik';
const SHEET_NAME='RSVP';
const HEADERS=['연락처_고유키','이름','참석여부','최초회신일시','최종수정일시','개인정보동의'];
function json(data,mime){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(mime||ContentService.MimeType.JSON);}
function doGet(e){
 const p=(e&&e.parameter)||{};
 if(p.action!=='status')return json({ok:true,service:'GENOBODY RSVP'});
 const id=String(p.id||'').slice(0,100),callback=String(p.callback||'');
 if(!/^[A-Za-z_$][A-Za-z0-9_$]{0,80}$/.test(callback)||!/^[a-zA-Z0-9_-]{10,100}$/.test(id))return json({error:'invalid'});
 const cached=CacheService.getScriptCache().get('rsvp_'+id);
 return ContentService.createTextOutput(callback+'('+JSON.stringify(cached?JSON.parse(cached):{state:'pending'})+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function doPost(e){
 const lock=LockService.getScriptLock();let id='';
 try{
  const body=JSON.parse((e&&e.postData&&e.postData.contents)||'{}');
  id=String(body.requestId||'').slice(0,100);
  if(!/^[a-zA-Z0-9_-]{10,100}$/.test(id))return json({ok:false,message:'요청 ID 오류'});
  const name=String(body.name||'').trim().slice(0,30);
  let phone=String(body.phone||'').replace(/\D/g,'');
  if(phone.startsWith('82')&&phone.length===12)phone='0'+phone.slice(2);
  const attendance=body.attendance;
  if(!name||!/^01[016789]\d{7,8}$/.test(phone)||!['참석','불참'].includes(attendance)||body.consent!==true){
   CacheService.getScriptCache().put('rsvp_'+id,JSON.stringify({state:'done',ok:false,message:'입력값 오류'}),600);
   return json({ok:false});
  }
  lock.waitLock(15000);
  const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if(!sheet)throw new Error('RSVP tab not found');
  if(sheet.getLastRow()===0)sheet.appendRow(HEADERS);
  const last=sheet.getLastRow(),now=new Date();let row=0;
  if(last>1){const found=sheet.getRange(2,1,last-1,1).createTextFinder(phone).matchEntireCell(true).findNext();if(found)row=found.getRow();}
  const safeName=/^[=+\-@\t\r]/.test(name)?"'"+name:name;
  if(row){
   sheet.getRange(row,2,1,2).setValues([[safeName,attendance]]);
   sheet.getRange(row,5,1,2).setValues([[now,'동의']]);
  }else{
   row=last+1;sheet.getRange(row,1).setNumberFormat('@');
   sheet.getRange(row,1,1,6).setValues([[phone,safeName,attendance,now,now,'동의']]);
  }
  SpreadsheetApp.flush();
  CacheService.getScriptCache().put('rsvp_'+id,JSON.stringify({state:'done',ok:true,updated:row<=last}),600);
  return json({ok:true});
 }catch(err){
  if(id&&/^[a-zA-Z0-9_-]{10,100}$/.test(id))CacheService.getScriptCache().put('rsvp_'+id,JSON.stringify({state:'done',ok:false,message:'저장 오류'}),600);
  return json({ok:false,message:'저장 오류'});
 }finally{if(lock.hasLock())lock.releaseLock();}
}
