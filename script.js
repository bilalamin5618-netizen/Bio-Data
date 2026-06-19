// ============================
// NAVBAR SCROLL EFFECT
// ============================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================
// MOBILE NAV TOGGLE
// ============================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// ============================
// COUNTER ANIMATION
// ============================
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(counter => animateCounter(counter));
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// ============================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================
// FAQ ACCORDION — close others on open
// ============================
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', function () {
        if (this.open) {
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== this && other.open) {
                    other.open = false;
                }
            });
        }
    });
});

// ============================
// PARALLAX SHAPES (subtle)
// ============================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.02;
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});
