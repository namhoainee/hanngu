document.addEventListener('DOMContentLoaded', () => {
  const HSK_OPTIONS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map(v => ({ value: v, label: v }));

  // Phải lấy danh sách bài học TRƯỚC khi dựng form, để dropdown "Bài học liên quan"
  // chọn theo lessonId thật (không gõ tay tên bài học) — tránh sai liên kết dữ liệu.
  getLessonsIndexEffective().then(lessons => {
    const LESSON_OPTIONS = lessons.map(l => ({ value: l.id, label: l.title }));

    initAdminCrudPage({
      dataLoader: getAllVocabulary,
      storageKey: STORAGE_KEYS.VOCABULARY,
      idField: 'id',
      idPrefix: 'vocab',
      entityLabel: 'từ vựng',
      search: { inputId: 'vocabSearchInput', fields: ['hanzi', 'pinyin', 'meaningVi'] },
      filters: [
        { selectId: 'vocabFilterHsk', key: 'hskLevel' },
        { selectId: 'vocabFilterLesson', key: 'lessonTitle' },
      ],
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'hanzi', label: 'Hán Tự' },
        { key: 'pinyin', label: 'Pinyin' },
        { key: 'meaningVi', label: 'Nghĩa' },
        { key: 'hskLevel', label: 'HSK' },
        { key: 'lessonTitle', label: 'Bài học' },
      ],
      fields: [
        { key: 'hanzi', label: 'Hán tự', type: 'text', required: true },
        { key: 'pinyin', label: 'Pinyin', type: 'text', required: true },
        { key: 'meaningVi', label: 'Nghĩa tiếng Việt', type: 'text', required: true },
        { key: 'meaningEn', label: 'Nghĩa tiếng Anh', type: 'text' },
        { key: 'wordType', label: 'Loại từ', type: 'text' },
        { key: 'example', label: 'Ví dụ tiếng Trung', type: 'text' },
        { key: 'examplePinyin', label: 'Pinyin ví dụ', type: 'text' },
        { key: 'exampleVi', label: 'Dịch ví dụ', type: 'text' },
        { key: 'hskLevel', label: 'Cấp độ HSK', type: 'select', options: HSK_OPTIONS, required: true },
        {
          key: 'lessonId', label: 'Bài học liên quan', type: 'select', options: LESSON_OPTIONS,
          getValue: (item) => (item && item.lessonId) || '',
        },
        { key: 'imageUrl', label: 'Hình ảnh (URL)', type: 'text' },
        { key: 'audioUrl', label: 'Audio (URL)', type: 'text' },
      ],
      // Tự suy ra lessonTitle (chỉ để hiển thị) từ lessonId thật vừa chọn —
      // đây là nguồn liên kết thật sự để js/api/lessonApi.js lọc đúng từ vựng của Lesson 1.
      onBeforeSave: (values) => {
        const lesson = lessons.find(l => l.id === values.lessonId);
        return { ...values, lessonTitle: lesson ? lesson.title : '' };
      },
    });
  });
});
