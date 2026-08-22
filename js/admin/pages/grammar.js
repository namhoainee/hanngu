document.addEventListener('DOMContentLoaded', () => {
  const HSK_OPTIONS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map(v => ({ value: v, label: v }));

  getLessonsIndexEffective().then(lessons => {
    const LESSON_OPTIONS = lessons.map(l => ({ value: l.id, label: l.title }));

    initAdminCrudPage({
      dataLoader: getAllGrammar,
      storageKey: STORAGE_KEYS.GRAMMAR,
      idField: 'id',
      idPrefix: 'grammar',
      entityLabel: 'điểm ngữ pháp',
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Tên điểm ngữ pháp' },
        { key: 'hskLevel', label: 'HSK' },
        { key: 'lessonTitle', label: 'Bài học' },
      ],
      fields: [
        { key: 'title', label: 'Tên điểm ngữ pháp', type: 'text', required: true },
        { key: 'hskLevel', label: 'Cấp độ HSK', type: 'select', options: HSK_OPTIONS, required: true },
        { key: 'explain', label: 'Giải thích', type: 'textarea', required: true },
        { key: 'example', label: 'Ví dụ', type: 'text' },
        { key: 'examplePinyin', label: 'Pinyin ví dụ', type: 'text' },
        { key: 'exampleVi', label: 'Dịch ví dụ', type: 'text' },
        {
          key: 'lessonId', label: 'Bài học liên quan', type: 'select', options: LESSON_OPTIONS,
          getValue: (item) => (item && item.lessonId) || '',
        },
      ],
      onBeforeSave: (values) => {
        const lesson = lessons.find(l => l.id === values.lessonId);
        return { ...values, lessonTitle: lesson ? lesson.title : '' };
      },
    });
  });
});
