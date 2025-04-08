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
  menuOverlay.classList.remove("menu-open");
  menuOverlay.classList.add("menu-close");
  menuIcon.classList.remove("rotate");
  setTimeout(() => {
    menuOverlay.style.visibility = "hidden";
    menuOverlay.style.pointerEvents = "none";
  }, 400);
}

// Scroll and Activate Menu Link
const menuLinks = document.querySelectorAll('#menuOverlay a[href^="#"]');

menuLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      e.preventDefault();

      // Temporarily disable sticky to force scroll
      targetEl.classList.remove('stack');
      targetEl.style.position = 'relative';

      const yOffset = -1;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });

      // Re-enable sticky after scroll
      setTimeout(() => {
        targetEl.classList.add('stack');
        targetEl.style.position = 'sticky';
      }, 600);
    }

    // Highlight active link
    menuLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Close menu
    closeMenu();
    isOpen = false;
  });
});

// Highlight menu link on scroll
const sections = document.querySelectorAll(".stack");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  menuLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
