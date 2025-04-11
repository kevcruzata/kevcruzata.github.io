// Fetch and Inject Menu
fetch('/menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu-placeholder').innerHTML = html;
    initMenu(); // menu JS only runs once HTML is in the page
  });

// MENU Button and All
function initMenu() {
  const menuButton = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuIcon = document.getElementById("menuIcon");
  let isOpen = false;
  let rotation = 0;
  let lastScroll = window.scrollY;

  // Toggle Menu
  menuButton.addEventListener("click", () => {
    if (!isOpen) {
      menuOverlay.style.visibility = "visible";
      menuOverlay.style.pointerEvents = "auto";
      menuOverlay.classList.remove("menu-close");
      void menuOverlay.offsetWidth;
      menuOverlay.classList.add("menu-open");
      menuIcon.classList.add("rotate");

      // Force rotate to 90
      rotation = 90;
      gsap.to("#menuToggle", {
        rotate: rotation,
        duration: 0.4,
        ease: "power2.out"
      });
      } else {
        closeMenu();
        rotation = 0;
        gsap.to("#menuToggle", {
          rotate: rotation,
          duration: 0.4,
          ease: "power2.out"
        });
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

  // Handle menu link behavior
  const menuLinks = document.querySelectorAll('#menuOverlay a[href]');

  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      if (href.startsWith("#")) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();

          targetEl.classList.remove('stack');
          targetEl.style.position = 'relative';

          const yOffset = -1;
          const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });

          setTimeout(() => {
            targetEl.classList.add('stack');
            targetEl.style.position = 'sticky';
          }, 600);
        }

        // Highlight clicked link
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        closeMenu();
        isOpen = false;
      }
    });
  });

  // Highlight active menu link while scrolling
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
      const href = link.getAttribute("href");
      link.classList.remove("active");
      if (href === `#${current}` || href.endsWith(`#${current}`)) {
        link.classList.add("active");
      }
    });
  });

  // Highlight menu link on load
  function highlightActiveMenuLinkFromHash() {
    const currentHash = window.location.hash;
    menuLinks.forEach(link => {
      const href = link.getAttribute("href");
      link.classList.remove("active");
      if (
        href === currentHash ||
        href === window.location.pathname + currentHash ||
        href === window.location.pathname.replace(/\/$/, "") + currentHash
      ) {
        link.classList.add("active");
      }
    });
  }

  highlightActiveMenuLinkFromHash();

  // Scroll-based menuToggle rotation
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const direction = currentScroll > lastScroll ? 'down' : 'up';
    const rotationAmount = direction === 'down' ? -3 : 3;
    rotation += rotationAmount;

    gsap.to("#menuToggle", {
      rotate: rotation,
      duration: 0.3,
      ease: "power2.out"
    });

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  });
}

//  GSAP On-scroll Animations

//  Profile-Pic scrub
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({
  // Mobile & Tablet only
  "(max-width: 980px)": function () {
    gsap.from("#profile-pic", {
      x: "-100vw",
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#profile-pic",
        start: "top 80%",
        end: "top 20%",
        scrub: true,
        once: false,
        markers: false
      }
    });
  },

  // Desktop
  "(min-width: 981px)": function () {
    gsap.to("#profile-pic", {
      rotate: 720,
      scrollTrigger: {
        trigger: "#aboutme",
        start: "top 90",
        endTrigger: "#projects",
        end: "top 100",
        scrub: true,
        pin: "#profile-pic",
        pinSpacing: false,
        markers: false
      },
      ease: "none"
    });
  }
});

// Project Cards scroll in
gsap.from(".projects-scroll-wrapper", {
  x: "100vw", // Start from completely off-screen to the left
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".projects-scroll-wrapper",
    start: "top 90%",  
    end: "top 10%",    
    scrub: true,       
    once: false,    
    markers: false    
  }
});

// Section label slide down
gsap.utils.toArray(".section-label").forEach(label => {
  gsap.from(label, {
    y: -100,                
    ease: "power2.out",
    scrollTrigger: {
      trigger: label,
      start: "top 90%",  
      end: "top 60%",    
      scrub: true,
      once: true,       
    }
  });
});

// Section title scroll in
gsap.utils.toArray(".section-title").forEach(title => {
  gsap.from(title, {
    x: "-50vw",
    ease: "power2.out",
    scrollTrigger: {
      trigger: title,
      start: "top 90%",
      end: "top 10%",
      scrub: true,
      once: true,
      markers: false
    }
  });
});


// SVH Compatibility with iOS
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}
setRealVh();
window.addEventListener('resize', setRealVh);

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
