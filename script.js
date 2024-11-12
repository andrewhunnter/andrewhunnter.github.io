document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
        });

        // Close the menu if clicking anywhere outside of it
        document.addEventListener('click', (e) => {
            if (
                !hamburger.contains(e.target) &&
                !navLinks.contains(e.target) &&
                navLinks.classList.contains('active')
            ) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    // Animated section transitions
    setupSectionTransitions();

    // Set up Vanta.js Topology animation
    if (document.getElementById('vanta-bg')) {
        VANTA.TOPOLOGY({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xffffff,
            backgroundColor: 0x000000,
            points: 17.00,
            maxDistance: 20.00,
            spacing: 15.00
        });
    }
});



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