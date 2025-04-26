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

// MENU LOADING
fetch(`/${pathLang}/menu.html`)
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("menuPlaceholder").innerHTML = html;
    initMenu(); // Menu setup after load
    initThemeToggle();
  });

// Scroll lock logic (used only for older iOS if needed)
function lockScroll() {
  if (window.innerWidth < 981) {
    document.body.classList.add("modal-open");
  }
}
function unlockScroll() {
  if (window.innerWidth < 981) {
    document.body.classList.remove("modal-open");
  }
}

// Progress scroll
const scrollTrack = document.getElementById("scroll-track");
const scrollProgress = document.getElementById("scroll-progress");
let scrollTimer;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;

  const progressHeight = scrollPercent * 100; // 0% to 100%

  scrollProgress.style.height = `${progressHeight}%`;

  scrollTrack.style.opacity = 1;

  clearTimeout(scrollTimer);

  scrollTimer = setTimeout(() => {
    scrollTrack.style.opacity = 0;
  }, 500);
});

// Modal references
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalLink = document.getElementById("modalLink");
const modalVideo = document.getElementById("modalVideo");
const modalImage = document.getElementById("modalImage");
const closeModalBtn = document.querySelector(".close-btn");

const currentLang = window.location.pathname.includes("/it/") ? "it" : "en";

const translations = {
  en: {
    tryDemo: "Try Demo",
    viewCode: "Show More",
    writtenIn: "Tech:",
  },
  it: {
    tryDemo: "Prova la demo",
    viewCode: "Mostra di più",
    writtenIn: "Tech:",
  },
};

let projectsData = [];

fetch(`../data/${currentLang}-projects.json`)
  .then((res) => res.json())
  .then((data) => {
    projectsData = data;
    attachProjectListeners();
  });

function attachProjectListeners() {
  document.querySelectorAll(".project-card").forEach((card) => {
    const id = card.dataset.projectId;
    card.querySelector(".open-modal")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const project = projectsData.find((p) => p.id === id);
      if (project) showModal(project, card);
    });
  });
}

function showModal(project, triggerElement) {
  const isDesktop = window.innerWidth >= 981;
  lockScroll();

  const t = translations[currentLang];
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

  // Hide image/video
  modalImage.style.display = "none";
  modalVideo.style.display = "none";

  const content = modal.querySelector(".modal-content");

  modal.style.display = isDesktop ? "block" : "flex";
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
  modal.style.pointerEvents = "auto";

  content.style.display = "block";
  content.style.visibility = "visible";
  content.style.pointerEvents = "auto";

  requestAnimationFrame(() => {
    if (isDesktop && triggerElement) {
      // content.style.position = "fixed";
      content.style.top = "50%";
      content.style.left = "50%";
      // // content.style.width = "50svh";
      // // content.style.height = "100svh";
      // // content.style.overflow = "hidden";
      content.style.transform = "translate(-50%, -50%) scale(1)";

      content.classList.remove("flipped");
    } else {
      // Mobile fallback modal
      content.style.position = "fixed";
      content.style.bottom = "0";
      content.style.left = "0";
      content.style.width = "100%";
      content.style.borderRadius = "0";
      content.style.maxHeight = "none";
      content.style.transform = "scale(1)";
    }

    // Show modal
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.style.pointerEvents = "auto";

    gsap.fromTo(
      content,
      isDesktop ? { opacity: 0, scale: 0.95 } : { y: "100%", opacity: 0 },
      {
        opacity: 1,
        scale: 1,
        y: "0",
        duration: 0.5,
        ease: "power2.out",
      }
    );
  });
}

function closeModal() {
  const isDesktop = window.innerWidth >= 981;
  const content = modal.querySelector(".modal-content");

  gsap.to(content, {
    opacity: 0,
    scale: isDesktop ? 0.95 : 1,
    y: isDesktop ? 0 : "100%",
    duration: 0.4,
    ease: "power2.in",
  });

  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    ease: "power1.out",
    onComplete: () => {
      modal.style.display = "none";
      modal.style.visibility = "hidden";
      modal.style.pointerEvents = "none";
      unlockScroll();
    },
  });
}

closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// SCROLL HINT
document.addEventListener("DOMContentLoaded", function () {
  const scrollHint = document.getElementById("scrollHint");

  if (!scrollHint) return; // ✅ Run only if the scrollHint element exists

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
      const hash = new URL(href, window.location.href).hash;
      if (hash) {
        const targetEl = document.querySelector(hash);
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
gsap.registerPlugin(ScrollTrigger);

// Profile Pic scrub
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
const isMobileOrTablet = window.matchMedia("(max-width: 980px)").matches;

gsap.from(".projects-scroll-wrapper", {
  x: "100vw",
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#projects",
    start: "top 95%",
    end: "top 5%",
    scrub: !isMobileOrTablet,
    once: isMobileOrTablet,
    toggleActions: isMobileOrTablet ? "play none none none" : undefined,
    markers: false,
  },
});

// Section-label hover
const labels = document.querySelectorAll('.section-label, .section-label2');

labels.forEach(label => {
  label.addEventListener('mouseenter', () => {
    gsap.to(label, {
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  label.addEventListener('mouseleave', () => {
    gsap.to(label, {
      rotation: 2,
      duration: 0.6,
      ease: "power2.out"
    });
  });
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

// Section title scroll down
gsap.from(".slide-down", {
  y: "-50vh",
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#contact",
    start: "top 50%",
    end: "top 10%",
    scrub: true,
    toggleActions: "play none none none",
    once: true,
    markers: false,
  },
});

// Animate tech stack icons in a sequence
gsap.to(".icon-wrapper", {
  scale: 1.2,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
  stagger: {
    each: 0.5,
    repeat: -1,
    yoyo: true,
  },
});

// Icons row slide in
gsap.from(".icon-row", {
  x: "100vw",
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".introduction",
    start: "top 95%",
    end: "top 5%",
    scrub: !isMobileOrTablet,
    once: isMobileOrTablet,
    toggleActions: isMobileOrTablet ? "play none none none" : undefined,
    markers: false,
  },
});

// Optimized Animated Background (loaded only on view)
const sections = document.querySelectorAll(".main-bg, .main-bg2");
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const activeAnimations = new Map();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      if (entry.isIntersecting) {
        if (isTouchDevice) {
          startLoopAnimation(section);
        } else {
          attachPointerEvents(section);
        }
      } else {
        if (isTouchDevice) {
          stopLoopAnimation(section);
        } else {
          detachPointerEvents(section);
        }
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach((section) => observer.observe(section));

// Mobile/Tablet loop animation
function startLoopAnimation(section) {
  let t = 0;
  function animate() {
    const x = Math.sin(t / 40) * 50;
    const y = Math.cos(t / 60) * 50;
    section.style.setProperty("--posX", x);
    section.style.setProperty("--posY", y);
    t++;
    const id = requestAnimationFrame(animate);
    activeAnimations.set(section, id);
  }
  animate();
}

function stopLoopAnimation(section) {
  const id = activeAnimations.get(section);
  if (id) {
    cancelAnimationFrame(id);
    activeAnimations.delete(section);
  }
}

// Desktop: Pointer move
function attachPointerEvents(section) {
  const parent = section.parentElement;
  const handler = (e) => {
    const { left, top, width, height } = parent.getBoundingClientRect();
    section.style.setProperty("--posX", e.clientX - left - width / 2);
    section.style.setProperty("--posY", e.clientY - top - height / 2);
  };
  parent.__pointerHandler = handler;
  parent.addEventListener("pointermove", handler);
}

function detachPointerEvents(section) {
  const parent = section.parentElement;
  if (parent.__pointerHandler) {
    parent.removeEventListener("pointermove", parent.__pointerHandler);
    delete parent.__pointerHandler;
  }
}

// Smooth Transition, dark to light and vice versa
function initThemeToggle() {
  const toggleBtn = document.getElementById("modeToggle");
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector("i");

  function updateIcon() {
    if (document.body.classList.contains("white-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  }

  // Set initial theme based on saved preference
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("white-mode");
    toggleBtn.classList.add("light");
  }

  updateIcon();

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("white-mode");
    toggleBtn.classList.toggle("light");

    const isLight = document.body.classList.contains("white-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");

    updateIcon();
  });
}
