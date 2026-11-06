// ===== PREMIUM MUSIC PLAYER =====

const music = document.getElementById("music");
const musicButton = document.getElementById("music-button");
const musicButtonIcon = document.getElementById("music-button-icon");
const trackName = document.getElementById("track-name");
const trackArtist = document.getElementById("track-artist");
const progress = document.getElementById("music-progress");
const currentTimeLabel = document.getElementById("music-current-time");
const durationLabel = document.getElementById("music-duration");
const musicPlayer = document.getElementById("music-player");

// Название трека и исполнителя

trackName.textContent = "internet shelter";
trackArtist.textContent = "akiaura, LONOWN, STM";

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateProgress() {
    if (!Number.isFinite(music.duration) || music.duration <= 0) {
        progress.value = 0;
        progress.style.setProperty("--progress", "0%");
        return;
    }

    const percentage = (music.currentTime / music.duration) * 100;

    progress.value = percentage;
    progress.style.setProperty("--progress", `${percentage}%`);

    currentTimeLabel.textContent = formatTime(music.currentTime);
    durationLabel.textContent = formatTime(music.duration);
}

function updatePlayerState() {
    const isPlaying = !music.paused;

    musicButtonIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    musicButton.setAttribute(
        "aria-label",
        isPlaying ? "Приостановить музыку" : "Включить музыку"
    );

    musicPlayer.classList.toggle("is-playing", isPlaying);
}

musicButton.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
        } catch (error) {
            trackName.textContent = "Не удалось запустить музыку";
            trackArtist.textContent = "Проверь файл my-track.mp3";
        }
    } else {
        music.pause();
    }
});

music.addEventListener("play", updatePlayerState);
music.addEventListener("pause", updatePlayerState);
music.addEventListener("loadedmetadata", updateProgress);
music.addEventListener("timeupdate", updateProgress);
music.addEventListener("durationchange", updateProgress);

progress.addEventListener("input", () => {
    if (Number.isFinite(music.duration) && music.duration > 0) {
        const percentage = Number(progress.value);
        music.currentTime = (percentage / 100) * music.duration;
        progress.style.setProperty("--progress", `${percentage}%`);
    }
});

// Сбрасываем полосу, когда трек закончился
music.addEventListener("ended", () => {
    updateProgress();
    updatePlayerState();
});

updatePlayerState();

// ПЛАВНОЕ ПОЯВЛЕНИЕ КАРТОЧЕК ПРИ ПРОКРУТКЕ

const animatedElements = document.querySelectorAll(
    ".social-card, .project-placeholder"
);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    animatedElements.forEach((element) => {
        element.classList.add("reveal");
        observer.observe(element);
    });
}
// Всплывающая панель Telegram

const telegramCard = document.querySelector(
    '.social-card[href*="telegram"]'
);

const telegramModal = document.getElementById("telegram-modal");
const telegramClose = document.getElementById("telegram-close");
const telegramCopy = document.getElementById("telegram-copy");
const telegramOpen = document.querySelector(".telegram-open");

function openTelegramModal(event) {
    event.preventDefault();

    telegramModal.classList.add("active");
    telegramModal.setAttribute("aria-hidden", "false");
    telegramClose.focus();
}

function closeTelegramModal() {
    telegramModal.classList.remove("active");
    telegramModal.setAttribute("aria-hidden", "true");

    if (telegramCard) {
        telegramCard.focus();
    }
}

if (telegramCard && telegramModal) {
    telegramCard.addEventListener("click", openTelegramModal);
}

telegramClose.addEventListener("click", closeTelegramModal);

telegramModal.addEventListener("click", (event) => {
    if (event.target === telegramModal) {
        closeTelegramModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        telegramModal.classList.contains("active")
    ) {
        closeTelegramModal();
    }
});

telegramCopy.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(telegramOpen.href);
        telegramCopy.textContent = "Ссылка скопирована ✓";
    } catch (error) {
        telegramCopy.textContent = "Не удалось скопировать ссылку";
    }
});

/* ===== CUSTOM CURSOR ANIMATION ===== */

(() => {
    const cursor = document.getElementById("custom-cursor");
    const dot = document.getElementById("cursor-dot");

    // Проверяем, что устройство использует мышь
    if (
        !cursor ||
        !dot ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
        return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;

        document.body.classList.add("cursor-ready");
    });

    // Плавное движение стеклянного кольца
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Увеличение при наведении на интерактивные элементы
    document.addEventListener("mouseover", (event) => {
        const target = event.target.closest(
            "a, button, input, textarea, select, label, [role='button']"
        );

        if (target) {
            cursor.classList.add("cursor-hover");
        }
    });

    document.addEventListener("mouseout", (event) => {
        const target = event.target.closest(
            "a, button, input, textarea, select, label, [role='button']"
        );

        if (target && !target.contains(event.relatedTarget)) {
            cursor.classList.remove("cursor-hover");
        }
    });

    // Лёгкое сжатие при нажатии
    document.addEventListener("mousedown", () => {
        cursor.classList.add("cursor-press");
    });

    document.addEventListener("mouseup", () => {
        cursor.classList.remove("cursor-press");
    });

    // Скрываем курсор, когда мышь покидает страницу
    document.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-ready");
    });

    document.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-ready");
    });
})();

/* ===== SCROLL REVEAL ===== */

(() => {
    const elements = document.querySelectorAll(
        'h1, h2, section > p, section > div, .card, .glass-card'
    );

    elements.forEach((element) => {
        // Не добавляем анимацию повторно
        if (element.closest('.custom-cursor')) return;

        element.classList.add('reveal');
    });

    // Показываем элементы, когда они попадают в область экрана
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    document.querySelectorAll('.reveal').forEach((element) => {
        observer.observe(element);
    });
})();

const chromeObject = document.querySelector('.chrome-object');

if (chromeObject) {
    let rotation = 0;
    let targetRotation = 0;
    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const delta = currentScroll - lastScroll;

        targetRotation += delta * 0.12;
        lastScroll = currentScroll;
    }, { passive: true });

    function animateRotation() {
        rotation += (targetRotation - rotation) * 0.06;

        chromeObject.style.transform = `rotate(${rotation}deg)`;

        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// ===== Окна проектов =====

(() => {
    const projectCards = document.querySelectorAll(".project-card");
    const projectModals = document.querySelectorAll(".project-modal");

    function openProjectModal(card) {
        const modal = document.getElementById(card.dataset.modal);
        if (!modal) return;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        const closeButton = modal.querySelector(".project-close");
        if (closeButton) closeButton.focus();
    }

    function closeProjectModal(modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }

    projectCards.forEach((card) => {
        card.addEventListener("click", () => openProjectModal(card));
    });

    projectModals.forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (
                event.target === modal ||
                event.target.classList.contains("project-close")
            ) {
                closeProjectModal(modal);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            projectModals.forEach((modal) => closeProjectModal(modal));
        }
    });
})();
