/* --- 7. HSK Exam Engine & Question Palette --- */
const examQuestionsData = [
  { q: "1. 听力: Nghe âm thanh '苹果' (Píngguǒ), chọn nghĩa đúng:", options: ["Quả táo", "Quả chuối", "Quả dưa hấu", "Quả cam"], correct: 0, explain: "苹果 (Píngguǒ) có nghĩa là Quả Táo trong tiếng Trung." },
  { q: "2. 阅读: Điền từ vào chỗ trống: 他是我的中文_____。", options: ["老师 (Giáo viên)", "水 (Nước)", "猫 (Con mèo)", "昨天 (Hôm qua)"], correct: 0, explain: "Chữ 老师 (Lǎoshī) ghép thành '中文老师' = Giáo viên tiếng Trung." },
  { q: "3. 阅读: Cho câu '我喜欢看书。' Phiên âm Pinyin đúng là:", options: ["wǒ xǐhuān kàn shū", "nǐ hǎo ma", "zài jiàn xiè xie", "tā shì péng you"], correct: 0, explain: "我(wǒ) 喜欢(xǐhuān) 看(kàn) 书(shū) = Tôi thích đọc sách." },
  { q: "4. 语法: Chọn câu có trật tự từ đúng trong tiếng Trung:", options: ["我明天去学校。", "去学校我明天。", "学校去我明天。", "明天学校 me 去。"], correct: 0, explain: "Trạng ngữ chỉ thời gian '明天' thường đặt trước hoặc sau Chủ ngữ '我'." }
];

let examTimeSeconds = 600;
let examInterval = null;
let currentExamIdx = 0;
let userAnswers = {};

function initHSKExam() {
  const examContainer = document.getElementById('examContainer');
  if (!examContainer) return;

  startExamTimer();
  renderExamQuestion(0);
}

function startExamTimer() {
  const timerEl = document.getElementById('examTimer');
  if (!timerEl) return;

  examInterval = setInterval(() => {
    examTimeSeconds--;
    const mins = Math.floor(examTimeSeconds / 60);
    const secs = examTimeSeconds % 60;
    timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (examTimeSeconds <= 0) {
      clearInterval(examInterval);
      submitExam();
    }
  }, 1000);
}

function renderExamQuestion(idx) {
  currentExamIdx = idx;
  const examContainer = document.getElementById('examContainer');
  if (!examContainer) return;

  const q = examQuestionsData[idx];

  examContainer.innerHTML = `
    <!-- Question Palette -->
    <div class="question-palette">
      ${examQuestionsData.map((_, i) => `
        <button class="q-palette-btn ${i === idx ? 'active' : ''} ${userAnswers[i] !== undefined ? 'answered' : ''}" onclick="renderExamQuestion(${i})">
          ${i + 1}
        </button>
      `).join('')}
    </div>

    <div class="exam-question-card">
      <div style="color: var(--accent-gold); font-weight: 800; margin-bottom: 0.75rem;">CÂU ${idx + 1} / ${examQuestionsData.length}</div>
      <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1.5rem;">${q.q}</h3>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn ${userAnswers[idx] === i ? 'correct' : ''}" onclick="selectExamAnswer(${idx}, ${i})">
            <span>${String.fromCharCode(65 + i)}. ${opt}</span>
            <i class="${userAnswers[idx] === i ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
          </button>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
        <button class="btn btn-secondary" ${idx === 0 ? 'disabled' : ''} onclick="renderExamQuestion(${idx - 1})"><i class="fas fa-arrow-left"></i> Câu Trước</button>
        ${idx === examQuestionsData.length - 1 ? 
          `<button class="btn btn-primary" onclick="submitExam()"><i class="fas fa-paper-plane"></i> Nộp Bài Thi</button>` :
          `<button class="btn btn-primary" onclick="renderExamQuestion(${idx + 1})">Câu Tiếp <i class="fas fa-arrow-right"></i></button>`
        }
      </div>
    </div>
  `;
}

function selectExamAnswer(qIdx, optionIdx) {
  userAnswers[qIdx] = optionIdx;
  renderExamQuestion(qIdx);
}

function submitExam() {
  if (examInterval) clearInterval(examInterval);

  let score = 0;
  examQuestionsData.forEach((q, i) => {
    if (userAnswers[i] === q.correct) score++;
  });

  const examContainer = document.getElementById('examContainer');
  if (!examContainer) return;

  const total = examQuestionsData.length;
  const pct = Math.round((score / total) * 100);

  showToast(`🎉 Nộp bài thành công! Bạn đạt ${score * 25}/100 điểm.`, 'success');

  examContainer.innerHTML = `
    <div class="exam-question-card text-center">
      <div style="font-size: 4rem; color: var(--accent-gold); margin-bottom: 1rem;"><i class="fas fa-award"></i></div>
      <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem;">Kết Quả Thi Thử HSK</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Bạn đã hoàn thành bài thi mô phỏng!</p>
      
      <div style="font-size: 3.5rem; font-weight: 900; color: var(--primary-crimson); margin-bottom: 1.5rem;">
        ${score * 25} / 100 ĐIỂM
      </div>

      <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 1.25rem; border-radius: var(--radius-md); max-width: 450px; margin: 0 auto 2rem auto; text-align: left;">
        <p><strong>Số câu đúng:</strong> ${score} / ${total}</p>
        <p><strong>Tỷ lệ chính xác:</strong> ${pct}%</p>
        <p style="color: var(--accent-jade); margin-top:0.5rem; font-weight:800;">Đánh giá: ${pct >= 75 ? 'ĐẠT CHỨNG CHỈ HSK!' : 'CẦN ÔN TẬP THÊM'}</p>
      </div>

      <button class="btn btn-primary" onclick="window.location.reload()"><i class="fas fa-redo"></i> Thi Lại Đề Này</button>
      <button class="btn btn-gold" onclick="openModal('trialModal')" style="margin-left: 0.5rem;"><i class="fas fa-certificate"></i> Nhận Bằng Chứng Nhận PDF</button>
    </div>
  `;
}
