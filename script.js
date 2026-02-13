
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
    console.log('🌊 Initializing site...');
   
    new CustomCursor();
    new Card3DEffect();
    new Navigation();
    
    console.log('🎉 All systems loaded!');
});
