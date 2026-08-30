// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');

// ===== Slider Variables =====
let currentSlide = 0;
let slideInterval;
const slideDelay = 5000;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    if (slider) {
        startSlider();
        updateSlideTextColor(0);

        // Make slides clickable
        slides.forEach(slide => {
            slide.style.cursor = 'pointer';
            slide.addEventListener('click', (e) => {
                // If the user clicked on a button or link inside the slide, let that handle the navigation
                if (e.target.closest('a') || e.target.closest('button')) return;

                const link = slide.querySelector('.btn-primary');
                if (link && link.href) {
                    window.location.href = link.href;
                }
            });
        });
    }
    initScrollEffects();
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
    initThemeSwitcher();
    init3DTiltEffect();
});

// ===== Adaptive Text Color =====
function getAverageBrightness(bgString) {
    if (!bgString) return 0;

    // Extract hex colors
    const hexMatches = bgString.match(/#[a-fA-F0-9]{6}/g);

    if (!hexMatches) return 0;

    let totalBrightness = 0;

    hexMatches.forEach(hex => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        // Standard brightness formula (Rec. 601)
        totalBrightness += (r * 299 + g * 587 + b * 114) / 1000;
    });

    return totalBrightness / hexMatches.length;
}

function updateSlideTextColor(index) {
    if (!slides || !slides[index]) return;
    const slide = slides[index];

    const bgElement = slide.querySelector('.slide-bg');
    if (!bgElement) return;

    // Get inline style attribute directly to ensure we get the Hex codes as written in HTML
    // Browsers might convert element.style.background to mapped RGB values which our simple regex doesn't catch
    const bgStyle = bgElement.getAttribute('style');

    const brightness = getAverageBrightness(bgStyle);
    const slideText = slide.querySelector('.slide-text');

    if (slideText) {
        if (brightness > 140) {
            // Light background -> Dark text
            slideText.classList.add('text-dark');
            slideText.classList.remove('text-light');
        } else {
            // Dark background -> Light text
            slideText.classList.add('text-light');
            slideText.classList.remove('text-dark');
        }
    }
}

// ===== Slider Functions =====
function startSlider() {
    if (!slider) return;
    stopSlider(); // Ensure no other interval is running
    slideInterval = setInterval(nextSlide, slideDelay);
}

function stopSlider() {
    clearInterval(slideInterval);
}

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    updateSlideTextColor(currentSlide);
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

// Slider Controls
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
    });
}

if (dots) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlider();
            goToSlide(index);
            startSlider();
        });
    });
}

// Pause slider on hover
if (slider) {
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);

    // Touch support for slider
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlider();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlider();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            prevSlide(); // Swipe left - previous (RTL)
        } else {
            nextSlide(); // Swipe right - next (RTL)
        }
    }
}

// ===== Scroll Effects =====
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar shadow
        if (scrollY > 50) {
            navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active nav link based on scroll
        updateActiveNavLink();
    });

    // Back to top click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section, header');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Toggle icon
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ===== Contact Form =====
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(contactForm);

        // Send data using FormSubmit.co AJAX
        fetch('https://formsubmit.co/ajax/AVF69Programmer@gmail.com', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Show success message
                showNotification('پیام شما با موفقیت ارسال شد!', 'success');
                // Reset form
                contactForm.reset();
            })
            .catch(error => {
                // Show error message
                showNotification('خطا در ارسال پیام. لطفا دوباره تلاش کنید.', 'error');
                console.error('Error:', error);
            })
            .finally(() => {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'success' ? '#43e97b' : '#667eea',
        color: '#fff',
        padding: '15px 30px',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        animation: 'slideDown 0.3s ease'
    });

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.app-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        stopSlider();
        nextSlide();
        startSlider();
    } else if (e.key === 'ArrowRight') {
        stopSlider();
        prevSlide();
        startSlider();
    }
});

// ===== Lightbox Functionality =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    let currentLightboxIndex = 0;

    // Open Lightbox
    galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            currentLightboxIndex = index;
            openLightbox(item);
        });
    });

    function openLightbox(item) {
        lightbox.classList.add('active');
        updateLightboxContent(item);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function updateLightboxContent(item) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        // Try to get caption from the sibling .gallery-caption element
        const captionEl = item.parentElement.querySelector('.gallery-caption');
        lightboxCaption.textContent = captionEl ? captionEl.textContent : item.alt;
    }

    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    function showNextImage() {
        currentLightboxIndex++;
        if (currentLightboxIndex >= galleryItems.length) {
            currentLightboxIndex = 0;
        }
        updateLightboxContent(galleryItems[currentLightboxIndex]);
    }

    function showPrevImage() {
        currentLightboxIndex--;
        if (currentLightboxIndex < 0) {
            currentLightboxIndex = galleryItems.length - 1;
        }
        updateLightboxContent(galleryItems[currentLightboxIndex]);
    }

    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Keyboard Navigation for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') { // Next in LTR, Prev in RTL - Adjusting for visual logic
            // In RTL, Left arrow usually means "Go to Next" visually (scrolling left) or "Go to Previous" logically? 
            // Usually Left Arrow -> Next Slide in RTL sliders if logic is flipped.
            // Let's stick to standard Key mapping: Left Arrow -> Previous Item in DOM order usually?
            // But in the slider code above: ArrowLeft calls nextSlide(). ArrowRight calls prevSlide(). 
            // Let's match that behavior for consistency.
            showNextImage();
        } else if (e.key === 'ArrowRight') {
            showPrevImage();
        }
    });
}

// ===== Theme Switcher =====
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Apply saved theme or system default
    if (savedTheme === 'dark' || (!savedTheme && systemTheme === 'dark')) {
        applyTheme('dark');
    }

    // Toggle theme on click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            htmlElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }
}

// ===== 3D Tilt Effect =====
function init3DTiltEffect() {
    const cards = document.querySelectorAll('.main-app-img');
    const maxTilt = 15; // Maximum tilt angle in degrees

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X relative to element
            const y = e.clientY - rect.top;  // Mouse Y relative to element

            // Calculate position relative to center (-1 to 1)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -maxTilt; // Invert Y for natural feel
            const rotateY = ((x - centerX) / centerX) * maxTilt;

            // Apply transform
            // Use a short transition for smoothness during movement, but not too slow to feel laggy
            card.style.transition = 'transform 0.1s ease-out';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset with smooth transition
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });

        // Optional: Reset transition on mouse enter to avoid lag from previous state if needed
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
    });
}
