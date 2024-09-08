// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    setupMobileMenu();

    // Animated section transitions
    setupSectionTransitions();

    // Set up dynamic navbar
    setupDynamicNavbar();

    // Set up Vanta.js Topology animation
    if (document.getElementById('vanta-bg')) {
        VANTA.TOPOLOGY({
            el: "#vanta-bg", // The div for the animation
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xffffff,     // Adjust these colors for the gradient effect
            backgroundColor: 0x0 // Background color
        });
    }
});

// Function to set up mobile menu functionality
function setupMobileMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Function to set up animated section transitions
function setupSectionTransitions() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Function to set up dynamic navbar functionality
function setupDynamicNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Change navbar background on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const opacity = Math.min(scrollPosition / (windowHeight * 0.5), 0.8);

        if (scrollPosition > 100) {
            navbar.classList.add('scrolled');
            navbar.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
            navbar.style.backdropFilter = `blur(${opacity * 10}px)`;
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            navbar.style.backdropFilter = 'blur(0px)';
        }
    });

    // Highlight active section in navbar (for single-page scrolling)
    const sections = document.querySelectorAll('.section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}