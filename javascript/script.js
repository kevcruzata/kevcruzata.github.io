// LANGUAGE REDIRECTION
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  const userLang = navigator.language || navigator.userLanguage;
  const redirectLang = userLang.startsWith('it') ? 'it' : 'en';
  window.location.replace(`/${redirectLang}/`);
}

// DETECT CURRENT LANGUAGE FROM URL
const pathLang = window.location.pathname.includes('/it/') ? 'it' : 'en';

// 📂 MENU LOADING
fetch(`/${pathLang}/menu.html`)
  .then(res => res.text())
  .then(html => {
    document.getElementById('menuPlaceholder').innerHTML = html;
    initMenu(); // Menu setup after load
  });

// MODAL LOGIC
const modal = document.getElementById("projectModal");
const modalVideo = document.getElementById("modalVideo");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalLink = document.getElementById("modalLink");
const closeModalBtn = document.querySelector(".close-btn");

let projectsData = [];

fetch(`../data/${pathLang}-projects.json`)
  .then(res => res.json())
  .then(data => {
    projectsData = data;
    attachProjectListeners();
  });

function attachProjectListeners() {
  document.querySelectorAll(".project-card").forEach(card => {
    const id = card.dataset.projectId;
    card.querySelector(".open-modal")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const project = projectsData.find(p => p.id === id);
      if (project) showModal(project);
    });
  });
}

function showModal(project) {
  document.body.classList.add("modal-open");
  modalTitle.textContent = project.title;
  modalDescription.innerHTML = `
    <p>${project.fullDescription || project.description}</p>
    ${project.technologies ? `<p>Written in: ${project.technologies.join(", ")}</p>` : ""}
    ${project.year ? `<p>${project.year}</p>` : ""}
  `;
  modalLink.href = project.github;
  modalLink.textContent = project.demo ? "Try Demo" : "View Code";

  // Media display
  if (project.video) {
    modalVideo.src = project.video;
    modalVideo.style.display = "block";
    modalImage.style.display = "none";
    modalVideo.load();
    modalVideo.play();
  } else {
    modalVideo.pause();
    modalVideo.src = "";
    modalVideo.style.display = "none";
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalImage.style.display = "block";
  }

  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';

  gsap.fromTo(".modal-content", {
    y: "50vh",
    opacity: 0,
    scale: 1
  }, {
    y: "0",
    opacity: 1,
    duration: 0.5,
    ease: "power3.out"
  });
}

function closeModal() {
  gsap.to(".modal-content", {
    y: "50vh",
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
    onComplete: () => {
      modal.style.display = 'none';
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modalVideo.pause();
      modalVideo.src = "";
      document.body.classList.remove("modal-open");
    }
  });
}

closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// PREVENT SCROLL WHEN MODAL IS OPEN
const style = document.createElement('style');
style.innerHTML = `body.modal-open { overflow: hidden !important; }`;
document.head.appendChild(style);

// SCROLL HINT
if (window.location.pathname === "/" || window.location.pathname.endsWith("index.html")) {
  window.addEventListener("scroll", () => {
    const scrollHint = document.getElementById("scrollHint");
    if (scrollHint) {
      scrollHint.classList.toggle("hidden", window.scrollY > 10);
    }
  });
}

// CURVED TEXT SCROLLING ANIMATION
gsap.registerPlugin(ScrollTrigger);

gsap.fromTo("#waveText", 
  { attr: { startOffset: "100%" } },
  { 
    attr: { startOffset: "-50%" }, // smaller range
    ease: "none",
    scrollTrigger: {
      trigger: ".introduction",
      start: "top 90%",
      end: "top -100%", // longer scroll path
      scrub: true
    }
  }
);

// ADDITIONAL ANIMATION EXAMPLE FOR A SECOND PATH
gsap.fromTo("#waveText2", 
  { attr: { startOffset: "-100%" } },
  { 
    attr: { startOffset: "50%" },
    ease: "none",
    scrollTrigger: {
      trigger: ".projects-container",
      start: "top 90%",
      end: "top -100%",
      scrub: true
    }
  }
);

// iOS SAFARI SVH FIX
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}
setRealVh();
window.addEventListener('resize', setRealVh);

// PARALLAX SCROLL EFFECT
window.addEventListener('scroll', () => {
  document.querySelectorAll('[class*="parallax-section"]').forEach(section => {
    const bg = section.querySelector('[class*="parallax-bg"]');
    if (!bg) return;
    const rect = section.getBoundingClientRect();
    const speed = parseFloat(bg.dataset.speed) || 0.4;
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = section.getBoundingClientRect().top;
      bg.style.transform = `translateY(${offset * speed * -1}px)`;
    }
  });
});

// SMOOTH SCROLL TO ANCHOR AFTER LOAD
window.addEventListener('load', () => {
  const hash = window.location.hash;
  const OFFSET = 200;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
});

// PROJECT CARDS SCROLL ARROWS
const scrollContainer = document.querySelector('.projects-container');
const scrollLeftBtn = document.querySelector('.scroll-arrow.left');
const scrollRightBtn = document.querySelector('.scroll-arrow.right');

scrollLeftBtn?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
});
scrollRightBtn?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
});
scrollContainer?.addEventListener('scroll', updateArrowVisibility);
window.addEventListener('resize', updateArrowVisibility);
function updateArrowVisibility() {
  const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  scrollLeftBtn.style.display = scrollContainer.scrollLeft > 0 ? 'block' : 'none';
  scrollRightBtn.style.display = scrollContainer.scrollLeft < maxScroll ? 'block' : 'none';
}
updateArrowVisibility();

// CALL MENU INITIALIZER (INTERNAL FROM menu.html)
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

  // Close if clicked outside menu or Escape key
  document.addEventListener("click", (event) => {
    const isInside = menuOverlay.contains(event.target);
    const isToggle = menuButton.contains(event.target);
    if (!isInside && !isToggle && isOpen) {
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

  // Handle internal menu links
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

        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        closeMenu();
        isOpen = false;
      }
    });
  });

  // Highlight active section while scrolling
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

  // On page load highlight correct link
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

  // Animate menuToggle rotation on scroll
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

// GSAP On-scroll Animations

// Profile Pic scrub
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({
"(max-width: 980px)": function () {
  gsap.from("#profilePicMobile", {
    x: "100vw",
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#profilePicMobile",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      once: true,
      markers: false
    }
  });
},

"(min-width: 981px)": function () {
  gsap.to("#profilePicDesktop", {
    rotate: 720,
    scrollTrigger: {
      trigger: "#aboutMe",
      start: "top 90",
      endTrigger: "#projects",
      end: "top 10",
      scrub: true,
      pin: "#profilePicDesktop",
      pinSpacing: false,
      markers: false
    },
    ease: "none"
  });
}
});

// Project Cards scroll in
// Detect screen width
const isMobileOrTablet = window.matchMedia("(max-width: 980px)").matches;

gsap.from(".projects-scroll-wrapper", {
  x: "100vw",
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".projects-scroll-wrapper",
    start: "top 90%",
    end: "top 10%",
    scrub: !isMobileOrTablet,         // Only scrub if NOT mobile/tablet
    once: isMobileOrTablet,           // Only once if mobile/tablet
    toggleActions: isMobileOrTablet ? "play none none none" : undefined,
    markers: false
  }
});


// Section title scroll in
gsap.utils.toArray(".section-label, .section-title").forEach(title => {
  gsap.from(title, {
    x: "-50vw",
    ease: "power2.out",
    scrollTrigger: {
      trigger: title,
      start: "top 90%",
      end: "top 10%",
      scrub: true,
      toggleActions: "play none none none",
      once:true,
      markers: false
    }
  });
});