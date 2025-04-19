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
gsap.registerPlugin(ScrollTrigger);

// Project Cards scroll in
const isMobileOrTablet = window.matchMedia("(max-width: 980px)").matches;

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

gsap.from(".cv-intro", {
  y: 100,
  duration: 0.5,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".cv-intro",
    start: "top 95%",
    toggleActions: "play none none none",
  },
});
