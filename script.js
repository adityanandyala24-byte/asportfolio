const Portfolio = {
    init() {
        this.cacheDOM();
        this.attachEventListeners();
        this.handleScroll();
    },

    cacheDOM() {
        this.hamburger = document.getElementById('hamburger');
        this.navbar = document.getElementById('navbar');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.sections = document.querySelectorAll('.content-section');
        this.contactForm = document.getElementById('contactForm');
    },

    attachEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabClick(e));
        });
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleHamburger());
        }
    },

    handleTabClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            this.updateActiveTab(e.target);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    },

    handleScroll() {
        let currentSection = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        this.tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${currentSection}`) {
                btn.classList.add('active');
            }
        });
    },

    updateActiveTab(activeBtn) {
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    },

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        this.showNotification('Message sent successfully! I will get back to you soon.', 'success');
        this.contactForm.reset();
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
            background: ${type === 'success' ? '#ffffff' : '#ef4444'};
            color: ${type === 'success' ? '#0a1628' : 'white'};
            padding: 1rem 2rem;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
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
            color: ${type === 'success' ? '#0a1628' : 'white'};
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

    toggleHamburger() {
        this.hamburger.classList.toggle('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Portfolio.init();
});
