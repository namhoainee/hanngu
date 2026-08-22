/**
 * Admin CRUD engine dùng chung cho các trang quản lý
 * (Lessons, Vocabulary, Grammar, Dialogues, Quizzes).
 *
 * QUAN TRỌNG — đây là bản mô phỏng cho GIAI ĐOẠN CHƯA CÓ BACKEND:
 * - Dữ liệu gốc đọc 1 lần từ file JSON qua js/api/*.js (options.dataLoader).
 * - Thêm/Sửa/Xóa chỉ thay đổi mảng trong bộ nhớ trình duyệt + lưu tạm vào
 *   localStorage (theo options.storageKey) để không mất khi F5, KHÔNG ghi
 *   đè lên file JSON gốc trong /data (frontend thuần không ghi được file).
 * - Khi làm Spring Boot thật: chỉ cần thay 3 chỗ Thêm/Sửa/Xóa bên dưới
 *   (trong handleSubmit và deleteItem) bằng gọi POST/PUT/DELETE tới API —
 *   phần giao diện (bảng, form, modal) giữ nguyên không phải viết lại.
 *
 * options:
 *   dataLoader()        -> Promise<Array>   hàm lấy dữ liệu gốc (từ js/api/)
 *   storageKey           string              khóa localStorage
 *   columns               [{key,label,format?(value,item)}]
 *   fields                 [{key,label,type,required?,options?,getValue?(item),serialize?(value),parse?(raw)}]
 *   onBeforeSave?(values, editingItem) -> object  (gộp thêm field tính toán trước khi lưu)
 *   idField='id', idPrefix='item', entityLabel='mục'
 *   search?    { inputId, fields: ['hanzi','pinyin',...] }  -> lọc theo từ khóa (không phân biệt hoa/thường)
 *   filters?   [{ selectId, key }]  -> mỗi select lọc theo đúng 1 field; option được tự sinh
 *              từ các giá trị có thật trong dữ liệu (không cần khai báo cứng danh sách)
 */
function initAdminCrudPage(options) {
  const {
    dataLoader,
    storageKey,
    columns,
    fields,
    onBeforeSave,
    onView,
    search,
    filters,
    idField = 'id',
    idPrefix = 'item',
    entityLabel = 'mục',
    tableBodyId = 'tableBody',
    tableHeadId = 'tableHead',
    addBtnId = 'btnAddNew',
    modalId = 'formModal',
    formId = 'entityForm',
    formFieldsId = 'formFields',
    formTitleId = 'formModalTitle',
  } = options;

  let items = [];
  let editingId = null;
  let searchQuery = '';
  const activeFilters = {}; // { [filterKey]: selectedValue }

  // Trả về danh sách sau khi áp dụng ô tìm kiếm + các bộ lọc đang chọn.
  // Không đổi mảng `items` gốc — chỉ lọc để hiển thị.
  // Bỏ dấu (thanh điệu Pinyin: nǐ hǎo, và dấu tiếng Việt: Xin chào) để tìm không
  // cần gõ dấu vẫn ra kết quả — rất cần thiết cho web học tiếng Trung/Việt.
  function stripDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function getVisibleItems() {
    let visible = items;

    if (search && searchQuery) {
      const q = stripDiacritics(searchQuery.toLowerCase());
      visible = visible.filter(item =>
        search.fields.some(f => stripDiacritics(String(item[f] || '').toLowerCase()).includes(q))
      );
    }

    if (filters) {
      filters.forEach(f => {
        const selected = activeFilters[f.key];
        if (selected) visible = visible.filter(item => String(item[f.key]) === String(selected));
      });
    }

    return visible;
  }

  // Sinh danh sách option cho mỗi <select> lọc từ chính giá trị có trong dữ liệu,
  // để không phải khai báo cứng (thêm Lesson/HSK mới tự động xuất hiện trong bộ lọc).
  function populateFilterOptions() {
    if (!filters) return;
    filters.forEach(f => {
      const select = document.getElementById(f.selectId);
      if (!select) return;
      const currentValue = select.value;
      const uniqueValues = [...new Set(items.map(i => i[f.key]).filter(Boolean))].sort();
      const placeholderOption = select.querySelector('option[value=""]');
      select.innerHTML = (placeholderOption ? placeholderOption.outerHTML : '<option value="">Tất cả</option>')
        + uniqueValues.map(v => `<option value="${escapeHTML(String(v))}">${escapeHTML(String(v))}</option>`).join('');
      select.value = currentValue; // giữ lại lựa chọn đang chọn nếu vẫn còn hợp lệ
    });
  }

  function initSearchAndFilters() {
    if (search) {
      const input = document.getElementById(search.inputId);
      if (input) {
        input.addEventListener('input', () => {
          searchQuery = input.value.trim();
          renderTableBody();
        });
      }
    }
    if (filters) {
      filters.forEach(f => {
        const select = document.getElementById(f.selectId);
        if (select) {
          select.addEventListener('change', () => {
            activeFilters[f.key] = select.value;
            renderTableBody();
          });
        }
      });
    }
  }

  function loadFromStorageOrSource() {
    // Dùng chung với lessonApi.js (js/utils/localData.js) để Admin sửa gì,
    // trang Lesson thấy ngay — không có 2 phiên bản logic đọc localStorage khác nhau.
    return loadLocalCollection(storageKey, dataLoader);
  }

  function persist() {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  function renderTableHead() {
    const head = document.getElementById(tableHeadId);
    if (!head) return;
    head.innerHTML = `<tr>${columns.map(c => `<th>${c.label}</th>`).join('')}<th>Thao tác</th></tr>`;
  }

  function formatCell(item, col) {
    const val = item[col.key];
    if (col.format) return col.format(val, item);
    if (val === undefined || val === null || val === '') return '<span class="admin-cell-empty">—</span>';
    return escapeHTML(String(val));
  }

  function renderTableBody() {
    const body = document.getElementById(tableBodyId);
    if (!body) return;

    const visibleItems = getVisibleItems();

    if (items.length === 0) {
      body.innerHTML = `<tr><td colspan="${columns.length + 1}" class="admin-table-empty">Chưa có dữ liệu. Bấm "Thêm ${entityLabel}" để tạo mới.</td></tr>`;
      return;
    }
    if (visibleItems.length === 0) {
      body.innerHTML = `<tr><td colspan="${columns.length + 1}" class="admin-table-empty">Không tìm thấy ${entityLabel} nào khớp.</td></tr>`;
      return;
    }

    body.innerHTML = visibleItems.map(item => `
      <tr>
        ${columns.map(c => `<td>${formatCell(item, c)}</td>`).join('')}
        <td class="admin-table-actions">
          ${onView ? `<button class="admin-icon-btn" data-action="view" data-id="${item[idField]}" title="Xem chi tiết"><i class="fas fa-eye"></i></button>` : ''}
          <button class="admin-icon-btn" data-action="edit" data-id="${item[idField]}" title="Sửa"><i class="fas fa-pen"></i></button>
          <button class="admin-icon-btn danger" data-action="delete" data-id="${item[idField]}" title="Xóa"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');

    if (onView) {
      body.querySelectorAll('[data-action="view"]').forEach(btn => {
        btn.addEventListener('click', () => onView(items.find(i => String(i[idField]) === String(btn.dataset.id))));
      });
    }
    body.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => openForm(btn.dataset.id));
    });
    body.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => deleteItem(btn.dataset.id));
    });
  }

  function renderFormFields(item) {
    const container = document.getElementById(formFieldsId);
    container.innerHTML = fields.map(f => {
      let value = f.getValue ? f.getValue(item || {}) : (item ? item[f.key] : '');
      if (value === undefined || value === null) value = '';
      if (f.serialize) value = f.serialize(value);

      if (f.type === 'textarea') {
        return `<div class="admin-form-group"><label>${f.label}${f.required ? ' *' : ''}</label><textarea name="${f.key}" rows="4" ${f.required ? 'required' : ''}>${escapeHTML(String(value))}</textarea></div>`;
      }
      if (f.type === 'select') {
        return `<div class="admin-form-group"><label>${f.label}${f.required ? ' *' : ''}</label>
          <select name="${f.key}" ${f.required ? 'required' : ''}>
            ${f.options.map(opt => `<option value="${opt.value}" ${String(opt.value) === String(value) ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select></div>`;
      }
      return `<div class="admin-form-group"><label>${f.label}${f.required ? ' *' : ''}</label><input type="${f.type || 'text'}" name="${f.key}" value="${escapeHTML(String(value))}" ${f.required ? 'required' : ''}></div>`;
    }).join('');
  }

  function openForm(id) {
    editingId = id || null;
    const item = editingId ? items.find(i => String(i[idField]) === String(editingId)) : null;
    document.getElementById(formTitleId).textContent = item ? `Sửa ${entityLabel}` : `Thêm ${entityLabel}`;
    renderFormFields(item);
    openModal(modalId);
  }

  function deleteItem(id) {
    if (!window.confirm(`Xóa ${entityLabel} này? Hành động không thể hoàn tác.`)) return;
    items = items.filter(i => String(i[idField]) !== String(id));
    persist();
    populateFilterOptions();
    renderTableBody();
    showToast(`Đã xóa ${entityLabel}`, 'success');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let values = {};
    fields.forEach(f => {
      const raw = formData.get(f.key) || '';
      values[f.key] = f.parse ? f.parse(raw) : raw;
    });

    if (onBeforeSave) values = onBeforeSave(values, editingId ? items.find(i => String(i[idField]) === String(editingId)) : null);

    if (editingId) {
      const idx = items.findIndex(i => String(i[idField]) === String(editingId));
      if (idx > -1) items[idx] = { ...items[idx], ...values };
      showToast(`Đã cập nhật ${entityLabel}`, 'success');
    } else {
      const newId = `${idPrefix}-${Date.now()}`;
      items.push({ [idField]: newId, ...values });
      showToast(`Đã thêm ${entityLabel} mới`, 'success');
    }

    persist();
    populateFilterOptions();
    renderTableBody();
    closeModal(modalId);
  }

  const addBtn = document.getElementById(addBtnId);
  if (addBtn) addBtn.addEventListener('click', () => openForm(null));

  const form = document.getElementById(formId);
  if (form) form.addEventListener('submit', handleSubmit);

  document.querySelectorAll(`#${modalId} [data-close-modal]`).forEach(btn => {
    btn.addEventListener('click', () => closeModal(modalId));
  });

  renderTableHead();
  initSearchAndFilters();
  loadFromStorageOrSource().then(data => {
    items = data;
    populateFilterOptions();
    renderTableBody();
  }).catch(err => {
    const body = document.getElementById(tableBodyId);
    if (body) body.innerHTML = `<tr><td colspan="${columns.length + 1}">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
    showToast('Lỗi tải dữ liệu: ' + err.message, 'info');
  });
}
