function initHeroMotion() {
  const heroCard = document.querySelector('.hero-card-3d');
  const heroContainer = document.querySelector('.hero-widget-container');
  const particlesContainer = document.getElementById('heroParticles');

  if (particlesContainer) {
    const particleCount = 18;
    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${8 + Math.random() * 7}s`;
      particlesContainer.appendChild(particle);
    }
  }

  if (!heroCard || !heroContainer) return;

  heroContainer.addEventListener('mousemove', (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroCard.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    heroCard.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
  });

  heroContainer.addEventListener('mouseleave', () => {
    heroCard.style.setProperty('--rx', '0deg');
    heroCard.style.setProperty('--ry', '0deg');
  });
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window) || elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((element) => observer.observe(element));
}

function initGamifiedFeatures() {
  const missionButtons = document.querySelectorAll('.mission-btn');
  const progressBar = document.querySelector('.progress-bar');
  const streakValue = document.querySelector('[data-streak-value]');
  const resultText = document.getElementById('matchResult');
  const matchTiles = document.querySelectorAll('.mini-match-tile');

  if (missionButtons.length) {
    let completed = 0;
    missionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('done')) return;
        btn.classList.add('done');
        btn.textContent = '✓ Hoàn thành';
        completed += 1;

        if (progressBar) {
          const percent = Math.min(100, Math.round((completed / missionButtons.length) * 100));
          progressBar.style.width = `${percent}%`;
        }

        if (streakValue) {
          streakValue.textContent = String(7 + Math.floor(completed / 2));
        }

        showToast('Nhiệm vụ hoàn thành! Bạn nhận thêm 50 XP', 'success');
      });
    });
  }

  if (matchTiles.length && resultText) {
    let selectedTiles = [];
    let matchedPairs = 0;

    matchTiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        if (tile.classList.contains('matched') || tile.classList.contains('selected')) return;

        tile.classList.add('selected');
        selectedTiles.push(tile);

        if (selectedTiles.length === 2) {
          const [first, second] = selectedTiles;
          if (first.dataset.match === second.dataset.match) {
            first.classList.remove('selected');
            second.classList.remove('selected');
            first.classList.add('matched');
            second.classList.add('matched');
            matchedPairs += 1;
            resultText.textContent = matchedPairs === 2 ? 'Hoàn tất! Bạn vừa mở khóa một hộp quà nhỏ.' : 'Chính xác! Tiếp tục nào!';
            showToast('Ghép đúng rồi! Bạn nhận thêm 100 XP', 'success');
          } else {
            setTimeout(() => {
              first.classList.remove('selected');
              second.classList.remove('selected');
            }, 650);
            resultText.textContent = 'Chưa đúng rồi, thử lại nhé!';
          }
          selectedTiles = [];
        }
      });
    });
  }
}

/* --- 5. Flashcard Engine --- */
const flashcardsData = [
  { hanzi: "学习", pinyin: "xué xí", meaning: "Học tập, nghiên cứu", level: "HSK 1", example: "我喜欢学习中文。" },
  { hanzi: "朋友", pinyin: "péng you", meaning: "Bạn bè", level: "HSK 1", example: "我们是好朋友。" },
  { hanzi: "成功", pinyin: "chéng gōng", meaning: "Thành công", level: "HSK 3", example: "坚持就是成功。" },
  { hanzi: "梦想", pinyin: "mèng xiǎng", meaning: "Ước mơ", level: "HSK 4", example: "追逐你的梦想。" },
  { hanzi: "未来", pinyin: "wèi lái", meaning: "Tương lai", level: "HSK 4", example: "创造美好的未来。" }
];

let currentCardIdx = 0;

function initFlashcards() {
  const card3d = document.getElementById('flashcard3d');
  const prevBtn = document.getElementById('prevCardBtn');
  const nextBtn = document.getElementById('nextCardBtn');

  if (!card3d) return;

  card3d.addEventListener('click', () => card3d.classList.toggle('flipped'));

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      card3d.classList.remove('flipped');
      setTimeout(() => {
        currentCardIdx = (currentCardIdx - 1 + flashcardsData.length) % flashcardsData.length;
        renderFlashcard(currentCardIdx);
      }, 200);
    });

    nextBtn.addEventListener('click', () => {
      card3d.classList.remove('flipped');
      setTimeout(() => {
        currentCardIdx = (currentCardIdx + 1) % flashcardsData.length;
        renderFlashcard(currentCardIdx);
      }, 200);
    });
  }

  renderFlashcard(0);
}

function renderFlashcard(index) {
  const card = flashcardsData[index];
  const frontHanzi = document.getElementById('cardFrontHanzi');
  const frontPinyin = document.getElementById('cardFrontPinyin');
  const backMeaning = document.getElementById('cardBackMeaning');
  const backExample = document.getElementById('cardBackExample');
  const cardBadge = document.getElementById('cardLevelBadge');
  const counter = document.getElementById('cardCounter');

  if (frontHanzi) frontHanzi.textContent = card.hanzi;
  if (frontPinyin) frontPinyin.textContent = card.pinyin;
  if (backMeaning) backMeaning.textContent = card.meaning;
  if (backExample) backExample.textContent = card.example;
  if (cardBadge) cardBadge.textContent = card.level;
  if (counter) counter.textContent = `${index + 1} / ${flashcardsData.length}`;
}

/* --- 6. Mini Quiz Engine --- */
const quizQuestions = [
  { question: "Từ '你好' (Nǐ hǎo) có nghĩa là gì?", options: ["Cảm ơn", "Xin chào", "Tạm biệt", "Xin lỗi"], correct: 1 },
  { question: "Phiên âm Pinyin đúng của từ '谢谢' là gì?", options: ["xiè xie", "zài jiàn", "hěn hǎo", "bú kè qi"], correct: 0 },
  { question: "Chữ Hán nào có nghĩa là 'Học' (Study)?", options: ["爱", "学", "福", "龙"], correct: 1 }
];

let quizCurrentIdx = 0;
let quizScore = 0;

function initMiniQuiz() {
  const quizBox = document.getElementById('quizBox');
  if (quizBox) renderQuizQuestion(0);
}

function renderQuizQuestion(idx) {
  const quizBox = document.getElementById('quizBox');
  if (!quizBox) return;

  const q = quizQuestions[idx];
  const progressPercent = ((idx + 1) / quizQuestions.length) * 100;

  quizBox.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-bar" style="width: ${progressPercent}%;"></div>
    </div>
    <div style="font-size:0.85rem; color:var(--accent-gold); font-weight:800; margin-bottom:0.5rem;">CÂU ${idx + 1} / ${quizQuestions.length}</div>
    <h3 class="quiz-question-title">${q.question}</h3>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option-btn" onclick="selectQuizOption(${i})">
          <span>${String.fromCharCode(65 + i)}. ${opt}</span>
          <i class="far fa-circle"></i>
        </button>
      `).join('')}
    </div>
  `;
}

function selectQuizOption(selectedIdx) {
  const q = quizQuestions[quizCurrentIdx];
  const optionBtns = document.querySelectorAll('.quiz-option-btn');

  optionBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) {
      btn.classList.add('correct');
      btn.querySelector('i').className = 'fas fa-check-circle';
    }
    if (idx === selectedIdx && selectedIdx !== q.correct) {
      btn.classList.add('wrong');
      btn.querySelector('i').className = 'fas fa-times-circle';
    }
  });

  if (selectedIdx === q.correct) quizScore++;

  setTimeout(() => {
    quizCurrentIdx++;
    if (quizCurrentIdx < quizQuestions.length) {
      renderQuizQuestion(quizCurrentIdx);
    } else {
      showQuizResult();
    }
  }, 1200);
}

function showQuizResult() {
  const quizBox = document.getElementById('quizBox');
  if (!quizBox) return;

  const scorePct = Math.round((quizScore / quizQuestions.length) * 100);
  quizBox.innerHTML = `
    <div class="text-center" style="padding: 1.5rem 0;">
      <div style="font-size: 4rem; color: var(--accent-gold); margin-bottom: 1rem;"><i class="fas fa-trophy"></i></div>
      <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Chúc Mừng Bạn!</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Kết quả trắc nghiệm nhanh của bạn:</p>
      <div style="font-size: 3rem; font-weight: 900; color: var(--primary-crimson); margin-bottom: 1.5rem;">
        ${quizScore} / ${quizQuestions.length} (${scorePct}%)
      </div>
      <button class="btn btn-primary" onclick="openModal('trialModal')"><i class="fas fa-rocket"></i> Nhận Lộ Trình Cá Nhân Miễn Phí</button>
      <button class="btn btn-secondary" onclick="resetQuiz()" style="margin-left: 0.5rem;"><i class="fas fa-redo"></i> Thử Lại</button>
    </div>
  `;
}

function resetQuiz() {
  quizCurrentIdx = 0; quizScore = 0;
  renderQuizQuestion(0);
}
