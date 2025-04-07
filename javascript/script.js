// Menu Toggle
const menuButton = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuIcon = document.getElementById("menuIcon");
let isOpen = false;

menuButton.addEventListener("click", () => {
  if (!isOpen) {
    // OPEN MENU
    menuOverlay.style.visibility = "visible";
    menuOverlay.style.pointerEvents = "auto";
    menuOverlay.classList.remove("menu-close");
    void menuOverlay.offsetWidth; // restart animation
    menuOverlay.classList.add("menu-open");

    menuIcon.classList.add("rotate"); // Flip the K
  } else {
    // CLOSE MENU
    menuOverlay.classList.remove("menu-open");
    menuOverlay.classList.add("menu-close");

    setTimeout(() => {
      menuOverlay.style.visibility = "hidden";
      menuOverlay.style.pointerEvents = "none";
    }, 400);

    menuIcon.classList.remove("rotate"); // Unflip the K
  }

  isOpen = !isOpen;
});

// Menu Active Link
const links = document.querySelectorAll('#menuOverlay a');

links.forEach(link => {
  link.addEventListener('click', () => {
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});