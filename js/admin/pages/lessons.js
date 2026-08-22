document.addEventListener('DOMContentLoaded', () => {
  const HSK_OPTIONS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map(v => ({ value: v, label: v }));
  const STATUS_OPTIONS = [
    { value: 'draft', label: 'Nháp' },
    { value: 'published', label: 'Đã xuất bản' },
  ];

  initAdminCrudPage({
    dataLoader: getLessonsIndex,
    storageKey: STORAGE_KEYS.LESSONS,
    idField: 'id',
    idPrefix: 'lesson',
    entityLabel: 'bài học',
    onView: (item) => window.open(`../lesson.html?id=${encodeURIComponent(item.id)}`, '_blank'),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Tên bài học' },
      { key: 'hskLevel', label: 'HSK' },
      { key: 'topic', label: 'Chủ đề' },
      { key: 'vocabCount', label: 'Số từ vựng' },
      {
        key: 'status', label: 'Trạng thái',
        format: (val) => `<span class="admin-badge ${val === 'published' ? 'success' : 'muted'}">${val === 'published' ? 'Đã xuất bản' : 'Nháp'}</span>`,
      },
    ],
    fields: [
      { key: 'title', label: 'Tên bài học', type: 'text', required: true },
      { key: 'hskLevel', label: 'Cấp độ HSK', type: 'select', options: HSK_OPTIONS, required: true },
      { key: 'topic', label: 'Chủ đề', type: 'text' },
      { key: 'description', label: 'Mô tả', type: 'textarea' },
      { key: 'order', label: 'Thứ tự bài', type: 'number' },
      { key: 'status', label: 'Trạng thái', type: 'select', options: STATUS_OPTIONS, required: true },
    ],
  });
});
