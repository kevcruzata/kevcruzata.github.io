// Menu Toggle
const menuButton = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuIcon = document.getElementById("menuIcon");
let isOpen = false;

menuButton.addEventListener("click", () => {
  if (!isOpen) {
    menuOverlay.style.visibility = "visible";
    menuOverlay.style.pointerEvents = "auto";
    menuOverlay.classList.remove("menu-close");
    void menuOverlay.offsetWidth;
    menuOverlay.classList.add("menu-open");
    menuIcon.classList.add("rotate");
  } else {
    closeMenu();
  }
  isOpen = !isOpen;
});

// Close menu if clicked outside
document.addEventListener("click", (event) => {
  const isClickInsideMenu = menuOverlay.contains(event.target);
  const isClickOnToggle = menuButton.contains(event.target);
  if (!isClickInsideMenu && !isClickOnToggle && isOpen) {
    closeMenu();
    isOpen = false;
  }
});

// Close menu on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isOpen) {
    closeMenu();
    isOpen = false;
  }
});

function closeMenu() {
  if (!menuOverlay.classList.contains("menu-open")) return;
  menuOverlay.classList.remove("menu-open");
  menuOverlay.classList.add("menu-close");
  menuIcon.classList.remove("rotate");
  setTimeout(() => {
    menuOverlay.style.visibility = "hidden";
    menuOverlay.style.pointerEvents = "none";
  }, 400);
}

// Parallax Effect
window.addEventListener('scroll', () => {
  const parallaxSections = document.querySelectorAll('[class*="parallax-section"]');

  parallaxSections.forEach(section => {
    const bg = section.querySelector('[class*="parallax-bg"]');
    if (!bg) return;

    const rect = section.getBoundingClientRect();
    const speed = parseFloat(bg.dataset.speed) || 0.4;

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = section.getBoundingClientRect().top;
      const y = offset * speed * -1;
      bg.style.transform = `translateY(${y}px)`;
    }
  });
});

// Project Cards Container Scrolling
const scrollContainer = document.querySelector('.projects-container');
const scrollLeftBtn = document.querySelector('.scroll-arrow.left');
const scrollRightBtn = document.querySelector('.scroll-arrow.right');

if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
  scrollLeftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
  });

  scrollRightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
  });

  function updateArrowVisibility() {
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    scrollLeftBtn.style.display = scrollContainer.scrollLeft > 0 ? 'block' : 'none';
    scrollRightBtn.style.display = scrollContainer.scrollLeft < maxScroll ? 'block' : 'none';
  }

  scrollContainer.addEventListener('scroll', updateArrowVisibility);
  window.addEventListener('resize', updateArrowVisibility);
  updateArrowVisibility(); // Initial state
}

// Progressive Web App Integration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(reg => console.log("✅ Service Worker registered:", reg.scope))
      .catch(err => console.error("❌ Service Worker failed:", err));
  });
}

// Viewport height fix on mobile
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}
setRealVh();
window.addEventListener('resize', setRealVh);
