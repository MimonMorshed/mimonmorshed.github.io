/* ===================================
   Clean Minimal Website JavaScript
   TYPEWRITER ONLY - NO PARTICLES
   =================================== */

// === TYPEWRITER ANIMATION ===
class Typewriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        
        this.type();
    }
    
    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 Initializing website...');
    
    // Typewriter Animation
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        new Typewriter(typewriterElement, 'Mimon Morsheduzzaman', 80);
        console.log('✅ Typewriter initialized');
    }
    
    console.log('🎉 Website loaded successfully!');
});
