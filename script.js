// Mobile Navigation Logic
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Toggle navigation dropdown and swap generic icons
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        hamburger.setAttribute('aria-expanded', 'true');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Close mobile menu dynamically when a specific link is selected
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Transparent Navbar background change on scroll
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    // Navbar styling
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 25, 47, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 25, 47, 0.9)';
        navbar.style.boxShadow = 'none';
    }

    // Back to top button visibility
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to top scroll functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // We unobserve to only animate once
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-on-scroll, .stagger-item').forEach(el => {
    observer.observe(el);
});


