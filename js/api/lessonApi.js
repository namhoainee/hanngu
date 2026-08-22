// Lớp truy cập dữ liệu Bài học (Lesson).
//
// QUAN TRỌNG: file chi tiết từng bài (vd hsk/hsk1/lesson-01.json) CHỈ chứa
// thông tin riêng của bài học (title, topic, description, listening...).
// KHÔNG chứa lại toàn bộ vocabulary/grammar/dialogue/quiz — những dữ liệu đó
// chỉ tồn tại DUY NHẤT trong all-vocabulary.json / all-grammar.json /
// all-dialogues.json / all-quiz.json (nguồn mà Admin cũng đang dùng), rồi được
// LỌC theo lessonId ở đây. Nhờ vậy Admin sửa/thêm/xóa vocabulary của Lesson 1
// sẽ hiện ra ngay khi mở lại trang Lesson 1, không cần đồng bộ tay giữa 2 nơi.
//
// Sau này: đổi thành GET /api/lessons/{id} (backend tự join sẵn).

function getLessonsIndex() {
  return fetch(`${APP_CONFIG.DATA_BASE_PATH}/lessons-index.json`)
    .then(res => res.json())
    .then(data => data.lessons);
}

// Bản "hiệu lực" của danh mục bài học — ưu tiên bản Admin đã sửa (localStorage).
function getLessonsIndexEffective() {
  return loadLocalCollection(STORAGE_KEYS.LESSONS, getLessonsIndex);
}

function getLessonById(lessonId) {
  return getLessonsIndexEffective().then(lessons => {
    const stub = lessons.find(l => l.id === lessonId);
    if (!stub) throw new Error(`Không tìm thấy bài học: ${lessonId}`);

    return Promise.all([
      fetch(`${APP_CONFIG.DATA_BASE_PATH}/${stub.path}`).then(res => res.json()),
      getAllVocabularyEffective(),
      getAllGrammarEffective(),
      getAllDialoguesEffective(),
      getAllQuizEffective(),
    ]).then(([lessonDetail, allVocab, allGrammar, allDialogues, allQuiz]) => {
      // stub (từ lessons-index, có thể đã bị Admin sửa) ghi đè lên các field
      // hiển thị cơ bản của lessonDetail, để Admin sửa Title/HSK/Topic/... có tác dụng thật.
      const lesson = {
        ...lessonDetail,
        ...stub,
        description: stub.description || lessonDetail.description,
      };

      lesson.vocabulary = allVocab.filter(v => v.lessonId === lessonId);
      lesson.grammar = allGrammar.filter(g => g.lessonId === lessonId);
      lesson.quiz = allQuiz.filter(q => q.lessonId === lessonId);
      // Hiện tại 1 bài học có 1 hội thoại (đúng cấu trúc UI hiện có: lesson.dialogue,
      // không phải mảng) — lấy hội thoại đầu tiên khớp lessonId.
      lesson.dialogue = allDialogues.find(d => d.lessonId === lessonId) || null;

      return lesson;
    });
  });
}
