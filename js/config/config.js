// Cấu hình dùng chung cho frontend.
//
// DATA_BASE_PATH: tự tính đường dẫn tới thư mục /data dựa trên độ sâu của trang
// hiện tại, để js/api/*.js gọi fetch() đúng dù trang nằm ở pages/ hay pages/admin/.
// Khi có backend thật, chỉ cần đổi API_BASE_URL rồi sửa các hàm trong js/api/
// từ fetch(`${DATA_BASE_PATH}/...json`) sang fetch(`${API_BASE_URL}/...`).
function resolveDataBasePath() {
  const path = window.location.pathname;
  if (path.includes('/pages/admin/')) return '../../data';
  if (path.includes('/pages/')) return '../data';
  return './data';
}

const APP_CONFIG = {
  API_BASE_URL: '', // để trống vì chưa có backend — sẽ điền vd "http://localhost:8080/api"
  DATA_BASE_PATH: resolveDataBasePath(),
};
