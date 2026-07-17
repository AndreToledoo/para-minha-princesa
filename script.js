
const giftScreen = document.getElementById("giftScreen");
const site = document.getElementById("site");

const spotifyPlayer = document.getElementById("spotifyPlayer");
const musicStatus = document.getElementById("musicStatus");

function startMusicFromEnvelope() {
  if (!spotifyPlayer) return;

  const currentSource = spotifyPlayer.getAttribute("src");
  if (currentSource && !currentSource.includes("autoplay=1")) {
    const separator = currentSource.includes("?") ? "&" : "?";
    spotifyPlayer.setAttribute("src", `${currentSource}${separator}autoplay=1`);
  }

  if (musicStatus) {
    musicStatus.textContent = "A música foi preparada. Caso o Spotify não inicie sozinho, toque no play.";
  }
}


function openGift() {
  if (giftScreen.classList.contains("open")) return;

  giftScreen.classList.add("open");
  startMusicFromEnvelope();

  setTimeout(() => {
    site.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    startIntro();
  }, 1050);

  setTimeout(() => {
    giftScreen.classList.add("hidden");
  }, 1850);
}

giftScreen.addEventListener("click", openGift);
giftScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openGift();
  }
});

const startDate = new Date("2024-02-10T00:00:00");

function updateCounter() {
  const now = new Date();
  const difference = Math.max(0, now - startDate);

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCounter();
setInterval(updateCounter, 1000);

const introMessage = "Preparei este cantinho especialmente para você, meu amor. ❤️";
const letterMessage = `Obrigado por cada momento e cada sorriso meu amor, você é e sempre será a minha melhor pessoa`;

function typeText(element, text, speed = 35) {
  element.textContent = "";
  let index = 0;

  function write() {
    if (index >= text.length) return;
    element.textContent += text[index];
    index += 1;
    setTimeout(write, speed);
  }

  write();
}

let introStarted = false;

function startIntro() {
  if (introStarted) return;
  introStarted = true;

  typeText(document.getElementById("introText"), introMessage, 42);

  setTimeout(() => {
    typeText(document.getElementById("letterText"), letterMessage, 24);
  }, 900);
}

const photoFiles = [
  "foto1.jpg",
  "foto2.jpg",
  "foto3.jpg",
  "foto4.jpg",
  "foto5.jpg",
  "foto6.jpg",
  "foto7.jpg",
  "foto8.jpg",
  "foto9.jpg",
  "foto10.jpg"
];

const gallery = document.getElementById("gallery");

photoFiles.forEach((file, index) => {
  const item = document.createElement("button");
  item.className = "gallery-item";
  item.type = "button";
  item.setAttribute("aria-label", `Abrir foto ${index + 1}`);

  const image = document.createElement("img");
  image.src = file;
  image.alt = `Momento de nós dois ${index + 1}`;
  image.loading = index < 3 ? "eager" : "lazy";

  item.appendChild(image);
  item.addEventListener("click", () => openModal(index));
  gallery.appendChild(item);
});
const heroPhoto = document.querySelector(".hero-photo");
const firstGalleryImage = document.querySelector(".gallery-item img");

if (heroPhoto && firstGalleryImage) {
  heroPhoto.src = firstGalleryImage.src;
}

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModalButton = document.getElementById("closeModal");
const prevImageButton = document.getElementById("prevImage");
const nextImageButton = document.getElementById("nextImage");
let currentImageIndex = 0;

function showModalImage(index) {
  const galleryImages = document.querySelectorAll(".gallery-item img");

  currentImageIndex =
    (index + galleryImages.length) % galleryImages.length;

  const selectedImage = galleryImages[currentImageIndex];

  modalImage.src = selectedImage.src;
  modalImage.alt =
    `Momento de nós dois ${currentImageIndex + 1}`;
}

function openModal(index) {
  showModalImage(index);
  imageModal.classList.add("open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  imageModal.classList.remove("open");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

closeModalButton.addEventListener("click", closeModal);
prevImageButton.addEventListener("click", () => showModalImage(currentImageIndex - 1));
nextImageButton.addEventListener("click", () => showModalImage(currentImageIndex + 1));

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (!imageModal.classList.contains("open")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") showModalImage(currentImageIndex - 1);
  if (event.key === "ArrowRight") showModalImage(currentImageIndex + 1);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const starsCanvas = document.getElementById("starsCanvas");
const starsContext = starsCanvas.getContext("2d");
let stars = [];

function resizeStars() {
  const ratio = window.devicePixelRatio || 1;
  starsCanvas.width = window.innerWidth * ratio;
  starsCanvas.height = window.innerHeight * ratio;
  starsCanvas.style.width = `${window.innerWidth}px`;
  starsCanvas.style.height = `${window.innerHeight}px`;
  starsContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  stars = Array.from({ length: Math.min(130, Math.floor(window.innerWidth / 8)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.65 + 0.2,
    speed: Math.random() * 0.15 + 0.03
  }));
}

function animateStars() {
  starsContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((star) => {
    star.y -= star.speed;

    if (star.y < -4) {
      star.y = window.innerHeight + 4;
      star.x = Math.random() * window.innerWidth;
    }

    starsContext.beginPath();
    starsContext.fillStyle = `rgba(255,255,255,${star.alpha})`;
    starsContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starsContext.fill();
  });

  requestAnimationFrame(animateStars);
}

resizeStars();
animateStars();

const heartsCanvas = document.getElementById("heartsCanvas");
const heartsContext = heartsCanvas.getContext("2d");
let hearts = [];

function resizeHearts() {
  heartsCanvas.width = window.innerWidth;
  heartsCanvas.height = window.innerHeight;
}

class Heart {
  constructor() {
    this.x = Math.random() * heartsCanvas.width;
    this.y = heartsCanvas.height + Math.random() * 180;
    this.size = Math.random() * 18 + 15;
    this.speed = Math.random() * 2.4 + 1.2;
    this.drift = Math.random() * 1.2 - 0.6;
    this.opacity = 1;
    this.rotation = Math.random() * 0.5 - 0.25;
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift;
    this.opacity -= 0.0045;
  }

  draw() {
    heartsContext.save();
    heartsContext.globalAlpha = Math.max(0, this.opacity);
    heartsContext.translate(this.x, this.y);
    heartsContext.rotate(this.rotation);
    heartsContext.font = `${this.size}px Arial`;
    heartsContext.fillText("❤️", 0, 0);
    heartsContext.restore();
  }
}

function animateHearts() {
  heartsContext.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
  hearts = hearts.filter((heart) => heart.opacity > 0 && heart.y > -80);
  hearts.forEach((heart) => {
    heart.update();
    heart.draw();
  });
  requestAnimationFrame(animateHearts);
}

resizeHearts();
animateHearts();

window.addEventListener("resize", () => {
  resizeStars();
  resizeHearts();
});

const loveButton = document.getElementById("loveButton");
const finalMessage = document.getElementById("finalMessage");

loveButton.addEventListener("click", () => {
  hearts.push(...Array.from({ length: 220 }, () => new Heart()));
  finalMessage.textContent = "Eu te amo infinitamente, minha princesa. ❤️";
  loveButton.textContent = "Para sempre ❤️";
});


// Corações discretos no fundo
const ambientHearts = document.getElementById("ambientHearts");

function createAmbientHeart() {
  if (!ambientHearts || document.hidden) return;

  const heart = document.createElement("span");
  heart.className = "ambient-heart";
  heart.textContent = "♥";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${Math.random() * 14 + 10}px`;
  heart.style.animationDuration = `${Math.random() * 8 + 10}s`;
  heart.style.setProperty("--drift", `${Math.random() * 90 - 45}px`);
  ambientHearts.appendChild(heart);

  setTimeout(() => heart.remove(), 19000);
}

setInterval(createAmbientHeart, 1150);

// Fotos aparecem individualmente durante a rolagem
const photoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("photo-visible");
      photoObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: "0px 0px -35px 0px"
});

document.querySelectorAll(".gallery-item").forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
  photoObserver.observe(item);
});

// ===================================
// NOSSA BRINCADEIRA
// ===================================

const loveGameText = document.getElementById("loveGameText");
const loveGameButton = document.getElementById("loveGameButton");

const loveGameSteps = [
  {
    type: "her",
    text: "Daqui até a lua 🌙"
  },
  {
    type: "me",
    text: "Ida e volta?"
  },
  {
    type: "her",
    text: "Pra sempre! ❤️"
  }
];

let loveGameStep = 0;

function addGameMessage(type, text) {
  const message = document.createElement("p");

  message.className =
    type === "me"
      ? "game-line game-me"
      : "game-line game-her";

  message.textContent = text;

  loveGameText.appendChild(message);
}

loveGameButton.addEventListener("click", () => {
  if (loveGameStep >= loveGameSteps.length) {
    return;
  }

  const currentStep = loveGameSteps[loveGameStep];

  addGameMessage(
    currentStep.type,
    currentStep.text
  );

  loveGameStep++;

  if (loveGameStep === 1) {
    loveGameButton.textContent = "Continuar ❤️";
  }

  if (loveGameStep === loveGameSteps.length) {
    loveGameButton.disabled = true;
    loveGameButton.textContent = "Pra sempre ❤️";

    const finalText = document.createElement("p");
    finalText.className = "game-final";
    finalText.textContent = "Daqui até a lua, ida e volta, pra sempre. ❤️";

    loveGameText.appendChild(finalText);

    hearts.push(
      ...Array.from(
        { length: 120 },
        () => new Heart()
      )
    );
  }
});
