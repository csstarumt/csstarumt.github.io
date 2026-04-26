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

// Carousel 
const track = document.querySelector('.carousel-track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    let currentSlideIndex = 0;
    let autoSlideInterval;

    const moveToSlide = (index) => {
        currentSlideIndex = index;

        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right', 'current-slide');

            if (i === currentSlideIndex) {
                slide.classList.add('active', 'current-slide');
            } else if (i === currentSlideIndex - 1 || (currentSlideIndex === 0 && i === slides.length - 1)) {
                if (slides.length > 2 || i < currentSlideIndex) {
                    slide.classList.add('prev');
                } else {
                    slide.classList.add('next');
                }
            } else if (i === currentSlideIndex + 1 || (currentSlideIndex === slides.length - 1 && i === 0)) {
                if (slides.length > 2 || i > currentSlideIndex) {
                    slide.classList.add('next');
                } else {
                    slide.classList.add('prev');
                }
            } else {
                if (i < currentSlideIndex) {
                    slide.classList.add('hidden-left');
                } else {
                    slide.classList.add('hidden-right');
                }
            }
        });

        const currentDot = dotsNav.querySelector('.current-indicator');
        if (currentDot) currentDot.classList.remove('current-indicator');
        if (dots[index]) dots[index].classList.add('current-indicator');
    };

    // Make slides clickable
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            if (index !== currentSlideIndex) {
                moveToSlide(index);
                resetAutoSlide();
            }
        });
    });

    // Initialize layout
    moveToSlide(currentSlideIndex);

    const nextSlide = () => {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0; // wrap around
        }
        moveToSlide(nextIndex);
    };

    const prevSlide = () => {
        let prevIndex = currentSlideIndex - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        moveToSlide(prevIndex);
    };

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        moveToSlide(targetIndex);
        resetAutoSlide();
    });

    startAutoSlide();
}
