// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    setupSmoothScrolling();

    // Mobile menu functionality
    setupMobileMenu();

    // Animated section transitions
    setupSectionTransitions();

    // Hive-like Mind Graph Animation
    setupParticleAnimation();
});

// Function to set up smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Function to set up mobile menu functionality
function setupMobileMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const navList = document.querySelector('.nav-list');

    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('active');
            navList.classList.remove('active');
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

// Function to set up the particle animation
function setupParticleAnimation() {
    const canvas = document.getElementById('particles-js');
    const ctx = canvas.getContext('2d');
    const homeSection = document.getElementById('home');

    let centerX, centerY;

    // Set canvas size to match the home section
    function setCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = homeSection.offsetWidth * dpr;
        canvas.height = homeSection.offsetHeight * dpr;
        canvas.style.width = `${homeSection.offsetWidth}px`;
        canvas.style.height = `${homeSection.offsetHeight}px`;
        ctx.scale(dpr, dpr);
        centerX = canvas.width / (2 * dpr);
        centerY = canvas.height / (2 * dpr);
    }

    setCanvasSize();

    const colors = ['#FF69B4', '#FFA500', '#FFFF00', '#FFFFFF']; // Pink, Orange, Yellow, White

    class Node {
        constructor(isBigNode = false) {
            this.initializeNode(isBigNode);
        }

        initializeNode(isBigNode) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(centerX, centerY) * 0.8;
            this.x = centerX + Math.cos(angle) * distance;
            this.y = centerY + Math.sin(angle) * distance;
            this.isBigNode = isBigNode;
            this.size = isBigNode ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5;
            this.connections = [];
            this.angle = angle;
            this.orbitSpeed = (Math.random() - 0.5) * 0.0002;
            this.distanceFromCenter = distance;
            this.mass = isBigNode ? 3 : 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.glowIntensity = 0;
            this.glowSpeed = Math.random() * 0.01 + 0.005;
            this.glowing = false;
            this.glowTimer = Math.random() * 100;
        }

        update(nodes) {
            this.updatePosition();
            this.applyGravitationalEffect(nodes);
            this.keepWithinBounds();
            this.updateGlowEffect();
        }

        updatePosition() {
            this.angle += this.orbitSpeed;
            this.x = centerX + Math.cos(this.angle) * this.distanceFromCenter;
            this.y = centerY + Math.sin(this.angle) * this.distanceFromCenter;
        }

        applyGravitationalEffect(nodes) {
            nodes.forEach(node => {
                if (node !== this) {
                    const dx = node.x - this.x;
                    const dy = node.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = node.mass / (distance * distance);
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 0.05;
                    this.y += Math.sin(angle) * force * 0.05;
                }
            });
        }

        keepWithinBounds() {
            const maxDistance = Math.min(centerX, centerY) * 0.8;
            const currentDistance = Math.sqrt((this.x - centerX) ** 2 + (this.y - centerY) ** 2);
            if (currentDistance > maxDistance) {
                const angle = Math.atan2(this.y - centerY, this.x - centerX);
                this.x = centerX + Math.cos(angle) * maxDistance;
                this.y = centerY + Math.sin(angle) * maxDistance;
            }
        }

        updateGlowEffect() {
            if (this.glowing) {
                this.glowIntensity += this.glowSpeed;
                if (this.glowIntensity > 1) {
                    this.glowing = false;
                }
            } else {
                this.glowIntensity -= this.glowSpeed;
                if (this.glowIntensity < 0) {
                    this.glowIntensity = 0;
                    this.glowTimer--;
                    if (this.glowTimer <= 0) {
                        this.glowing = true;
                        this.glowTimer = Math.random() * 100;
                    }
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            if (this.color === '#FFFFFF') {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + this.glowIntensity * 0.7})`;
            } else {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * (1.5 + this.glowIntensity));
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, `rgba(${parseInt(this.color.slice(1,3),16)}, ${parseInt(this.color.slice(3,5),16)}, ${parseInt(this.color.slice(5,7),16)}, 0)`);
                ctx.fillStyle = gradient;
            }
            
            ctx.globalAlpha = 0.6 + this.glowIntensity * 0.4;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        connectNodes(nodes) {
            this.connections = nodes.filter(node => {
                if (node === this) return false;
                const distance = Math.hypot(this.x - node.x, this.y - node.y);
                return distance < (this.isBigNode ? 100 : 50);
            }).slice(0, this.isBigNode ? 3 : 2);
        }

        drawConnections() {
            this.connections.forEach(node => {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(node.x, node.y);
                ctx.strokeStyle = 'rgba(150, 150, 150, 0.1)';
                ctx.lineWidth = this.isBigNode ? 0.5 : 0.3;
                ctx.stroke();
            });
        }
    }

    const nodes = [];
    const nodeCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 10000));
    const bigNodeCount = Math.floor(nodeCount * 0.1);
    const coloredNodeCount = Math.floor(nodeCount * 0.6);

    // Initialize nodes
    for (let i = 0; i < bigNodeCount; i++) {
        nodes.push(new Node(true));
    }
    for (let i = 0; i < coloredNodeCount; i++) {
        nodes.push(new Node(false));
    }
    for (let i = 0; i < nodeCount - bigNodeCount - coloredNodeCount; i++) {
        nodes.push(new Node());
    }

    let animationFrameId;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        nodes.forEach(node => {
            node.update(nodes);
            node.connectNodes(nodes);
            node.draw();
            node.drawConnections();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Resize canvas when window is resized
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        cancelAnimationFrame(animationFrameId);
        
        resizeTimeout = setTimeout(() => {
            setCanvasSize();
            nodes.forEach(node => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * Math.min(centerX, centerY) * 0.8;
                node.x = centerX + Math.cos(angle) * distance;
                node.y = centerY + Math.sin(angle) * distance;
                node.angle = angle;
                node.distanceFromCenter = distance;
            });
            animate();
        }, 250);
    });
}