// Intersection Observer para animações ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar todos os elementos com animação
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Adicionar classe ao scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Animar números na seção de garantias
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Observar seção de garantias para animar números
    const guaranteesSection = document.querySelector('.guarantees');
    if (guaranteesSection) {
        const guaranteesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animar "25h de evolução"
                    const text = entry.target.querySelector('p');
                    if (text && text.textContent.includes('25h')) {
                        const span = document.createElement('span');
                        span.textContent = '0';
                        text.innerHTML = text.innerHTML.replace('25', '<span class="animate-number">0</span>');
                        
                        setTimeout(() => {
                            const numberElement = text.querySelector('.animate-number');
                            animateValue(numberElement, 0, 25, 1000);
                        }, 500);
                    }
                    guaranteesObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        guaranteesObserver.observe(guaranteesSection);
    }
    
    // Adicionar efeito de digitação ao headline
    const headline = document.querySelector('.headline');
    if (headline) {
        const text = headline.textContent;
        headline.textContent = '';
        headline.style.opacity = '1';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                headline.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Iniciar digitação após um pequeno delay
        setTimeout(typeWriter, 500);
    }
    
    // Adicionar efeito hover especial aos botões CTA
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Meta Pixel - Rastrear cliques no WhatsApp
    document.querySelectorAll('.cta-whatsapp, .cta-last').forEach(button => {
        button.addEventListener('click', function() {
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact', {
                    content_name: 'WhatsApp Click',
                    content_category: 'neuraltenis',
                    value: button.classList.contains('cta-last') ? 'FAQ' : 'Main'
                });
            }
        });
    });
    
    // Rastrear tempo na página (engagement)
    let timeSpent = 0;
    setInterval(() => {
        timeSpent += 5;
        if (timeSpent === 30 && typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: '30 seconds on page',
                content_category: 'engagement'
            });
        }
    }, 5000);
});