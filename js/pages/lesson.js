/* --- Trang xem chi tiết bài học (frontend/pages/lesson.html) --- */

document.addEventListener('DOMContentLoaded', () => {
  // Bootstrap các phần UI dùng chung (navbar/theme/tabs/speech/modal),
  // KHÔNG dùng js/app.js ở trang này vì app.js gọi cả init của các trang khác
  // (home/vocabulary/ai/hsk/exam) mà trang lesson.html không nạp các file đó.
  initThemeToggle();
  initNavbarScroll();
  initMobileDrawer();
  initTabs();
  initSpeechEngine();
  initModals();

  loadLesson();
});

function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'hsk1-lesson-01'; // mặc định Lesson 1 mẫu
}

let lessonFlashcardIdx = 0;
let lessonData = null;

function loadLesson() {
  const lessonId = getLessonIdFromUrl();

  getLessonById(lessonId)
    .then(lesson => {
      lessonData = lesson;
      renderLessonHeader(lesson);
      renderVocabTab(lesson.vocabulary);
      renderGrammarTab(lesson.grammar);
      renderDialogueTab(lesson.dialogue);
      renderFlashcardTab(lesson.vocabulary);
      renderQuizTab(lesson.quiz);
      renderListeningTab(lesson.listening);
    })
    .catch(err => {
      document.getElementById('lessonTitle').textContent = 'Không tải được bài học';
      document.getElementById('lessonDesc').textContent = err.message;
      showToast('Không tải được dữ liệu bài học. Kiểm tra bạn có đang chạy qua local server (Live Server) không.', 'info');
    });
}

function renderLessonHeader(lesson) {
  document.getElementById('lessonHskBadge').innerHTML = `<i class="fas fa-graduation-cap"></i> ${lesson.hskLevel} · Bài ${lesson.order}`;
  document.getElementById('lessonTitle').textContent = `${lesson.title} (${lesson.titleCn})`;
  document.getElementById('lessonDesc').textContent = lesson.description;
  document.title = `${lesson.title} | Hán Ngữ Master`;
}

function renderVocabTab(vocabulary) {
  const grid = document.getElementById('lessonVocabGrid');
  grid.innerHTML = vocabulary.map(v => `
    <div class="vocab-card">
      <span class="hsk-badge" style="position:absolute; top:1.25rem; right:1.25rem;">${v.wordType || ''}</span>
      <div class="vocab-hanzi cn-serif">${v.hanzi}</div>
      <div class="vocab-py">${v.pinyin} <button class="audio-btn-mini" onclick="speakChinese('${v.hanzi}')"><i class="fas fa-volume-up"></i></button></div>
      <div class="vocab-meaning">${v.meaningVi}</div>
      <p class="example-vi" style="margin-top:0.6rem; font-size:0.85rem;">
        <strong class="cn-text">${v.example}</strong><br>${v.examplePinyin}<br>${v.exampleVi}
      </p>
    </div>
  `).join('');
}

function renderGrammarTab(grammar) {
  const grid = document.getElementById('lessonGrammarGrid');
  grid.innerHTML = grammar.map(g => `
    <div class="knowledge-card">
      <div class="knowledge-icon"><i class="fas fa-bookmark"></i></div>
      <h3 class="knowledge-title">${g.title}</h3>
      <p class="knowledge-desc">
        ${g.explain}<br>
        <em class="cn-text">${g.example}</em><br>
        ${g.examplePinyin}<br>${g.exampleVi}
      </p>
    </div>
  `).join('');
}

function renderDialogueTab(dialogue) {
  document.getElementById('lessonDialogueTitle').textContent = dialogue.title;
  const messages = document.getElementById('lessonDialogueMessages');
  messages.innerHTML = dialogue.lines.map(line => `
    <div class="chat-bubble ${line.speaker === 'A' ? 'ai' : 'user'}">
      <p class="bubble-py">${line.pinyin}</p>
      <p><strong class="cn-text">${line.chinese}</strong> <button class="audio-btn-mini" onclick="speakChinese('${line.chinese}')"><i class="fas fa-volume-up"></i></button></p>
      <p class="example-vi" style="margin-top:0.3rem; font-size:0.8rem;">${line.vietnamese}</p>
    </div>
  `).join('');
}

function renderFlashcardTab(vocabulary) {
  lessonFlashcardIdx = 0;
  const card3d = document.getElementById('lessonFlashcard3d');
  const prevBtn = document.getElementById('lessonPrevCardBtn');
  const nextBtn = document.getElementById('lessonNextCardBtn');

  card3d.classList.remove('flipped');
  card3d.onclick = () => card3d.classList.toggle('flipped');

  prevBtn.onclick = () => {
    card3d.classList.remove('flipped');
    lessonFlashcardIdx = (lessonFlashcardIdx - 1 + vocabulary.length) % vocabulary.length;
    renderLessonFlashcard(vocabulary, lessonFlashcardIdx);
  };
  nextBtn.onclick = () => {
    card3d.classList.remove('flipped');
    lessonFlashcardIdx = (lessonFlashcardIdx + 1) % vocabulary.length;
    renderLessonFlashcard(vocabulary, lessonFlashcardIdx);
  };

  renderLessonFlashcard(vocabulary, 0);
}

function renderLessonFlashcard(vocabulary, index) {
  const v = vocabulary[index];
  document.getElementById('lessonCardFrontHanzi').textContent = v.hanzi;
  document.getElementById('lessonCardFrontPinyin').textContent = v.pinyin;
  document.getElementById('lessonCardBackMeaning').textContent = v.meaningVi;
  document.getElementById('lessonCardBackExample').textContent = v.example;
  document.getElementById('lessonCardCounter').textContent = `${index + 1} / ${vocabulary.length}`;
}

let lessonQuizIdx = 0;
let lessonQuizScore = 0;

function renderQuizTab(quiz) {
  lessonQuizIdx = 0;
  lessonQuizScore = 0;
  renderLessonQuizQuestion(quiz, 0);
}

function renderLessonQuizQuestion(quiz, idx) {
  const box = document.getElementById('lessonQuizBox');
  const q = quiz[idx];
  const progressPercent = ((idx + 1) / quiz.length) * 100;

  box.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-bar" style="width:${progressPercent}%;"></div>
    </div>
    <div style="font-size:0.85rem; color:var(--accent-gold); font-weight:800; margin-bottom:0.5rem;">CÂU ${idx + 1} / ${quiz.length}</div>
    <h3 class="quiz-question-title">${q.question}</h3>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option-btn" data-idx="${i}">
          <span>${String.fromCharCode(65 + i)}. ${opt}</span>
          <i class="far fa-circle"></i>
        </button>
      `).join('')}
    </div>
  `;

  box.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => selectLessonQuizOption(quiz, idx, Number(btn.dataset.idx)));
  });
}

function selectLessonQuizOption(quiz, idx, selectedIdx) {
  const q = quiz[idx];
  const optionBtns = document.querySelectorAll('#lessonQuizBox .quiz-option-btn');

  optionBtns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) {
      btn.classList.add('correct');
      btn.querySelector('i').className = 'fas fa-check-circle';
    }
    if (i === selectedIdx && selectedIdx !== q.correctIndex) {
      btn.classList.add('wrong');
      btn.querySelector('i').className = 'fas fa-times-circle';
    }
  });

  if (selectedIdx === q.correctIndex) lessonQuizScore++;

  setTimeout(() => {
    lessonQuizIdx++;
    if (lessonQuizIdx < quiz.length) {
      renderLessonQuizQuestion(quiz, lessonQuizIdx);
    } else {
      showLessonQuizResult(quiz);
    }
  }, 1200);
}

function showLessonQuizResult(quiz) {
  const box = document.getElementById('lessonQuizBox');
  const pct = Math.round((lessonQuizScore / quiz.length) * 100);
  box.innerHTML = `
    <div class="text-center" style="padding: 1.5rem 0;">
      <div style="font-size: 4rem; color: var(--accent-gold); margin-bottom: 1rem;"><i class="fas fa-trophy"></i></div>
      <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Hoàn Thành Bài Học!</h3>
      <div style="font-size: 3rem; font-weight: 900; color: var(--primary-crimson); margin-bottom: 1.5rem;">
        ${lessonQuizScore} / ${quiz.length} (${pct}%)
      </div>
      <button class="btn btn-primary" id="lessonQuizRetryBtn"><i class="fas fa-redo"></i> Làm Lại Quiz</button>
    </div>
  `;
  document.getElementById('lessonQuizRetryBtn').addEventListener('click', () => renderQuizTab(quiz));
}

function renderListeningTab(listening) {
  if (listening && listening.note) {
    document.getElementById('lessonListeningNote').textContent = listening.note;
  }
}
