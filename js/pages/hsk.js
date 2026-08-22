/* --- 9. Course Filter Engine --- */
function initCourseFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const level = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        if (level === 'all' || card.getAttribute('data-level') === level) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
