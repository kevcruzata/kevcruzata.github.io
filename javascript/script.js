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

// const menuButton = document.getElementById("menuToggle");
// const menuOverlay = document.getElementById("menuOverlay");
// const menuIcon = document.getElementById("menuIcon");
// let isOpen = false;

// menuButton.addEventListener("click", () => {
//   if (!isOpen) {
//     // OPEN MENU
//     menuOverlay.style.visibility = "visible";
//     menuOverlay.style.pointerEvents = "auto";
//     menuOverlay.classList.remove("menu-close");
//     void menuOverlay.offsetWidth; // reflow to restart animation
//     menuOverlay.classList.add("menu-open");

//     // Rotate arrow
//     menuIcon.classList.add("rotate");
//   } else {
//     // CLOSE MENU
//     menuOverlay.classList.remove("menu-open");
//     menuOverlay.classList.add("menu-close");

//     // Wait for animation to finish
//     setTimeout(() => {
//       menuOverlay.style.visibility = "hidden";
//       menuOverlay.style.pointerEvents = "none";
//     }, 400);

//     // Unrotate arrow
//     menuIcon.classList.remove("rotate");
//   }

//   isOpen = !isOpen;
// });

// Menu Active Link
const links = document.querySelectorAll('#menuOverlay a');

links.forEach(link => {
  link.addEventListener('click', () => {
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});