document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    getCourses(),
    getLessonsIndexEffective(),
    getAllVocabularyEffective(),
    getAllGrammarEffective(),
    getAllDialoguesEffective(),
    getAllQuizEffective(),
  ]).then(([courses, lessons, vocab, grammar, dialogues, quiz]) => {
    setStat('statCourses', courses.length);
    setStat('statLessons', lessons.length);
    setStat('statVocabulary', vocab.length);
    setStat('statGrammar', grammar.length);
    setStat('statDialogues', dialogues.length);
    setStat('statQuiz', quiz.length);

    // Dữ liệu mẫu — chưa có hệ thống người dùng/tiến độ học thật
    setStat('statUsers', 128);
    setStat('statCompletedLessons', 342);
    setStat('statActiveLearners', 47);
  }).catch(err => {
    showToast('Lỗi tải dữ liệu dashboard: ' + err.message, 'info');
  });
});

function setStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
