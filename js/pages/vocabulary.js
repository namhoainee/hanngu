/* --- 3. Enhanced Hanzi Stroke Canvas --- */
let canvasStrokesHistory = [];

function initStrokeCanvas() {
  const canvas = document.getElementById('hanziCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let currentColor = '#E63946';

  function setupCanvasResolution() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
  }

  setupCanvasResolution();
  window.addEventListener('resize', setupCanvasResolution);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    // Save canvas state for undo
    canvasStrokesHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDrawing() { isDrawing = false; }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);

  // Canvas Tools
  const clearBtn = document.getElementById('clearCanvasBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvasStrokesHistory = [];
      showToast('Đã xóa bảng nét vẽ', 'info');
    });
  }

  const undoBtn = document.getElementById('undoCanvasBtn');
  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      if (canvasStrokesHistory.length > 0) {
        const lastState = canvasStrokesHistory.pop();
        ctx.putImageData(lastState, 0, 0);
      }
    });
  }

  // Color Selector Buttons
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColor = btn.getAttribute('data-color') || '#E63946';
      ctx.strokeStyle = currentColor;
    });
  });

  const charBtns = document.querySelectorAll('.char-btn');
  const guideCharEl = document.getElementById('guideCharacter');

  charBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      charBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const char = btn.getAttribute('data-char');
      if (guideCharEl) guideCharEl.textContent = char;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvasStrokesHistory = [];
      speakChinese(char);
    });
  });
}

/* --- 8. Vocabulary Search Engine --- */
const vocabDatabase = [
  { hanzi: "你好", py: "nǐ hǎo", meaning: "Xin chào", level: "HSK 1" },
  { hanzi: "谢谢", py: "xiè xie", meaning: "Cảm ơn", level: "HSK 1" },
  { hanzi: "再见", py: "zài jiàn", meaning: "Tạm biệt", level: "HSK 1" },
  { hanzi: "中国", py: "zhōng guó", meaning: "Trung Quốc", level: "HSK 1" },
  { hanzi: "学习", py: "xué xí", meaning: "Học tập", level: "HSK 1" },
  { hanzi: "工作", py: "gōng zuò", meaning: "Làm việc, công việc", level: "HSK 2" },
  { hanzi: "高兴", py: "gāo xìng", meaning: "Vui vẻ", level: "HSK 2" },
  { hanzi: "时间", py: "shí jiān", meaning: "Thời gian", level: "HSK 3" },
  { hanzi: "环境", py: "huán jìng", meaning: "Môi trường", level: "HSK 4" },
  { hanzi: "经济", py: "jīng jì", meaning: "Kinh tế", level: "HSK 5" }
];

function initVocabSearch() {
  const searchInput = document.getElementById('vocabSearchInput');
  const vocabGrid = document.getElementById('vocabGrid');

  if (!searchInput || !vocabGrid) return;

  function renderVocabCards(items) {
    vocabGrid.innerHTML = items.map(item => `
      <div class="vocab-card">
        <span class="hsk-badge" style="position: absolute; top: 1.25rem; right: 1.25rem;">${item.level}</span>
        <div class="vocab-hanzi cn-serif">${item.hanzi}</div>
        <div class="vocab-py">${item.py} <button class="audio-btn-mini" onclick="speakChinese('${item.hanzi}')"><i class="fas fa-volume-up"></i></button></div>
        <div class="vocab-meaning">${item.meaning}</div>
      </div>
    `).join('');
  }

  renderVocabCards(vocabDatabase);

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = vocabDatabase.filter(item => 
      item.hanzi.includes(q) || item.py.toLowerCase().includes(q) || item.meaning.toLowerCase().includes(q)
    );
    renderVocabCards(filtered);
  });
}
