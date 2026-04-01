// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Split Text Hero Animation logic
    const splitElements = document.querySelectorAll('.split-text-animate');
    splitElements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        let charIndex = 0;
        
        // Split by standard words/br to preserve original structure slightly
        // For simplicity, just split all characters except spaces
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === ' ') {
                el.innerHTML += '&nbsp;';
            } else if (char === '\n') {
                 el.innerHTML += '<br>';
            } else {
                const span = document.createElement('span');
                span.classList.add('char');
                span.style.setProperty('--char-index', charIndex);
                span.textContent = char;
                if(text.substring(i).startsWith("SAI KIRAN")) {
                   span.classList.add("highlight-text"); // carry over formatting
                }
                el.appendChild(span);
                charIndex++;
            }
        }
    });

    // 1. Initialize 3D Background effect
    const vantaEffect = VANTA.NET({
        el: ".background-container",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x33b8ff,
        backgroundColor: 0x050508,
        backgroundAlpha: 0.00,
        points: 8.00,
        maxDistance: 18.00,
        spacing: 17.00
    });
    
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorGlow.style.left = `${posX}px`;
            cursorGlow.style.top = `${posY}px`;

            // Deeper Parallax for floating elements
            const parallaxWraps = document.querySelectorAll('.parallax-wrap');
            parallaxWraps.forEach(wrap => {
                const elements = wrap.querySelectorAll('.parallax-element');
                elements.forEach(el => {
                    const speed = el.getAttribute('data-speed') || 2;
                    const x = ((posX - window.innerWidth / 2) * speed) / 80; // deepened
                    const y = ((posY - window.innerHeight / 2) * speed) / 80;
                    el.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
        });

        const interactives = document.querySelectorAll('a, button, input, textarea, .glass-card, .skill-item');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
        
        // 2b. Magnetic Hover Logic
        const magnetics = document.querySelectorAll('.magnetic-btn');
        magnetics.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                
                // Calculate distance from center
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                
                // Pull element strongly but safely
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px) scale(1)`;
                btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                setTimeout(() => btn.style.transition = '', 400);
            });
        });
    }

    // 3. Smart Navbar & Active Indicator
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const icon = mobileBtn.querySelector('i');
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    const header = document.querySelector('.glass-nav');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-indicator');
    
    let lastScrollY = window.scrollY;

    const updateIndicator = (activeItem) => {
        if(!indicator || !activeItem) return;
        indicator.classList.add('active');
        indicator.style.width = `${activeItem.offsetWidth}px`;
        indicator.style.height = `${activeItem.offsetHeight}px`;
        indicator.style.left = `${activeItem.offsetLeft}px`;
        indicator.style.top = `${activeItem.offsetTop}px`;
    };

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Navbar hide logic removed - Navbar remains stable on scroll
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = currentScrollY;

        // Active link detect
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
                updateIndicator(item);
            }
        });
    });

    // 4. Advanced Scroll Reveals
    const fadeElements = document.querySelectorAll('.scroll-reveal');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    fadeElements.forEach(el => appearOnScroll.observe(el));

    // 5. Holographic Glare on Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        // Add glare element
        const glare = document.createElement('div');
        glare.classList.add('glare');
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; 
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Glare logic
            const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI - 90;
            glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            glare.style.opacity = '0';
            setTimeout(() => card.style.transition = '', 500);
        });
        
        card.addEventListener('mouseenter', () => {
            glare.style.opacity = '1';
        });
    });

    // 6. Form Handling (Preserved)
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const submitter = e.submitter;
            const submitType = submitter ? submitter.value : 'email';
            const btn = submitter || form.querySelector('.form-submit-btn');
            const originalText = btn.innerHTML;
            const originalBg = btn.style.backgroundColor;
            
            btn.innerHTML = `<span class="btn-text" style="color: inherit;">Sending...</span><i class="fas fa-spinner fa-spin send-icon"></i>`;
            
            if (submitType === 'whatsapp') {
                const phone = "919014871553";
                const waText = `Hello Taninki, I am ${name}.\n\n${message}\n\nYou can reach me at: ${email}`;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waText)}`, '_blank');
                btn.innerHTML = `<span class="btn-text" style="color: #25D366;">Opened!</span><i class="fas fa-check send-icon" style="color: #25D366;"></i>`;
                form.reset();
                setTimeout(() => btn.innerHTML = originalText, 3000);
            } else {
                const mailtoEmail = "taninkivinda@gmail.com";
                const emailSubject = `Portfolio Contact from ${name}`;
                const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                window.location.href = `mailto:${mailtoEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                btn.innerHTML = `<span class="btn-text">Opened Client!</span><i class="fas fa-check send-icon"></i>`;
                btn.style.backgroundColor = 'rgba(57, 255, 20, 0.2)';
                form.reset();
                setTimeout(() => { btn.innerHTML = originalText; btn.style.backgroundColor = originalBg; }, 3000);
            }
        });
    }

    // 7. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
});
