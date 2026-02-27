/* ===================================
   Enhanced Ocean Research Website JS
   Particle system, animations, interactions
   =================================== */

// ===== PARTICLE SYSTEM FOR OCEAN CURRENTS =====
class OceanParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.resize();
        this.init();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.3;
            
            this.particles.push(new Particle(x, y, size, speedX, speedY));
        }
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.canvas, this.mouse);
            particle.draw(this.ctx);
        });
        
        // Connect nearby particles
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.5;
                    this.ctx.strokeStyle = `rgba(62, 146, 204, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.baseSpeedX = speedX;
        this.baseSpeedY = speedY;
    }
    
    update(canvas, mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius && mouse.x != null) {
            const forceX = dx / distance;
            const forceY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            this.speedX -= forceX * force * 0.5;
            this.speedY -= forceY * force * 0.5;
        } else {
            // Return to base speed
            if (Math.abs(this.speedX - this.baseSpeedX) > 0.01) {
                this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
            }
            if (Math.abs(this.speedY - this.baseSpeedY) > 0.01) {
                this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
            }
        }
        
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
    
    draw(ctx) {
        // Make particles more visible
        ctx.fillStyle = 'rgba(62, 146, 204, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add stronger glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(62, 146, 204, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    init() {
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }
    
    handleScroll() {
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && el.style.opacity === '0') {
                const delay = el.dataset.aosDelay || 0;
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        // Scroll behavior
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
        
        // Mobile menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    updateActiveLink() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = this.navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.closeMobileMenu();
        }
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// ===== PROJECT CARDS PARALLAX =====
class ProjectParallax {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .fieldwork-card, .photo-item');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }
    
    handleMouseLeave(card) {
        card.style.transform = '';
    }
}

// ===== TYPING ANIMATION FOR HERO =====
class TypingAnimation {
    constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        if (this.element) {
            this.type();
        }
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== SKILL TAGS ANIMATION =====
class SkillTagsAnimation {
    constructor() {
        this.tags = document.querySelectorAll('.interest-tag, .tech-tag, .skill-tags span');
        this.init();
    }
    
    init() {
        this.tags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.05}s`;
        });
    }
}

// ===== CURSOR EFFECT (Optional) =====
class CursorEffect {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);
        
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
            
            this.cursorDot.style.left = e.clientX + 'px';
            this.cursorDot.style.top = e.clientY + 'px';
        });
        
        this.animate();
        
        // Add hover effects
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.cursor.style.borderColor = 'rgba(62, 146, 204, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                this.cursor.style.borderColor = 'rgba(62, 146, 204, 0.5)';
            });
        });
    }
    
    animate() {
        this.x += (this.targetX - this.x) * 0.1;
        this.y += (this.targetY - this.y) * 0.1;
        
        this.cursor.style.left = this.x + 'px';
        this.cursor.style.top = this.y + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

// Add cursor styles
const cursorStyles = `
    .custom-cursor {
        position: fixed;
        width: 30px;
        height: 30px;
        border: 2px solid rgba(62, 146, 204, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    
    .custom-cursor-dot {
        position: fixed;
        width: 6px;
        height: 6px;
        background: rgba(62, 146, 204, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
    }
    
    @media (max-width: 768px) {
        .custom-cursor,
        .custom-cursor-dot {
            display: none;
        }
    }
`;

// ===== LOADING SCREEN (Optional) =====
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-wave"></div>
                <p>Loading oceanography...</p>
            </div>
        `;
        document.body.appendChild(this.loadingScreen);
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.loadingScreen.remove();
                }, 500);
            }, 500);
        });
    }
}

// Add loading screen styles
const loadingStyles = `
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #0A2463 0%, #1A5F7A 50%, #3E92CC 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    }
    
    .loading-content {
        text-align: center;
        color: white;
    }
    
    .loading-wave {
        width: 60px;
        height: 60px;
        margin: 0 auto 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-content p {
        font-size: 1.1rem;
        opacity: 0.9;
    }
`;

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Initializing Ocean Website...');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = cursorStyles + loadingStyles;
    document.head.appendChild(style);
    
    // Initialize particle system
    const canvas = document.getElementById('ocean-canvas');
    if (canvas) {
        console.log('✅ Canvas found, initializing particles...');
        new OceanParticleSystem(canvas);
        console.log('✅ Particle system initialized');
    } else {
        console.error('❌ Canvas element not found!');
    }
    
    // Initialize scroll animations
    new ScrollAnimations();
    console.log('✅ Scroll animations loaded');
    
    // Initialize navigation
    new Navigation();
    console.log('✅ Navigation initialized');
    
    // Initialize parallax effects
    new ProjectParallax();
    console.log('✅ Parallax effects loaded');
    
    // Initialize skill tags animation
    new SkillTagsAnimation();
    
    // Initialize cursor effect (desktop only)
    if (window.innerWidth > 768) {
        new CursorEffect();
        console.log('✅ Custom cursor loaded');
    }
    
    console.log('🎉 Ocean Research Website Fully Loaded!');
    console.log('Particle count: 80');
    console.log('Check the hero section for moving particles');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Reduce particle count on mobile
if (window.innerWidth < 768) {
    // Mobile devices get fewer particles
    window.addEventListener('load', () => {
        const canvas = document.getElementById('ocean-canvas');
        if (canvas) {
            canvas.style.opacity = '0.2';
        }
    });
}

// ===== EASTER EGG: KONAMI CODE =====
(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                document.body.style.animation = 'rainbow 5s linear infinite';
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
                konamiIndex = 0;
                
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
            }
        } else {
            konamiIndex = 0;
        }
    });
})();

// ===== EXPORT FOR DEBUGGING =====
if (typeof window !== 'undefined') {
    window.oceanWebsite = {
        version: '2.0',
        author: 'Mimon Morsheduzzaman',
        features: [
            'Particle System',
            'Scroll Animations',
            'Interactive Navigation',
            'Parallax Effects',
            'Custom Cursor'
        ]
    };
}
