// LightMFA GSAP Animations
// Professional entrance animations and micro-interactions

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Create master timeline
    const masterTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // === HERO SECTION ANIMATIONS ===

    // Matrix background fade in
    gsap.from('.matrix-bg', {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut'
    });

    // Hero image dramatic entrance
    gsap.from('.hero-image', {
        opacity: 0,
        scale: 0.5,
        y: 100,
        rotation: -10,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.3
    });

    // Pulsing glow effect on hero circles
    gsap.to('.hero-section::before, .hero-section::after', {
        scale: 1.1,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Stat cards staggered entrance
    gsap.from('.stat-card', {
        opacity: 0,
        y: 50,
        scale: 0.8,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.8
    });

    // Continuous floating animation for stat cards
    gsap.to('.stat-card', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
        delay: 1.5
    });

    // === FORM SECTION ANIMATIONS ===

    // Brand logo entrance with bounce
    gsap.from('.brand-icon', {
        opacity: 0,
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.2
    });

    // Brand text reveal
    gsap.from('.brand h1', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5
    });

    gsap.from('.brand p', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.7
    });

    // Container slide and fade
    gsap.from('.container', {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power2.out',
        delay: 0.4
    });

    // Form elements staggered reveal
    gsap.from('.form-group', {
        opacity: 0,
        x: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.8
    });

    // Buttons pop in - use fromTo to ensure final visibility
    gsap.fromTo('.btn',
        {
            opacity: 0,
            scale: 0.8
        },
        {
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: 'back.out(2)',
            delay: 1.2,
            onComplete: function () {
                // Ensure all buttons are visible after animation
                document.querySelectorAll('.btn').forEach(btn => {
                    btn.style.opacity = '1';
                    btn.style.visibility = 'visible';
                });
            }
        }
    );

    // === MFA OPTIONS ANIMATIONS ===

    gsap.from('.mfa-btn', {
        opacity: 0,
        x: -50,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.5
    });

    // === HEADING ANIMATIONS ===

    // Animate h2 with text reveal effect
    const h2Elements = document.querySelectorAll('h2');
    h2Elements.forEach(h2 => {
        gsap.from(h2, {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.3
        });
    });

    // === INTERACTIVE HOVER EFFECTS ===

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // MFA button hover
    const mfaBtns = document.querySelectorAll('.mfa-btn');
    mfaBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                x: 10,
                boxShadow: '0 0 30px rgba(124, 58, 237, 0.5)',
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(btn.querySelector('.icon'), {
                scale: 1.2,
                rotation: 10,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                boxShadow: 'none',
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(btn.querySelector('.icon'), {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(input.parentElement, {
                y: -2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(input.parentElement, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // === ALERT ANIMATIONS ===

    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        gsap.from(alert, {
            opacity: 0,
            x: -100,
            duration: 0.5,
            ease: 'power3.out'
        });
    });

    // === VIDEO ELEMENT ANIMATION ===

    const video = document.querySelector('video');
    if (video) {
        gsap.from(video, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.5
        });
    }

    // === QR CODE ANIMATION ===

    const qrCode = document.querySelector('img[alt="QR Code"]');
    if (qrCode) {
        gsap.from(qrCode, {
            opacity: 0,
            scale: 0,
            rotation: -180,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.5
        });
    }

    // === SOCIAL ICONS ANIMATION ===

    gsap.from('.social-icon', {
        opacity: 0,
        y: 20,
        scale: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(2)',
        delay: 1.5
    });

    // Social icon hover
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                y: -5,
                scale: 1.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // === MATRIX RAIN EFFECT (Canvas) ===

    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,./<>?~`アイウエオカキクケコサシスセソ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(13, 13, 26, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#10b981';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.1})`;
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 50);
    }

    console.log('🚀 GSAP Animations initialized!');
});
