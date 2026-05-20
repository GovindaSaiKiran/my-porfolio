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

    // 1. Initialize Antigravity Particles
    const particleContainer = document.getElementById('agParticles');
    if (particleContainer) {
        for (let i = 0; i < 40; i++) {
            const part = document.createElement('div');
            part.classList.add('ag-particle');
            part.style.left = `${Math.random() * 100}vw`;
            part.style.top = `${Math.random() * 100}vh`;
            const size = Math.random() * 4 + 1;
            part.style.width = `${size}px`;
            part.style.height = `${size}px`;
            part.style.animationDuration = `${Math.random() * 15 + 10}s`;
            part.style.animationDelay = `${Math.random() * 5}s`;
            // Give some parallax effect to particles too
            part.classList.add('ag-parallax');
            part.setAttribute('data-speed', (Math.random() * 0.5 + 0.1).toFixed(2));
            part.setAttribute('data-depth', (Math.random() * 0.5).toFixed(2));
            particleContainer.appendChild(part);
        }
    }
    
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let cursorGlowX = window.innerWidth / 2;
    let cursorGlowY = window.innerHeight / 2;
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        // Antigravity Parallax with Inertia (Lerp)
        const agElements = document.querySelectorAll('.ag-parallax');
        const lerp = (start, end, factor) => start + (end - start) * factor;

        // Idle float variables
        let time = 0;
        
        // WebGL wrapper hover physics variables
        const webglWrapper = document.getElementById('webglContainer');
        let webglCurrX = window.innerWidth / 2;
        let webglCurrY = window.innerHeight / 2;
        
        
        // ================= WebGL Neon Singularity Setup =================
        const canvas = document.getElementById('singularityCanvas');
        if (canvas && typeof THREE !== 'undefined') {
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setSize(600, 600);
            renderer.setPixelRatio(window.devicePixelRatio);
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
            camera.position.z = 250;
            
            const particleCount = 3000;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const basePositions = new Float32Array(particleCount * 3);
            
            const neonColors = [
                new THREE.Color(0x00f3ff), // Neon Cyan
                new THREE.Color(0xbd00ff), // Neon Purple
                new THREE.Color(0x0066ff), // Neon Blue
            ];
            
            for (let i = 0; i < particleCount; i++) {
                // Perfect Spherical distribution via Fibonacci algorithm
                const r = 75; // Decreased radius for a smaller perfect bubble
                const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
                const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                
                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);
                
                positions[i*3] = x;
                positions[i*3+1] = y;
                positions[i*3+2] = z;
                
                basePositions[i*3] = x;
                basePositions[i*3+1] = y;
                basePositions[i*3+2] = z;
                
                // Mix colors based on random vibrant neon selection
                const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
                colors[i*3] = randomColor.r;
                colors[i*3+1] = randomColor.g;
                colors[i*3+2] = randomColor.b;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 2.0, // slightly smaller points for a crisp looking sphere
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });
            
            const particleMesh = new THREE.Points(geometry, material);
            scene.add(particleMesh);
            
            canvas.classList.add('loaded'); // fade in softly
            
            // Expose vars for animation loop
            window.singularityMesh = particleMesh;
            window.singularityBasePos = basePositions;
            window.singularityRenderer = renderer;
            window.singularityScene = scene;
            window.singularityCamera = camera;
        }
        function agAnimationLoop() {
            // Cursor — dot is instant, glow trails via CSS transition
            if (cursorGlow && cursorDot) {
                // Dot snaps instantly to mouse — perfectly accurate
                cursorDot.style.left = `${targetX}px`;
                cursorDot.style.top = `${targetY}px`;
                // Glow follows same position — CSS transition creates trail effect
                cursorGlow.style.left = `${targetX}px`;
                cursorGlow.style.top = `${targetY}px`;
            }

            // Background Elements Inertia Parallax
            agElements.forEach(el => {
                if (!el.currX) el.currX = window.innerWidth / 2;
                if (!el.currY) el.currY = window.innerHeight / 2;
                
                el.currX = lerp(el.currX, targetX, 0.05);
                el.currY = lerp(el.currY, targetY, 0.05);
                
                const speed = parseFloat(el.getAttribute('data-speed')) || 1;
                const depth = parseFloat(el.getAttribute('data-depth')) || 0.5;
                const moveModifier = (2 - depth) * speed;
                
                const x = ((el.currX - window.innerWidth / 2) * moveModifier) / 80;
                const y = ((el.currY - window.innerHeight / 2) * moveModifier) / 80;
                
                const currentTransform = el.style.transform;
                let rotateMatch = currentTransform ? currentTransform.match(/rotate\([^)]+\)/) : null;
                const rotateStr = rotateMatch ? rotateMatch[0] : '';
                
                el.style.transform = `translate(${x}px, ${y}px) ${rotateStr}`;
            });
            
            // Profile photo stays static — no mouse tilt or movement
            if (webglWrapper) {
                webglWrapper.style.transform = 'none';
            }

            // Neon Singularity WebGL Physics
            if (window.singularityMesh) {
                const mesh = window.singularityMesh;
                const positions = mesh.geometry.attributes.position.array;
                const base = window.singularityBasePos;
                
                time += 0.02; // Advance global time
                
                // Rotate sphere slowly overall
                mesh.rotation.y += 0.002;
                mesh.rotation.x += 0.001;
                
                // Mouse interaction mapped to local 3D space
                const ndcX = ((targetX - window.innerWidth / 2) / (window.innerWidth / 2));
                const ndcY = -((targetY - window.innerHeight / 2) / (window.innerHeight / 2));
                
                const pullX = ndcX * 150;
                const pullY = ndcY * 150;
                
                // Enforce perfect circle rigidly (no waves)
                for(let i = 0; i < positions.length; i += 3) {
                    positions[i] = base[i];
                    positions[i+1] = base[i+1];
                    positions[i+2] = base[i+2];
                }
                
                mesh.geometry.attributes.position.needsUpdate = true;
                window.singularityRenderer.render(window.singularityScene, window.singularityCamera);
            }



            requestAnimationFrame(agAnimationLoop);
        }
        agAnimationLoop();

        // ================= Animated Neural Network Background =================
        const nnCanvas = document.getElementById('neural-net-bg');
        if (nnCanvas) {
            const ctx = nnCanvas.getContext('2d');
            let nnW, nnH;
            function resizeNN() {
                nnW = window.innerWidth; nnH = window.innerHeight;
                nnCanvas.width = nnW; nnCanvas.height = nnH;
            }
            window.addEventListener('resize', resizeNN);
            resizeNN();

            const neonColors = [
                { r:0, g:200, b:255 },   // Bright Cyan
                { r:130, g:0, b:255 },    // Vivid Purple
                { r:0, g:120, b:255 },    // Electric Blue
                { r:0, g:255, b:200 },    // Neon Teal
                { r:200, g:0, b:255 },    // Hot Purple
            ];

            // Denser node count for richer network
            const nodeCount = 150;
            const maxDist = 190;
            const nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: Math.random() * nnW,
                    y: Math.random() * nnH,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2.2 + 0.8,
                    color: neonColors[Math.floor(Math.random() * neonColors.length)],
                    pulse: Math.random() * Math.PI * 2  // phase offset for pulsing
                });
            }

            let nnMouseX = nnW / 2, nnMouseY = nnH / 2;
            let nnTime = 0;

            function drawNN() {
                ctx.clearRect(0, 0, nnW, nnH);
                nnTime += 0.01;

                // Smooth mouse tracking
                nnMouseX = nnMouseX + (targetX - nnMouseX) * 0.05;
                nnMouseY = nnMouseY + (targetY - nnMouseY) * 0.05;

                // Draw connections first (behind nodes)
                for (let i = 0; i < nodes.length; i++) {
                    const n = nodes[i];
                    for (let j = i + 1; j < nodes.length; j++) {
                        const n2 = nodes[j];
                        const dx = n.x - n2.x, dy = n.y - n2.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < maxDist) {
                            const op = Math.pow(1 - d / maxDist, 1.5) * 0.55;
                            // Gradient line between two node colors
                            const grad = ctx.createLinearGradient(n.x, n.y, n2.x, n2.y);
                            grad.addColorStop(0, `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${op})`);
                            grad.addColorStop(1, `rgba(${n2.color.r}, ${n2.color.g}, ${n2.color.b}, ${op})`);
                            ctx.beginPath();
                            ctx.moveTo(n.x, n.y);
                            ctx.lineTo(n2.x, n2.y);
                            ctx.strokeStyle = grad;
                            ctx.lineWidth = 1.0;
                            ctx.stroke();
                        }
                    }
                }

                // Update and draw nodes
                for (let i = 0; i < nodes.length; i++) {
                    const n = nodes[i];

                    // Drift movement
                    n.x += n.vx;
                    n.y += n.vy;

                    // Cursor repulsion — nodes gently push away from mouse
                    const mdx = nnMouseX - n.x, mdy = nnMouseY - n.y;
                    const md = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (md < 200) {
                        const force = (200 - md) / 200 * 0.8;
                        n.x -= (mdx / md) * force;
                        n.y -= (mdy / md) * force;
                    }

                    // Wrap around edges
                    if (n.x < -20) n.x = nnW + 20;
                    if (n.x > nnW + 20) n.x = -20;
                    if (n.y < -20) n.y = nnH + 20;
                    if (n.y > nnH + 20) n.y = -20;

                    // Pulsing radius for living feel
                    const pulseScale = 1 + Math.sin(nnTime * 2 + n.pulse) * 0.3;
                    const drawRadius = n.radius * pulseScale;

                    // Draw outer glow halo
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, drawRadius * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0.06)`;
                    ctx.fill();

                    // Draw node core with strong glow
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, drawRadius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0.9)`;
                    ctx.shadowColor = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0.6)`;
                    ctx.shadowBlur = 14;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                requestAnimationFrame(drawNN);
            }
            drawNN();
        }

        // Cursor hover states for interactive elements
        const interactives = document.querySelectorAll('a, button, .glass-card, .skill-item, .glass-list-item, .glass-project-card, .nav-link');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Cursor text state for input fields
        const textFields = document.querySelectorAll('input, textarea');
        textFields.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.remove('cursor-hover');
                document.body.classList.add('cursor-text');
            });
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
        });

        // Cursor click pulse effect
        document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
        document.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-click');
            // Spawn a click ripple
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: fixed; left: ${targetX}px; top: ${targetY}px;
                width: 10px; height: 10px; border-radius: 50%;
                border: 2px solid rgba(189, 0, 255, 0.6);
                transform: translate(-50%, -50%) scale(1);
                pointer-events: none; z-index: 99998;
                animation: cursorRipple 0.6s ease-out forwards;
            `;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        // Cursor trailing particles on move
        let lastTrailTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTrailTime < 50) return; // throttle
            lastTrailTime = now;
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed; left: ${e.clientX}px; top: ${e.clientY}px;
                width: 4px; height: 4px; border-radius: 50%;
                background: rgba(0, 243, 255, 0.6);
                box-shadow: 0 0 6px rgba(0, 243, 255, 0.4);
                transform: translate(-50%, -50%);
                pointer-events: none; z-index: 99998;
                transition: all 0.5s ease-out;
            `;
            document.body.appendChild(trail);
            requestAnimationFrame(() => {
                trail.style.opacity = '0';
                trail.style.width = '0px';
                trail.style.height = '0px';
            });
            setTimeout(() => trail.remove(), 500);
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
            const targetId = this.getAttribute('href');
            if (targetId === '#' || this.id === 'resumeBtn') return; // skip resume btn
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // 8. Resume Options Modal
    const resumeBtn = document.getElementById('resumeBtn');
    const resumeModal = document.getElementById('resumeModal');
    const resumeModalClose = document.getElementById('resumeModalClose');

    if (resumeBtn && resumeModal) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.add('active');
        });

        resumeModalClose.addEventListener('click', () => {
            resumeModal.classList.remove('active');
        });

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
            }
        });
    }
});
