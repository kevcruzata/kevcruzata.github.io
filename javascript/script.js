const menuButton = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
let isOpen = false;

menuButton.addEventListener("click", () => {
  isOpen = !isOpen;
  menuOverlay.style.display = isOpen ? "flex" : "none";
  menuButton.textContent = isOpen ? "✕ Close" : "☰ Menu";
});