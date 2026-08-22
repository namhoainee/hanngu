document.addEventListener('DOMContentLoaded', () => {
  const HSK_OPTIONS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map(v => ({ value: v, label: v }));
  const TYPE_OPTIONS = [
    { value: 'multiple_choice', label: 'Trắc nghiệm (4 đáp án)' },
    // Sau này mở rộng thêm: fill_blank (điền từ), listening (nghe chọn đáp án)...
  ];
  const LETTER_OPTIONS = ['A', 'B', 'C', 'D'].map(v => ({ value: v, label: v }));

  function optionAt(item, idx) {
    return item && Array.isArray(item.options) ? (item.options[idx] || '') : '';
  }

  getLessonsIndexEffective().then(lessons => {
    const LESSON_OPTIONS = lessons.map(l => ({ value: l.id, label: l.title }));

    initAdminCrudPage({
      dataLoader: getAllQuiz,
      storageKey: STORAGE_KEYS.QUIZ,
      idField: 'id',
      idPrefix: 'quiz',
      entityLabel: 'câu hỏi',
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'question', label: 'Câu hỏi' },
        {
          key: 'correctIndex', label: 'Đáp án đúng',
          format: (val) => (val === undefined || val === null) ? '—' : ['A', 'B', 'C', 'D'][val] || '—',
        },
        { key: 'lessonTitle', label: 'Bài học' },
        { key: 'hskLevel', label: 'HSK' },
      ],
      fields: [
        { key: 'question', label: 'Câu hỏi', type: 'textarea', required: true },
        { key: 'type', label: 'Loại câu hỏi', type: 'select', options: TYPE_OPTIONS },
        { key: 'optionA', label: 'Đáp án A', type: 'text', required: true, getValue: (item) => optionAt(item, 0) },
        { key: 'optionB', label: 'Đáp án B', type: 'text', required: true, getValue: (item) => optionAt(item, 1) },
        { key: 'optionC', label: 'Đáp án C', type: 'text', getValue: (item) => optionAt(item, 2) },
        { key: 'optionD', label: 'Đáp án D', type: 'text', getValue: (item) => optionAt(item, 3) },
        {
          key: 'correctLetter', label: 'Đáp án đúng', type: 'select', options: LETTER_OPTIONS, required: true,
          getValue: (item) => (item && item.correctIndex !== undefined) ? ['A', 'B', 'C', 'D'][item.correctIndex] : 'A',
        },
        { key: 'explain', label: 'Giải thích', type: 'textarea' },
        {
          key: 'lessonId', label: 'Bài học liên quan', type: 'select', options: LESSON_OPTIONS,
          getValue: (item) => (item && item.lessonId) || '',
        },
        { key: 'hskLevel', label: 'Cấp độ HSK', type: 'select', options: HSK_OPTIONS },
      ],
      onBeforeSave: (values) => {
        const options = [values.optionA, values.optionB, values.optionC, values.optionD].filter(v => v !== '');
        const correctIndex = ['A', 'B', 'C', 'D'].indexOf(values.correctLetter);
        const lesson = lessons.find(l => l.id === values.lessonId);
        const cleaned = { ...values, options, correctIndex, lessonTitle: lesson ? lesson.title : '' };
        delete cleaned.optionA;
        delete cleaned.optionB;
        delete cleaned.optionC;
        delete cleaned.optionD;
        delete cleaned.correctLetter;
        return cleaned;
      },
    });
  });
});
