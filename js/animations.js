// Advanced animations and visual effects for SIEM Central

// Animation controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.initializeAdvancedAnimations();
        this.setupIntersectionObserver();
        this.bindEvents();
    }

    initializeAdvancedAnimations() {
        // Card hover effects
        this.initCardHoverEffects();
        
        // Number counting animation
        this.initCountingAnimations();
        
        // Tech tags animation
        this.initTechTagsAnimation();
        
        // Team card animations
        this.initTeamCardAnimations();
        
        // Architecture diagram interactions
        this.initArchitectureInteractions();
    }

    initCardHoverEffects() {
        const cards = document.querySelectorAll('.bento-card, .tech-card, .team-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });
    }

    handleCardHover(event) {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create ripple effect
        this.createRippleEffect(card, event.clientX - rect.left, event.clientY - rect.top);
        
        // Apply tilt effect
        card.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-10px)';
        card.style.transition = 'transform 0.3s ease';
        
        // Enhance shadow
        card.style.boxShadow = '0 25px 50px rgba(2, 69, 122, 0.3)';
    }

    handleCardLeave(event) {
        const card = event.currentTarget;
        card.style.transform = '';
        card.style.boxShadow = '';
        
        // Remove ripple effects
        const ripples = card.querySelectorAll('.ripple');
        ripples.forEach(ripple => {
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }

    createRippleEffect(element, x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
    }

    initCountingAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateNumber(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat);
        });
    }

    animateNumber(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const number = parseInt(text.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = Math.ceil(number / 60); // 60 frames for 1 second at 60fps
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            element.textContent = current + (hasPlus ? '+' : '') + (text.includes('/') ? '/7' : '');
        }, 16); // ~60fps
    }

    initTechTagsAnimation() {
        const techTags = document.querySelectorAll('.tech-tag');
        
        techTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                tag.style.transition = 'all 0.3s ease';
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initTeamCardAnimations() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            const image = card.querySelector('.team-image img');
            const info = card.querySelector('.team-info');
            
            if (image && info) {
                card.addEventListener('mouseenter', () => {
                    image.style.transform = 'scale(1.1)';
                    info.style.transform = 'translateY(-5px)';
                });
                
                card.addEventListener('mouseleave', () => {
                    image.style.transform = 'scale(1)';
                    info.style.transform = 'translateY(0)';
                });
            }
        });
    }

    initArchitectureInteractions() {
        const archImage = document.querySelector('.arch-img');
        const detailCards = document.querySelectorAll('.detail-card');
        
        if (archImage) {
            archImage.addEventListener('mousemove', this.handleArchImageHover.bind(this));
            archImage.addEventListener('mouseleave', this.handleArchImageLeave.bind(this));
        }
        
        detailCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.highlightArchComponent(index);
            });
        });
    }

    handleArchImageHover(event) {
        const image = event.currentTarget;
        const rect = image.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * 5;
        const rotateY = (centerX - x) / centerX * 5;
        
        image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }

    handleArchImageLeave(event) {
        const image = event.currentTarget;
        image.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }

    highlightArchComponent(index) {
        // This could be expanded to highlight specific parts of the architecture diagram
        console.log(`Highlighting architecture component ${index}`);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSectionAnimation(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    triggerSectionAnimation(section) {
        const sectionId = section.id;
        
        switch (sectionId) {
            case 'about':
                this.animateAboutSection(section);
                break;
            case 'technologies':
                this.animateTechnologiesSection(section);
                break;
            case 'architecture':
                this.animateArchitectureSection(section);
                break;
            case 'team':
                this.animateTeamSection(section);
                break;
        }
    }

    animateAboutSection(section) {
        const bentoCards = section.querySelectorAll('.bento-card');
        
        bentoCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, index * 150);
        });
    }

    animateTechnologiesSection(section) {
        const techCards = section.querySelectorAll('.tech-card');
        
        techCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) rotate(-5deg)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) rotate(0deg)';
            }, index * 200);
        });
    }

    animateArchitectureSection(section) {
        const archImage = section.querySelector('.architecture-image');
        const detailCards = section.querySelectorAll('.detail-card');
        
        if (archImage) {
            archImage.style.opacity = '0';
            archImage.style.transform = 'translateX(-50px)';
            archImage.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                archImage.style.opacity = '1';
                archImage.style.transform = 'translateX(0)';
            }, 200);
        }
        
        detailCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 400 + index * 150);
        });
    }

    animateTeamSection(section) {
        const teamCards = section.querySelectorAll('.team-card');
        
        teamCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) rotateY(20deg)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotateY(0deg)';
            }, index * 300);
        });
    }

    bindEvents() {
        // Add custom styles for ripple animation
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleAnimation {
                    to {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
                
                .ripple {
                    animation: rippleAnimation 0.6s ease-out;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Particle system for enhanced visual effects
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.maxParticles = 30;
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'enhanced-particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + size;
        const speed = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.5 + 0.3;
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(106, 163, 245, ${opacity}) 0%, transparent 70%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1;
        `;
        
        particle.dataset.speed = speed;
        particle.dataset.originalX = x;
        
        this.container.appendChild(particle);
        return particle;
    }

    animate() {
        this.particles.forEach((particle, index) => {
            const speed = parseFloat(particle.dataset.speed);
            const currentTop = parseFloat(particle.style.top);
            const originalX = parseFloat(particle.dataset.originalX);
            
            const newTop = currentTop - speed;
            const newX = originalX + Math.sin(newTop * 0.01) * 50;
            
            particle.style.top = newTop + 'px';
            particle.style.left = newX + 'px';
            
            if (newTop < -10) {
                particle.remove();
                this.particles[index] = this.createParticle();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Text reveal effect
class TextReveal {
    constructor(element) {
        this.element = element;
        this.text = element.textContent;
        this.init();
    }

    init() {
        this.element.innerHTML = this.wrapChars();
        this.animateChars();
    }

    wrapChars() {
        return this.text.split('').map(char => 
            `<span class="char" style="opacity: 0; transform: translateY(50px);">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
    }

    animateChars() {
        const chars = this.element.querySelectorAll('.char');
        
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// Initialize enhanced animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation controller
    const animationController = new AnimationController();
    
    // Initialize particle system for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleSystem(heroSection);
    }
    
    // Initialize text reveal for section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                new TextReveal(entry.target);
                titleObserver.unobserve(entry.target);
            }
        });
    });
    
    sectionTitles.forEach(title => titleObserver.observe(title));
});

// Export for global access
window.AnimationController = AnimationController;
window.ParticleSystem = ParticleSystem;
window.TextReveal = TextReveal;
