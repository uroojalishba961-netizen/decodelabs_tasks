// Simple hamburger menu toggle for mobile navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
  navMenu.classList.remove('is-open');
  navOverlay.classList.remove('is-open');
}

if (navToggle && navMenu && navOverlay) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
    navOverlay.classList.toggle('is-open');
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close menu when a link is clicked (mobile)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
