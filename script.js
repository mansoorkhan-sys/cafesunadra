// ==========================================
// 1. LENSIS SMOOTH SCROLLING
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// ==========================================
// 2. PRELOADER
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    
    gsap.to(preloader, {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            preloader.style.display = 'none';
            initHeroAnimations();
        }
    });
});

// ==========================================
// 3. CUSTOM CURSOR
// ==========================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
    
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out"
    });
});

const hoverTargets = document.querySelectorAll('a, button, .menu-item, .char-card, .gallery-item, .close-lightbox');
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursor.classList.add('hover-effect');
        cursorFollower.classList.add('hover-effect');
    });
    target.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover-effect');
        cursorFollower.classList.remove('hover-effect');
    });
});

// ==========================================
// 4. SCROLL PROGRESS BAR
// ==========================================
const progressBar = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// 5. BACKGROUND PARTICLES (CANVAS)
// ==========================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // Randomly assign neon blue or purple colors
        const colors = ['rgba(0, 240, 255, 0.7)', 'rgba(176, 38, 255, 0.7)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min(window.innerWidth / 15, 150); // Responsive amount
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ==========================================
// 6. GSAP ANIMATIONS
// ==========================================
gsap.registerPlugin(ScrollTrigger);

function initHeroAnimations() {
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      .fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
      .fromTo('.cta-btn', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, "-=0.4")
      .fromTo('.scroll-indicator', { y: 20, opacity: 0 }, { y: 0, opacity: 0.7, duration: 0.8 }, "-=0.2");
}

// Parallax for floating hero characters
gsap.utils.toArray('.char-float').forEach(char => {
    const speed = char.classList.contains('char-1') ? -0.1 : 
                  char.classList.contains('char-2') ? 0.2 : 
                  char.classList.contains('char-3') ? 0.1 : -0.2;
                  
    gsap.to(char, {
        y: () => -(window.innerHeight * speed),
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Gentle float animation independent of scroll
    gsap.to(char, {
        y: '+=20',
        duration: 2 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });
});

// About Section Animation Let features slide in
gsap.utils.toArray('.features-list li').forEach((item, index) => {
    gsap.to(item, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-grid",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        delay: index * 0.15
    });
});

// Characters Section Stagger Reveal
gsap.to('.char-card', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".characters",
        start: "top 75%",
    }
});

// Menu Items Reveal
gsap.to('.menu-item', {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".menu",
        start: "top 80%",
    }
});

// ==========================================
// 7. LIGHTBOX GALLERY
// ==========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightboxImg.src = item.src;
        lightbox.classList.add('active');
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
    }
});

// ==========================================
// 8. CONTACT FORM VALIDATION
// ==========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if(name && email && message) {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerText;
        
        submitBtn.innerText = "Transmitting...";
        
        // Simulate sending
        setTimeout(() => {
            submitBtn.innerText = "Message Sent!";
            submitBtn.style.borderColor = "var(--neon-blue)";
            submitBtn.style.color = "var(--neon-blue)";
            
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.border = "2px solid var(--neon-red)";
                submitBtn.style.color = "#fff";
            }, 3000);
        }, 1500);
    }
});
