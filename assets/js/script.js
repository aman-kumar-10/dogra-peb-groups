// ==========================================================================
// DOGRA PEB GROUPS - ENHANCED CORE JAVASCRIPT
// High-performance micro-interactions, responsive sliders, touch gestures,
// modal popups, lightbox, animated counters & festival celebration system.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initBannerSlider();
    initMobileNav();
    initScrollHeader();
    initServicesSlider();
    initStatsCounter();
    initScrollReveal();
    initSimpleLightbox();
    initServicePopup();
    initProjectPopup();
    initFaqAccordion();
    initForms();
    initFestivalTheme();
    initScrollProgress();
    initEquipmentCatalogModal();
});

// ============================================
// 1. HERO BANNER SLIDER
// ============================================
function initBannerSlider() {
    const fullBanners = document.querySelectorAll("#full-banners .full-banner");
    const mbBanners = document.querySelectorAll("#mb-banners .mb-banner");

    function setupSlider(banners) {
        if (!banners.length) return;
        let index = 0;
        setInterval(() => {
            banners[index].classList.remove("active");
            index = (index + 1) % banners.length;
            banners[index].classList.add("active");
        }, 5000);
    }

    setupSlider(fullBanners);
    setupSlider(mbBanners);
}

// ============================================
// 2. HEADER SCROLL & MOBILE NAVIGATION
// ============================================
function initScrollHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

function initMobileNav() {
    const mobileToggle = document.getElementById("mobileToggle");
    const navMobile = document.getElementById("navMobile");
    const navOverlay = document.getElementById("navOverlay");

    if (!mobileToggle || !navMobile || !navOverlay) return;

    function openMobileMenu() {
        mobileToggle.classList.add("active");
        navMobile.classList.add("active");
        navOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        mobileToggle.classList.remove("active");
        navMobile.classList.remove("active");
        navOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    mobileToggle.addEventListener("click", () => {
        if (navMobile.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    navOverlay.addEventListener("click", closeMobileMenu);

    // Close when clicking nav links inside mobile menu
    navMobile.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navMobile.classList.contains("active")) {
            closeMobileMenu();
        }
    });
}

// ============================================
// 3. STATS COUNTER ANIMATION (ON SCROLL VIEW)
// ============================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll(".stat-number");
    if (!statNumbers.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.count) || 0;
                    let current = 0;
                    const duration = 1800; // ms
                    const frameRate = 1000 / 60;
                    const totalFrames = Math.round(duration / frameRate);
                    const increment = target / totalFrames;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target + "+";
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, frameRate);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.25 });

    const statsSection = document.querySelector(".stats-section") || statNumbers[0].closest(".section");
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ============================================
// 4. SERVICES SLIDER (WITH TOUCH SWIPE & GAP)
// ============================================
let currentServiceSlide = 0;

function initServicesSlider() {
    const track = document.getElementById("servicesTrack");
    const prevBtn = document.getElementById("prevService");
    const nextBtn = document.getElementById("nextService");
    const dotsContainer = document.getElementById("serviceDots");

    if (!track) return;

    const cards = track.querySelectorAll(".service-card");
    if (!cards.length) return;

    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function getMaxSlides() {
        const visible = getVisibleCards();
        return Math.max(1, cards.length - visible + 1);
    }

    function updateSlider() {
        const maxSlides = getMaxSlides();
        if (currentServiceSlide >= maxSlides) {
            currentServiceSlide = maxSlides - 1;
        }
        if (currentServiceSlide < 0) {
            currentServiceSlide = 0;
        }

        // Calculate precise offset including margin / gap
        const firstCard = cards[0];
        const cardWidth = firstCard.getBoundingClientRect().width;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 24;
        const totalOffset = currentServiceSlide * (cardWidth + gap);

        track.style.transform = `translateX(-${totalOffset}px)`;

        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll(".slider-dot");
            dots.forEach((dot, idx) => {
                dot.classList.toggle("active", idx === currentServiceSlide);
            });
        }
    }

    function renderDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        const maxSlides = getMaxSlides();
        for (let i = 0; i < maxSlides; i++) {
            const dot = document.createElement("div");
            dot.className = `slider-dot ${i === currentServiceSlide ? "active" : ""}`;
            dot.dataset.index = i;
            dot.addEventListener("click", () => {
                currentServiceSlide = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const maxSlides = getMaxSlides();
            if (currentServiceSlide < maxSlides - 1) {
                currentServiceSlide++;
            } else {
                currentServiceSlide = 0;
            }
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const maxSlides = getMaxSlides();
            if (currentServiceSlide > 0) {
                currentServiceSlide--;
            } else {
                currentServiceSlide = maxSlides - 1;
            }
            updateSlider();
        });
    }

    // Touch Swipe Support for Mobile & Tablets
    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                // Swipe Left -> Next
                if (nextBtn) nextBtn.click();
            } else {
                // Swipe Right -> Prev
                if (prevBtn) prevBtn.click();
            }
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        renderDots();
        updateSlider();
    });

    renderDots();
    updateSlider();
}

// ============================================
// 5. FAQ ACCORDION
// ============================================
function initFaqAccordion() {
    const questions = document.querySelectorAll(".faq-question");
    if (!questions.length) return;

    questions.forEach(question => {
        question.addEventListener("click", () => {
            const item = question.closest(".faq-item");
            const answer = item.querySelector(".faq-answer");
            const icon = question.querySelector(".faq-icon");

            const isOpen = answer.classList.contains("active");

            // Close others
            questions.forEach(q => {
                const otherItem = q.closest(".faq-item");
                const otherAnswer = otherItem.querySelector(".faq-answer");
                const otherIcon = q.querySelector(".faq-icon");
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                    q.classList.remove("active");
                    if (otherAnswer) otherAnswer.classList.remove("active");
                    if (otherIcon) otherIcon.textContent = "+";
                }
            });

            // Toggle current
            if (isOpen) {
                answer.classList.remove("active");
                question.classList.remove("active");
                item.classList.remove("active");
                if (icon) icon.textContent = "+";
            } else {
                answer.classList.add("active");
                question.classList.add("active");
                item.classList.add("active");
                if (icon) icon.textContent = "−";
            }
        });
    });
}

// ============================================
// 6. FORM HANDLING & TOAST NOTIFICATIONS
// ============================================
function initForms() {
    const contactForm = document.getElementById("contactForm");
    const newsletterForm = document.getElementById("newsletterForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = contactForm.querySelector("#name")?.value.trim();
            const email = contactForm.querySelector("#email")?.value.trim();
            const phone = contactForm.querySelector("#phone")?.value.trim();
            const message = contactForm.querySelector("#message")?.value.trim();

            if (!name || !email || !phone) {
                showToast("Please fill in all required fields.", "error");
                return;
            }

            showToast("Thank you, " + name + "! Your enquiry has been received. Our team will contact you within 24 hours.", "success");
            contactForm.reset();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector(".newsletter-input");
            if (!input || !input.value.trim()) {
                showToast("Please enter a valid email address.", "error");
                return;
            }
            showToast("Thank you for subscribing to Dogra PEB Groups updates!", "success");
            newsletterForm.reset();
        });
    }
}

function showToast(message, type = "success") {
    document.querySelectorAll(".notification").forEach(n => n.remove());

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => notification.remove());
    }

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(20px)";
            notification.style.transition = "all 0.35s ease";
            setTimeout(() => notification.remove(), 350);
        }
    }, 5500);
}

// ============================================
// 7. SCROLL REVEAL OBSERVER
// ============================================
function initScrollReveal() {
    const reveals = document.querySelectorAll(".fade-in, .reveal, .service-card, .project-card, .gallery-item, .contact-item, .info-card");
    if (!reveals.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        reveals.forEach(el => el.classList.add("fade-in-visible", "revealed"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in-visible", "revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
    });

    reveals.forEach(el => observer.observe(el));
}

// ============================================
// 8. IMAGE LIGHTBOX MODAL
// ============================================
function initSimpleLightbox() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    if (!galleryItems.length) return;

    galleryItems.forEach((item, index) => {
        item.dataset.index = index;
        item.addEventListener("click", (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    setupLightboxControls();
}

function openLightbox(index) {
    const items = document.querySelectorAll(".gallery-item");
    if (!items.length || index < 0 || index >= items.length) return;

    window.currentLightboxIndex = index;
    const currentItem = items[index];
    const imgEl = currentItem.querySelector("img");
    if (!imgEl) return;

    const modal = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("lightboxImage");
    const titleEl = document.getElementById("lightboxTitle");
    const counterEl = document.getElementById("lightboxCounter");

    if (!modal || !lightboxImg) return;

    // Source resolution
    let src = imgEl.currentSrc || imgEl.getAttribute("src") || imgEl.src;
    lightboxImg.src = src;
    lightboxImg.alt = imgEl.alt || "Dogra PEB Groups Infrastructure Image";

    const caption = currentItem.querySelector(".gallery-caption p")?.textContent.trim();
    if (titleEl) {
        titleEl.textContent = caption || imgEl.alt || "Project Image";
    }

    if (counterEl) {
        counterEl.textContent = `${index + 1} / ${items.length}`;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Setup thumbnails
    renderLightboxThumbnails(items, index);
}

function renderLightboxThumbnails(items, activeIndex) {
    const track = document.getElementById("thumbnailTrack");
    if (!track) return;
    track.innerHTML = "";

    items.forEach((item, idx) => {
        const img = item.querySelector("img");
        if (!img) return;

        const thumb = document.createElement("div");
        thumb.className = `thumbnail ${idx === activeIndex ? "active" : ""}`;
        const thumbImg = document.createElement("img");
        thumbImg.src = img.currentSrc || img.src;
        thumbImg.alt = `Thumbnail ${idx + 1}`;
        thumb.appendChild(thumbImg);

        thumb.addEventListener("click", () => {
            openLightbox(idx);
        });

        track.appendChild(thumb);
    });
}

function setupLightboxControls() {
    const modal = document.getElementById("imageLightbox");
    if (!modal) return;

    const closeBtn = document.getElementById("lightboxClose");
    const overlay = document.getElementById("lightboxOverlay");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    const zoomBtn = document.getElementById("lightboxZoom");
    const downloadBtn = document.getElementById("lightboxDownload");

    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
        const img = document.getElementById("lightboxImage");
        if (img) img.classList.remove("zoomed");
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const items = document.querySelectorAll(".gallery-item");
            const newIdx = (window.currentLightboxIndex - 1 + items.length) % items.length;
            openLightbox(newIdx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const items = document.querySelectorAll(".gallery-item");
            const newIdx = (window.currentLightboxIndex + 1) % items.length;
            openLightbox(newIdx);
        });
    }

    if (zoomBtn) {
        zoomBtn.addEventListener("click", () => {
            const img = document.getElementById("lightboxImage");
            if (img) img.classList.toggle("zoomed");
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const img = document.getElementById("lightboxImage");
            if (!img || !img.src) return;
            const a = document.createElement("a");
            a.href = img.src;
            a.download = `dogra-peb-image-${(window.currentLightboxIndex || 0) + 1}.jpg`;
            a.click();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft" && prevBtn) prevBtn.click();
        if (e.key === "ArrowRight" && nextBtn) nextBtn.click();
    });
}

// ============================================
// 9. SERVICE SUMMARY POPUP
// ============================================
let typewriterTimer = null;

function initServicePopup() {
    const popup = document.getElementById("servicePopup");
    if (!popup) return;

    document.querySelectorAll(".view-service-summary").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const card = btn.closest(".service-card");
            if (!card) return;
            openServicePopup(card);
        });
    });

    const closeBtn = document.getElementById("servicePopupClose");
    const overlay = document.getElementById("servicePopupOverlay");

    if (closeBtn) closeBtn.addEventListener("click", closeServicePopup);
    if (overlay) overlay.addEventListener("click", closeServicePopup);

    document.addEventListener("keydown", (e) => {
        if (popup.classList.contains("active") && e.key === "Escape") {
            closeServicePopup();
        }
    });

    window.closeServicePopup = closeServicePopup;
}

function openServicePopup(card) {
    const popup = document.getElementById("servicePopup");
    if (!popup) return;

    if (typewriterTimer) {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
    }

    const title = card.querySelector("h3")?.textContent || "Service Details";
    const desc = card.querySelector("p")?.textContent || "";
    const iconClass = card.querySelector(".service-icon i")?.className || "fas fa-building";
    const features = Array.from(card.querySelectorAll(".service-features li")).map(li => li.textContent);

    document.getElementById("servicePopupTitle").textContent = title;
    const iconContainer = document.getElementById("servicePopupIcon");
    if (iconContainer) iconContainer.innerHTML = `<i class="${iconClass}"></i>`;

    const descEl = document.getElementById("servicePopupDescription");
    const cursor = popup.querySelector(".typewriter-cursor");
    const featuresList = document.getElementById("servicePopupFeatures");

    if (descEl) descEl.textContent = "";
    if (cursor) cursor.style.display = "inline-block";
    if (featuresList) featuresList.innerHTML = "";

    popup.classList.add("active");
    document.body.style.overflow = "hidden";

    // Typewriter effect
    let i = 0;
    typewriterTimer = setInterval(() => {
        if (i < desc.length) {
            descEl.textContent += desc.charAt(i);
            i++;
        } else {
            clearInterval(typewriterTimer);
            typewriterTimer = null;
            if (cursor) cursor.style.display = "none";
        }
    }, 18);

    // Populate animated features
    if (featuresList) {
        features.forEach((feat, idx) => {
            const item = document.createElement("div");
            item.className = "feature-item";
            item.innerHTML = `
                <div class="feature-checkbox"><i class="fas fa-check"></i></div>
                <div class="feature-text">${feat}</div>
            `;
            featuresList.appendChild(item);
        });
    }
}

function closeServicePopup() {
    const popup = document.getElementById("servicePopup");
    if (!popup) return;
    if (typewriterTimer) {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
    }
    popup.classList.remove("active");
    document.body.style.overflow = "";
}

// ============================================
// 10. PROJECT SUMMARY POPUP
// ============================================
function initProjectPopup() {
    const popup = document.getElementById("projectPopup");
    if (!popup) return;

    const overlay = document.getElementById("projectPopupOverlay");
    const closeBtn = document.getElementById("projectPopupClose");
    const prevBtn = popup.querySelector(".popup-prev");
    const nextBtn = popup.querySelector(".popup-next");

    let galleryImages = [];
    let currentImageIndex = 0;

    document.querySelectorAll(".view-project-summary").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const card = btn.closest(".project-card");
            if (!card) return;
            openProjectPopup(card);
        });
    });

    function openProjectPopup(card) {
        const titleEl = document.getElementById("projectPopupTitle");
        const locationEl = document.querySelector("#projectPopupLocation span");
        const imageEl = document.getElementById("projectPopupImage");
        const descEl = document.getElementById("projectPopupDescription");

        const scaleEl = document.getElementById("projectPopupScale");
        const timelineEl = document.getElementById("projectPopupTimeline");
        const categoryEl = document.getElementById("projectPopupCategory");
        const keyPointsEl = document.getElementById("projectPopupKeyPoints");

        const clientNameEl = document.getElementById("projectPopupClientName");
        const clientRoleEl = document.getElementById("projectPopupClientRole");
        const testimonialEl = document.getElementById("projectPopupTestimonial");

        if (titleEl) titleEl.textContent = card.querySelector("h3")?.textContent || "Project Overview";
        if (locationEl) {
            locationEl.textContent = card.querySelector(".fa-map-marker-alt")?.parentElement.textContent.trim() || "India";
        }
        if (descEl) {
            descEl.textContent = card.querySelector(".project-content > p:nth-of-type(2)")?.textContent || "";
        }

        // Tags & highlights
        const tags = Array.from(card.querySelectorAll(".project-tag")).map(t => t.textContent.trim());
        if (keyPointsEl) {
            keyPointsEl.innerHTML = "";
            tags.forEach(t => {
                keyPointsEl.innerHTML += `<div class="key-point"><i class="fas fa-check-circle"></i> ${t}</div>`;
            });
        }

        if (scaleEl) scaleEl.textContent = tags.length >= 3 ? "Large Industrial" : "Custom Spec";
        if (timelineEl) timelineEl.textContent = "Turnkey Execution";
        if (categoryEl) categoryEl.textContent = tags[0] || "Structural Engineering";

        // Client feedback
        if (clientNameEl) clientNameEl.textContent = card.querySelector(".c-name")?.value || "Project Client";
        if (clientRoleEl) clientRoleEl.textContent = card.querySelector(".c-role")?.value || "Authorized Representative";
        if (testimonialEl) {
            testimonialEl.textContent = `"${card.querySelector(".c-testimonial")?.value || "Outstanding structural execution with timely delivery."}"`;
        }

        // Images
        galleryImages = Array.from(card.querySelectorAll(".project-img")).map(i => i.value);
        if (!galleryImages.length) {
            const mainImg = card.querySelector(".project-image img");
            if (mainImg) galleryImages.push(mainImg.currentSrc || mainImg.src);
        }
        currentImageIndex = 0;
        setPopupImage();

        popup.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function setPopupImage() {
        const imageEl = document.getElementById("projectPopupImage");
        if (imageEl && galleryImages.length) {
            imageEl.src = galleryImages[currentImageIndex];
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (!galleryImages.length) return;
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            setPopupImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (!galleryImages.length) return;
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            setPopupImage();
        });
    }

    function closePopup() {
        popup.classList.remove("active");
        document.body.style.overflow = "";
        galleryImages = [];
    }

    if (closeBtn) closeBtn.addEventListener("click", closePopup);
    if (overlay) overlay.addEventListener("click", closePopup);

    document.addEventListener("keydown", (e) => {
        if (!popup.classList.contains("active")) return;
        if (e.key === "Escape") closePopup();
        if (e.key === "ArrowLeft" && prevBtn) prevBtn.click();
        if (e.key === "ArrowRight" && nextBtn) nextBtn.click();
    });

    window.closeProjectPopup = closePopup;
}

// ============================================
// 10. FAQ ACCORDION INTERACTION
// ============================================
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    if (!faqQuestions.length) return;

    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const item = question.closest(".faq-item");
            if (!item) return;
            const answer = item.querySelector(".faq-answer");
            const icon = question.querySelector(".faq-icon");
            const isCurrentlyActive = item.classList.contains("active");

            // Close all other items
            faqQuestions.forEach(q => {
                if (q !== question) {
                    const otherItem = q.closest(".faq-item");
                    const otherAnswer = otherItem ? otherItem.querySelector(".faq-answer") : null;
                    const otherIcon = q.querySelector(".faq-icon");
                    if (otherItem) otherItem.classList.remove("active");
                    q.classList.remove("active");
                    if (otherAnswer) otherAnswer.classList.remove("active");
                    if (otherIcon) otherIcon.textContent = "+";
                }
            });

            // Toggle current item
            if (!isCurrentlyActive) {
                item.classList.add("active");
                question.classList.add("active");
                if (answer) answer.classList.add("active");
                if (icon) icon.textContent = "−";
            } else {
                item.classList.remove("active");
                question.classList.remove("active");
                if (answer) answer.classList.remove("active");
                if (icon) icon.textContent = "+";
            }
        });
    });
}

// ============================================
// 11. FESTIVAL THEMING & CELEBRATION SYSTEM
// ============================================
const FESTIVAL_CONFIG = {
    dussehra: {
        id: "dussehra",
        name: "Dussehra",
        greeting: "Happy Dussehra!",
        message: "Celebrate the victory of good over evil with unbeatable deals on PEB, prefab structures & outdoor infrastructure.",
        startDate: "2026-10-18T00:00:00+05:30",
        endDate: "2026-10-21T23:59:59+05:30",
        logo: "assets/imgs/logo-dussehra.svg",
        accentColor: "#E65100",
        badge: "🏹 Shubh Vijayadashami",
        garland: "🏹 ✦ 🪔 ✦ 🏹 ✦ 🪔 ✦ 🏹",
        vectors: { topLeft: "🏹", topRight: "🪔", bottomLeft: "✨", bottomRight: "🎯" },
        particleColors: ["#FF6A00", "#FFD700", "#FF3D00", "#FFA000", "#FFFFFF"]
    },
    diwali: {
        id: "diwali",
        name: "Diwali",
        greeting: "Happy Diwali!",
        message: "Illuminate your industrial projects with premier engineering and festive savings on PEB & tanks.",
        startDate: "2026-11-03T00:00:00+05:30",
        endDate: "2026-11-12T23:59:59+05:30",
        logo: "assets/imgs/logo-diwali.svg",
        accentColor: "#FF8F00",
        badge: "🪔 Shubh Deepavali",
        garland: "🪔 ✦ 🎆 ✦ 🪔 ✦ 🎆 ✦ 🪔",
        vectors: { topLeft: "🪔", topRight: "🎆", bottomLeft: "✨", bottomRight: "🎇" },
        particleColors: ["#FFD700", "#FF8F00", "#FF6A00", "#FF1744", "#FFFFFF"]
    },
    christmas: {
        id: "christmas",
        name: "Christmas",
        greeting: "Merry Christmas!",
        message: "Season's greetings from Dogra PEB Groups! Enjoy joyful holiday discounts on industrial infrastructure.",
        startDate: "2026-12-20T00:00:00+05:30",
        endDate: "2026-12-26T23:59:59+05:30",
        logo: "assets/imgs/logo-christmas.svg",
        accentColor: "#D32F2F",
        badge: "🎄 Season's Greetings",
        garland: "🎄 ✦ 🔔 ✦ ❄️ ✦ 🎁 ✦ 🎄",
        vectors: { topLeft: "🎄", topRight: "🎁", bottomLeft: "❄️", bottomRight: "🔔" },
        particleColors: ["#D32F2F", "#10B981", "#FFD700", "#FFFFFF"]
    },
    newyear: {
        id: "newyear",
        name: "New Year",
        greeting: "Happy New Year 2027!",
        message: "Step into 2027 with state-of-the-art PEB warehouses and infrastructure at special inaugural year pricing.",
        startDate: "2026-12-28T00:00:00+05:30",
        endDate: "2027-01-03T23:59:59+05:30",
        logo: "assets/imgs/logo-newyear.svg",
        accentColor: "#F59E0B",
        badge: "✨ Welcome 2027",
        garland: "🥂 ✦ 🎆 ✦ 🍾 ✦ 🎆 ✦ 🥂",
        vectors: { topLeft: "🥂", topRight: "🎆", bottomLeft: "✨", bottomRight: "🎉" },
        particleColors: ["#F59E0B", "#FBBF24", "#6366F1", "#FFFFFF"]
    }
};

function getActiveFestival() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("nofestival")) {
        return { festival: null, isOverride: false };
    }
    const override = urlParams.get("festival");
    if (override && FESTIVAL_CONFIG[override.toLowerCase()]) {
        return { festival: FESTIVAL_CONFIG[override.toLowerCase()], isOverride: true };
    }

    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
        });
        const parts = formatter.formatToParts(now);
        const p = {};
        parts.forEach(({ type, value }) => p[type] = value);
        const kolkataISO = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+05:30`;
        const currentTime = new Date(kolkataISO).getTime();

        for (const key of Object.keys(FESTIVAL_CONFIG)) {
            const fest = FESTIVAL_CONFIG[key];
            const start = new Date(fest.startDate).getTime();
            const end = new Date(fest.endDate).getTime();
            if (currentTime >= start && currentTime <= end) {
                return { festival: fest, isOverride: false };
            }
        }
    } catch (err) {
        console.warn("Festival calculation fallback:", err);
    }
    return { festival: null, isOverride: false };
}

function resolveAssetPath(relPath) {
    const isSubdir = window.location.pathname.includes("/about-us") ||
                     window.location.pathname.includes("/services") ||
                     window.location.pathname.includes("/projects") ||
                     window.location.pathname.includes("/gallery") ||
                     window.location.pathname.includes("/open-gym-equipment") ||
                     window.location.pathname.includes("/contact-us");
    return isSubdir ? "../" + relPath : relPath;
}

function initFestivalTheme() {
    const { festival, isOverride } = getActiveFestival();
    if (!festival) return;

    // Swap logos
    const logos = document.querySelectorAll(".logo img, .logo-icon");
    const festLogoSrc = resolveAssetPath(festival.logo);
    logos.forEach(img => {
        img.removeAttribute("srcset");
        img.src = festLogoSrc;
    });

    // Theme variables
    document.documentElement.style.setProperty("--color-accent", festival.accentColor);
    document.documentElement.style.setProperty("--gradient-accent", `linear-gradient(135deg, ${festival.accentColor}, #FFA142)`);

    const storageKey = `dogra_festive_seen_${festival.id}_2026`;
    const alreadySeen = localStorage.getItem(storageKey);

    if (!alreadySeen || isOverride) {
        showCelebrationPopup(festival, storageKey);
    }
}

function showCelebrationPopup(festival, storageKey) {
    if (document.getElementById("festivalCelebrationModal")) return;

    const v = festival.vectors;
    const modalHTML = `
        <div class="festive-modal-overlay" id="festivalCelebrationModal" role="dialog" aria-modal="true">
            <div class="festive-modal-card">
                <!-- Top Festive Bunting Garland (Sample Image 3) -->
                <div class="festive-bunting-banner" aria-hidden="true">
                    <svg class="festive-bunting-svg" viewBox="0 0 540 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- String 1 -->
                        <path d="M0,15 Q270,62 540,15" stroke="rgba(15,23,42,0.22)" stroke-width="1.8" stroke-dasharray="3,3" fill="none"/>
                        <!-- Flags on String 1 -->
                        <polygon points="18,17 36,44 54,21" fill="#FF3D00"/>
                        <polygon points="60,22 78,49 96,27" fill="#FFC107"/>
                        <polygon points="102,28 120,55 138,33" fill="#00E5FF"/>
                        <polygon points="144,34 162,61 180,40" fill="#E91E63"/>
                        <polygon points="186,41 204,66 222,46" fill="#4CAF50"/>
                        <polygon points="228,47 246,70 264,50" fill="#FF9100"/>
                        <polygon points="272,50 290,70 308,47" fill="#9C27B0"/>
                        <polygon points="314,46 332,66 350,41" fill="#00E676"/>
                        <polygon points="356,40 374,61 392,34" fill="#FF1744"/>
                        <polygon points="398,33 416,55 434,28" fill="#FFD700"/>
                        <polygon points="440,27 458,49 476,22" fill="#2979FF"/>
                        <polygon points="482,21 500,44 518,17" fill="#FF5722"/>

                        <!-- String 2 Lower Drape -->
                        <path d="M15,35 Q270,82 525,35" stroke="rgba(15,23,42,0.18)" stroke-width="1.5" stroke-dasharray="2,2" fill="none"/>
                        <!-- Flags on String 2 -->
                        <polygon points="45,38 58,60 71,42" fill="#FFD700"/>
                        <polygon points="85,44 98,66 111,48" fill="#E040FB"/>
                        <polygon points="125,50 138,72 151,55" fill="#00B0FF"/>
                        <polygon points="165,57 178,77 191,61" fill="#FF3D00"/>
                        <polygon points="205,63 218,81 231,66" fill="#76FF03"/>
                        <polygon points="245,68 258,84 271,70" fill="#FF6D00"/>
                        <polygon points="285,69 298,84 311,68" fill="#2979FF"/>
                        <polygon points="325,66 338,81 351,63" fill="#FFD600"/>
                        <polygon points="365,61 378,77 391,57" fill="#E91E63"/>
                        <polygon points="405,55 418,72 431,50" fill="#00E5FF"/>
                        <polygon points="445,48 458,66 471,44" fill="#00E676"/>
                        <polygon points="485,42 498,60 511,38" fill="#FF9100"/>

                        <!-- Garland sparkles and confetti dots -->
                        <circle cx="50" cy="10" r="3" fill="#FF1744"/>
                        <circle cx="110" cy="18" r="2.5" fill="#FFD700"/>
                        <circle cx="170" cy="22" r="3" fill="#00E5FF"/>
                        <circle cx="230" cy="28" r="2.5" fill="#76FF03"/>
                        <circle cx="310" cy="28" r="3" fill="#FF9100"/>
                        <circle cx="370" cy="22" r="2" fill="#E040FB"/>
                        <circle cx="430" cy="18" r="3" fill="#FFD700"/>
                        <circle cx="490" cy="10" r="2.5" fill="#00E5FF"/>
                    </svg>
                </div>

                <!-- Firework Burst Sparks in Corners (Sample Image 2) -->
                <div class="festive-firework firework-top-left" aria-hidden="true">
                    <svg viewBox="0 0 100 100" class="firework-svg">
                        <circle cx="50" cy="50" r="3.5" fill="#FFF"/>
                        <g stroke="#FFD700" stroke-width="2" stroke-linecap="round">
                            <line x1="50" y1="40" x2="50" y2="15"/><circle cx="50" cy="12" r="3" fill="#FF1744"/>
                            <line x1="57" y1="43" x2="73" y2="23"/><circle cx="76" cy="20" r="2.5" fill="#FFD700"/>
                            <line x1="60" y1="50" x2="85" y2="50"/><circle cx="89" cy="50" r="3" fill="#00E5FF"/>
                            <line x1="57" y1="57" x2="73" y2="77"/><circle cx="76" cy="80" r="2.5" fill="#76FF03"/>
                            <line x1="50" y1="60" x2="50" y2="85"/><circle cx="50" cy="89" r="3" fill="#FF9100"/>
                            <line x1="43" y1="57" x2="27" y2="77"/><circle cx="24" cy="80" r="2.5" fill="#E040FB"/>
                            <line x1="40" y1="50" x2="15" y2="50"/><circle cx="11" cy="50" r="3" fill="#FFD700"/>
                            <line x1="43" y1="43" x2="27" y2="23"/><circle cx="24" cy="20" r="2.5" fill="#FF3D00"/>
                        </g>
                    </svg>
                </div>

                <div class="festive-firework firework-top-right" aria-hidden="true">
                    <svg viewBox="0 0 100 100" class="firework-svg">
                        <circle cx="50" cy="50" r="3.5" fill="#FFF"/>
                        <g stroke="#FF9100" stroke-width="2" stroke-linecap="round">
                            <line x1="50" y1="40" x2="50" y2="15"/><circle cx="50" cy="12" r="3" fill="#00E5FF"/>
                            <line x1="57" y1="43" x2="73" y2="23"/><circle cx="76" cy="20" r="2.5" fill="#FFD700"/>
                            <line x1="60" y1="50" x2="85" y2="50"/><circle cx="89" cy="50" r="3" fill="#FF1744"/>
                            <line x1="57" y1="57" x2="73" y2="77"/><circle cx="76" cy="80" r="2.5" fill="#E040FB"/>
                            <line x1="50" y1="60" x2="50" y2="85"/><circle cx="50" cy="89" r="3" fill="#76FF03"/>
                            <line x1="43" y1="57" x2="27" y2="77"/><circle cx="24" cy="80" r="2.5" fill="#FFD700"/>
                            <line x1="40" y1="50" x2="15" y2="50"/><circle cx="11" cy="50" r="3" fill="#00E5FF"/>
                            <line x1="43" y1="43" x2="27" y2="23"/><circle cx="24" cy="20" r="2.5" fill="#FF6D00"/>
                        </g>
                    </svg>
                </div>

                <!-- Floating Theme Vectors -->
                <div class="festive-floating-vector top-left" aria-hidden="true">${v.topLeft}</div>
                <div class="festive-floating-vector top-right" aria-hidden="true">${v.topRight}</div>

                <!-- Party Poppers Bursting with Confetti & Serpentine Ribbons (Sample Image 1) -->
                <div class="festive-popper popper-left" aria-hidden="true">
                    <svg viewBox="0 0 160 160" class="popper-svg" xmlns="http://www.w3.org/2000/svg">
                        <g class="popper-burst">
                            <path d="M60,85 C50,65 30,60 40,40 C48,25 28,15 35,0" stroke="#FF1744" stroke-width="4" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-1"/>
                            <path d="M70,80 C75,60 60,45 75,30 C88,15 72,0 82,-10" stroke="#FFD700" stroke-width="3.5" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-2"/>
                            <path d="M65,90 C80,80 95,70 90,50 C85,30 105,20 100,0" stroke="#00E5FF" stroke-width="3.5" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-3"/>
                            <path d="M50,90 C35,85 20,75 25,55 C30,40 15,30 20,15" stroke="#E040FB" stroke-width="3" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-4"/>
                            
                            <g class="popper-starburst" transform="translate(68, 40)">
                                <line x1="0" y1="0" x2="0" y2="-18" stroke="#FFD700" stroke-width="2"/>
                                <circle cx="0" cy="-20" r="2.5" fill="#FF1744"/>
                                <line x1="0" y1="0" x2="13" y2="-13" stroke="#FF9100" stroke-width="2"/>
                                <circle cx="15" cy="-15" r="2" fill="#FFD700"/>
                                <line x1="0" y1="0" x2="18" y2="0" stroke="#FFD700" stroke-width="2"/>
                                <circle cx="20" cy="0" r="2.5" fill="#00E5FF"/>
                                <line x1="0" y1="0" x2="13" y2="13" stroke="#FF1744" stroke-width="2"/>
                                <circle cx="15" cy="15" r="2" fill="#E040FB"/>
                                <line x1="0" y1="0" x2="-18" y2="0" stroke="#E040FB" stroke-width="2"/>
                                <circle cx="-20" cy="0" r="2.5" fill="#FFD700"/>
                                <line x1="0" y1="0" x2="-13" y2="-13" stroke="#76FF03" stroke-width="2"/>
                                <circle cx="-15" cy="-15" r="2" fill="#FF1744"/>
                            </g>

                            <circle cx="35" cy="70" r="3.5" fill="#FFD700"/>
                            <circle cx="50" cy="55" r="2.5" fill="#00E5FF"/>
                            <circle cx="85" cy="65" r="3.5" fill="#FF1744"/>
                            <circle cx="95" cy="40" r="3.5" fill="#76FF03"/>
                            <circle cx="25" cy="40" r="2.5" fill="#FF9100"/>
                            <rect x="55" y="20" width="5" height="5" fill="#E040FB" transform="rotate(45 57 22)"/>
                            <rect x="75" y="60" width="4" height="4" fill="#FFD700" transform="rotate(25 77 62)"/>
                        </g>

                        <g class="popper-cone" transform="rotate(-35 60 105)">
                            <defs>
                                <clipPath id="coneClipLeft">
                                    <polygon points="40,80 80,80 60,140"/>
                                </clipPath>
                            </defs>
                            <g clip-path="url(#coneClipLeft)">
                                <polygon points="40,80 80,80 60,140" fill="#880E4F"/>
                                <line x1="20" y1="80" x2="100" y2="100" stroke="#E91E63" stroke-width="10"/>
                                <line x1="20" y1="100" x2="100" y2="120" stroke="#FF4081" stroke-width="10"/>
                                <line x1="20" y1="120" x2="100" y2="140" stroke="#E91E63" stroke-width="10"/>
                            </g>
                            <ellipse cx="60" cy="80" rx="20" ry="6" fill="#FFD700" stroke="#FFA000" stroke-width="1.5"/>
                            <ellipse cx="60" cy="80" rx="16" ry="4" fill="#4A0028"/>
                        </g>
                    </svg>
                </div>

                <div class="festive-popper popper-right" aria-hidden="true">
                    <svg viewBox="0 0 160 160" class="popper-svg" xmlns="http://www.w3.org/2000/svg">
                        <g class="popper-burst">
                            <path d="M100,85 C110,65 130,60 120,40 C112,25 132,15 125,0" stroke="#00E676" stroke-width="4" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-1"/>
                            <path d="M90,80 C85,60 100,45 85,30 C72,15 88,0 78,-10" stroke="#FF6D00" stroke-width="3.5" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-2"/>
                            <path d="M95,90 C80,80 65,70 70,50 C75,30 55,20 60,0" stroke="#2979FF" stroke-width="3.5" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-3"/>
                            <path d="M110,90 C125,85 140,75 135,55 C130,40 145,30 140,15" stroke="#FFD700" stroke-width="3" fill="none" stroke-linecap="round" class="streamer-ribbon ribbon-4"/>
                            
                            <g class="popper-starburst" transform="translate(92, 40)">
                                <line x1="0" y1="0" x2="0" y2="-18" stroke="#00E5FF" stroke-width="2"/>
                                <circle cx="0" cy="-20" r="2.5" fill="#FFD700"/>
                                <line x1="0" y1="0" x2="13" y2="-13" stroke="#FF1744" stroke-width="2"/>
                                <circle cx="15" cy="-15" r="2" fill="#76FF03"/>
                                <line x1="0" y1="0" x2="18" y2="0" stroke="#FFD700" stroke-width="2"/>
                                <circle cx="20" cy="0" r="2.5" fill="#FF6D00"/>
                                <line x1="0" y1="0" x2="13" y2="13" stroke="#00E676" stroke-width="2"/>
                                <circle cx="15" cy="15" r="2" fill="#00E5FF"/>
                                <line x1="0" y1="0" x2="-18" y2="0" stroke="#76FF03" stroke-width="2"/>
                                <circle cx="-20" cy="0" r="2.5" fill="#2979FF"/>
                                <line x1="0" y1="0" x2="-13" y2="-13" stroke="#FF9100" stroke-width="2"/>
                                <circle cx="-15" cy="-15" r="2" fill="#E040FB"/>
                            </g>

                            <circle cx="125" cy="70" r="3.5" fill="#FF6D00"/>
                            <circle cx="110" cy="55" r="2.5" fill="#2979FF"/>
                            <circle cx="75" cy="65" r="3.5" fill="#00E676"/>
                            <circle cx="65" cy="40" r="3.5" fill="#FFD700"/>
                            <circle cx="135" cy="40" r="2.5" fill="#E040FB"/>
                            <rect x="105" y="20" width="5" height="5" fill="#76FF03" transform="rotate(45 107 22)"/>
                            <rect x="85" y="60" width="4" height="4" fill="#00E5FF" transform="rotate(25 87 62)"/>
                        </g>

                        <g class="popper-cone" transform="rotate(35 100 105)">
                            <defs>
                                <clipPath id="coneClipRight">
                                    <polygon points="80,80 120,80 100,140"/>
                                </clipPath>
                            </defs>
                            <g clip-path="url(#coneClipRight)">
                                <polygon points="80,80 120,80 100,140" fill="#1B5E20"/>
                                <line x1="60" y1="80" x2="140" y2="100" stroke="#4CAF50" stroke-width="10"/>
                                <line x1="60" y1="100" x2="140" y2="120" stroke="#76FF03" stroke-width="10"/>
                                <line x1="60" y1="120" x2="140" y2="140" stroke="#4CAF50" stroke-width="10"/>
                            </g>
                            <ellipse cx="100" cy="80" rx="20" ry="6" fill="#00E5FF" stroke="#00B0FF" stroke-width="1.5"/>
                            <ellipse cx="100" cy="80" rx="16" ry="4" fill="#003310"/>
                        </g>
                    </svg>
                </div>

                <!-- Internal Sprinkles Decorative Layer -->
                <div class="festive-sprinkles-layer" aria-hidden="true">
                    <span class="sprinkle sp-1">✦</span>
                    <span class="sprinkle sp-2">✨</span>
                    <span class="sprinkle sp-3">◆</span>
                    <span class="sprinkle sp-4">~</span>
                    <span class="sprinkle sp-5">✦</span>
                    <span class="sprinkle sp-6">★</span>
                    <span class="sprinkle sp-7">✨</span>
                    <span class="sprinkle sp-8">◆</span>
                </div>

                <div class="festive-ribbon"></div>
                <button class="festive-close-btn" id="festiveCloseBtn" aria-label="Close popup">&times;</button>
                <div class="festive-badge">${festival.badge}</div>
                <h2 class="festive-title">${festival.greeting}</h2>
                <p class="festive-message">${festival.message}</p>
                <div class="festive-actions">
                    <a href="tel:+916280397827" class="btn btn-festive-call">
                        <i class="fas fa-phone-alt"></i> Call Now
                    </a>
                    <a href="https://wa.me/916280397827" target="_blank" rel="noopener" class="btn btn-festive-wa">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <button class="btn btn-festive-dismiss" id="festiveDismissBtn">
                        Close
                    </button>
                </div>
            </div>
        </div>
        <canvas id="celebrationCanvas"></canvas>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const overlay = document.getElementById("festivalCelebrationModal");
    const closeBtn = document.getElementById("festiveCloseBtn");
    const dismissBtn = document.getElementById("festiveDismissBtn");
    const canvas = document.getElementById("celebrationCanvas");

    setTimeout(() => {
        overlay.classList.add("active");
        startConfettiAnimation(canvas, festival.particleColors);
    }, 350);

    function closeModal() {
        overlay.classList.remove("active");
        localStorage.setItem(storageKey, "true");
        setTimeout(() => {
            overlay.remove();
            if (canvas) canvas.remove();
        }, 400);
    }

    closeBtn.addEventListener("click", closeModal);
    dismissBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });
}

function startConfettiAnimation(canvas, colors) {
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        if (canvas) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
    }, { passive: true });

    const particles = [];
    const particleCount = Math.min(130, Math.max(70, Math.floor(width / 11)));
    const shapes = ["ribbon", "star", "dot", "diamond"];

    // Dual-cannon blast from bottom left and bottom right popper areas
    for (let i = 0; i < particleCount; i++) {
        const fromLeft = i % 2 === 0;
        const originX = fromLeft ? width * 0.25 : width * 0.75;
        const originY = height * 0.72;

        particles.push({
            x: originX + (Math.random() * 40 - 20),
            y: originY + (Math.random() * 30 - 15),
            vx: fromLeft ? (Math.random() * 5 + 1) : (Math.random() * -5 - 1),
            vy: -(Math.random() * 11 + 6),
            gravity: 0.22,
            drag: 0.985,
            size: Math.random() * 7 + 4,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 6 - 3,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.1 + 0.05,
            opacity: 1
        });
    }

    // Firework burst sparkles in background (Sample Image 2)
    const fireworks = [
        { x: width * 0.22, y: height * 0.28, radius: 0, maxRadius: 55, color: "#FFD700", alpha: 0.9, delay: 300 },
        { x: width * 0.78, y: height * 0.24, radius: 0, maxRadius: 65, color: "#00E5FF", alpha: 0.9, delay: 650 },
        { x: width * 0.50, y: height * 0.16, radius: 0, maxRadius: 75, color: "#FF1744", alpha: 0.9, delay: 1100 }
    ];

    const startTime = performance.now();
    function loop(time) {
        const elapsed = time - startTime;
        if (elapsed > 7000) {
            canvas.style.display = "none";
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Draw background firework sparks
        fireworks.forEach(fw => {
            if (elapsed > fw.delay && fw.alpha > 0.02) {
                fw.radius += (fw.maxRadius - fw.radius) * 0.08;
                fw.alpha *= 0.96;

                ctx.save();
                ctx.translate(fw.x, fw.y);
                ctx.strokeStyle = fw.color;
                ctx.fillStyle = fw.color;
                ctx.globalAlpha = fw.alpha;
                const sparks = 12;
                for (let s = 0; s < sparks; s++) {
                    const angle = (s * 2 * Math.PI) / sparks;
                    const sx = Math.cos(angle) * fw.radius;
                    const sy = Math.sin(angle) * fw.radius;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        });

        // Draw and update confetti particles
        particles.forEach(p => {
            p.vx *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx + Math.sin(p.wobble) * 1.5;
            p.y += p.vy;
            p.wobble += p.wobbleSpeed;
            p.rotation += p.rotSpeed;

            if (elapsed > 5500) {
                p.opacity = Math.max(0, p.opacity - 0.02);
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;

            if (p.shape === "ribbon") {
                const waveW = Math.cos(p.wobble) * p.size * 1.8;
                ctx.fillRect(-waveW / 2, -p.size * 0.4, waveW, p.size * 0.8);
            } else if (p.shape === "dot") {
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.shape === "star") {
                // 4-point sparkling star
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                ctx.lineTo(p.size * 0.28, -p.size * 0.28);
                ctx.lineTo(p.size, 0);
                ctx.lineTo(p.size * 0.28, p.size * 0.28);
                ctx.lineTo(0, p.size);
                ctx.lineTo(-p.size * 0.28, p.size * 0.28);
                ctx.lineTo(-p.size, 0);
                ctx.lineTo(-p.size * 0.28, -p.size * 0.28);
                ctx.closePath();
                ctx.fill();
            } else {
                // Diamond
                ctx.beginPath();
                ctx.moveTo(0, -p.size * 0.8);
                ctx.lineTo(p.size * 0.6, 0);
                ctx.lineTo(0, p.size * 0.8);
                ctx.lineTo(-p.size * 0.6, 0);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();

            // Recycle if particle falls off screen
            if (p.y > height + 20 && elapsed < 4500) {
                p.y = -10;
                p.x = Math.random() * width;
                p.vy = Math.random() * 2 + 1.5;
                p.vx = Math.random() * 2 - 1;
            }
        });

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

// ============================================
// 12. SCROLL PROGRESS INDICATOR
// ============================================
function initScrollProgress() {
    let bar = document.getElementById("scrollProgressBar");
    if (!bar) {
        bar = document.createElement("div");
        bar.id = "scrollProgressBar";
        bar.className = "scroll-progress-bar";
        document.body.prepend(bar);
    }

    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        bar.style.width = progress + "%";
    }, { passive: true });
}

// ============================================
// 13. OPEN GYM & GARDEN SWING CATALOG SLIDER
// ============================================
const EQUIPMENT_DATA = [
    {
        id: 1,
        num: 1,
        name: "Air Walker",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/air-walker.png",
        purpose: "Walking and leg exercise",
        icon: "fa-walking",
        material: "Heavy-duty Class B Mild Steel (114mm OD Main Post)",
        coating: "UV-Resistant Electrostatic Polyester Powder Coating",
        hardware: "Heavy-duty Sealed Self-Lubricating Roller Bearings",
        details: "Simulates natural walking strides with zero knee impact. Enhances cardiovascular endurance, tones quadriceps and calves, and improves lower-body joint mobility."
    },
    {
        id: 2,
        num: 2,
        name: "Cross Trainer",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/cross-trainer.png",
        purpose: "Full-body exercise",
        icon: "fa-running",
        material: "Heavy-duty Class B Mild Steel (IS 1239 compliant)",
        coating: "Dual-Layer Anti-Rust Zinc Phosphate + Powder Coat",
        hardware: "High-Load Sealed Japanese Ball Bearings",
        details: "Synchronized dual-action handles and foot pedals provide full-body aerobic conditioning, simultaneously toning arms, chest, shoulders, core, and legs."
    },
    {
        id: 3,
        num: 3,
        name: "Waist Twister",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/waist-twister.png",
        purpose: "Waist rotation exercise",
        icon: "fa-sync-alt",
        material: "Heavy-gauge MS Round Tubing with Anti-Skid Platform",
        coating: "Pure Polyester Weatherproof Powder Coating",
        hardware: "Precision Thrust Bearings with Tamper-Proof Cap Nuts",
        details: "Triple rotatable base disc system designed to tone internal and external obliques, relieve spinal stiffness, and increase core rotation flexibility."
    },
    {
        id: 4,
        num: 4,
        name: "Shoulder Wheel",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/shoulder-wheel.png",
        purpose: "Shoulder and arm mobility",
        icon: "fa-dharmachakra",
        material: "Reinforced 114mm Main Post with Dual Rotating Wheels",
        coating: "Anti-Corrosive Thermal Hardened Powder Coating",
        hardware: "High-Torque Sealed Bearings with Chrome Plated Handles",
        details: "Dual rotational wheels engineered to rehabilitate rotator cuff muscles, improve shoulder joint flexibility, expand chest capacity, and enhance arm circulation."
    },
    {
        id: 5,
        num: 5,
        name: "Chest Press",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/chest-press.png",
        purpose: "Chest and upper-body exercise",
        icon: "fa-dumbbell",
        material: "Heavy-duty Structural MS Pipes & Padded Rubber Grips",
        coating: "Outdoor-Grade UV-Stabilized Powder Coating",
        hardware: "Stainless Steel Fasteners & Sealed Pivot Bushings",
        details: "Dual-seat lever press utilizing user body weight resistance to build upper body strength, targeting pectorals, triceps, and anterior deltoids."
    },
    {
        id: 6,
        num: 6,
        name: "Leg Press",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/leg-press.png",
        purpose: "Leg-strengthening exercise",
        icon: "fa-compress-arrows-alt",
        material: "Thick-Walled Seamless MS Pipe with Contoured Seats",
        coating: "Electrostatic Powder Coating with Zinc Primer Base",
        hardware: "Industrial-Grade Pivot Bearings & Heavy Stop Buffers",
        details: "Ergonomically inclined leg press machine that develops quadriceps, hamstrings, and calves through smooth, guided bodyweight resistance."
    },
    {
        id: 7,
        num: 7,
        name: "Rowing Machine",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/rowing-machine.png",
        purpose: "Arms, back and upper-body exercise",
        icon: "fa-water",
        material: "Heavy Class B Steel Pipe Frame with Rubberized Footrests",
        coating: "Anti-Corrosive Weatherproof Outdoor Powder Finish",
        hardware: "Sealed Bearing Linkages & High-Tensile Bolts",
        details: "Simulates boat rowing action to engage latissimus dorsi, trapezius, biceps, and abdominal stabilizers with fluid low-impact resistance."
    },
    {
        id: 8,
        num: 8,
        name: "Sit-Up Bench",
        category: "Open Gym Equipment",
        categoryKey: "gym",
        image: "assets/imgs/equipments/situp-bentch.png",
        purpose: "Abdominal exercise",
        icon: "fa-align-justify",
        material: "Solid MS Frame with Perforated Contoured Steel Bed",
        coating: "Anti-Rust Electrostatic Powder Coating",
        hardware: "High-Density Rubberized Padded Ankle Roller Grips",
        details: "Incline abdominal workout bench with secure ergonomic leg retainers, engineered for core strengthening, sit-ups, and hip flexor conditioning."
    },
    {
        id: 9,
        num: 1,
        name: "Double-Seater Garden Swing",
        category: "Garden & Children’s Park",
        categoryKey: "park",
        image: "assets/imgs/equipments/double-swing.png",
        purpose: "Covered garden relaxation & outdoor seating",
        icon: "fa-chair",
        material: "Heavy-Gauge Steel Frame with Curved Sun Canopy Roof",
        coating: "Multi-Stage Anti-Rust Treated Powder Coated Finish",
        hardware: "Galvanized Anti-Pinch Suspension Chains & Shackles",
        details: "Spacious dual-seater swing fitted with a weatherproof sunshade canopy and comfortable contoured wooden/powder-coated steel slatted seating."
    },
    {
        id: 10,
        num: 2,
        name: "Children’s Swing",
        category: "Garden & Children’s Park",
        categoryKey: "park",
        image: "assets/imgs/equipments/single-swing.png",
        purpose: "Playground outdoor swing & balancing play",
        icon: "fa-child",
        material: "Reinforced Triangular A-Frame Tubular Steel Structure",
        coating: "Non-Toxic Lead-Free Vibrant Polyester Powder Coating",
        hardware: "Anti-Pinch Rubberized Chains & Heavy-Duty Safety Seats",
        details: "Dual-bay playground swing engineered with high-impact rubber safety seats, non-toxic finishes, and certified anchor foundation grouting."
    },
    {
        id: 11,
        num: 3,
        name: "Seesaw",
        category: "Garden & Children’s Park",
        categoryKey: "park",
        image: "assets/imgs/equipments/seesaw.png",
        purpose: "Balanced cooperative play & leg propulsion",
        icon: "fa-balance-scale",
        material: "High-Tensile MS Center Pipe with Heavy-Duty Pivot Hub",
        coating: "UV-Resistant Electrostatic Powder Coating",
        hardware: "Shock-Absorbing Heavy Rubber Under-Seat Ground Buffers",
        details: "Balanced dual-seat seesaw with ergonomically contoured moulded seats, safety handrails, and shock-absorbing rubber buffers for gentle landing."
    },
    {
        id: 12,
        num: 4,
        name: "Children’s Slide",
        category: "Garden & Children’s Park",
        categoryKey: "park",
        image: "assets/imgs/equipments/slide.png",
        purpose: "Playground climbing, sliding & gross motor development",
        icon: "fa-level-down-alt",
        material: "Virgin Food-Grade FRP / UV-Stabilized Polymer Chute",
        coating: "Weatherproof Non-Fade Glossy Powder Coating",
        hardware: "Anti-Slip Textured Climbing Rungs & Steel Safety Rails",
        details: "Smooth, safety-tested playground slide chute with slip-resistant safety access ladder rungs, high side safety walls, and extended deceleration deck."
    },
    {
        id: 13,
        num: 5,
        name: "Merry-Go-Round",
        category: "Garden & Children’s Park",
        categoryKey: "park",
        image: "assets/imgs/equipments/round.png",
        purpose: "Rotational group play & vestibular stimulation",
        icon: "fa-circle-notch",
        material: "Chequered Anti-Slip Heavy Steel Deck with Safety Rails",
        coating: "Industrial Weatherproof Gloss Polyester Coating",
        hardware: "Heavy-Duty Dual Ball Bearing Hub & Steel Perimeter Grips",
        details: "High-capacity revolving carousel with safety perimeter grab bars, anti-skid chequered plate flooring, and smooth, regulated rotational motion."
    }
];

// Global error handler for equipment images when file is not yet uploaded
window.handleEqImgFallback = function(img) {
    if (!img) return;
    img.style.display = 'none';
    const fallback = document.getElementById('eqPhotoFallback');
    if (fallback) fallback.style.display = 'flex';
};

function initEquipmentCatalogModal() {
    const modal = document.getElementById("equipmentCatalogModal");
    if (!modal) return;

    const overlay = document.getElementById("equipmentModalOverlay");
    const closeBtn = document.getElementById("equipmentModalClose");
    const triggerBtn = document.getElementById("openEquipmentModalBtn");
    const galleryTriggerBtn = document.getElementById("openCatalogFromGallery");
    const prevBtn = document.getElementById("eqSliderPrev");
    const nextBtn = document.getElementById("eqSliderNext");
    const inlineNextBtn = document.getElementById("eqNextSlideInline");
    const thumbTrack = document.getElementById("eqThumbTrack");
    const filterBtns = document.querySelectorAll(".eq-filter-btn");

    let currentFilter = "all";
    let filteredList = [...EQUIPMENT_DATA];
    let currentIndex = 0;

    function openModal(targetIndex = 0, filter = null) {
        if (filter && filter !== currentFilter) {
            setFilter(filter);
        }

        // Find index in current filtered list
        if (typeof targetIndex === "number") {
            currentIndex = targetIndex >= 0 && targetIndex < filteredList.length ? targetIndex : 0;
        }

        renderSlide(currentIndex);
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function setFilter(filter) {
        currentFilter = filter;
        filterBtns.forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-filter") === filter);
        });

        if (filter === "all") {
            filteredList = [...EQUIPMENT_DATA];
        } else {
            filteredList = EQUIPMENT_DATA.filter(item => item.categoryKey === filter);
        }

        currentIndex = 0;
        renderThumbnails();
        renderSlide(currentIndex);
    }

    function renderSlide(idx) {
        if (!filteredList.length) return;
        const item = filteredList[idx];
        if (!item) return;

        const imgEl = document.getElementById("eqSlideImg");
        const fallbackEl = document.getElementById("eqPhotoFallback");
        const fallbackIcon = document.getElementById("eqFallbackIcon");
        const fallbackTitle = document.getElementById("eqFallbackTitle");
        const fallbackPath = document.getElementById("eqFallbackPath");
        const counterEl = document.getElementById("eqCounterBadge");
        const catPill = document.getElementById("eqCategoryPill");
        const itemHeading = document.getElementById("eqItemHeading");
        const purposeDesc = document.getElementById("eqPurposeDesc");
        const specPipe = document.getElementById("eqSpecPipe");
        const specCoating = document.getElementById("eqSpecCoating");
        const specHardware = document.getElementById("eqSpecHardware");
        const enquireBtn = document.getElementById("eqSlideEnquireBtn");

        const prefix = document.querySelector('link[rel="stylesheet"][href^="../"]') ? '../' : '';
        const resolvedImg = prefix + item.image;

        // Prepare image & fallback
        if (imgEl && fallbackEl) {
            imgEl.style.display = "block";
            fallbackEl.style.display = "none";
            imgEl.alt = item.name;

            // Preload test to toggle fallback smoothly
            const tempImg = new Image();
            tempImg.onload = () => {
                imgEl.src = resolvedImg;
                imgEl.style.display = "block";
                fallbackEl.style.display = "none";
            };
            tempImg.onerror = () => {
                imgEl.style.display = "none";
                fallbackEl.style.display = "flex";
                if (fallbackIcon) fallbackIcon.className = `fas ${item.icon || 'fa-tools'}`;
                if (fallbackTitle) fallbackTitle.textContent = item.name;
                if (fallbackPath) fallbackPath.textContent = item.image;
            };
            tempImg.src = resolvedImg;
        }

        if (counterEl) counterEl.textContent = `${idx + 1} / ${filteredList.length}`;
        if (catPill) catPill.textContent = item.category;
        if (itemHeading) itemHeading.textContent = `${item.id}. ${item.name}`;
        if (purposeDesc) purposeDesc.textContent = item.purpose;
        if (specPipe) specPipe.textContent = item.material;
        if (specCoating) specCoating.textContent = item.coating;
        if (specHardware) specHardware.textContent = item.hardware;

        if (enquireBtn) {
            enquireBtn.href = `${prefix}contact-us/index.html?service=Open%20Gym%20Equipment&item=${encodeURIComponent(item.name)}`;
        }

        // Highlight active thumbnail and scroll into view
        const allThumbs = thumbTrack ? thumbTrack.querySelectorAll(".eq-thumb-card") : [];
        allThumbs.forEach((thumb, tIdx) => {
            const isActive = tIdx === idx;
            thumb.classList.toggle("active", isActive);
            if (isActive) {
                thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        });
    }

    function renderThumbnails() {
        if (!thumbTrack) return;
        thumbTrack.innerHTML = "";
        const prefix = document.querySelector('link[rel="stylesheet"][href^="../"]') ? '../' : '';

        filteredList.forEach((item, idx) => {
            const card = document.createElement("div");
            card.className = `eq-thumb-card ${idx === currentIndex ? "active" : ""}`;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("title", item.name);

            card.innerHTML = `
                <div class="eq-thumb-img-wrap">
                    <img src="${prefix}${item.image}" alt="${item.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="mini-fallback" style="display:none;"><i class="fas ${item.icon || 'fa-cube'}"></i></div>
                </div>
                <div class="eq-thumb-card-title">
                    <span class="eq-thumb-badge-num">${item.id}</span>${item.name}
                </div>
            `;

            card.addEventListener("click", () => {
                currentIndex = idx;
                renderSlide(currentIndex);
            });

            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    currentIndex = idx;
                    renderSlide(currentIndex);
                }
            });

            thumbTrack.appendChild(card);
        });
    }

    function nextSlide() {
        if (!filteredList.length) return;
        currentIndex = (currentIndex + 1) % filteredList.length;
        renderSlide(currentIndex);
    }

    function prevSlide() {
        if (!filteredList.length) return;
        currentIndex = (currentIndex - 1 + filteredList.length) % filteredList.length;
        renderSlide(currentIndex);
    }

    // Event Listeners
    if (triggerBtn) triggerBtn.addEventListener("click", () => openModal(0));
    if (galleryTriggerBtn) galleryTriggerBtn.addEventListener("click", () => openModal(0));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (inlineNextBtn) inlineNextBtn.addEventListener("click", nextSlide);

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter") || "all";
            setFilter(filter);
        });
    });

    // Wire up equipment list items in the main section boxes
    document.querySelectorAll(".equipment-item[data-eq]").forEach(item => {
        item.addEventListener("click", () => {
            const eqId = parseInt(item.getAttribute("data-eq"), 10);
            const targetIdx = EQUIPMENT_DATA.findIndex(eq => eq.id === eqId);
            if (targetIdx !== -1) {
                // Determine filter based on item
                const filter = targetIdx < 8 ? "gym" : "park";
                setFilter("all");
                openModal(targetIdx);
            }
        });

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.click();
            }
        });
    });

    // Wire up the 4 thumbnails under the main photo
    document.querySelectorAll(".open-gym-thumb[data-eq-num]").forEach(thumb => {
        thumb.addEventListener("click", () => {
            const eqId = parseInt(thumb.getAttribute("data-eq-num"), 10);
            const targetIdx = EQUIPMENT_DATA.findIndex(eq => eq.id === eqId);
            if (targetIdx !== -1) {
                setFilter("all");
                openModal(targetIdx);
            }
        });

        thumb.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                thumb.click();
            }
        });
    });

    // Keyboard support (ArrowLeft, ArrowRight, Escape)
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
    });

    // Mobile Swipe Gestures on Slide Showcase
    const showcase = document.getElementById("eqSlideShowcase");
    if (showcase) {
        let touchStartX = 0;
        let touchEndX = 0;

        showcase.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        showcase.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 40) {
                if (diff < 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });
    }

    // Initial render of thumbnails
    renderThumbnails();
}
