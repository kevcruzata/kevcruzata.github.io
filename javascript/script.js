fetch('/menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu-placeholder').innerHTML = html;
    initMenu(); // 🔁 menu JS only runs once HTML is in the page
  });

function initMenu() {
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

  document.addEventListener("click", (event) => {
    const isClickInsideMenu = menuOverlay.contains(event.target);
    const isClickOnToggle = menuButton.contains(event.target);
    if (!isClickInsideMenu && !isClickOnToggle && isOpen) {
      closeMenu();
      isOpen = false;
    }
  });

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

  const menuLinks = document.querySelectorAll('#menuOverlay a[href^="#"]');

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        e.preventDefault();

        targetEl.classList.remove('stack');
        targetEl.style.position = 'relative';

        const yOffset = -1;
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });

        setTimeout(() => {
          targetEl.classList.add('stack');
          targetEl.style.position = 'sticky';
        }, 600);
      }

      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      closeMenu();
      isOpen = false;
    });
  });

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
}


// SVH Compatibility with iOS
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}
setRealVh();
window.addEventListener('resize', setRealVh);

// Animate on scroll up too
AOS.init({
  once: true, // animate every time you scroll to it
  duration: 1000, // speed in ms
  offset: 120 // trigger offset from top
});


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

// Projects Cards Container
const scrollContainer = document.querySelector('.projects-container');
const scrollLeftBtn = document.querySelector('.scroll-arrow.left');
const scrollRightBtn = document.querySelector('.scroll-arrow.right');

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
updateArrowVisibility(); // initial state

// Smooth Scroll to Anchor After Page Load
window.addEventListener('load', () => {
  const hash = window.location.hash;
  const OFFSET = 200;

  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }
});




