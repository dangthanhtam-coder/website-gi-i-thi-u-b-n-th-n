/* ==========================================================
   SCRIPT.JS - Dang Thanh Tam Portfolio
   Handles: navbar, hamburger, typed text,
            scroll animations, progress bars,
            contact form validation, back-to-top
   ========================================================== */

/* --------- DOM REFERENCES --------- */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navMenu     = document.getElementById('nav-menu');
const navLinks    = document.querySelectorAll('.nav-link');
const backTopBtn  = document.getElementById('back-top');
const contactForm = document.getElementById('contact-form');

/* ==========================================================
   1. STICKY NAVBAR + BACK-TO-TOP VISIBILITY
   ========================================================== */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add shadow when scrolled
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide back-to-top button
    if (scrollY > 400) {
        backTopBtn.classList.add('show');
    } else {
        backTopBtn.classList.remove('show');
    }

    // Highlight active nav link
    highlightActiveSection();
});

/* --------- Back to top click --------- */
backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================================
   2. HAMBURGER MOBILE MENU
   ========================================================== */
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    // Toggle aria-expanded for accessibility
    const isOpen = navMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
    }
});

/* ==========================================================
   3. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ========================================================== */
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);

        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}
/* ==========================================================
   4. TYPED TEXT EFFECT (Hero Profession)
   ========================================================== */
const typedEl    = document.getElementById('typed-text');
const phrases    = ['Lập Trình Viên Web', 'Đam mê UI/UX', 'Lập Trình Sáng Tạo', 'Giải Quyết Vấn Đề'];
let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let typingTimer;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        // Remove a character
        typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
    } else {
        // Add a character
        typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of phrase
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
    }

    typingTimer = setTimeout(typeEffect, speed);
}

// Start typing after a short delay
setTimeout(typeEffect, 800);

/* ==========================================================
   5. SCROLL FADE-IN ANIMATIONS (IntersectionObserver)
   ========================================================== */
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    root:       null,       // viewport
    rootMargin: '0px',
    threshold:  0.12        // trigger when 12% visible
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to save resources
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

/* ==========================================================
   6. PROGRESS BAR ANIMATION
   Triggered when skills section is visible
   ========================================================== */
const progressBars = document.querySelectorAll('.progress');
let progressAnimated = false;

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !progressAnimated) {
            progressAnimated = true;
            progressBars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width');
                // Small timeout for staggered feel
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 150);
            });
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) progressObserver.observe(skillsSection);
/* ==========================================================
   7. CONTACT FORM VALIDATION
   ========================================================== */
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError    = document.getElementById('name-error');
    const emailError   = document.getElementById('email-error');
    const msgError     = document.getElementById('message-error');
    const successMsg   = document.getElementById('form-success');

    let valid = true;

    // Reset previous errors
    [nameInput, emailInput, messageInput].forEach(input => input.classList.remove('error'));
    [nameError, emailError, msgError].forEach(err => err.classList.remove('show'));
    successMsg.classList.remove('show');

    // Validate name
    if (nameInput.value.trim().length < 2) {
        nameInput.classList.add('error');
        nameError.classList.add('show');
        valid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('error');
        emailError.classList.add('show');
        valid = false;
    }

    // Validate message
    if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        msgError.textContent = 'Vui lòng nhập ít nhất 10 ký tự.';
        msgError.classList.add('show');
        valid = false;
    }

    if (valid) {
        // Show success message (no real backend - UI simulation)
        successMsg.classList.add('show');
        contactForm.reset();

        // Hide success after 5 seconds
        setTimeout(() => successMsg.classList.remove('show'), 5000);
    }
});

/* ==========================================================
   8. SMOOTH SCROLL for anchor links
   (fallback for browsers without CSS smooth scroll)
   ========================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70);
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});