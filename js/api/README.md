# js/api/

Lớp truy cập dữ liệu — mọi trang (public + admin) gọi qua đây thay vì tự viết `fetch()` rải rác.

Hiện tại mỗi hàm đọc file JSON tĩnh trong `frontend/data/`. Khi có backend Spring Boot,
chỉ cần sửa nội dung bên trong các hàm này (đổi `fetch(DATA_BASE_PATH/...)` thành
`fetch(API_BASE_URL/...)`), phần gọi ở nơi khác (`pages/*.js`, `admin/*.js`) không cần đổi gì.

| File               | Hàm                          | Sau này thay bằng REST endpoint         |
|---------------------|-------------------------------|-------------------------------------------|
| coursesApi.js       | getCourses()                  | GET /api/courses                          |
| lessonApi.js        | getLessonsIndex()             | GET /api/lessons                          |
| lessonApi.js        | getLessonById(id)             | GET /api/lessons/{id}                     |
| vocabularyApi.js     | getAllVocabulary()             | GET/POST/PUT/DELETE /api/vocabulary       |
| grammarApi.js        | getAllGrammar()                 | GET/POST/PUT/DELETE /api/grammar          |
| dialogueApi.js        | getAllDialogues()                | GET/POST/PUT/DELETE /api/dialogues        |
| quizApi.js             | getAllQuiz()                      | GET/POST/PUT/DELETE /api/quizzes          |

Yêu cầu: các trang dùng file này phải include `js/config/config.js` TRƯỚC nó (để có biến `APP_CONFIG`),
và phải chạy qua local server (Live Server...), vì `fetch()` không hoạt động khi mở file trực tiếp bằng `file://`.
