// ============================================
// IMPROVED OCEAN EFFECTS
// Keeping: Particles, Radar, Cursor, 3D Cards
// Improvement: More visible, better performance
// ============================================

class OceanParticleSystem {
    constructor() {
        this.canvas = document.getElementById('ocean-canvas');
        if (!this.canvas) {
            console.warn('Canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.radarAngle = 0;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        console.log('✅ Ocean particle system initialized');
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // MORE particles for better visibility
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1.5, // BIGGER particles
                opacity: Math.random() * 0.5 + 0.4 // MORE OPAQUE
            });
        }
    }
    
    drawParticles() {
        this.particles.forEach((p, i) => {
            // Move particle
            p.x += p.vx;
            p.y += p.vy;
            
            // Mouse interaction (flow disturbance)
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.x -= dx * force * 0.03;
                p.y -= dy * force * 0.03;
            }
            
            // Wrap around screen
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Draw particle with GLOW
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 119, 190, ${p.opacity})`; // OCEAN BLUE
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(0, 119, 190, 0.8)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Connect nearby particles (velocity field lines)
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) { // CONNECTION RANGE
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(102, 178, 255, ${0.4 * (1 - distance / 120)})`; // MORE VISIBLE
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
    }
    
    drawRadarSweep() {
        // RADAR SWEEP - More prominent
        const centerX = this.canvas.width * 0.85;
        const centerY = this.canvas.height * 0.15;
        const maxRadius = 250;
        
        // Radar background circles (range rings)
        [80, 140, 200].forEach(radius => {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(0, 119, 190, 0.15)'; // MORE VISIBLE
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
        });
        
        // Radar sweep beam
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxRadius
        );
        gradient.addColorStop(0, 'rgba(0, 119, 190, 0.6)'); // MUCH MORE VISIBLE
        gradient.addColorStop(0.5, 'rgba(0, 119, 190, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 119, 190, 0)');
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.radarAngle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.arc(0, 0, maxRadius, -Math.PI / 6, Math.PI / 6);
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Rotate radar (HF radar scanning motion)
        this.radarAngle += 0.02;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawParticles();
        this.drawRadarSweep();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// CUSTOM CURSOR EFFECT (Keep)
// ============================================
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';
        document.body.appendChild(this.cursor);
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 20 + 'px';
            this.cursor.style.top = e.clientY - 20 + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('clicking');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('clicking');
        });
        
        console.log('✅ Custom cursor initialized');
    }
}

// ============================================
// 3D CARD TILT EFFECT (Keep)
// ============================================
class Card3DEffect {
    constructor() {
        this.cards = document.querySelectorAll('.card-3d');
        this.init();
        console.log(`✅ 3D card effect on ${this.cards.length} cards`);
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale(1.02)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL & NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
        this.highlightOnScroll();
        console.log('✅ Navigation initialized');
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    highlightOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Initializing Ocean Research Website...');
    
    new OceanParticleSystem();
    new CustomCursor();
    new Card3DEffect();
    new Navigation();
    
    console.log('🎉 All systems loaded!');
});
