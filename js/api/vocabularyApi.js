// Lớp truy cập dữ liệu Từ vựng.
// Hiện tại: đọc file JSON tĩnh trong /data/vocabulary/all-vocabulary.json.
// Sau này: GET /api/vocabulary, POST /api/vocabulary,
//          PUT /api/vocabulary/{id}, DELETE /api/vocabulary/{id}

function getAllVocabulary() {
  return fetch(`${APP_CONFIG.DATA_BASE_PATH}/vocabulary/all-vocabulary.json`)
    .then(res => res.json())
    .then(data => data.vocabulary);
}

// Bản "hiệu lực": ưu tiên dữ liệu đã sửa qua Admin (localStorage) nếu có.
// Trang xem bài học (lesson.js) dùng hàm này để luôn khớp với Admin.
function getAllVocabularyEffective() {
  return loadLocalCollection(STORAGE_KEYS.VOCABULARY, getAllVocabulary);
}
