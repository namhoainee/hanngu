/* ==========================================================================
   HÁN NGỮ MASTER (HANZIFLOW) - MASTER GRADE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. NAVIGATION, MOBILE DRAWER & THEME SWITCHER
  initThemeToggle();
  initNavbarScroll();
  initMobileDrawer();
  initTabs();

  // 2. AUDIO & SPEECH SYNTHESIS ENGINE
  initSpeechEngine();

  // 3. ENHANCED HANZI STROKE CANVAS (WITH UNDO & COLOR PICKER)
  initStrokeCanvas();

  // 4. AI CHAT SIMULATOR & QUICK CHIPS
  initAIChat();

  // 5. FLASHCARD ENGINE
  initFlashcards();

  // 6. MINI QUIZ ENGINE
  initMiniQuiz();

  // 7. HSK MOCK EXAM ENGINE & QUESTION PALETTE
  initHSKExam();

  // 8. VOCABULARY SEARCH ENGINE
  initVocabSearch();

  // 9. COURSE FILTER ENGINE
  initCourseFilter();

  // 10. MODAL CONTROLS
  initModals();

  // 11. HERO ANIMATIONS
  initHeroMotion();
  initRevealOnScroll();

  // 12. GAMIFIED LEARNING FEATURES
  initGamifiedFeatures();
});
