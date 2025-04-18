// LANGUAGE REDIRECTION
if (
  window.location.pathname === "/" ||
  window.location.pathname === "/index.html"
) {
  const userLang = navigator.language || navigator.userLanguage;
  const redirectLang = userLang.startsWith("it") ? "it" : "en";
  window.location.replace(`/${redirectLang}/`);
}

// DETECT CURRENT LANGUAGE FROM URL
const pathLang = window.location.pathname.includes("/it/") ? "it" : "en";

// CUSTOM CURSOR
const cursor = document.getElementById("cursor");
const ripple = document.getElementById("cursor-ripple");

// Move the cursor elements
document.addEventListener("mousemove", (e) => {
  const { clientX: x, clientY: y } = e;
  cursor.style.left = ripple.style.left = `${x}px`;
  cursor.style.top = ripple.style.top = `${y}px`;
});

// Ripple effect on click
document.addEventListener("mousedown", () => {
  ripple.style.opacity = "1";
  ripple.style.transform = "translate(-50%, -50%) scale(1)";
});

document.addEventListener("mouseup", () => {
  ripple.style.opacity = "0";
  ripple.style.transform = "translate(-50%, -50%) scale(0)";
});

// Enlarge cursor on interactive elements
const hoverTargets = document.querySelectorAll("a, button, img, h1");

hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    document.body.classList.add("cursor-hover");
  });

  el.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-hover");
  });
});

// MENU LOADING
fetch(`/${pathLang}/menu.html`)
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("menuPlaceholder").innerHTML = html;
    initMenu(); // Menu setup after load
  });

// Lock scroll (iOS-safe)
function lockScroll() {
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.dataset.scrollY = scrollY;
  document.body.classList.add("modal-open");
}

// Unlock scroll (restore previous position)
function unlockScroll() {
  const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);

  document.documentElement.classList.add("no-smooth");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.classList.remove("modal-open");

  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY);
    document.documentElement.classList.remove("no-smooth");
    delete document.body.dataset.scrollY;
  });
}

// MODAL LOGIC
const modal = document.getElementById("projectModal");
const modalVideo = document.getElementById("modalVideo");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalLink = document.getElementById("modalLink");
const closeModalBtn = document.querySelector(".close-btn");

// Language detection
const currentLang = window.location.pathname.includes("/it/") ? "it" : "en";

// Translations
const translations = {
  en: {
    tryDemo: "Try Demo",
    viewCode: "View Code",
    writtenIn: "Written in:",
  },
  it: {
    tryDemo: "Prova la demo",
    viewCode: "Vai al codice",
    writtenIn: "Scritto in:",
  },
};

let projectsData = [];

// Fetch JSON data
fetch(`../data/${currentLang}-projects.json`)
  .then((res) => res.json())
  .then((data) => {
    projectsData = data;
    attachProjectListeners();
  });

// Attach modal open handlers
function attachProjectListeners() {
  document.querySelectorAll(".project-card").forEach((card) => {
    const id = card.dataset.projectId;
    card.querySelector(".open-modal")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const project = projectsData.find((p) => p.id === id);
      if (project) showModal(project);
    });
  });
}

// Show modal
function showModal(project) {
  lockScroll();

  const t = translations[currentLang]; // shortcut

  modalTitle.textContent = project.title;
  modalDescription.innerHTML = `
    <p>${project.fullDescription || project.description}</p>
    ${
      project.technologies
        ? `<p>${t.writtenIn} ${project.technologies.join(", ")}</p>`
        : ""
    }
    ${project.year ? `<p>${project.year}</p>` : ""}
  `;
  modalLink.href = project.github;
  modalLink.textContent = project.demo ? t.tryDemo : t.viewCode;

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

  modal.style.display = "flex";
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  modal.style.pointerEvents = "auto";

  gsap.fromTo(
    ".modal-content",
    {
      y: "50vh",
      opacity: 0,
      scale: 1,
    },
    {
      y: "0",
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    }
  );
}

// Close modal
function closeModal() {
  const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);

  // Step 1: Unlock scrolling
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.classList.remove("modal-open");

  // Step 2: Restore scroll position instantly
  window.scrollTo(0, scrollY);

  // Step 3: Animate modal content out
  gsap.to(".modal-content", {
    y: "50vh",
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
  });

  // Step 4: Animate backdrop and fully hide modal
  gsap.to(modal, {
    opacity: 0,
    duration: 1,
    ease: "power1.out",
    onComplete: () => {
      modal.style.display = "none";
      modal.style.visibility = "hidden";
      modal.style.pointerEvents = "none";

      modalVideo.pause();
      modalVideo.src = "";

      delete document.body.dataset.scrollY;
    },
  });
}

closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Optional: fallback CSS for modal-open
// const style = document.createElement('style');
// style.innerHTML = `body.modal-open { overflow: hidden; touch-action: none; overscroll-behavior: contain; }`;
// document.head.appendChild(style);

// SCROLL HINT
document.addEventListener("DOMContentLoaded", function () {
  const scrollHint = document.getElementById("scrollHint");

  if (!scrollHint) return; // Exit if element doesn't exist

  const path = window.location.pathname;
  const isHomePage =
    path === "/" ||
    path.endsWith("/index.html") ||
    path === "/en/" ||
    path === "/en/index.html" ||
    path === "/it/" ||
    path === "/it/index.html";

  if (!isHomePage) return;

  // Initial check
  if (window.scrollY > 10) {
    scrollHint.classList.add("hidden");
  } else {
    scrollHint.classList.remove("hidden");
  }

  // On scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      scrollHint.classList.add("hidden");
    } else {
      scrollHint.classList.remove("hidden");
    }
  });
});

// iOS SAFARI SVH FIX
function setRealVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--real-vh", `${vh}px`);
}
setRealVh();
window.addEventListener("resize", setRealVh);

// SMOOTH SCROLL TO ANCHOR AFTER LOAD
window.addEventListener("load", () => {
  const hash = window.location.hash;
  const OFFSET = 200;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
});

// PROJECT CARDS SCROLL ARROWS
const scrollContainer = document.querySelector(".projects-container");
const scrollLeftBtn = document.querySelector(".scroll-arrow.left");
const scrollRightBtn = document.querySelector(".scroll-arrow.right");

scrollLeftBtn?.addEventListener("click", () => {
  scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
});
scrollRightBtn?.addEventListener("click", () => {
  scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
});
scrollContainer?.addEventListener("scroll", updateArrowVisibility);
window.addEventListener("resize", updateArrowVisibility);
function updateArrowVisibility() {
  const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  scrollLeftBtn.style.display =
    scrollContainer.scrollLeft > 0 ? "block" : "none";
  scrollRightBtn.style.display =
    scrollContainer.scrollLeft < maxScroll ? "block" : "none";
}
updateArrowVisibility();

// CALL MENU INITIALIZER (INTERNAL FROM menu.html)
function initMenu() {
  const menuButton = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuIcon = document.getElementById("menuIcon");
  const langBtn = document.getElementById("langToggleBtn");
  const langDropdown = document.getElementById("langDropdown");
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
        ease: "power2.out",
      });
    } else {
      closeMenu();
      rotation = 0;
      gsap.to("#menuToggle", {
        rotate: rotation,
        duration: 0.4,
        ease: "power2.out",
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
  const menuLinks = document.querySelectorAll("#menuOverlay a[href]");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.classList.remove("stack");
          targetEl.style.position = "relative";

          const yOffset = -1;
          const y =
            targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });

          setTimeout(() => {
            targetEl.classList.add("stack");
            targetEl.style.position = "sticky";
          }, 600);
        }

        menuLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        closeMenu();
        isOpen = false;
      }
    });
  });

  // Highlight active section while scrolling
  const sections = document.querySelectorAll(".stack");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    menuLinks.forEach((link) => {
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
    menuLinks.forEach((link) => {
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
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    const direction = currentScroll > lastScroll ? "down" : "up";
    const rotationAmount = direction === "down" ? -3 : 3;
    rotation += rotationAmount;

    gsap.to("#menuToggle", {
      rotate: rotation,
      duration: 0.3,
      ease: "power2.out",
    });

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  });

  // Toggle language dropdown
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!langDropdown.contains(e.target) && e.target !== langBtn) {
      langDropdown.classList.add("hidden");
    }
  });

  //Animation - language dropdown
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!langDropdown.contains(e.target) && e.target !== langBtn) {
      langDropdown.classList.remove("show");
    }
  });

  const currentLang = pathLang || "en"; // already detected earlier
  const langLinks = document.querySelectorAll(".lang-option");

  langLinks.forEach((link) => {
    if (link.getAttribute("href").includes(`/${currentLang}/`)) {
      link.classList.add("active-lang");
    } else {
      link.classList.remove("active-lang");
    }
  });

  const userLang = navigator.language.startsWith("it") ? "it" : "en";
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
        markers: false,
      },
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
        markers: false,
      },
      ease: "none",
    });
  },
});

// Project Cards scroll in
// Detect screen width
const isMobileOrTablet = window.matchMedia("(max-width: 980px)").matches;

gsap.from(".projects-scroll-wrapper", {
  x: "100vw",
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#projects",
    start: "top 95%",
    end: "top 5%",
    scrub: !isMobileOrTablet, // Only scrub if NOT mobile/tablet
    once: isMobileOrTablet, // Only once if mobile/tablet
    toggleActions: isMobileOrTablet ? "play none none none" : undefined,
    markers: false,
  },
});

// Section title scroll in
gsap.utils.toArray(".section-label, .section-title").forEach((title) => {
  gsap.from(title, {
    x: "-50vw",
    ease: "power2.out",
    scrollTrigger: {
      trigger: title,
      start: "top 90%",
      end: "top 10%",
      scrub: true,
      toggleActions: "play none none none",
      once: true,
      markers: false,
    },
  });
});

// animated main background
const sections = document.querySelectorAll(".main-bg, .main-bg2");

// Detect if it's a touch device (tablet/phone)
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (isTouchDevice) {
  // Looping animation for mobile/tablet
  let t = 0;
  function animate() {
    const x = Math.sin(t / 40) * 50;
    const y = Math.cos(t / 60) * 50;
    sections.forEach((section) => {
      section.style.setProperty("--posX", x);
      section.style.setProperty("--posY", y);
    });
    t += 1;
    requestAnimationFrame(animate);
  }
  animate(); // start the loop
} else {
  // Desktop interaction
  sections.forEach((bg) => {
    const parent = bg.parentElement;
  
    function updateVars(x, y) {
      const { left, top, width, height } = parent.getBoundingClientRect();
      bg.style.setProperty("--posX", x - left - width / 2);
      bg.style.setProperty("--posY", y - top - height / 2);
    }
  
    parent.addEventListener("pointermove", (e) => {
      updateVars(e.clientX, e.clientY);
    });
  });  

  // Device tilt on desktop/laptop with sensors
  window.addEventListener("deviceorientation", (e) => {
    const x = e.gamma || 0;
    const y = e.beta || 0;
    sections.forEach((section) => {
      section.style.setProperty("--posX", x * 10);
      section.style.setProperty("--posY", y * 10);
    });
  });
}
