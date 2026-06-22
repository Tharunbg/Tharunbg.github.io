// ============================================
// Portfolio Application - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Respect the user's motion preference for all programmatic scrolling.
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

// Mark all decorative Font Awesome icons as hidden from assistive tech.
function hideDecorativeIcons() {
    document.querySelectorAll('i.fa, i.fas, i.fab, i.far').forEach(icon => {
        if (!icon.hasAttribute('aria-hidden')) {
            icon.setAttribute('aria-hidden', 'true');
        }
    });
}

// Swap in locally-hosted company/institution logos. The on-brand monogram
// badge (.logo-fallback) ships in the markup and stays visible by default;
// .has-logo is added only once the image actually loads, so a missing or
// broken logo silently leaves the monogram in place.
function initLogos() {
    document.querySelectorAll('.logo-img[data-src]').forEach(img => {
        const src = img.getAttribute('data-src');
        const chip = img.closest('.logo-chip');
        if (!src || !chip) return;
        img.addEventListener('load', () => {
            if (img.naturalWidth > 2) chip.classList.add('has-logo');
        });
        img.addEventListener('error', () => { /* keep the monogram fallback */ });
        img.src = src;
    });
}

// ============================================
// Initialize Application
// ============================================
async function initializeApp() {
    try {
        // Load all data sections
        await Promise.all([
            loadSiteConfig(),
            loadNavigation(),
            loadHero(),
            loadAbout(),
            loadExperience(),
            loadSkills(),
            loadProjects(),
            loadEducation(),
            loadContact(),
            loadFooter()
        ]);

        // Initialize interactive features (after content has loaded so all
        // data-driven elements exist for observers / canvas sizing).
        initializeNavigation();
        initializeScrollEffects();
        initializeReveal();
        initializeCountUp();
        initNeuralCanvas();
        initializeBackToTop();
        initLogos();

        // Hide decorative icons rendered into the data-driven sections.
        hideDecorativeIcons();

        console.log('Portfolio loaded successfully!');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// ============================================
// Load Site Configuration
// ============================================
async function loadSiteConfig() {
    try {
        const response = await fetch('data/site-config.json');
        const data = await response.json();

        // Update meta tags
        document.title = data.title;
        document.querySelector('meta[name="description"]').setAttribute('content', data.description);
        document.querySelector('meta[name="keywords"]').setAttribute('content', data.keywords);
        document.querySelector('meta[name="author"]').setAttribute('content', data.author);
    } catch (error) {
        console.error('Error loading site config:', error);
    }
}

// ============================================
// Load Navigation
// ============================================
async function loadNavigation() {
    try {
        const response = await fetch('data/navigation.json');
        const data = await response.json();

        // Set brand name
        const brandElement = document.getElementById('nav-brand');
        if (brandElement) {
            brandElement.textContent = data.brand.name;
            brandElement.href = data.brand.href;
        }

        // Build navigation menu
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.innerHTML = data.menuItems.map(item => `
                <li>
                    <a href="${item.href}" class="nav-link">
                        <i class="${item.icon}"></i>
                        ${item.text}
                    </a>
                </li>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// ============================================
// Load Hero Section
// ============================================
async function loadHero() {
    try {
        const response = await fetch('data/hero.json');
        const data = await response.json();

        // Set text content
        document.getElementById('hero-greeting').textContent = data.greeting;
        document.getElementById('hero-name').innerHTML = `${data.name.split(' ')[0]} <span>${data.name.split(' ').slice(1).join(' ')}</span>`;
        document.getElementById('hero-title').textContent = data.title;
        document.getElementById('hero-tagline').textContent = data.tagline;
        document.getElementById('hero-summary').textContent = data.summary;

        // Render highlights
        const highlightsContainer = document.getElementById('hero-highlights');
        if (highlightsContainer && data.highlights) {
            highlightsContainer.innerHTML = data.highlights.map(highlight => `
                <div class="highlight-item">
                    <i class="${highlight.icon}" style="color: ${highlight.color}"></i>
                    <span>${highlight.text}</span>
                </div>
            `).join('');
        }

        // Render CTA buttons
        const ctaContainer = document.getElementById('hero-cta');
        if (ctaContainer && data.cta && data.cta.buttons) {
            ctaContainer.innerHTML = data.cta.buttons.map(button => `
                <a href="${button.href}" class="btn btn-${button.type}">
                    ${button.icon ? `<i class="${button.icon}"></i>` : ''}
                    ${button.text}
                </a>
            `).join('');
        }

        // Render social links
        const socialContainer = document.getElementById('hero-social');
        if (socialContainer && data.socialLinks) {
            socialContainer.innerHTML = data.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${link.platform}">
                    <i class="${link.icon}"></i>
                </a>
            `).join('');
        }

        // Render scroll indicator
        const scrollIndicator = document.getElementById('scroll-indicator');
        if (scrollIndicator && data.scrollIndicator) {
            scrollIndicator.innerHTML = `
                <span>${data.scrollIndicator.text}</span>
                <i class="${data.scrollIndicator.icon}"></i>
            `;
        }
    } catch (error) {
        console.error('Error loading hero section:', error);
    }
}

// ============================================
// Load About Section
// ============================================
async function loadAbout() {
    try {
        const response = await fetch('data/about.json');
        const data = await response.json();

        // Set section title
        document.getElementById('about-title').textContent = data.sectionTitle;

        // Render paragraphs
        const textContainer = document.getElementById('about-text');
        if (textContainer && data.paragraphs) {
            textContainer.innerHTML = data.paragraphs.map(paragraph => `
                <p>${paragraph}</p>
            `).join('');
        }

        // Render statistics
        const statsContainer = document.getElementById('about-stats');
        if (statsContainer && data.statistics) {
            statsContainer.innerHTML = data.statistics.map(stat => `
                <div class="stat-card">
                    <i class="${stat.icon}" style="color: ${stat.color}"></i>
                    <span class="stat-value">${stat.value}</span>
                    <span class="stat-label">${stat.label}</span>
                </div>
            `).join('');
        }

        // Render download CV button
        const actionsContainer = document.getElementById('about-actions');
        if (actionsContainer && data.downloadCV) {
            actionsContainer.innerHTML = `
                <a href="${data.downloadCV.href}" download class="btn btn-primary">
                    <i class="${data.downloadCV.icon}"></i>
                    ${data.downloadCV.text}
                </a>
            `;
        }
    } catch (error) {
        console.error('Error loading about section:', error);
    }
}

// ============================================
// Load Experience Section
// ============================================
async function loadExperience() {
    try {
        const response = await fetch('data/experience.json');
        const data = await response.json();

        // Set section title
        document.getElementById('experience-title').textContent = data.sectionTitle;

        // Render timeline
        const timelineContainer = document.getElementById('experience-timeline');
        if (timelineContainer && data.experiences) {
            timelineContainer.innerHTML = data.experiences.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-icon logo-chip" style="background: ${exp.color}">
                        <span class="logo-fallback">${exp.monogram || ''}</span>
                        ${exp.logo ? `<img class="logo-img" alt="${exp.company} logo" data-src="${exp.logo}">` : ''}
                    </div>
                    <div class="timeline-content">
                        <div class="experience-header">
                            <h3 class="experience-title">${exp.title}</h3>
                            <p class="experience-company">
                                ${exp.company} ${exp.location ? `• ${exp.location}` : ''}
                            </p>
                            <p class="experience-period">
                                <i class="fas fa-calendar-alt"></i>
                                ${exp.period}
                                ${exp.type ? `<span class="experience-type">• ${exp.type}</span>` : ''}
                            </p>
                        </div>
                        ${exp.responsibilities && exp.responsibilities.length ? `
                            <ul class="experience-responsibilities">
                                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        ` : `<p class="experience-description">${exp.description}</p>`}
                        ${exp.technologies ? `
                            <div class="experience-tech">
                                ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading experience section:', error);
    }
}

// ============================================
// Load Skills Section
// ============================================
async function loadSkills() {
    try {
        const response = await fetch('data/skills.json');
        const data = await response.json();

        // Set section title
        document.getElementById('skills-title').textContent = data.sectionTitle;

        // Render skill categories
        const skillsGrid = document.getElementById('skills-grid');
        if (skillsGrid && data.categories) {
            skillsGrid.innerHTML = data.categories.map(category => `
                <div class="skill-category">
                    <div class="skill-category-header">
                        <div class="skill-category-icon" style="background: ${category.color}20; color: ${category.color}">
                            <i class="${category.icon}"></i>
                        </div>
                        <h3 class="skill-category-title">${category.category}</h3>
                    </div>
                    <div class="skill-list">
                        ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading skills section:', error);
    }
}

// ============================================
// Load Projects Section
// ============================================
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();

        // Set section title
        document.getElementById('projects-title').textContent = data.sectionTitle;

        // Render projects
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid && data.projects) {
            // "Project dossiers": a wide featured showcase + a grid of panel cards.
            const hasFeatured = data.projects.some(p => p.featured === true);
            const featured = data.projects.find((p, i) => hasFeatured ? p.featured === true : i === 0);
            const rest = data.projects.filter(p => p !== featured);

            const ghUrl = (p) => (p.links && p.links.github) || p.github || '#';
            const repoName = (p) => (ghUrl(p).split('/').filter(Boolean).pop() || 'repository');
            const techChips = (p) => p.technologies
                ? `<div class="project-tags">${p.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>`
                : '';
            const metricBlock = (p) => p.stats
                ? `<div class="project-stats">${Object.entries(p.stats).map(([k, v]) => `<div class="project-stat"><span class="project-stat-value">${v}</span><span class="project-stat-label">${k}</span></div>`).join('')}</div>`
                : '';

            const featuredHTML = featured ? `
                <a class="project-feature" href="${ghUrl(featured)}" target="_blank" rel="noopener noreferrer" aria-label="${featured.title} — view code on GitHub">
                    <div class="project-feature__body">
                        <span class="project-eyebrow"><span class="project-eyebrow__dot"></span>Featured${featured.category ? ` · ${featured.category}` : ''}</span>
                        <h3 class="project-feature__title">${featured.title}</h3>
                        <p class="project-feature__desc">${featured.longDescription || featured.description}</p>
                        ${techChips(featured)}
                        <span class="project-feature__cta">View code <i class="fas fa-arrow-right"></i></span>
                    </div>
                    <div class="project-feature__visual" aria-hidden="true">
                        <div class="project-feature__icon"><i class="${featured.icon}"></i></div>
                        ${metricBlock(featured)}
                    </div>
                </a>` : '';

            const panelsHTML = rest.map(p => `
                <a class="project-panel" href="${ghUrl(p)}" target="_blank" rel="noopener noreferrer" aria-label="${p.title} — view code on GitHub">
                    <div class="project-panel__bar">
                        <span class="project-panel__dot"></span>
                        <span class="project-panel__file">${repoName(p)}</span>
                        <i class="fas fa-arrow-right project-panel__arrow"></i>
                    </div>
                    <div class="project-panel__head">
                        <span class="project-panel__icon" style="color: ${p.color}"><i class="${p.icon}"></i></span>
                        <h3 class="project-panel__title">${p.title}</h3>
                    </div>
                    <p class="project-panel__desc">${p.description}</p>
                    ${p.stats ? `<div class="project-panel__metrics">${Object.entries(p.stats).slice(0, 3).map(([k, v]) => `<span class="pm"><b>${v}</b> ${k}</span>`).join('')}</div>` : ''}
                    ${techChips(p)}
                </a>`).join('');

            projectsGrid.innerHTML = featuredHTML + `<div class="projects-rest">${panelsHTML}</div>`;
        }
    } catch (error) {
        console.error('Error loading projects section:', error);
    }
}

// ============================================
// Load Education Section
// ============================================
async function loadEducation() {
    try {
        const response = await fetch('data/education.json');
        const data = await response.json();

        // Set section title
        document.getElementById('education-title').textContent = data.sectionTitle;

        // Render education items
        const educationGrid = document.getElementById('education-grid');
        if (educationGrid && data.education) {
            educationGrid.innerHTML = data.education.map(edu => `
                <div class="education-card">
                    <div class="education-icon logo-chip" style="background: ${edu.color}20; color: ${edu.color}">
                        <span class="logo-fallback">${edu.monogram || ''}</span>
                        ${edu.logo ? `<img class="logo-img" alt="${edu.institution} logo" data-src="${edu.logo}">` : ''}
                    </div>
                    <h3 class="education-degree">${edu.degree}</h3>
                    <p class="education-institution">${edu.institution}</p>
                    <p class="education-period">${edu.period}</p>
                    <p class="education-description">${edu.description}</p>
                    ${edu.achievements ? `
                        <ul class="education-achievements">
                            ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
        }

        // Set certifications title
        document.getElementById('certifications-title').textContent = data.certificationsTitle;

        // Render certifications
        const certificationsGrid = document.getElementById('certifications-grid');
        if (certificationsGrid && data.certifications) {
            certificationsGrid.innerHTML = data.certifications.map(cert => `
                <div class="certification-card">
                    <div class="certification-icon" style="color: ${cert.color}">
                        <i class="${cert.icon}"></i>
                    </div>
                    <h4 class="certification-title">${cert.title}</h4>
                    <p class="certification-issuer">${cert.issuer}</p>
                    <p class="certification-date">${cert.date}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading education section:', error);
    }
}

// ============================================
// Load Contact Section
// ============================================
async function loadContact() {
    try {
        const response = await fetch('data/contact.json');
        const data = await response.json();

        // Set section title and subtitle
        document.getElementById('contact-title').textContent = data.sectionTitle;
        document.getElementById('contact-subtitle').textContent = data.subtitle;

        // Render contact info
        const contactInfoContainer = document.getElementById('contact-info');
        if (contactInfoContainer && data.contactInfo) {
            contactInfoContainer.innerHTML = data.contactInfo.map(info => `
                <a href="${info.href}" class="contact-info-item" ${info.type !== 'location' ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                    <div class="contact-icon" style="background: ${info.color}20; color: ${info.color}">
                        <i class="${info.icon}"></i>
                    </div>
                    <div class="contact-info-content">
                        <span class="contact-info-label">${info.label}</span>
                        <p>${info.value}</p>
                    </div>
                </a>
            `).join('');
        }

        // Render contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm && data.form) {
            contactForm.action = data.form.action;
            contactForm.method = data.form.method;

            contactForm.innerHTML = data.form.fields.map(field => `
                <div class="form-group">
                    <label for="${field.name}">
                        <i class="${field.icon}"></i>
                        ${field.label}
                    </label>
                    ${field.type === 'textarea' ? `
                        <textarea
                            id="${field.name}"
                            name="${field.name}"
                            placeholder="${field.placeholder}"
                            ${field.required ? 'required' : ''}
                            rows="${field.rows || 5}"
                        ></textarea>
                    ` : `
                        <input
                            type="${field.type}"
                            id="${field.name}"
                            name="${field.name}"
                            placeholder="${field.placeholder}"
                            ${field.required ? 'required' : ''}
                        />
                    `}
                </div>
            `).join('') + `
                <button type="submit" class="form-submit">
                    <i class="${data.form.submitIcon}"></i>
                    ${data.form.submitText}
                </button>
                <div class="form-message"></div>
            `;

            // Handle form submission
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formMessage = contactForm.querySelector('.form-message');
                const submitButton = contactForm.querySelector('.form-submit');

                try {
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                    const formData = new FormData(contactForm);
                    const response = await fetch(contactForm.action, {
                        method: contactForm.method,
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        formMessage.textContent = data.form.successMessage;
                        formMessage.className = 'form-message success';
                        formMessage.style.display = 'block';
                        contactForm.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    formMessage.textContent = data.form.errorMessage;
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                } finally {
                    submitButton.disabled = false;
                    submitButton.innerHTML = `<i class="${data.form.submitIcon}"></i> ${data.form.submitText}`;
                }
            });
        }

        // Render social media links
        const contactSocial = document.getElementById('contact-social');
        if (contactSocial && data.socialMedia) {
            contactSocial.innerHTML = data.socialMedia.map(social => `
                <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${social.platform}">
                    <i class="${social.icon}"></i>
                </a>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading contact section:', error);
    }
}

// ============================================
// Load Footer
// ============================================
async function loadFooter() {
    try {
        const response = await fetch('data/footer.json');
        const data = await response.json();

        // Set tagline
        const taglineElement = document.getElementById('footer-tagline');
        if (taglineElement) {
            taglineElement.textContent = data.tagline;
        }

        // Render social links
        const footerSocial = document.getElementById('footer-social');
        if (footerSocial && data.socialLinks) {
            footerSocial.innerHTML = data.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${link.platform}">
                    <i class="${link.icon}"></i>
                </a>
            `).join('');
        }

        // Set copyright
        const copyrightElement = document.getElementById('footer-copyright');
        if (copyrightElement) {
            copyrightElement.textContent = data.copyright.text;
        }

        // Render footer links
        const footerLinks = document.getElementById('footer-links');
        if (footerLinks && data.links) {
            footerLinks.innerHTML = data.links.map(link => `
                <a href="${link.href}">${link.text}</a>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// ============================================
// Initialize Navigation
// ============================================
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: scrollBehavior()
                });
            }
        });
    });
}

// ============================================
// Initialize Scroll Effects
// ============================================
function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollProgress = document.getElementById('scroll-progress');

    // --- ONE rAF-guarded scroll handler: navbar 'scrolled' + scroll progress ---
    let ticking = false;

    const onScrollFrame = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

        // Navbar elevation state.
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Top scroll-progress bar fill.
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScrollFrame);
        }
    }, { passive: true });

    // Keep progress accurate when the layout height changes.
    window.addEventListener('resize', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScrollFrame);
        }
    }, { passive: true });

    // Run once on load to set initial navbar + progress state.
    onScrollFrame();

    // --- Active-link highlighting via IntersectionObserver (no layout reads on scroll) ---
    const setActiveLink = (id) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    };

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.getAttribute('id'));
                }
            });
        }, {
            // Trigger when a section crosses the upper portion of the viewport.
            rootMargin: '-40% 0px -55% 0px',
            threshold: 0
        });

        sections.forEach(section => sectionObserver.observe(section));
    }
}

// ============================================
// Initialize Reveal (sections + cards + timeline items)
// ============================================
// Adds class "in-view" to reveal targets once they scroll into view. CSS owns
// the hidden initial state and the visible/animated .in-view state. Under
// reduced motion (or without observer support) everything is shown immediately.
function initializeReveal() {
    const revealSelector = [
        '.section',
        '.stat-card',
        '.timeline-item',
        '.skill-category',
        '.project-feature',
        '.project-panel',
        '.education-card',
        '.certification-card'
    ].join(', ');

    const revealElements = document.querySelectorAll(revealSelector);
    if (!revealElements.length) return;

    // Reduced motion or no IntersectionObserver -> reveal everything now.
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('in-view'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -120px 0px',
        threshold: 0
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
// Initialize Count-Up (metric values)
// ============================================
// Animates numeric values inside .stat-value and .project-stat-value from 0 to
// the parsed target when they scroll into view (once). Preserves any prefix /
// suffix and thousands separators ("+", "%", "K+", "15,000+"). Non-numeric
// values (e.g. "sub-second") are left untouched. Reduced motion -> final value
// immediately.
function initializeCountUp() {
    const targets = document.querySelectorAll('.stat-value, .project-stat-value');
    if (!targets.length) return;

    const reduced = prefersReducedMotion();

    const animateValue = (el) => {
        const raw = el.textContent.trim();

        // Find the first numeric run, allowing thousands separators and decimals.
        const match = raw.match(/[0-9][0-9,]*(?:\.[0-9]+)?/);
        if (!match) {
            // Non-numeric (e.g. "sub-second") -> leave as-is.
            return;
        }

        const numberStr = match[0];
        const prefix = raw.slice(0, match.index);
        const suffix = raw.slice(match.index + numberStr.length);

        const hadComma = numberStr.indexOf(',') !== -1;
        const decimals = (numberStr.split('.')[1] || '').length;
        const targetValue = parseFloat(numberStr.replace(/,/g, ''));

        if (!isFinite(targetValue)) return;

        const formatNumber = (value) => {
            let out = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
            if (hadComma) {
                const parts = out.split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                out = parts.join('.');
            }
            return out;
        };

        const setValue = (value) => {
            el.textContent = `${prefix}${formatNumber(value)}${suffix}`;
        };

        if (reduced) {
            setValue(targetValue);
            return;
        }

        const duration = 1600;
        const start = performance.now();
        // easeOutCubic for a snappy, decelerating count.
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const step = (now) => {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / duration);
            setValue(targetValue * ease(t));
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                setValue(targetValue);
            }
        };

        requestAnimationFrame(step);
    };

    // No observer support -> just set final values.
    if (!('IntersectionObserver' in window)) {
        targets.forEach(animateValue);
        return;
    }

    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0
    });

    targets.forEach(el => countObserver.observe(el));
}

// ============================================
// Initialize Neural Network Canvas (hero "Living Data" layer)
// ============================================
// Hand-written vanilla canvas: drifting nodes connected by lines when near, in
// blue / cyan with soft opacity and subtle mouse parallax. DPR-aware,
// resize-aware, rAF-driven. Pauses when the tab is hidden or the hero is out of
// view. Reduced motion -> draws ONE static frame and never animates.
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hero = canvas.closest('.hero-section') || canvas.parentElement;

    const COLOR_BLUE = '59, 130, 246';   // #3B82F6
    const COLOR_CYAN = '34, 211, 238';    // #22D3EE
    const MAX_LINK_DIST = 140;            // px (CSS space) for connecting lines
    const MAX_LINK_DIST_SQ = MAX_LINK_DIST * MAX_LINK_DIST;
    const MAX_NEIGHBORS = 6;              // cap line work per node

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let rafId = null;
    let running = false;
    let heroVisible = true;

    // Mouse parallax (CSS-space offset applied to drawing).
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    const reduced = prefersReducedMotion();

    const computeCount = () => {
        // Cap particle count by viewport area to keep things cheap.
        const area = width * height;
        const byArea = Math.round(area / 14000);
        return Math.max(40, Math.min(90, byArea));
    };

    const makeNode = () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
        cyan: Math.random() > 0.5
    });

    const buildNodes = () => {
        const count = computeCount();
        nodes = [];
        for (let i = 0; i < count; i++) nodes.push(makeNode());
    };

    const resize = () => {
        const rect = (hero || canvas).getBoundingClientRect();
        width = Math.max(1, Math.round(rect.width));
        height = Math.max(1, Math.round(rect.height));
        dpr = Math.min(2, window.devicePixelRatio || 1);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        buildNodes();
    };

    const draw = () => {
        // Smooth the parallax pointer toward its target.
        pointer.x += (pointer.tx - pointer.x) * 0.06;
        pointer.y += (pointer.ty - pointer.y) * 0.06;

        ctx.clearRect(0, 0, width, height);

        const ox = pointer.active ? pointer.x : 0;
        const oy = pointer.active ? pointer.y : 0;

        // Connecting lines (distance-based, capped neighbors).
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            let neighbors = 0;
            for (let j = i + 1; j < nodes.length && neighbors < MAX_NEIGHBORS; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < MAX_LINK_DIST_SQ) {
                    neighbors++;
                    const alpha = (1 - distSq / MAX_LINK_DIST_SQ) * 0.28;
                    ctx.strokeStyle = `rgba(${a.cyan ? COLOR_CYAN : COLOR_BLUE}, ${alpha.toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x + ox, a.y + oy);
                    ctx.lineTo(b.x + ox, b.y + oy);
                    ctx.stroke();
                }
            }
        }

        // Nodes.
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            ctx.beginPath();
            ctx.fillStyle = `rgba(${n.cyan ? COLOR_CYAN : COLOR_BLUE}, 0.7)`;
            ctx.arc(n.x + ox, n.y + oy, n.r, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const update = () => {
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0) { n.x = 0; n.vx *= -1; }
            else if (n.x > width) { n.x = width; n.vx *= -1; }
            if (n.y < 0) { n.y = 0; n.vy *= -1; }
            else if (n.y > height) { n.y = height; n.vy *= -1; }
        }
    };

    const tick = () => {
        if (!running) return;
        update();
        draw();
        rafId = requestAnimationFrame(tick);
    };

    const start = () => {
        if (running || reduced) return;
        if (document.hidden) return;
        running = true;
        rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
        running = false;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    // --- Build + initial paint ---
    resize();
    draw(); // one static frame regardless of motion preference

    // Reduced motion: static frame only, no animation, no listeners that animate.
    if (reduced) {
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { resize(); draw(); }, 150);
        }, { passive: true });
        return;
    }

    // --- Resize handling (debounced) ---
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            draw();
        }, 150);
    }, { passive: true });

    // --- Mouse parallax ---
    const onPointerMove = (e) => {
        const rect = (hero || canvas).getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        pointer.tx = relX * 28; // max ~28px parallax shift
        pointer.ty = relY * 28;
        pointer.active = true;
    };
    const onPointerLeave = () => {
        pointer.tx = 0;
        pointer.ty = 0;
    };
    (hero || window).addEventListener('mousemove', onPointerMove, { passive: true });
    (hero || window).addEventListener('mouseleave', onPointerLeave, { passive: true });

    // --- Pause when tab hidden ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        } else if (heroVisible) {
            start();
        }
    });

    // --- Pause when hero scrolled out of view ---
    if ('IntersectionObserver' in window && hero) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                heroVisible = entry.isIntersecting;
                if (heroVisible && !document.hidden) {
                    start();
                } else {
                    stop();
                }
            });
        }, { threshold: 0 });
        heroObserver.observe(hero);
    }

    // Kick off.
    start();
}

// ============================================
// Initialize Back to Top Button
// ============================================
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: scrollBehavior()
            });
        });
    }
}
