document.addEventListener('DOMContentLoaded', () => {
  const HSK_OPTIONS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map(v => ({ value: v, label: v }));

  const LINES_PLACEHOLDER_EXAMPLE = JSON.stringify([
    { speaker: 'A', chinese: '你好！', pinyin: 'Nǐ hǎo!', vietnamese: 'Xin chào!' },
    { speaker: 'B', chinese: '你好！你叫什么名字？', pinyin: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', vietnamese: 'Chào bạn! Bạn tên là gì?' },
  ], null, 2);

  getLessonsIndexEffective().then(lessons => {
    const LESSON_OPTIONS = lessons.map(l => ({ value: l.id, label: l.title }));

    initAdminCrudPage({
      dataLoader: getAllDialogues,
      storageKey: STORAGE_KEYS.DIALOGUES,
      idField: 'id',
      idPrefix: 'dialogue',
      entityLabel: 'hội thoại',
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Tiêu đề' },
        { key: 'lessonTitle', label: 'Bài học' },
        { key: 'hskLevel', label: 'HSK' },
        { key: 'lineCount', label: 'Số câu' },
      ],
      fields: [
        { key: 'title', label: 'Tiêu đề hội thoại', type: 'text', required: true },
        { key: 'hskLevel', label: 'Cấp độ HSK', type: 'select', options: HSK_OPTIONS },
        {
          key: 'lessonId', label: 'Bài học liên quan', type: 'select', options: LESSON_OPTIONS,
          getValue: (item) => (item && item.lessonId) || '',
        },
        {
          key: 'lines',
          label: `Các lượt nói (JSON — mỗi câu gồm speaker "A"/"B", chinese, pinyin, vietnamese). Ví dụ:\n${LINES_PLACEHOLDER_EXAMPLE}`,
          type: 'textarea',
          required: true,
          serialize: (value) => Array.isArray(value) ? JSON.stringify(value, null, 2) : (value || LINES_PLACEHOLDER_EXAMPLE),
          parse: (raw) => {
            try {
              const parsed = JSON.parse(raw);
              if (!Array.isArray(parsed)) throw new Error('Phải là một mảng JSON');
              return parsed;
            } catch (e) {
              showToast('Lỗi định dạng JSON ở phần "Các lượt nói": ' + e.message, 'info');
              throw e;
            }
          },
        },
      ],
      onBeforeSave: (values) => {
        const lesson = lessons.find(l => l.id === values.lessonId);
        values.lessonTitle = lesson ? lesson.title : '';
        values.lineCount = Array.isArray(values.lines) ? values.lines.length : 0;
        return values;
      },
    });
  });
});
