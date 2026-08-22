// Lớp truy cập dữ liệu Quiz.
// Sau này: GET/POST/PUT/DELETE /api/quizzes

function getAllQuiz() {
  return fetch(`${APP_CONFIG.DATA_BASE_PATH}/quiz/all-quiz.json`)
    .then(res => res.json())
    .then(data => data.quiz);
}

function getAllQuizEffective() {
  return loadLocalCollection(STORAGE_KEYS.QUIZ, getAllQuiz);
}
