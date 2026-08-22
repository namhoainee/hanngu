/* --- 2. Speech Engine --- */
function speakChinese(text) {
  showToast(`🔊 Đang phát âm: ${text}`, 'info');

  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85;

  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
  if (zhVoice) utterance.voice = zhVoice;

  window.speechSynthesis.speak(utterance);
}

function initSpeechEngine() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  document.querySelectorAll('[data-speak]').forEach(element => {
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToSpeak = element.getAttribute('data-speak');
      if (textToSpeak) speakChinese(textToSpeak);
    });
  });
}

function playToneDemo(toneNumber, text, pinyin) {
  const toneCards = document.querySelectorAll('.tone-card');
  toneCards.forEach(card => card.classList.remove('playing'));

  const activeCard = document.getElementById(`toneCard${toneNumber}`);
  if (activeCard) {
    activeCard.classList.add('playing');
    setTimeout(() => activeCard.classList.remove('playing'), 1500);
  }
  speakChinese(text);
}
