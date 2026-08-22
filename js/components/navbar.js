/* --- 1. Theme Toggle, Navbar & Mobile Drawer --- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
  const savedTheme = localStorage.getItem('hanzi_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('hanzi_theme', newTheme);
      updateThemeIcon(newTheme, themeIcon);
      showToast(`Đã chuyển sang giao diện ${newTheme === 'light' ? 'Sáng' : 'Tối'}`, 'info');
    });
  }
}

function updateThemeIcon(theme, iconElement) {
  if (!iconElement) return;
  iconElement.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else if (!navbar.classList.contains('subpage')) {
      navbar.classList.remove('scrolled');
    }
  });
}

function initMobileDrawer() {
  const openBtns = document.querySelectorAll('.mobile-menu-btn');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('closeMobileDrawerBtn');

  if (!overlay || !drawer) return;

  function toggleDrawer(open) {
    if (open) {
      overlay.classList.add('active');
      drawer.classList.add('active');
    } else {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
    }
  }

  openBtns.forEach(btn => btn.addEventListener('click', () => toggleDrawer(true)));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));
  overlay.addEventListener('click', () => toggleDrawer(false));
}
