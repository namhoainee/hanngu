/* --- 4. AI Chat & Quick Chips Engine --- */
const scenarioData = {
  restaurant: [
    { cn: "欢迎光临！请问您想吃点什么？", py: "Huānyíng guānglín! Qǐngwèn nǐ xiǎng chī diǎn shénme?", vi: "Chào mừng quý khách! Cho hỏi bạn muốn ăn gì?" },
    { cn: "好的，推荐我们的北京烤鸭，非常美味！", py: "Hǎo de, tuījiàn wǒmen de Běijīng kǎoyā, fēicháng měiwèi!", vi: "Được rồi, gợi ý bạn món Vịt quay Bắc Kinh rất ngon!" },
    { cn: "请稍等，菜马上就来！", py: "Qǐng shāo děng, cài mǎshàng jiù lái!", vi: "Xin chờ một chút, món ăn sẽ lên ngay!" }
  ],
  interview: [
    { cn: "请您简单介绍一下自己。", py: "Qǐng nǐ jiǎndān jièshào yíxià zìjǐ.", vi: "Xin mời bạn giới thiệu ngắn gọn về bản thân." },
    { cn: "你的中文表达非常流利！", py: "Nǐ de zhōngwén biǎodá fēicháng liúlì!", vi: "Khả năng diễn đạt tiếng Trung của bạn rất lưu loát!" }
  ],
  travel: [
    { cn: "请问去故宫怎么走？", py: "Qǐngwèn qù Gùgōng zěnme zǒu?", vi: "Cho hỏi đi Cố Cung đi đường nào?" },
    { cn: "您可以乘坐地铁1号线，在天安门东站下车。", py: "Nǐ kěyǐ chéngzuò dìtiě yī hào xiàn, zài Tiān'ānmén dōng zhàn xià chē.", vi: "Bạn có thể đi tàu điện ngầm tuyến số 1, xuống trạm Thiên An Môn Đông." }
  ],
  shopping: [
    { cn: "这件衣服打八折，非常划算！", py: "Zhè jiàn yīfu dǎ bā zhé, fēicháng huásuàn!", vi: "Bộ quần áo này giảm giá 20%, rất hời đấy!" },
    { cn: "您想试穿一下吗？", py: "Nǐ xiǎng shì chuān yíxià ma?", vi: "Bạn có muốn thử một chút không?" }
  ]
};

let currentScenario = 'restaurant';
let scenarioIdx = 0;

function initAIChat() {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendChatBtn');
  const chatMessages = document.getElementById('chatMessages');
  const scenarioCards = document.querySelectorAll('.scenario-card');
  const quickChips = document.querySelectorAll('.quick-chip');
  const micBtn = document.getElementById('micSimBtn');

  scenarioCards.forEach(card => {
    card.addEventListener('click', () => {
      scenarioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      currentScenario = card.getAttribute('data-scenario') || 'restaurant';
      scenarioIdx = 0;

      if (chatMessages) {
        chatMessages.innerHTML = '';
        const initialResp = scenarioData[currentScenario][0];
        appendAIMessage(initialResp);
      }
    });
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chatInput) {
        chatInput.value = chip.textContent;
        sendMessage();
      }
    });
  });

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      showToast('🎤 Đang lắng nghe giọng nói tiếng Trung của bạn...', 'info');
      setTimeout(() => {
        if (chatInput) chatInput.value = '我想吃烤鸭 (Wǒ xiǎng chī kǎoyā)';
      }, 1500);
    });
  }

  if (!chatInput || !sendBtn || !chatMessages) return;

  function sendMessage() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerHTML = `<p>${escapeHTML(userText)}</p>`;
    chatMessages.appendChild(userBubble);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const list = scenarioData[currentScenario] || scenarioData['restaurant'];
      scenarioIdx = (scenarioIdx + 1) % list.length;
      const resp = list[scenarioIdx];
      appendAIMessage(resp);
    }, 800);
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

function appendAIMessage(resp) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  const aiBubble = document.createElement('div');
  aiBubble.className = 'chat-bubble ai';
  aiBubble.innerHTML = `
    <p class="bubble-py">${resp.py}</p>
    <p><strong>${resp.cn}</strong> <button class="audio-btn-mini" onclick="speakChinese('${resp.cn}')"><i class="fas fa-volume-up"></i></button></p>
    <p class="example-vi" style="margin-top:0.3rem; font-size:0.8rem;">${resp.vi}</p>
  `;
  chatMessages.appendChild(aiBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  speakChinese(resp.cn);
}
