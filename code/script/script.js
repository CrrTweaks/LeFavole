// Blocca tasto destro
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Blocca selezione testo (opzionale, può risultare fastidioso)
document.addEventListener("selectstart", (e) => e.preventDefault());

// Blocca scorciatoie tastiera più comuni per dev tools, visualizza sorgente ecc
document.addEventListener("keydown", function (e) {
  // Liste di combinazioni da bloccare
  const blockedKeys = ["F12", "F11", "F1"];

  // Blocca singoli tasti
  if (blockedKeys.includes(e.key)) {
    e.preventDefault();
    return false;
  }

  // Blocca combinazioni Ctrl + tasti
  if (e.ctrlKey) {
    // Blocca Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.shiftKey) {
      if (["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault();
        return false;
      }
    }

    // Blocca Ctrl+U (visualizza sorgente), Ctrl+S (salva), Ctrl+P (stampa)
    if (["U", "S", "P"].includes(e.key.toUpperCase())) {
      e.preventDefault();
      return false;
    }
  }

  // Blocca Ctrl+Shift+K (Firefox console)
  if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "K") {
    e.preventDefault();
    return false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  /* HERO SLIDER */
  let currentSlide = 0;
  const totalSlides = 3;
  let slideInterval;

  // Funzione per mostrare uno slide specifico
  function showSlide(index) {
    // Gestisci i background
    for (let i = 0; i < totalSlides; i++) {
      const bg = document.getElementById(`hero-bg-${i + 1}`);
      if (bg) {
        if (i === index) {
          bg.style.opacity = "1";
        } else {
          bg.style.opacity = "0";
        }
      }
    }

    // Gestisci i contenuti degli slide
    for (let i = 0; i < totalSlides; i++) {
      const slide = document.getElementById(`hero-slide-${i + 1}`);
      if (slide) {
        if (i === index) {
          slide.style.opacity = "1";
          slide.style.zIndex = "10";
        } else {
          slide.style.opacity = "0";
          slide.style.zIndex = "5";
        }
      }
    }

    // Gestisci gli indicatori
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.getElementById(`indicator-${i + 1}`);
      if (indicator) {
        if (i === index) {
          indicator.classList.add("bg-gold", "scale-125");
          indicator.classList.remove("bg-white");
          indicator.style.opacity = "1";
        } else {
          indicator.classList.remove("bg-gold", "scale-125");
          indicator.classList.add("bg-white");
          indicator.style.opacity = "0.5";
        }
      }
    }

    currentSlide = index;
    console.log("Slide cambiato a:", index + 1); // Debug
  }

  // Funzioni di navigazione
  window.nextSlide = () => {
    const nextIndex = (currentSlide + 1) % totalSlides;
    showSlide(nextIndex);
    resetAutoPlay();
  };

  window.previousSlide = () => {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
    resetAutoPlay();
  };

  window.changeSlide = (index) => {
    showSlide(index);
    resetAutoPlay();
  };

  // Funzione per resettare l'auto-play
  function resetAutoPlay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(window.nextSlide, 7000);
  }

  // Avvia l'auto-play
  function startAutoPlay() {
    slideInterval = setInterval(window.nextSlide, 7000);
  }

  // Inizializza lo slider
  function initSlider() {
    console.log("Inizializzo slider..."); // Debug

    // Assicurati che il primo slide sia visibile
    showSlide(0);

    // Avvia l'auto-play
    startAutoPlay();

    // Gestisci il pause/resume al passaggio del mouse
    const heroSection = document.getElementById("home");
    if (heroSection) {
      heroSection.addEventListener("mouseenter", () => {
        clearInterval(slideInterval);
        console.log("Auto-play fermato"); // Debug
      });

      heroSection.addEventListener("mouseleave", () => {
        startAutoPlay();
        console.log("Auto-play riavviato"); // Debug
      });

      // Gestisci il touch/swipe per mobile
      let touchStartX = 0;
      let touchEndX = 0;

      heroSection.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      heroSection.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });

      function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            // Swipe left - next slide
            window.nextSlide();
          } else {
            // Swipe right - previous slide
            window.previousSlide();
          }
        }
      }
    }

    // Gestisci le frecce della tastiera
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        window.previousSlide();
      } else if (e.key === "ArrowRight") {
        window.nextSlide();
      }
    });

    console.log("Slider inizializzato correttamente!"); // Debug
  }

  // Avvia l'inizializzazione
  initSlider();

  /* Smooth scrolling */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();

      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      closeMobileMenu();
    });
  });

  /* Funzione globale */
  window.scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const headerOffset = 80;
    const offsetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    closeMobileMenu();
  };

  /* Menu mobile – toggle & animazioni */
  const mobileMenuButton = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("active");
    if (mobileMenuButton) {
      mobileMenuButton.classList.add("active");
      mobileMenuButton.setAttribute("aria-expanded", "true");
    }

    mobileMenu.querySelectorAll("a").forEach((link, i) => {
      link.style.opacity = "0";
      link.style.transform = "translateX(10px)";
      setTimeout(() => {
        link.style.opacity = "1";
        link.style.transform = "translateX(0)";
      }, 100 + i * 100);
    });
  }

  function closeMobileMenu(immediate = false) {
    if (!mobileMenu || mobileMenu.classList.contains("hidden")) return;

    mobileMenu.classList.remove("active");
    if (mobileMenuButton) {
      mobileMenuButton.classList.remove("active");
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }

    const reset = () => mobileMenu.classList.add("hidden");

    if (immediate) {
      reset();
    } else {
      mobileMenu.querySelectorAll("a").forEach((link, i) => {
        setTimeout(() => {
          link.style.opacity = "0";
          link.style.transform = "translateX(10px)";
        }, i * 50);
      });
      setTimeout(reset, 300);
    }
  }

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    window.addEventListener("pageshow", () => closeMobileMenu(true));
    window.addEventListener("pagehide", () => closeMobileMenu(true));
    closeMobileMenu(true);
  }

  /* Form di contatto */
  const contactForm =
    document.getElementById("contact-form") ||
    document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      if (!name || !email || !message) {
        alert("Per favore, compila tutti i campi obbligatori.");
        return;
      }

      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = "Invio in corso…";
      submitButton.disabled = true;

      setTimeout(() => {
        alert(
          "Grazie per il tuo messaggio! Ti contatteremo presto tramite WhatsApp o email."
        );
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2000);
    });
  }

  /* Header che appare/scompare con lo scroll */
  const header =
    document.querySelector(".nav-elegant") || document.getElementById("navbar");
  if (header) {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100) {
        header.classList.add("scrolled", "opacity-100");
        header.classList.remove("opacity-0");
      } else if (scrollTop <= 50) {
        header.classList.remove("scrolled", "opacity-100");
        header.classList.add("opacity-0");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  /* Animazione card on scroll (IntersectionObserver) */
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".elegant-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
});

/* Gestione dei modal */

// Funzioni apertura e chiusura modali
function openModal() {
  document.getElementById("reviewModal").classList.add("active");
  document.body.classList.add("modal-open");
}

function closeModal() {
  document.getElementById("reviewModal").classList.remove("active");
  document.body.classList.remove("modal-open");
  // Reset form alla chiusura
  document.getElementById("reviewForm").reset();
}

function openModal2() {
  document.getElementById("thxModal").classList.add("active");
  document.body.classList.add("modal-open");
}

function closeModal2() {
  document.getElementById("thxModal").classList.remove("active");
  document.body.classList.remove("modal-open");
}

// Funzione per invio form e gestione modali
function goToStep2() {
  const form = document.getElementById("reviewForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitButton = form.querySelector('button[onclick="goToStep2()"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = "Invio in corso…";
  submitButton.disabled = true;

  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        form.reset();
        closeModal();
        openModal2();
      } else {
        alert("Errore durante l'invio. Riprova.");
      }
    })
    .catch(() => {
      alert("Errore di rete. Riprova.");
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}
