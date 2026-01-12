
document.querySelectorAll(".carousel").forEach((carousel) => {
  carousel._dragState = {
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
  };

  const DRAG_THRESHOLD = 6;

  carousel.addEventListener("mousedown", (e) => {
    const s = carousel._dragState;
    s.isDown = true;
    s.dragged = false;

    carousel.classList.add("is-dragging");
    s.startX = e.pageX;
    s.scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener("mousemove", (e) => {
    const s = carousel._dragState;
    if (!s.isDown) return;

    e.preventDefault();
    const walk = e.pageX - s.startX;
    if (Math.abs(walk) > DRAG_THRESHOLD) s.dragged = true;

    carousel.scrollLeft = s.scrollLeft - walk;
  });

  carousel.addEventListener("mouseleave", () => {
    const s = carousel._dragState;
    s.isDown = false;
    carousel.classList.remove("is-dragging");
  });

  carousel.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;

    const s = carousel._dragState;
    if (s.dragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const list = Array.from(carousel.querySelectorAll("img"));
    const index = list.indexOf(img);
    openLightbox(list, index);
  });
});

window.addEventListener("mouseup", () => {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const s = carousel._dragState;
    if (!s) return;
    s.isDown = false;
    carousel.classList.remove("is-dragging");
  });
});


const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const fondo = lightbox?.querySelector(".lightboxFondo");
const navLeft = lightbox?.querySelector(".lb-left");
const navRight = lightbox?.querySelector(".lb-right");

let currentList = [];
let currentIndex = 0;

function setNavState() {
  if (!navLeft || !navRight) return;
  navLeft.classList.toggle("is-disabled", currentIndex <= 0);
  navRight.classList.toggle("is-disabled", currentIndex >= currentList.length - 1);
}

function showImage(i) {
  if (!lightboxImg || !currentList.length) return;
  currentIndex = Math.max(0, Math.min(i, currentList.length - 1));
  lightboxImg.src = currentList[currentIndex].src;
  lightboxImg.alt = currentList[currentIndex].alt || "";
  setNavState();
}

function openLightbox(list, index) {
  if (!lightbox || !lightboxImg) return;
  currentList = list || [];
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  showImage(index ?? 0);
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  lightboxImg.alt = "";
  currentList = [];
  currentIndex = 0;
}

fondo?.addEventListener("click", closeLightbox);

lightboxImg?.addEventListener("click", (e) => e.stopPropagation());

navLeft?.addEventListener("click", (e) => {
  e.stopPropagation();
  showImage(currentIndex - 1);
});

navRight?.addEventListener("click", (e) => {
  e.stopPropagation();
  showImage(currentIndex + 1);
});

window.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("is-open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});
