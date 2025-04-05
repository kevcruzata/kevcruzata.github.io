const menuButton = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
let isOpen = false;

menuButton.addEventListener("click", () => {
  isOpen = !isOpen;
  menuOverlay.classList.toggle("open");
  menuButton.textContent = isOpen ? "✕ Close" : "☰ Menu";
});