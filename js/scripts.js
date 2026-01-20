/*!
    Title: Dev Portfolio Template
    Version: 1.2.3
    Author: Ryan Fitzgerald
    Repo: https://github.com/RyanFitzgerald/devportfolio-template
    Issues: https://github.com/RyanFitzgerald/devportfolio-template/issues

    Description: This file contains all the scripts associated with the single-page
    portfolio website.
*/
(function () {
    'use strict';

    // Remove no-js class
    document.documentElement.classList.remove('no-js');

    // Helper to select all
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /* 
       ------------------------------------------------
       2. Theme Toggle (Dark Mode)
       ------------------------------------------------
    */
    const themeToggle = select('#theme-toggle');
    const html = document.documentElement;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        html.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark' && icon) {
            icon.classList.remove('fa-moon-o');
            icon.classList.add('fa-sun-o');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (html.getAttribute('data-theme') === 'dark') {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (icon) {
                    icon.classList.remove('fa-sun-o');
                    icon.classList.add('fa-moon-o');
                }
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (icon) {
                    icon.classList.remove('fa-moon-o');
                    icon.classList.add('fa-sun-o');
                }
            }
        });
    }

    /* 
       ------------------------------------------------
       3. Hero Animation (Canvas Particles) - Enhanced Visibility
       ------------------------------------------------
    */
    const leadSection = select('#lead');
    if (leadSection) {
        const canvas = document.createElement('canvas');
        canvas.id = 'hero-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0'; // Behind content but above background image
        canvas.style.pointerEvents = 'none'; // Allow clicks through
        leadSection.insertBefore(canvas, leadSection.firstChild);

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const initCanvas = () => {
            width = canvas.width = leadSection.offsetWidth;
            height = canvas.height = leadSection.offsetHeight;
        };

        const createParticles = () => {
            particles = [];
            const particleCount = Math.floor(width / 5); // Slightly reduced density for larger particles to avoid clutter
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 3, // Increased size: 2px to 5px
                    opacity: Math.random() * 0.3 + 0.7 // Increased opacity: 0.3 to 0.7
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, width, height);

            // Check theme for particle color
            const isDark = html.getAttribute('data-theme') === 'dark';
            const color = '255, 255, 255'; // Always white/light on the hero bg which is dark/image

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            });

            // Connect particles
            particles.forEach((p1, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) { // Increased connection distance
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${color}, ${1 * (1 - dist / 100)})`; // Increased line opacity
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(drawParticles);
        };

        initCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            initCanvas();
            createParticles();
        });
    }


    /* 
       ------------------------------------------------
       4. Navigation & Scrolling
       ------------------------------------------------
    */
    // Animate to section when nav is clicked
    const links = select('header a', true);
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('no-scroll')) return;

            e.preventDefault();
            const heading = select(link.getAttribute('href'));
            if (heading) {
                const headerOffset = 0;
                const elementPosition = heading.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Hide the menu once clicked if mobile
                const header = select('header');
                if (header.classList.contains('active')) {
                    header.classList.remove('active');
                    document.body.classList.remove('active');
                }
            }
        });
    });

    // Scroll to top
    const toTop = select('#to-top');
    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll to first element
    const leadDown = select('#lead-down span');
    if (leadDown) {
        leadDown.addEventListener('click', () => {
            const lead = select('#lead');
            const nextElement = lead.nextElementSibling;
            if (nextElement) {
                const offsetPosition = nextElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Open mobile menu
    const menuOpen = select('#mobile-menu-open');
    if (menuOpen) {
        menuOpen.addEventListener('click', () => {
            select('header').classList.add('active');
            document.body.classList.add('active');
        });
    }

    // Close mobile menu
    const menuClose = select('#mobile-menu-close');
    if (menuClose) {
        menuClose.addEventListener('click', () => {
            select('header').classList.remove('active');
            document.body.classList.remove('active');
        });
    }

    /* 
       ------------------------------------------------
       5. Timeline & Collapsible Logic
       ------------------------------------------------
    */
    const createTimeline = (timelineId) => {
        const timeline = select(timelineId);
        if (!timeline) return;

        // Add Expand/Collapse All Button
        const controls = document.createElement('div');
        controls.className = 'timeline-controls';
        controls.style.textAlign = 'right';
        controls.style.marginBottom = '20px';
        controls.style.maxWidth = '1000px';
        controls.style.margin = '0 auto 20px auto';

        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.textContent = 'Collapse All';
        toggleAllBtn.className = 'btn-rounded-white';
        toggleAllBtn.style.padding = '8px 15px';
        toggleAllBtn.style.fontSize = '0.8em';
        toggleAllBtn.style.color = 'var(--base-color)';
        toggleAllBtn.style.borderColor = 'var(--base-color)';

        // Handle Toggle All
        let allExpanded = true;
        toggleAllBtn.addEventListener('click', () => {
            const projects = timeline.querySelectorAll('.projects-list');
            const icons = timeline.querySelectorAll('.toggle-icon');

            if (allExpanded) {
                projects.forEach(p => p.style.display = 'none');
                icons.forEach(i => i.classList.replace('fa-angle-up', 'fa-angle-down'));
                toggleAllBtn.textContent = 'Expand All';
            } else {
                projects.forEach(p => p.style.display = 'flex');
                icons.forEach(i => i.classList.replace('fa-angle-down', 'fa-angle-up'));
                toggleAllBtn.textContent = 'Collapse All';
            }
            allExpanded = !allExpanded;
        });

        controls.appendChild(toggleAllBtn);
        timeline.parentNode.insertBefore(controls, timeline);

        // Process Timeline Items
        const children = select(`${timelineId} > div`, true);
        children.forEach(child => {
            const wrapperPoint = document.createElement('div');
            wrapperPoint.className = 'vtimeline-point';
            const wrapperBlock = document.createElement('div');
            wrapperBlock.className = 'vtimeline-block';

            child.parentNode.insertBefore(wrapperPoint, child);
            wrapperBlock.appendChild(child);
            wrapperPoint.appendChild(wrapperBlock);
            child.classList.add('vtimeline-content');

            const icon = document.createElement('div');
            icon.className = 'vtimeline-icon';
            icon.innerHTML = '<i class="fa fa-map-marker"></i>';
            wrapperPoint.insertBefore(icon, wrapperPoint.firstChild);

            const date = child.getAttribute('data-date');
            if (date) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'vtimeline-date';
                dateSpan.textContent = date;
                wrapperPoint.insertBefore(dateSpan, wrapperPoint.firstChild);
            }

            // Collapsible Logic for Individual Item
            const projectsList = child.querySelector('.projects-list');
            if (projectsList) {
                // Add toggle capability to header
                const header = child.querySelector('.company-header');
                if (header) {
                    header.style.cursor = 'pointer';
                    header.style.display = 'flex';
                    // header.style.justifyContent = 'space-between'; // Removed to keep text near logo

                    // Add icon
                    const toggleIcon = document.createElement('i');
                    toggleIcon.className = 'fa fa-angle-up toggle-icon'; // Default expanded
                    toggleIcon.style.fontSize = '1.5em';
                    toggleIcon.style.marginLeft = 'auto'; // Push icon to the right
                    header.appendChild(toggleIcon);

                    header.addEventListener('click', () => {
                        if (projectsList.style.display === 'none') {
                            projectsList.style.display = 'flex';
                            toggleIcon.classList.replace('fa-angle-down', 'fa-angle-up');
                        } else {
                            projectsList.style.display = 'none';
                            toggleIcon.classList.replace('fa-angle-up', 'fa-angle-down');
                        }
                    });
                }
            }
        });

        // Initial state: Start Collapsed
        toggleAllBtn.click();
    };

    createTimeline('#experience-timeline');
    createTimeline('#internship-timeline');

    // Load additional projects
    const viewMore = select('#view-more-projects');
    if (viewMore) {
        viewMore.addEventListener('click', (e) => {
            e.preventDefault();
            viewMore.style.display = 'none';
            const moreProjects = select('#more-projects');
            if (moreProjects) {
                moreProjects.style.display = 'block';
                moreProjects.style.opacity = 0;
                let opacity = 0;
                const timer = setInterval(() => {
                    if (opacity >= 1) {
                        clearInterval(timer);
                    }
                    moreProjects.style.opacity = opacity;
                    opacity += 0.1;
                }, 30);
            }
        });
    }

    /* 
       ------------------------------------------------
       6. Scroll Animations (Reveal)
       ------------------------------------------------
    */
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = select('.heading, .about-content, .experience-content, .project-item, .education-block, .project, .publication-card, .certification-card, .skills ul li, .contact-form', true);

    // Also add .reveal class to them dynamically or just observe them and toggle a class
    // "reveal" class in CSS will handle the initial state
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

})();
