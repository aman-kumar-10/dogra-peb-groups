// ============================================
// BANNER SLIDER
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    const fullbanners = document.querySelectorAll(".full-banner");

    if (!fullbanners.length) {
        return;
    }

    let index = 0;

    setInterval(() => {
        fullbanners[index].classList.remove("active");
        index = (index + 1) % fullbanners.length;
        fullbanners[index].classList.add("active");
    }, 4000);
});

document.addEventListener("DOMContentLoaded", () => {
    const mbbanners = document.querySelectorAll(".mb-banner");

    if (!mbbanners.length) {
        return;
    }

    let index = 0;

    setInterval(() => {
        mbbanners[index].classList.remove("active");
        index = (index + 1) % mbbanners.length;
        mbbanners[index].classList.add("active");
    }, 4000);
});


// ============================================
// ABOUT US STATS COUNTER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 30);
    });
});

// ============================================
// DOM ELEMENTS (with null checks)
// ============================================

const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navMobile = document.getElementById('navMobile');
const navOverlay = document.getElementById('navOverlay');
const servicesTrack = document.getElementById('servicesTrack');
const serviceDots = document.querySelectorAll('.slider-dot');
const prevService = document.getElementById('prevService');
const nextService = document.getElementById('nextService');
const viewProjectBtns = document.querySelectorAll('.view-project');
const galleryItems = document.querySelectorAll('.gallery-item');
const faqQuestions = document.querySelectorAll('.faq-question');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// ============================================
// STATE
// ============================================

let currentService = 0;
const visibleCards = 3;

// ============================================
// INITIALIZATION
// ============================================

function init() {
    setupEventListeners();
    setupScrollEffects();
    setupAnimations();
    setupFAQ();
    
    // Only setup services slider if elements exist
    if (servicesTrack) {
        setupServicesSlider();
    }
}

// ============================================
// SERVICES SLIDER
// ============================================

function setupServicesSlider() {
    updateServicesSlider();
}

function updateServicesSlider() {
    const track = servicesTrack;
    const cards = track.querySelectorAll('.service-card');
    const dots = document.querySelectorAll('.slider-dot');

    if (!cards.length) return;

    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth =
        cards[0].offsetWidth +
        parseInt(cardStyle.marginLeft) +
        parseInt(cardStyle.marginRight);

    const maxSlides = cards.length - visibleCards + 1;

    // Safety clamp
    if (currentService >= maxSlides) {
        currentService = maxSlides - 1;
    }

    track.style.transform = `translateX(-${currentService * cardWidth}px)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentService);
    });
}


function nextServiceSlide() {
    const cards = servicesTrack.querySelectorAll('.service-card');
    const maxSlides = cards.length - visibleCards + 1;

    if (currentService < maxSlides - 1) {
        currentService++;
        updateServicesSlider();
    }
}

function prevServiceSlide() {
    if (currentService > 0) {
        currentService--;
        updateServicesSlider();
    }
}

function goToService(index) {
    currentService = index;
    updateServicesSlider();
}

// ============================================
// FAQ
// ============================================

function setupFAQ() {
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('.faq-icon');
            
            if (!answer || !icon) return;
            
            // Close all other items
            faqQuestions.forEach(q => {
                if (q !== question) {
                    const otherItem = q.parentElement;
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = q.querySelector('.faq-icon');
                    
                    if (otherAnswer) otherAnswer.classList.remove('active');
                    if (otherIcon) otherIcon.textContent = '+';
                    q.classList.remove('active');
                }
            });
            
            // Toggle current item
            answer.classList.toggle('active');
            icon.textContent = answer.classList.contains('active') ? '−' : '+';
            question.classList.toggle('active');
        });
    });
}

// ============================================
// FORM HANDLING
// ============================================

function setupForms() {
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate
            if (!data.name || !data.email || !data.phone || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show success message
            showNotification('Thank you for your message! We will contact you within 24 hours.', 'success');
            
            // Reset form
            this.reset();
        });
    }
    
    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('.newsletter-input').value;
            
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            // Show success message
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close event
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// ANIMATIONS & EFFECTS
// ============================================

function setupAnimations() {
    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        });
    }
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all fade-in elements
        fadeElements.forEach(el => observer.observe(el));
    }
}

// ============================================
// SCROLL EFFECTS
// ============================================

function setupScrollEffects() {
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (anchorLinks.length) {
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// MOBILE MENU
// ============================================

function toggleMobileMenu() {
    if (!mobileToggle || !navMobile || !navOverlay) return;
    
    mobileToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    if (!mobileToggle || !navMobile || !navOverlay) return;
    
    mobileToggle.classList.remove('active');
    navMobile.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// EVENT LISTENERS (with null checks)
// ============================================

function setupEventListeners() {
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Services slider controls
    if (prevService) {
        prevService.addEventListener('click', prevServiceSlide);
    }
    
    if (nextService) {
        nextService.addEventListener('click', nextServiceSlide);
    }
    
    // Service dots
    if (serviceDots.length) {
        serviceDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                goToService(index);
            });
        });
    }
    
    
    // Setup forms
    setupForms();
    
    // // Auto advance services slider (only if slider exists)
    // if (servicesTrack) {
    //     setInterval(nextServiceSlide, 5000);
    // }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', init);


// *************************************************************************************************************************************
// ****************************************************        OPEN POPUPS JS        ***************************************************
// *************************************************************************************************************************************


// *************************************************************************************************************************************

// ============================================
// SIMPLE IMAGE LIGHTBOX - CLEAN VERSION
// ============================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initSimpleLightbox();
});

function initSimpleLightbox() {
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    // Add click event to each image
    galleryImages.forEach((img, index) => {
        // Get the parent gallery-item
        const galleryItem = img.closest('.gallery-item');
        
        if (galleryItem) {
            // Store index on the parent
            galleryItem.dataset.index = index;
            
            // Make it clickable
            galleryItem.style.cursor = 'pointer';
            
            // Remove any existing event listeners by cloning
            const newGalleryItem = galleryItem.cloneNode(true);
            galleryItem.parentNode.replaceChild(newGalleryItem, galleryItem);
            
            // Add click event to the new element
            newGalleryItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openSimpleLightbox(this);
            });
        }
    });
    
    // Setup lightbox controls
    setupLightboxControls();
}

function openSimpleLightbox(galleryItem) {
    const imgElement = galleryItem.querySelector('img');
    if (!imgElement) return;
    
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    if (!lightbox || !lightboxImg) return;
    
    // Ensure image is never lazy loaded inside lightbox
    lightboxImg.removeAttribute('loading');
    
    // Extract the most accurate image source (supports webp, currentSrc, and fallback)
    let imgSrc = imgElement.currentSrc;
    if (!imgSrc || imgSrc === '') {
        const srcset = imgElement.getAttribute('srcset');
        if (srcset) {
            imgSrc = srcset.split(',')[0].trim().split(' ')[0];
        }
    }
    if (!imgSrc || imgSrc === '') {
        imgSrc = imgElement.getAttribute('src') || imgElement.src;
    }
    
    // Ensure image is visible in DOM box model
    lightboxImg.style.display = 'block';
    
    // Show subtle loading state without hiding the image container
    showLoadingState(true);
    
    // Set image source with error handling
    lightboxImg.onload = function() {
        showLoadingState(false);
    };
    
    lightboxImg.onerror = function() {
        const fallbackSrc = imgElement.getAttribute('src') || imgElement.src;
        if (fallbackSrc && lightboxImg.src !== fallbackSrc) {
            lightboxImg.src = fallbackSrc;
        } else {
            showLoadingState(false);
            const errorDiv = document.getElementById('imageError');
            if (errorDiv) errorDiv.style.display = 'flex';
        }
    };
    
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgElement.alt || 'Gallery Image';
    
    // If browser already had image decoded or cached, reveal instantly!
    if (lightboxImg.complete && lightboxImg.naturalWidth > 0) {
        showLoadingState(false);
    }
    
    // Set title if available
    if (lightboxTitle) {
        const caption = galleryItem.querySelector('.gallery-caption p');
        lightboxTitle.textContent = caption?.textContent || imgElement.alt || 'Gallery Image';
    }
    
    // Set counter
    if (lightboxCounter) {
        const total = document.querySelectorAll('.gallery-item').length;
        const current = parseInt(galleryItem.dataset.index) + 1;
        lightboxCounter.textContent = `${current} / ${total}`;
    }
    
    // Store current index globally
    window.currentLightboxIndex = parseInt(galleryItem.dataset.index);
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus close button for accessibility
    setTimeout(() => {
        const closeBtn = document.getElementById('lightboxClose');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

function showLoadingState(show) {
    const spinner = document.querySelector('.loading-spinner');
    const errorDiv = document.getElementById('imageError');
    const lightboxImg = document.getElementById('lightboxImage');
    
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
        spinner.style.opacity = show ? '1' : '0';
    }
    if (errorDiv) errorDiv.style.display = 'none';
    if (lightboxImg) {
        lightboxImg.style.display = 'block';
        lightboxImg.style.opacity = show ? '0.3' : '1';
    }
}

function setupLightboxControls() {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;
    
    // Close buttons
    const closeBtn = document.getElementById('lightboxClose');
    const overlay = document.getElementById('lightboxOverlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeLightbox);
    }
    
    // Navigation arrows
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', navigateToPrevImage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', navigateToNextImage);
    }
    
    // Download button
    const downloadBtn = document.getElementById('lightboxDownload');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const img = document.getElementById('lightboxImage');
            if (img && img.src) {
                const link = document.createElement('a');
                link.href = img.src;
                link.download = 'image-' + (window.currentLightboxIndex + 1) + '.jpg';
                link.click();
            }
        });
    }
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateToPrevImage();
                break;
            case 'ArrowRight':
                navigateToNextImage();
                break;
        }
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function navigateToPrevImage() {
    const total = document.querySelectorAll('.gallery-item').length;
    if (total === 0) return;
    
    let newIndex = window.currentLightboxIndex - 1;
    if (newIndex < 0) newIndex = total - 1;
    
    const nextItem = document.querySelector(`.gallery-item[data-index="${newIndex}"]`);
    if (nextItem) {
        openSimpleLightbox(nextItem);
    }
}

function navigateToNextImage() {
    const total = document.querySelectorAll('.gallery-item').length;
    if (total === 0) return;
    
    let newIndex = window.currentLightboxIndex + 1;
    if (newIndex >= total) newIndex = 0;
    
    const nextItem = document.querySelector(`.gallery-item[data-index="${newIndex}"]`);
    if (nextItem) {
        openSimpleLightbox(nextItem);
    }
}

// *************************************************************************************************************************************

// ============================================
// SERVICE SUMMARY POPUP
// ============================================

// DOM Elements
let servicePopup;
let isTyping = false;
let typewriterInterval;

// Initialize Service Popup
function initServicePopup() {
    servicePopup = document.getElementById('servicePopup');
    
    if (!servicePopup) return;
    
    // Add click events to all "View Details" buttons
    const viewButtons = document.querySelectorAll('.view-service-summary');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceCard = this.closest('.service-card');
            if (serviceCard) {
                openServicePopup(serviceCard);
            }
        });
    });
    
    // Setup close events
    setupServicePopupControls();
}

// Extract data from service card and open popup
function openServicePopup(serviceCard) {
    if (!servicePopup) return;
    
    // Stop any ongoing typing
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
    }
    isTyping = false;
    
    // Extract data from service card
    const iconElement = serviceCard.querySelector('.service-icon i');
    const title = serviceCard.querySelector('h3')?.textContent || 'Service Title';
    const description = serviceCard.querySelector('p')?.textContent || '';
    const features = Array.from(serviceCard.querySelectorAll('.service-features li')).map(li => li.textContent);
    const iconClass = iconElement?.className || 'fas fa-industry';
    
    // Set popup content
    document.getElementById('servicePopupTitle').textContent = title;
    document.getElementById('servicePopupIcon').innerHTML = `<i class="${iconClass}"></i>`;
    
    // Clear previous content
    const descriptionElement = document.getElementById('servicePopupDescription');
    const cursorElement = document.querySelector('.typewriter-cursor');
    const featuresContainer = document.getElementById('servicePopupFeatures');
    
    descriptionElement.textContent = '';
    cursorElement.style.display = 'inline-block';
    featuresContainer.innerHTML = '';
    
    // Show popup
    servicePopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Start animations after popup is visible
    setTimeout(() => {
        // Typewriter effect for description
        startTypewriterEffect(descriptionElement, description, cursorElement);
        
        // Animated features after a delay
        setTimeout(() => {
            createAnimatedFeatures(featuresContainer, features);
        }, description.length * 20 + 500); // Wait for typing to complete + 500ms
    }, 300);
}

// Typewriter Effect
function startTypewriterEffect(element, text, cursor) {
    let i = 0;
    element.textContent = '';
    element.style.opacity = '1';
    
    // First, show the text immediately (fade in)
    element.textContent = text;
    element.style.opacity = '0';
    element.style.animation = 'fadeInText 0.5s ease forwards';
    
    // Then start the typewriter effect
    setTimeout(() => {
        element.textContent = '';
        element.style.animation = '';
        
        typewriterInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typewriterInterval);
                typewriterInterval = null;
                cursor.style.display = 'none';
                isTyping = false;
            }
        }, 20); // Typing speed
    }, 300);
}

// Create animated features
function createAnimatedFeatures(container, features) {
    container.innerHTML = '';
    
    features.forEach((feature, index) => {
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item';
        featureItem.style.animationDelay = `${index * 0.15}s`;
        
        const checkbox = document.createElement('div');
        checkbox.className = 'feature-checkbox';
        checkbox.innerHTML = '<i class="fas fa-check"></i>';
        checkbox.style.animationDelay = `${index * 0.15}s`;
        
        const text = document.createElement('div');
        text.className = 'feature-text';
        text.textContent = feature;
        text.style.animationDelay = `${index * 0.15 + 0.3}s`;
        
        featureItem.appendChild(checkbox);
        featureItem.appendChild(text);
        container.appendChild(featureItem);
    });
}

// Setup popup controls
function setupServicePopupControls() {
    // Close button
    const closeBtn = document.getElementById('servicePopupClose');
    const overlay = document.getElementById('servicePopupOverlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeServicePopup);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeServicePopup);
    }
    
    // Keyboard close
    document.addEventListener('keydown', (e) => {
        if (servicePopup && servicePopup.classList.contains('active') && e.key === 'Escape') {
            closeServicePopup();
        }
    });
}

// Close popup function (also available globally)
function closeServicePopup() {
    if (!servicePopup) return;
    
    // Stop typing if in progress
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
    }
    
    servicePopup.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initServicePopup();
});


// *************************************************************************************************************************************

// ============================================
// PROJECT POPUP WITH ENHANCED DATA
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const popup = document.getElementById("projectPopup");

    if(!popup) return;

    const overlay = document.getElementById("projectPopupOverlay");
    const closeBtn = document.getElementById("projectPopupClose");

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

    const prevBtn = popup.querySelector(".popup-prev");
    const nextBtn = popup.querySelector(".popup-next");

    let galleryImages = [];
    let currentImageIndex = 0;

    document.querySelectorAll(".view-project-summary").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const card = btn.closest(".project-card");
            if (!card) return;
            openPopupFromCard(card);
        });
    });

    function openPopupFromCard(card) {

        /* ---------- BASIC DATA ---------- */

        titleEl.textContent = card.querySelector("h3")?.textContent || "";
        locationEl.textContent =
            card.querySelector(".fa-map-marker-alt")?.parentElement.textContent.trim() || "";
        descEl.textContent =
            card.querySelector(".project-content > p:nth-of-type(2)")?.textContent || "";

        /* ---------- TAGS ---------- */

        const tags = [...card.querySelectorAll(".project-tag")].map(t => t.textContent.trim());
        keyPointsEl.innerHTML = "";
        tags.forEach(tag => {
            keyPointsEl.innerHTML += `
                <div class="key-point">
                    <i class="fas fa-check-circle"></i> ${tag}
                </div>`;
        });

        scaleEl.textContent = tags.length >= 3 ? "Large" : "Medium";
        timelineEl.textContent = "As per project scope";
        categoryEl.textContent = tags[0] || "Project";

        /* ---------- CLIENT DATA ---------- */

        clientNameEl.textContent =
            card.querySelector(".c-name")?.value || "Project Client";
        clientRoleEl.textContent =
            card.querySelector(".c-role")?.value || "Authorized Representative";
        testimonialEl.textContent =
            `"${card.querySelector(".c-testimonial")?.value || "Excellent project execution."}"`;

        /* ---------- IMAGE GALLERY ---------- */

        galleryImages = [...card.querySelectorAll(".project-img")].map(i => i.value);
        currentImageIndex = 0;

        setGalleryImage();

        popup.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function setGalleryImage() {
        if (!galleryImages.length) return;
        imageEl.src = galleryImages[currentImageIndex];
        imageEl.alt = titleEl.textContent;
    }

    prevBtn.addEventListener("click", () => {
        if (!galleryImages.length) return;
        currentImageIndex =
            (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        setGalleryImage();
    });

    nextBtn.addEventListener("click", () => {
        if (!galleryImages.length) return;
        currentImageIndex =
            (currentImageIndex + 1) % galleryImages.length;
        setGalleryImage();
    });

    function closePopup() {
        popup.classList.remove("active");
        document.body.style.overflow = "";
        galleryImages = [];
    }

    closeBtn.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);

    document.addEventListener("keydown", e => {
        if (!popup.classList.contains("active")) return;
        if (e.key === "Escape") closePopup();
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
    });

    window.closeProjectPopup = closePopup;
});

// ==========================================================================
// SCROLL REVEAL OBSERVER (GPU Accelerated)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal, .section, .service-card, .project-card, .feature-card");
    if (!reveals.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        reveals.forEach(el => el.classList.add("revealed"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => {
        el.classList.add("reveal");
        observer.observe(el);
    });
});

// ==========================================================================
// FESTIVAL THEMING SYSTEM & CELEBRATION POPUP (Phases 4 & 5)
// ==========================================================================

const FESTIVAL_CONFIG = {
    dussehra: {
        id: "dussehra",
        name: "Dussehra",
        greeting: "Happy Dussehra!",
        message: "Celebrate the victory of good over evil with unbeatable deals on PEB, prefab structures & outdoor infrastructure. Let's discuss your project!",
        startDate: "2026-10-18T00:00:00+05:30",
        endDate: "2026-10-21T23:59:59+05:30",
        logo: "assets/imgs/logo-dussehra.svg",
        accentColor: "#E65100",
        badge: "🏹 Shubh Vijayadashami",
        garland: "🏹 ✦ 🪔 ✦ 🏹 ✦ 🪔 ✦ 🏹",
        vectors: {
            topLeft: "🏹",
            topRight: "🪔",
            bottomLeft: "✨",
            bottomRight: "🎯"
        },
        particleColors: ["#FF6A00", "#FFD700", "#FF3D00", "#FFA000", "#FFF9C4", "#FFFFFF"]
    },
    diwali: {
        id: "diwali",
        name: "Diwali",
        greeting: "Happy Diwali!",
        message: "Illuminate your projects with premier engineering and festive savings! Grab exclusive festival discounts on PEB, Prefab cabins & tanks.",
        startDate: "2026-11-03T00:00:00+05:30",
        endDate: "2026-11-12T23:59:59+05:30",
        logo: "assets/imgs/logo-diwali.svg",
        accentColor: "#FF8F00",
        badge: "🪔 Shubh Deepavali",
        garland: "🪔 ✦ 🎆 ✦ 🪔 ✦ 🎆 ✦ 🪔",
        vectors: {
            topLeft: "🪔",
            topRight: "🎆",
            bottomLeft: "✨",
            bottomRight: "🎇"
        },
        particleColors: ["#FFD700", "#FF8F00", "#FF6A00", "#FF1744", "#FFF59D", "#FFFFFF"]
    },
    christmas: {
        id: "christmas",
        name: "Christmas",
        greeting: "Merry Christmas!",
        message: "Season's greetings from Dogra PEB Groups! Enjoy joyful holiday discounts and turnkey delivery on industrial infrastructure.",
        startDate: "2026-12-20T00:00:00+05:30",
        endDate: "2026-12-26T23:59:59+05:30",
        logo: "assets/imgs/logo-christmas.svg",
        accentColor: "#D32F2F",
        badge: "🎄 Season's Greetings",
        garland: "🎄 ✦ 🔔 ✦ ❄️ ✦ 🎁 ✦ 🎄",
        vectors: {
            topLeft: "🎄",
            topRight: "🎁",
            bottomLeft: "❄️",
            bottomRight: "🔔"
        },
        particleColors: ["#D32F2F", "#10B981", "#FFD700", "#E0F2FE", "#FFFFFF", "#F87171"]
    },
    newyear: {
        id: "newyear",
        name: "New Year",
        greeting: "Happy New Year 2027!",
        message: "Step into 2027 with state-of-the-art PEB warehouses, factory sheds, and gym infrastructure at inaugural year pricing. Make a call today!",
        startDate: "2026-12-28T00:00:00+05:30",
        endDate: "2027-01-03T23:59:59+05:30",
        logo: "assets/imgs/logo-newyear.svg",
        accentColor: "#F59E0B",
        badge: "✨ Welcome 2027",
        garland: "🥂 ✦ 🎆 ✦ 🍾 ✦ 🎆 ✦ 🥂",
        vectors: {
            topLeft: "🥂",
            topRight: "🎆",
            bottomLeft: "✨",
            bottomRight: "🎉"
        },
        particleColors: ["#F59E0B", "#FBBF24", "#6366F1", "#EC4899", "#A855F7", "#FFFFFF"]
    }
};

/**
 * Calculates current active festival comparing date in Asia/Kolkata timezone
 * or checking ?festival= url testing override.
 */
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
        console.warn("Timezone calculation fallback:", err);
    }
    return { festival: null, isOverride: false };
}

/**
 * Normalizes relative asset path depending on whether the current page is root or a subpage
 */
function resolveAssetPath(relPath) {
    const sampleImg = document.querySelector(".logo img, .logo-icon");
    if (sampleImg) {
        const srcAttr = sampleImg.getAttribute("src") || "";
        if (srcAttr.startsWith("../")) {
            return "../" + relPath;
        }
    }
    const isSubdir = window.location.pathname.includes("/about-us") ||
                     window.location.pathname.includes("/services") ||
                     window.location.pathname.includes("/projects") ||
                     window.location.pathname.includes("/gallery") ||
                     window.location.pathname.includes("/contact-us");
    return isSubdir ? "../" + relPath : relPath;
}

/**
 * Initializes the Festival Theme: logo swap and dynamic accent colors
 */
function initFestivalTheme() {
    const { festival, isOverride } = getActiveFestival();
    if (!festival) return;

    // 1. Swap logo across navbar and footer
    const logos = document.querySelectorAll(".logo img, .logo-icon");
    const festLogoSrc = resolveAssetPath(festival.logo);

    logos.forEach(img => {
        img.removeAttribute("srcset");
        img.src = festLogoSrc;
        img.alt = `Dogra PEB Groups - ${festival.name} Celebrations`;
    });

    // 2. Set dynamic festive accent colors in CSS
    document.documentElement.style.setProperty("--color-accent", festival.accentColor);
    document.documentElement.style.setProperty("--color-accent-hover", festival.accentColor);
    document.documentElement.style.setProperty("--gradient-accent", `linear-gradient(135deg, ${festival.accentColor}, #FF8C42)`);

    // 3. Trigger celebration popup (once per visitor per festival, or always on test override)
    const storageKey = `dogra_festive_seen_${festival.id}_2026`;
    const alreadySeen = localStorage.getItem(storageKey);

    if (!alreadySeen || isOverride) {
        showCelebrationPopup(festival, storageKey);
    }
}

/**
 * Displays accessible, glassmorphic celebration modal with canvas animation
 */
function showCelebrationPopup(festival, storageKey) {
    // Avoid double rendering
    if (document.getElementById("festivalCelebrationModal")) return;

    const v = festival.vectors || { topLeft: "✨", topRight: "🎉", bottomLeft: "🪔", bottomRight: "✨" };
    const garland = festival.garland || "✨ ✦ 🎊 ✦ ✨";

    // Inject modal into DOM with ambient glassmorphic glow orbs, floating celebration vectors and decorative garland
    const modalHTML = `
        <div class="festive-modal-overlay" id="festivalCelebrationModal" role="dialog" aria-modal="true" aria-labelledby="festiveTitle">
            <!-- Luminous Glowing Ambient Orbs for Authentic Glassmorphism Refraction -->
            <div class="festive-glow-orb orb-top-right" aria-hidden="true"></div>
            <div class="festive-glow-orb orb-bottom-left" aria-hidden="true"></div>
            <div class="festive-glow-orb orb-center" aria-hidden="true"></div>

            <div class="festive-modal-card">
                <!-- Floating Celebration Vectors Popping Up Around Modal -->
                <div class="festive-floating-vector top-left" aria-hidden="true">${v.topLeft}</div>
                <div class="festive-floating-vector top-right" aria-hidden="true">${v.topRight}</div>
                <div class="festive-floating-vector bottom-left" aria-hidden="true">${v.bottomLeft}</div>
                <div class="festive-floating-vector bottom-right" aria-hidden="true">${v.bottomRight}</div>

                <div class="festive-ribbon"></div>
                <button class="festive-close-btn" id="festiveCloseBtn" aria-label="Close celebration popup">&times;</button>
                
                <div class="festive-garland" aria-hidden="true">${garland}</div>
                <div class="festive-badge">${festival.badge || '✨ Festive Special'}</div>
                <h2 class="festive-title" id="festiveTitle">${festival.greeting}</h2>
                <p class="festive-message">${festival.message}</p>
                <div class="festive-actions">
                    <a href="tel:+916280397827" class="btn btn-festive-call">
                        <i class="fas fa-phone-alt"></i> Call Now
                    </a>
                    <a href="https://wa.me/916280397827?text=Hello%20Dogra%20PEB%20Groups%2C%20I%20would%20like%20to%20discuss%20a%20project" target="_blank" rel="noopener" class="btn btn-festive-wa">
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
    const previousActive = document.activeElement;

    // Small delay for smooth entrance
    setTimeout(() => {
        overlay.classList.add("active");
        if (closeBtn) closeBtn.focus();
        startCelebrationAnimation(canvas, festival);
    }, 350);

    function closeModal() {
        overlay.classList.remove("active");
        stopCelebrationAnimation();
        localStorage.setItem(storageKey, "true");
        setTimeout(() => {
            overlay.remove();
            if (canvas) canvas.remove();
            if (previousActive && previousActive.focus) previousActive.focus();
        }, 400);
    }

    closeBtn.addEventListener("click", closeModal);
    dismissBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    // Keyboard accessibility: Escape key & focus trapping
    document.addEventListener("keydown", function handleKey(e) {
        if (!overlay.classList.contains("active")) {
            document.removeEventListener("keydown", handleKey);
            return;
        }
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", handleKey);
        }
    });
}

/**
 * Lightweight canvas particle system (falling petals/flowers + sparkles)
 * Automatically stops after 7.5 seconds for 0% CPU consumption
 */
let particleAnimId = null;

function startCelebrationAnimation(canvas, festival) {
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        if (canvas) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
    });

    const particles = [];
    const colors = (festival && festival.particleColors) || ["#FF6A00", "#FFD700", "#FF4081", "#10B981", "#FFF9C4", "#FFFFFF"];
    const totalCount = Math.min(95, Math.max(50, Math.floor(width / 15)));

    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < totalCount; i++) {
        // Initial sprinkler burst spreading outwards from celebration center
        const angle = Math.random() * Math.PI * 2;
        const initialSpeed = Math.random() * 5 + 2;
        const isSprinkleBurst = i < 45; // Half of particles burst from center, half fall from sky

        particles.push({
            x: isSprinkleBurst ? centerX + (Math.random() * 40 - 20) : Math.random() * width,
            y: isSprinkleBurst ? centerY + (Math.random() * 40 - 20) : Math.random() * (height * 0.5) - (height * 0.4),
            vx: isSprinkleBurst ? Math.cos(angle) * initialSpeed : Math.random() * 2 - 1,
            vy: isSprinkleBurst ? Math.sin(angle) * initialSpeed - 1.5 : Math.random() * 2.5 + 1.5,
            size: Math.random() * 7 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 4 - 2,
            sway: Math.random() * 0.05 + 0.015,
            swayCount: Math.random() * Math.PI * 2,
            shape: Math.floor(Math.random() * 4), // 0: confetti strip, 1: 4-point star, 2: petal, 3: sparkle dot
            gravity: 0.08
        });
    }

    const startTime = performance.now();
    const duration = 7500; // 7.5 seconds total life

    function render(time) {
        const elapsed = time - startTime;
        if (elapsed > duration) {
            stopCelebrationAnimation();
            if (canvas) canvas.style.display = "none";
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Gentle fade-out near the end
        const alpha = elapsed > 5500 ? Math.max(0, (duration - elapsed) / 2000) : 1;
        ctx.globalAlpha = alpha;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Apply physics: outward velocity decays into gentle downward gravitational drift
            p.vx *= 0.985;
            p.vy += p.gravity;
            if (p.vy > 3.2) p.vy = 3.2; // terminal velocity

            p.x += p.vx;
            p.y += p.vy;

            p.swayCount += p.sway;
            p.x += Math.sin(p.swayCount) * 1.1;
            p.rotation += p.rotSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);

            if (p.shape === 0) {
                // Confetti rectangle strip fluttering
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
            } else if (p.shape === 1) {
                // 4-point radiant star
                ctx.fillStyle = p.color;
                ctx.beginPath();
                for (let s = 0; s < 4; s++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.lineTo(p.size, 0);
                    ctx.lineTo(p.size * 0.25, p.size * 0.25);
                }
                ctx.fill();
            } else if (p.shape === 2) {
                // Curved flower petal
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                ctx.quadraticCurveTo(p.size * 0.8, -p.size * 0.2, 0, p.size);
                ctx.quadraticCurveTo(-p.size * 0.8, -p.size * 0.2, 0, -p.size);
                ctx.fill();
            } else {
                // Sparkling circle with glow
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // Recycle off-screen particles while within duration
            if (p.y > height + 20 && elapsed < 5500) {
                p.y = -20;
                p.x = Math.random() * width;
                p.vy = Math.random() * 2 + 1.2;
                p.vx = Math.random() * 2 - 1;
            }
        }

        particleAnimId = requestAnimationFrame(render);
    }

    particleAnimId = requestAnimationFrame(render);
}

function stopCelebrationAnimation() {
    if (particleAnimId) {
        cancelAnimationFrame(particleAnimId);
        particleAnimId = null;
    }
}

// Initialize Festival Theme on DOM Ready
document.addEventListener("DOMContentLoaded", initFestivalTheme);




// ==========================================================================
// DYNAMIC TOP SCROLL PROGRESS INDICATOR (Aesthetic Polish)
// ==========================================================================
(function initScrollProgress() {
    function setupBar() {
        let bar = document.getElementById('scrollProgressBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'scrollProgressBar';
            bar.className = 'scroll-progress-bar';
            document.body.prepend(bar);
        }
        window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = h > 0 ? (window.scrollY / h) * 100 : 0;
            bar.style.width = progress + '%';
        }, { passive: true });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupBar);
    } else {
        setupBar();
    }
})();
