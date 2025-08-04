// ==================== NAVIGATION ==================== 
class Navigation {
    constructor() {
        this.nav = document.getElementById('navigation');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.isScrolled = false;
        this.isMobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Scroll event
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        
        // Navigation links
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.scrollToSection(target.replace('#', ''));
                this.closeMobileMenu();
            });
        });
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled !== this.isScrolled) {
            this.isScrolled = scrolled;
            this.nav.classList.toggle('scrolled', scrolled);
        }
    }
    
    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        this.mobileMenu.classList.toggle('active', this.isMobileMenuOpen);
        
        // Animate hamburger menu
        const spans = this.mobileMenuBtn.querySelectorAll('span');
        if (this.isMobileMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    closeMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }
    
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ==================== CONTACT FORM ==================== 
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        // Não previne o envio do formulário, pois agora o FormSubmit irá processá-lo
        // Apenas valida os dados antes do envio
        
        // Get form data
        const data = {
            name: this.form.querySelector('#name').value,
            email: this.form.querySelector('#email').value,
            phone: this.form.querySelector('#phone').value,
            message: this.form.querySelector('#message').value
        };
        
        // Validate form
        if (!this.validateForm(data)) {
            e.preventDefault();
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        // O FormSubmit irá processar o envio do formulário automaticamente
        // Não precisamos mais do submitForm
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Email inválido');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }
        
        if (errors.length > 0) {
            this.showToast(errors[0], 'error');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // A função submitForm foi removida pois o FormSubmit lida com o envio do formulário
    
    setLoadingState(loading) {
        this.submitBtn.classList.toggle('loading', loading);
        this.submitBtn.disabled = loading;
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = toast.querySelector('.toast-message');
        const iconEl = toast.querySelector('.toast-icon');
        
        messageEl.textContent = message;
        iconEl.textContent = type === 'success' ? '✅' : '❌';
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ==================== ANIMATIONS ==================== 
class AnimationObserver {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            this.observeElements();
        }
    }
    
    observeElements() {
        const elements = document.querySelectorAll(
            '.animate-fade-up, .animate-slide-left'
        );
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = el.classList.contains('animate-slide-left') 
                ? 'translateX(-50px)' 
                : 'translateY(30px)';
            
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Add animation
                el.style.transition = 'all 0.8s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateX(0) translateY(0)';
                
                // Add delay if specified
                const delay = Array.from(el.classList)
                    .find(cls => cls.startsWith('delay-'));
                
                if (delay) {
                    const delayValue = delay.replace('delay-', '');
                    el.style.transitionDelay = `0.${delayValue}s`;
                }
                
                // Stop observing this element
                this.observer.unobserve(el);
            }
        });
    }
}

// ==================== UTILITY FUNCTIONS ==================== 
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function openWhatsApp() {
    const message = "Olá! Gostaria de saber mais sobre os serviços de relocation para Portugal.";
    const phone = "351965520353";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ==================== SMOOTH SCROLLING FOR ANCHOR LINKS ==================== 
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== PERFORMANCE OPTIMIZATIONS ==================== 
function optimizeImages() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    new Navigation();
    new ContactForm();
    new AnimationObserver();
    
    // Initialize utility functions
    initSmoothScrolling();
    optimizeImages();
    
    // Add loading class removal
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const nav = new Navigation();
            nav.closeMobileMenu();
        }
    });
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on resize
            const nav = new Navigation();
            nav.closeMobileMenu();
        }, 250);
    });
});

// ==================== SERVICE WORKER (Optional) ==================== 
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ==================== ANALYTICS (Optional) ==================== 
function trackEvent(eventName, eventData = {}) {
    // Add your analytics tracking code here
    console.log('Track event:', eventName, eventData);
    
    // Example for Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Track form submissions
document.addEventListener('submit', function(e) {
    if (e.target.id === 'contactForm') {
        trackEvent('form_submit', {
            form_name: 'contact_form'
        });
    }
});

// Track WhatsApp clicks
function trackWhatsAppClick() {
    trackEvent('whatsapp_click', {
        source: 'website'
    });
}

// Override openWhatsApp to include tracking
const originalOpenWhatsApp = openWhatsApp;
openWhatsApp = function() {
    trackWhatsAppClick();
    originalOpenWhatsApp();
};