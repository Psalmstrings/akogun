/* =========================================
   AKOGUN SEC WEBSITE
   Surveying & Environmental Consultancy
   Main JavaScript Application
========================================= */

"use strict";

/* =========================================
   SITE CONFIGURATION
========================================= */
const WHATSAPP_NUMBER = "2348064825656"; // Nigerian international format (+234 806 482 5656)

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     1. HERO CAROUSEL
  ========================================= */
  const heroSection = document.getElementById("home");
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDots = document.querySelectorAll(".hero-dot");
  const heroPrev = document.getElementById("heroPrev");
  const heroNext = document.getElementById("heroNext");

  let currentSlide = 0;
  let carouselTimer = null;
  let isAnimating = false;

  const carouselDelay = 6500;
  const slideDuration = 800;

  function showSlide(index) {
    if (heroSlides.length < 2 || isAnimating) return;

    const nextIndex = (index + heroSlides.length) % heroSlides.length;
    if (nextIndex === currentSlide) return;

    isAnimating = true;

    const current = heroSlides[currentSlide];
    const next = heroSlides[nextIndex];

    const direction =
      index > currentSlide ||
      (currentSlide === heroSlides.length - 1 && nextIndex === 0)
        ? 1
        : -1;

    // Position incoming slide
    next.style.transition = "none";
    next.style.visibility = "visible";
    next.style.opacity = "1";
    next.style.zIndex = "3";
    next.style.transform = `translateX(${direction * 100}%)`;

    current.style.transition = "none";
    current.style.transform = "translateX(0)";
    current.style.visibility = "visible";
    current.style.opacity = "1";
    current.style.zIndex = "2";

    // Force reflow
    void next.offsetWidth;

    next.style.transition = `transform ${slideDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    current.style.transition = `transform ${slideDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`;

    requestAnimationFrame(() => {
      current.style.transform = `translateX(${direction * -100}%)`;
      next.style.transform = "translateX(0)";
    });

    // Update dots
    heroDots.forEach((dot, i) => {
      const active = i === nextIndex;
      dot.classList.toggle("is-active", active);
      if (active) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    currentSlide = nextIndex;

    window.setTimeout(() => {
      current.classList.remove("is-active");
      current.setAttribute("aria-hidden", "true");
      current.style.visibility = "hidden";
      current.style.zIndex = "1";
      current.style.transition = "";
      current.style.transform = "translateX(100%)";

      next.classList.add("is-active");
      next.setAttribute("aria-hidden", "false");
      next.style.visibility = "visible";
      next.style.opacity = "1";
      next.style.zIndex = "2";
      next.style.transition = "";
      next.style.transform = "translateX(0)";

      isAnimating = false;
    }, slideDuration + 50);
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function previousSlide() {
    showSlide(currentSlide - 1);
  }

  function startCarousel() {
    stopCarousel();
    if (heroSlides.length > 1) {
      carouselTimer = window.setInterval(() => {
        if (!isAnimating) nextSlide();
      }, carouselDelay);
    }
  }

  function stopCarousel() {
    if (carouselTimer !== null) {
      window.clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  if (heroNext) {
    heroNext.addEventListener("click", () => {
      nextSlide();
      startCarousel();
    });
  }

  if (heroPrev) {
    heroPrev.addEventListener("click", () => {
      previousSlide();
      startCarousel();
    });
  }

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startCarousel();
    });
  });

  // Pause carousel on hover for readability
  if (heroSection) {
    heroSection.addEventListener("mouseenter", stopCarousel);
    heroSection.addEventListener("mouseleave", startCarousel);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    heroSection.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 50) {
          if (diffX < 0) {
            nextSlide();
          } else {
            previousSlide();
          }
          startCarousel();
        }
      },
      { passive: true }
    );
  }

  // Keyboard navigation for carousel
  document.addEventListener("keydown", (e) => {
    if (document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      return;
    }
    if (e.key === "ArrowLeft") {
      previousSlide();
      startCarousel();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      startCarousel();
    }
  });

  // Initialize first slide
  heroSlides.forEach((slide, index) => {
    const active = index === 0;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.style.transition = "";
    slide.style.visibility = active ? "visible" : "hidden";
    slide.style.opacity = "1";
    slide.style.transform = active ? "translateX(0)" : "translateX(100%)";
    slide.style.zIndex = active ? "2" : "1";
  });

  heroDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === 0);
    if (index === 0) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });

  startCarousel();

  /* =========================================
     2. MOBILE NAVIGATION DRAWER
  ========================================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (menuToggle && navigation) {
    const toggleMenu = (forceState) => {
      const willOpen =
        forceState !== undefined ? forceState : !navigation.classList.contains("is-open");
      navigation.classList.toggle("is-open", willOpen);
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute(
        "aria-label",
        willOpen ? "Close navigation menu" : "Open navigation menu"
      );
    };

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking nav links
    navigation.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        toggleMenu(false);
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navigation.classList.contains("is-open")) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });

    // Close on clicking outside
    document.addEventListener("click", (e) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  /* =========================================
     3. FOUNDER PROFILE TOGGLE
  ========================================= */
  const founderDetails = document.querySelector(".founder-details");
  if (founderDetails) {
    const summarySpan = founderDetails.querySelector("summary span:first-child");
    founderDetails.addEventListener("toggle", () => {
      if (summarySpan) {
        summarySpan.textContent = founderDetails.open
          ? "Hide founder's full profile"
          : "Read the founder’s full profile";
      }
    });
  }

  /* =========================================
     4. SERVICE ENQUIRY QUICK PRE-SELECT
  ========================================= */
  const serviceEnquiryLinks = document.querySelectorAll("a[data-service]");
  const serviceChoiceSelect = document.getElementById("service-choice");
  const enquiryForm = document.getElementById("enquiry-form");
  const messageInput = document.getElementById("message");

  serviceEnquiryLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const serviceName = link.getAttribute("data-service");
      if (serviceChoiceSelect && serviceName) {
        for (let i = 0; i < serviceChoiceSelect.options.length; i++) {
          if (
            serviceChoiceSelect.options[i].value.toLowerCase() ===
            serviceName.toLowerCase()
          ) {
            serviceChoiceSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (enquiryForm) {
        enquiryForm.classList.add("form-pulse");
        window.setTimeout(() => {
          enquiryForm.classList.remove("form-pulse");
        }, 1300);
      }

      if (messageInput) {
        window.setTimeout(() => {
          messageInput.focus();
        }, 450);
      }
    });
  });

  /* =========================================
     5. CONTACT FORM TO WHATSAPP
  ========================================= */
  const contactForm = document.getElementById("enquiry-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const nameInput = document.getElementById("full-name");
      const emailInput = document.getElementById("email-address");
      const serviceInput = document.getElementById("service-choice");
      const messageInput = document.getElementById("message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const service = serviceInput ? serviceInput.value : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !service || !message) {
        if (formStatus) {
          formStatus.className = "form-help is-error";
          formStatus.textContent = "Please fill in all required fields marked with *.";
        }
        return;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        if (formStatus) {
          formStatus.className = "form-help is-error";
          formStatus.textContent = "Please provide a valid email address.";
        }
        if (emailInput) emailInput.focus();
        return;
      }

      // Save lead/inquiry to DataStore (Firebase & LocalStorage) for Admin Dashboard
      if (window.AkogunDataStore) {
        window.AkogunDataStore.saveInquiry({
          name,
          email,
          service,
          message
        });
      }

      // Format WhatsApp message
      const whatsappMessage = [
        "Hello AKOGUN SEC,",
        "",
        "I would like to make an enquiry regarding your professional services.",
        "",
        `Full Name: ${name}`,
        `Email: ${email}`,
        `Service Required: ${service}`,
        "",
        "Project Details / Message:",
        message,
        "",
        "— Sent via AKOGUN SEC Website Enquiry Form"
      ].join("\n");

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(whatsappMessage);

      if (formStatus) {
        formStatus.className = "form-help is-success";
        formStatus.textContent =
          "✓ Opening WhatsApp with your prepared enquiry. Please review and send!";
      }

      // Attempt to open WhatsApp in a new tab
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Fallback if popup blocker intercepted the tab
      if (!whatsappWindow) {
        if (formStatus) {
          formStatus.className = "form-help is-success";
          formStatus.innerHTML =
            'Browser blocked pop-up. <a id="whatsappFallback" href="' +
            whatsappURL +
            '" target="_blank" rel="noopener noreferrer" style="color: #073b7a; font-weight: 700; text-decoration: underline;">Click here to open WhatsApp directly</a>.';
        }
      }
    });
  }

  /* =========================================
     6. PROJECT FILTERING
  ========================================= */
  const projectFilters = document.querySelectorAll(".project-filter");
  const projectCards = document.querySelectorAll(".project-card");

  projectFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      projectFilters.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const matchesCategory =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;

        if (matchesCategory) {
          card.hidden = false;
          // Re-trigger CSS animation
          card.style.animation = "none";
          void card.offsetHeight;
          card.style.animation = "";
        } else {
          card.hidden = true;
        }
      });
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  /* =========================================
     7. SCROLL REVEAL ANIMATIONS
  ========================================= */
  const revealElements = document.querySelectorAll(".reveal");
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealElements.forEach((el) => {
      el.classList.add("animate-on-scroll");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /* =========================================
     8. ACTIVE NAVIGATION LINK ON SCROLL
  ========================================= */
  const navLinks = document.querySelectorAll(".nav-link");
  const pageSections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            navLinks.forEach((link) => {
              const href = link.getAttribute("href");
              const matches = href === `#${currentId}`;
              link.classList.toggle("active", matches);
            });
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0,
      }
    );

    pageSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =========================================
     9. AUTOMATIC FOOTER YEAR
  ========================================= */
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
