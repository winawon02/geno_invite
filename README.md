# GENOBODY PRIVATE SOCIAL NIGHT 2026

초대장: 2026.12.19 18:30–20:30. 모바일 봉투 열기/접기, 참석/불참 회신, 공유, 캘린더 추가.

Google Sheets: https://docs.google.com/spreadsheets/d/1EXvuiDujuuckrf4m87eMLzFaI5ZhM1blLE_FzyO8iik/edit

## 남은 배포 절차
1. 구글 시트 > 확장 프로그램 > Apps Script 에서 이 저장소의 Code.gs 파일을 붙여넣고 저장.
2. 배포 > 새 배포 > 웹 앱. 실행 사용자: 나 / 액세스: 모든 사용자.
3. 배포된 /exec URL을 config.js의 appsScriptUrl 값에 입력하여 커밋.
4. GitHub Settings > Pages 에서 main / root 브랜치로 Pages 활성화.
5. https://winawon02.github.io/geno_invite/ 에서 회신 테스트하고 시트 반영 확인.

연락처는 숫자만 보존하여 고유키로 사용. 동일 번호는 기존 응답 갱신. LockService 사용.
GitHub Pages와 Google Apps Script 사이 응답은 CORS 제약이 있으므로 no-cors POST + 난수 ID 기반 JSONP 상태조회로 저장 결과 확인.
인증 없는 공개 폼이므로 타인이 같은 번호로 재회신할 가능성과 남용 가능성을 고려하세요.
시트는 비공개로 유지하고 행사 종료 30일 이내 개인정보를 삭제하세요.
