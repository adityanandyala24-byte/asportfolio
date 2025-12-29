const Portfolio = {
    init() {
        this.cacheDOM();
        this.initSlideshow();
        this.initNavigation();
        this.initScrollAnimations();
        this.initContactForm();
        this.initCustomCursor();
        this.initTypingEffect();
    },

    cacheDOM() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.contactForm = document.getElementById('contactForm');
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
    },

    initSlideshow() {
        this.updateSlideshow();

        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.currentSlide = index;
                this.updateSlideshow();
            });
        });

        setInterval(() => this.nextSlide(), 5000);
    },

    updateSlideshow() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('center', 'left', 'right', 'hidden');

            if (index === this.currentSlide) {
                slide.classList.add('center');
            } else if (index === (this.currentSlide - 1 + this.slides.length) % this.slides.length) {
                slide.classList.add('left');
            } else if (index === (this.currentSlide + 1) % this.slides.length) {
                slide.classList.add('right');
            } else {
                slide.classList.add('hidden');
            }
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    },

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlideshow();
    },

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlideshow();
    },

    initNavigation() {
        window.addEventListener('scroll', this.debounce(() => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            this.updateActiveNav();
        }, 10));

        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            });
        });
    },

    updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');

                    if (entry.target.classList.contains('skills-section')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        });

        this.initProjectCardAnimations();
    },

    animateSkillBars() {
        const progressBars = document.querySelectorAll('.progress-bar');

        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });
    },

    initProjectCardAnimations() {
        const projectCards = document.querySelectorAll('.project-card');
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            projectObserver.observe(card);
        });
    },

    initContactForm() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(this.contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            if (!name || !email || !subject || !message) {
                this.showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!this.isValidEmail(email)) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }

            this.showNotification('Message sent successfully! I will get back to you soon.', 'success');
            this.contactForm.reset();
        });
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-weight: 600;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        const removeNotification = () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        };

        closeBtn.addEventListener('click', removeNotification);
        setTimeout(() => {
            if (notification.parentNode) {
                removeNotification();
            }
        }, 5000);
    },

    initTypingEffect() {
        const titleElement = document.querySelector('.home-title');
        if (!titleElement) return;

        const originalText = titleElement.textContent;
        let i = 0;

        titleElement.innerHTML = '';

        const type = () => {
            if (i < originalText.length) {
                titleElement.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(type, 80);
            }
        };

        type();
    },

    initCustomCursor() {
        if (window.innerWidth <= 768) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(16, 185, 129, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        document.querySelectorAll('a, button, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Portfolio.init();
});
