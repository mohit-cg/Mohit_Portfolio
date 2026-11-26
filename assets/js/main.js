(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader with instant dismissal on DOMContentLoaded
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    let preloaderDismissed = false;
    const fadeOutPreloader = () => {
      if (preloaderDismissed) return;
      preloaderDismissed = true;
      preloader.classList.add('loaded');
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 350);
    };
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      setTimeout(fadeOutPreloader, 40);
    } else {
      document.addEventListener('DOMContentLoaded', () => setTimeout(fadeOutPreloader, 40));
      window.addEventListener('load', fadeOutPreloader);
      setTimeout(fadeOutPreloader, 400); // Fast safety fallback so content is never blocked
    }
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init (immediate on DOM ready + refreshed on load)
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        mirror: false
      });
      AOS.refresh();
    }
  }
  document.addEventListener('DOMContentLoaded', aosInit);
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    zoomable: true
  });

  /**
   * Init isotope layout and filters with smooth transitions
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    const container = isotopeItem.querySelector('.isotope-container');
    if (!container) return;

    imagesLoaded(container, function() {
      initIsotope = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
        transitionDuration: '0.45s',
        hiddenStyle: {
          opacity: 0,
          transform: 'scale(0.88) translateY(14px)'
        },
        visibleStyle: {
          opacity: 1,
          transform: 'scale(1) translateY(0)'
        }
      });

      // Refresh AOS after Isotope finishes arranging items
      initIsotope.on('arrangeComplete', function() {
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        const currentActive = isotopeItem.querySelector('.isotope-filters .filter-active');
        if (currentActive) currentActive.classList.remove('filter-active');
        this.classList.add('filter-active');

        if (initIsotope) {
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        }
      }, false);
    });

  });

  

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      if (swiperElement.swiper) return;
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initSwiper);
  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });
  






  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Portfolio Interactive Modular Modal Bar with Next/Prev Slider
   */
  const portfolioProjects = [
    {
      title: "Busmate",
      subtitle: "Smart Urban Transit & Commuter App",
      category: "UI/UX Design",
      categoryClass: "uiux",
      badgeIcon: "bi-bezier2",
      year: "2024",
      role: "Product Design Lead",
      domain: "Urban Mobility & Public Transit",
      image: "assets/img/portfolio/busmate.png",
      description: "A smart urban transit and bus tracking mobile application engineered to streamline daily commuter route planning, live vehicle telemetry, seat reservation, and seamless digital ticketing.",
      tags: ["Figma", "UI/UX", "Product Design", "Transit App"],
      detailsUrl: "project.html#uiux",
      githubUrl: "https://www.figma.com/proto/aVX62XojiLLKLDV48yABz7/Product-Design-Internship-%E2%80%94-Assignment?node-id=46-29&p=f&viewport=325%2C269%2C0.36&t=XU8tR1pqnRn2DcDC-1&scaling=scale-down&content-scaling=fixed&page-id=5%3A66"
    },
    {
      title: "KrishiMitra Web Application",
      subtitle: "Smart AgriTech Telemetry & Farmer Advisory Portal",
      category: "Web Development",
      categoryClass: "web",
      badgeIcon: "bi-code-slash",
      year: "2024",
      role: "Full-Stack Web Architect",
      domain: "AgriTech & Rural Digital Transformation",
      image: "assets/img/portfolio/krishimitra.png",
      description: "A comprehensive full-stack AgriTech web platform empowering agricultural cooperatives, farmer producer organizations (FPOs), and agronomists with real-time APMC mandi commodity prices, automated crop yield analytics, meteorological forecasting, and community seed trading.",
      tags: ["Full-Stack", "JavaScript", "Node.js", "REST API", "PostgreSQL", "AgriTech"],
      detailsUrl: "project.html#web",
      githubUrl: "https://studio--krishimitra-ai-l2tup.us-central1.hosted.app/dashboard"
    },
    {
      title: "KrishiMitra App",
      subtitle: "Smart AgriTech & Crop Advisory Solution",
      category: "App Development",
      categoryClass: "app",
      badgeIcon: "bi-phone-fill",
      year: "2024",
      role: "Mobile App Developer & UI/UX",
      domain: "AgriTech & Smart Farming",
      image: "assets/img/portfolio/krishi.png",
      description: "An intelligent AgriTech mobile application designed to empower farmers with real-time weather forecasts, AI crop disease diagnostics, live mandi price telemetry, and smart irrigation schedules.",
      tags: ["Android", "Kotlin", "AgriTech", "Offline First", "Mobile"],
      detailsUrl: "project.html#app",
      githubUrl: "https://studio--krishimitra-ai-l2tup.us-central1.hosted.app/dashboard"
    },
    {
      title: "Banner 11",
      subtitle: "Figma Design & Digital Web Banner",
      category: "Branding & Graphics",
      categoryClass: "branding",
      badgeIcon: "bi-palette-fill",
      year: "2024",
      role: "Visual & Brand Designer",
      domain: "Brand Architecture",
      image: "assets/img/portfolio/banner/figma_banner.png",
      description: "A high-impact Figma design banner and landscape creative engineered for digital web presence, developer branding, and promotional showcases.",
      tags: ["Figma", "Banner Design", "Brand Strategy", "Digital Art"],
      detailsUrl: "works.html#banners",
      githubUrl: "works.html#banners"
    },
    {
      title: "Dinner Decider Smart App",
      subtitle: "Interactive Culinary Decision Engine",
      category: "App Development",
      categoryClass: "app",
      badgeIcon: "bi-phone-fill",
      year: "2023",
      role: "Android Developer",
      domain: "Lifestyle & Food Tech",
      image: "assets/img/portfolio/dinner.png",
      description: "A fun and dynamic culinary decision engine featuring gesture-based swipe cards, geocoded restaurant discovery, dietary preference filtering, and smart meal suggestion algorithms.",
      tags: ["Android Dev", "Kotlin", "UI Kit", "REST APIs", "Motion UI"],
      detailsUrl: "project.html#app",
      githubUrl: "https://github.com/mohit-cg"
    },
    {
      title: "UI/UX Developer Roadmap",
      subtitle: "Interactive Learning & Career Progression Portal",
      category: "Web Development",
      categoryClass: "web",
      badgeIcon: "bi-code-slash",
      year: "2024",
      role: "Frontend & UI Architect",
      domain: "Developer Education & Open Source",
      image: "assets/img/portfolio/ui.png",
      description: "A comprehensive interactive web roadmap and visual guide outlining structured learning milestones, design token architectures, modern frontend stacks, and career progression paths for UI/UX developers.",
      tags: ["Web Dev", "UI/UX Design", "Roadmap", "JavaScript", "Frontend"],
      detailsUrl: "project.html#web",
      githubUrl: "https://roadmap-tau-teal.vercel.app/"
    },
    {
      title: "Coffee Shop App",
      subtitle: "Artisan Cafe & Mobile Ordering Experience",
      category: "UI/UX Design",
      categoryClass: "uiux",
      badgeIcon: "bi-bezier2",
      year: "2024",
      role: "Mobile UI/UX Designer",
      domain: "Food & Beverage E-Commerce",
      image: "assets/img/portfolio/coffeeshop.png",
      description: "A warm, sensory mobile coffee ordering application with rich visual drink customization, bean roast indicators, automated loyalty reward points, and scheduled express pickup.",
      tags: ["Figma", "UI/UX", "Mobile App", "Food & Beverage"],
      detailsUrl: "project.html#uiux",
      githubUrl: "https://www.figma.com/proto/CZEFQkSoTyyaE5yn8UI5OO/COFFEE-SHOP-APP-Test?page-id=1%3A40&node-id=1-251&viewport=67%2C37%2C0.19&t=zZo51AbdHFJxFz6K-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A71"
    },
    {
      title: "Mockup 08",
      subtitle: "3D Product & Packaging Mockup",
      category: "Branding & Graphics",
      categoryClass: "branding",
      badgeIcon: "bi-palette-fill",
      year: "2024",
      role: "3D & Visual Designer",
      domain: "Brand Collateral & Packaging",
      image: "assets/img/portfolio/mockup/mockup (5).png",
      description: "A photorealistic 3D product mockup layout crafted to present digital brand designs, merchandise, and packaging in real-world perspectives.",
      tags: ["3D Mockup", "Photoshop", "Packaging", "Brand Identity"],
      detailsUrl: "works.html#mockups",
      githubUrl: "works.html#mockups"
    },
    {
      title: "AniCG",
      subtitle: "Anime & Digital Animation Creative Web Platform",
      category: "Web Development",
      categoryClass: "web",
      badgeIcon: "bi-code-slash",
      year: "2024",
      role: "Full-Stack Web Developer & Creative Lead",
      domain: "Digital Media & Creative Entertainment",
      image: "assets/img/portfolio/ani.png",
      description: "A dynamic full-stack multimedia web platform and entertainment hub engineered for AniCG, showcasing anime-inspired animations, creative digital artwork, interactive media reels, and high-performance frontend interfaces.",
      tags: ["Web Dev", "Animation", "Multimedia", "JavaScript", "Creative Tech"],
      detailsUrl: "project.html#web",
      githubUrl: "https://www.youtube.com/@AniCG.o2"
    }
  ];

  let currentProjectIndex = 0;

  function renderProjectModal(index, direction) {
    if (index < 0) index = portfolioProjects.length - 1;
    if (index >= portfolioProjects.length) index = 0;
    currentProjectIndex = index;

    const p = portfolioProjects[currentProjectIndex];
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const bodyEl = modal.querySelector('.project-modal-body');
    if (bodyEl && direction) {
      bodyEl.classList.remove('pm-anim-slide-next', 'pm-anim-slide-prev');
      void bodyEl.offsetWidth; // Force CSS reflow
      bodyEl.classList.add(direction === 'next' ? 'pm-anim-slide-next' : 'pm-anim-slide-prev');
    }

    const imgEl = document.getElementById('pmImage');
    if (imgEl) {
      imgEl.src = p.image;
      imgEl.alt = p.title;
    }

    const badgeEl = document.getElementById('pmBadge');
    if (badgeEl) {
      badgeEl.innerHTML = `<i class="bi ${p.badgeIcon}"></i> ${p.category}`;
    }

    const zoomLink = document.getElementById('pmZoomLink');
    if (zoomLink) {
      zoomLink.href = p.image;
      zoomLink.title = p.title;
    }

    const catEl = document.getElementById('pmCategory');
    if (catEl) catEl.textContent = p.category;

    const yearEl = document.getElementById('pmYear');
    if (yearEl) yearEl.textContent = p.year;

    const titleEl = document.getElementById('pmTitle');
    if (titleEl) titleEl.textContent = p.title;

    const subEl = document.getElementById('pmSubtitle');
    if (subEl) subEl.textContent = p.subtitle;

    const descEl = document.getElementById('pmDescription');
    if (descEl) descEl.textContent = p.description;

    const roleEl = document.getElementById('pmRole');
    if (roleEl) roleEl.textContent = p.role;

    const domainEl = document.getElementById('pmDomain');
    if (domainEl) domainEl.textContent = p.domain;

    const tagsEl = document.getElementById('pmTags');
    if (tagsEl) {
      tagsEl.innerHTML = p.tags.map(t => `<span class="pm-tag">${t}</span>`).join('');
    }

    const actDetails = document.getElementById('pmActionDetails');
    if (actDetails) actDetails.href = p.detailsUrl;

    const actGitHub = document.getElementById('pmActionGitHub');
    if (actGitHub) {
      actGitHub.href = p.githubUrl;
      const isFigma = p.githubUrl && p.githubUrl.includes('figma.com');
      const isWorks = p.githubUrl && p.githubUrl.includes('works.html');
      const isLive = p.githubUrl && (p.githubUrl.includes('hosted.app') || p.githubUrl.includes('vercel.app'));
      const isYouTube = p.githubUrl && p.githubUrl.includes('youtube.com');
      const icon = actGitHub.querySelector('i');
      const span = actGitHub.querySelector('span');
      if (icon) {
        icon.className = isFigma ? 'bi bi-figma' : (isWorks ? 'bi bi-images' : (isYouTube ? 'bi bi-youtube' : (isLive ? 'bi bi-box-arrow-up-right' : 'bi bi-github')));
      }
      if (span) {
        let label = 'GitHub Repository';
        if (isFigma) label = 'Figma Prototype';
        else if (isWorks) label = 'Visual Works Gallery';
        else if (isYouTube) label = 'YouTube Showcase';
        else if (isLive) label = p.categoryClass === 'app' ? 'App View' : (p.title.includes('Roadmap') ? 'Live Roadmap' : 'Live Demo');
        span.textContent = label;
      }
    }

    const currNum = document.getElementById('pmCurrentNum');
    if (currNum) currNum.textContent = currentProjectIndex + 1;

    const totalNum = document.getElementById('pmTotalNum');
    if (totalNum) totalNum.textContent = portfolioProjects.length;
  }

  function openProjectModal(index) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    renderProjectModal(index);
    modal.removeAttribute('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      scrollTop.classList.remove('active');
      scrollTop.style.display = 'none';
    }

    const closeBtn = document.getElementById('pmClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      scrollTop.style.display = '';
      if (typeof toggleScrollTop === 'function') toggleScrollTop();
    }
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.setAttribute('hidden', '');
      }
    }, 320);
  }

  function initPortfolioModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    // Attach click triggers to portfolio cards
    document.querySelectorAll('.portfolio-card').forEach((card) => {
      card.addEventListener('click', function(e) {
        // If clicking on direct external link (case study or other full navigation), let default happen
        if (e.target.closest('a[href^="portfolio-details.html"]') || e.target.closest('a[href^="http"]')) {
          return;
        }
        e.preventDefault();
        const idx = parseInt(this.getAttribute('data-project-index') || '0', 10);
        openProjectModal(idx);
      });
    });

    // Close button & backdrop
    const closeBtn = document.getElementById('pmClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeProjectModal);
    }

    const backdrop = modal.querySelector('.project-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeProjectModal);
    }

    // Prev / Next button listeners
    const prevBtn = document.getElementById('pmPrev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        renderProjectModal(currentProjectIndex - 1, 'prev');
      });
    }

    const nextBtn = document.getElementById('pmNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        renderProjectModal(currentProjectIndex + 1, 'next');
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeProjectModal();
      } else if (e.key === 'ArrowRight') {
        renderProjectModal(currentProjectIndex + 1, 'next');
      } else if (e.key === 'ArrowLeft') {
        renderProjectModal(currentProjectIndex - 1, 'prev');
      }
    });
  }

  /**
   * Contact Form Interactive Submission Handler
   */
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const loadingEl = document.getElementById('formLoading');
    const errorEl = document.getElementById('formError');
    const successEl = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('btnSubmitContact');
    const directMailtoBtn = document.getElementById('btnDirectMailto');

    // Dynamically update direct mailto link as user types
    function updateMailto() {
      const subject = encodeURIComponent(contactForm.subject.value.trim() || 'Portfolio Inquiry');
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const body = encodeURIComponent(
        `Hi Mohit,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`
      );
      if (directMailtoBtn) {
        directMailtoBtn.href = `mailto:mohitkumar7232901@gmail.com?subject=${subject}&body=${body}`;
      }
    }

    contactForm.addEventListener('input', updateMailto);

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      // Reset statuses
      if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }
      if (successEl) successEl.style.display = 'none';

      // Basic client-side validation
      if (!name || !email || !subject || !message) {
        if (errorEl) {
          errorEl.textContent = 'Please fill out all fields before sending.';
          errorEl.style.display = 'block';
        }
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address.';
          errorEl.style.display = 'block';
        }
        return;
      }

      // Show loading
      if (loadingEl) loadingEl.style.display = 'block';
      if (submitBtn) submitBtn.disabled = true;

      // Simulate sending with realistic feedback & mailto preparation
      setTimeout(function () {
        if (loadingEl) loadingEl.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;

        if (successEl) {
          successEl.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Thank you, <strong>${name}</strong>! Your message has been prepared for <strong>Mohit Kumar</strong>. Opening in your email app...`;
          successEl.style.display = 'block';
        }

        // Open mailto link automatically in default mail client
        const mailtoSubject = encodeURIComponent(subject);
        const mailtoBody = encodeURIComponent(`Hi Mohit,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
        window.location.href = `mailto:mohitkumar7232901@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        contactForm.reset();
        updateMailto();
      }, 700);
    });
  }

  window.addEventListener('DOMContentLoaded', function() {
    initPortfolioModal();
    initContactForm();
  });
  window.addEventListener('load', function() {
    initPortfolioModal();
    initContactForm();
  });

})();
