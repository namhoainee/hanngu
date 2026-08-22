/**
 * Lớp truy cập dữ liệu dùng CHUNG cho toàn bộ frontend (Admin + trang học bài).
 *
 * Đây là nơi duy nhất quyết định "dữ liệu hiệu lực" (effective data) của 1 tập dữ liệu
 * (vocabulary/grammar/dialogues/quiz/lessons-index) là gì:
 *   - Nếu đã có bản đã sửa qua Admin lưu trong localStorage -> dùng bản đó.
 *   - Nếu chưa -> lấy từ file JSON gốc trong /data (qua js/api/*.js).
 *
 * QUAN TRỌNG: cả js/admin/adminCrud.js (bảng CRUD trong Admin) lẫn
 * js/api/lessonApi.js (trang xem bài học) đều gọi CÙNG hàm này với CÙNG storageKey
 * cho mỗi loại dữ liệu -> khi Admin thêm/sửa/xóa, trang Lesson thấy thay đổi ngay,
 * không cần chờ có backend thật.
 *
 * Khi chuyển sang Spring Boot: chỉ cần đổi phần "dataLoader" (đang là fetch JSON)
 * thành gọi REST API, và bỏ lớp localStorage này đi — phần gọi loadLocalCollection()
 * ở nơi khác không cần sửa.
 */
function loadLocalCollection(storageKey, dataLoader) {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch (e) {
      // Dữ liệu trong localStorage bị hỏng (không phải JSON hợp lệ) -> bỏ qua, dùng nguồn gốc
    }
  }
  return dataLoader();
}

// Tên storageKey dùng chung, để adminCrud.js và lessonApi.js không bị gõ nhầm key khác nhau
// cho cùng 1 loại dữ liệu (đó là nguyên nhân phổ biến nhất khiến Admin sửa mà Lesson không thấy).
const STORAGE_KEYS = {
  LESSONS: 'linghan_lessons',
  VOCABULARY: 'linghan_vocabulary',
  GRAMMAR: 'linghan_grammar',
  DIALOGUES: 'linghan_dialogues',
  QUIZ: 'linghan_quizzes',
};
