// Lớp truy cập dữ liệu Khóa học (Course/Level).
// Hiện tại: đọc file JSON tĩnh trong /data.
// Sau này: đổi thành fetch(`${APP_CONFIG.API_BASE_URL}/courses`) — GET /api/courses.

function getCourses() {
  return fetch(`${APP_CONFIG.DATA_BASE_PATH}/courses.json`)
    .then(res => res.json())
    .then(data => data.courses);
}
