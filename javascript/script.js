// Menu Toggle
const menuButton = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
let isOpen = false;

menuButton.addEventListener("click", () => {
  isOpen = !isOpen;
  menuOverlay.classList.toggle("open");
  menuIcon.textContent = isOpen ? "close" : "adjust";
});

// Menu Active Link
const links = document.querySelectorAll('#menuOverlay a');

links.forEach(link => {
  link.addEventListener('click', () => {
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});