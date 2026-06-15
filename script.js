/* ============================================
   EWON LAW — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ---------- Mobile Menu ----------
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- Scroll Animations ----------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger children if they exist
                const children = entry.target.querySelectorAll('.pillar-card, .toxic-card, .manifestation-item, .timeline-item, .mirror-q, .story-card');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('visible');
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ---------- Story Card Accordion ----------
    document.querySelectorAll('.story-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.story-card');
            const isOpen = card.classList.contains('open');

            // Close all other cards
            document.querySelectorAll('.story-card.open').forEach(openCard => {
                if (openCard !== card) {
                    openCard.classList.remove('open');
                }
            });

            // Toggle current
            card.classList.toggle('open');

            // Smooth scroll into view if opening
            if (!isOpen) {
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });

    // ---------- SPA Routing ----------
    const pages = document.querySelectorAll('.page');
    const desktopLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function navigateTo(path, addToHistory = true) {
        // Find matching page
        let targetPage = document.querySelector(`.page[data-page="${path}"]`);
        
        // Default to home page if route not found
        if (!targetPage) {
            targetPage = document.querySelector('.page[data-page="/"]');
            path = '/';
        }

        // Hide all pages and show target page
        pages.forEach(page => {
            page.classList.remove('active');
        });
        targetPage.classList.add('active');

        // Reset contact form state if loading the contact page
        if (path === '/contact') {
            const form = document.getElementById('contactForm');
            const success = document.getElementById('successState');
            if (form) form.style.display = '';
            if (success) success.style.display = 'none';
        }

        // Update active class on nav links
        desktopLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile menu if open
        if (menuBtn && mobileMenu) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Scroll to top instantly
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Update history state
        if (addToHistory) {
            history.pushState({ path }, '', path);
        }

        // Trigger animations for elements on the active page
        const animateEls = targetPage.querySelectorAll('.animate-on-scroll');
        animateEls.forEach(el => {
            setTimeout(() => {
                el.classList.add('visible');
                const children = el.querySelectorAll('.pillar-card, .toxic-card, .manifestation-item, .timeline-item, .mirror-q, .story-card');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('visible');
                });
            }, 50);
        });
    }

    // Intercept clicks on data-route links
    document.addEventListener('click', (e) => {
        const routeLink = e.target.closest('a[data-route]');
        if (routeLink) {
            e.preventDefault();
            const path = routeLink.getAttribute('href');
            navigateTo(path);
        }
    });

    // Handle back/forward history navigation
    window.addEventListener('popstate', (e) => {
        const path = e.state ? e.state.path : window.location.pathname;
        navigateTo(path, false);
    });

    // Load initial route on startup
    const initialPath = window.location.pathname;
    navigateTo(initialPath, false);

    // ---------- Parallax on Hero Visual ----------
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroVisual.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.2}px))`;
                heroVisual.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }
        }, { passive: true });
    }

    // ---------- Cursor Glow Effect (Desktop) ----------
    if (window.innerWidth > 768) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(167, 139, 250, 0.04), transparent 70%);
            pointer-events: none;
            z-index: 1;
            transform: translate(-50%, -50%);
            transition: left 0.3s ease-out, top 0.3s ease-out;
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ---------- Contact Form Submission ----------
    const contactForm = document.getElementById('contactForm');
    const successState = document.getElementById('successState');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('.submit-text');
                if (btnText) btnText.textContent = 'Sending...';
            }

            setTimeout(() => {
                contactForm.style.display = 'none';
                if (successState) {
                    successState.style.display = 'block';
                    successState.classList.add('visible');
                }
                
                // Reset form values for future entries
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    const btnText = submitBtn.querySelector('.submit-text');
                    if (btnText) btnText.textContent = 'Send Message ⧫';
                }
            }, 1200);
        });
    }
});

