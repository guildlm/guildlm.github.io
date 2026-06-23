/**
 * GuildLM Landing Page — Interactive JavaScript
 * Handles: scroll animations, stat counters, nav behavior, intersection observers
 */

(function () {
  'use strict';

  // --- Navigation Scroll Effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const links = document.querySelector('.nav__links');
      if (links) {
        links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
        links.style.position = 'fixed';
        links.style.top = '60px';
        links.style.left = '0';
        links.style.right = '0';
        links.style.flexDirection = 'column';
        links.style.padding = '1.5rem';
        links.style.background = 'rgba(10, 10, 10, 0.95)';
        links.style.backdropFilter = 'blur(20px)';
        links.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
        links.style.gap = '1rem';
        links.style.zIndex = '99';
      }
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        const links = document.querySelector('.nav__links');
        if (links && window.innerWidth <= 768) {
          links.style.display = 'none';
        }
      }
    });
  });

  // --- Animated Stat Counters ---
  function animateCounter(element, target, duration) {
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (target - startValue) * easeOut);
      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Intersection Observer for Animations ---
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  // Stats counter observer
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        document.querySelectorAll('.hero__stat-value[data-target]').forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          animateCounter(stat, target, 1500);
        });
      }
    });
  }, observerOptions);

  const statsContainer = document.querySelector('.hero__stats');
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  // General element visibility observer
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve so elements stay visible
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  // Observe flow steps
  document.querySelectorAll('.flow__step').forEach((step, index) => {
    step.style.transitionDelay = `${index * 150}ms`;
    visibilityObserver.observe(step);
  });

  // Observe timeline items
  document.querySelectorAll('.timeline__item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 100}ms`;
    visibilityObserver.observe(item);
  });

  // --- Guild Card Hover Glow Effect ---
  document.querySelectorAll('.arch__guild, .repo').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- Parallax Effect on Hero Glows ---
  const heroGlows = document.querySelectorAll('.hero__glow');

  function handleParallax() {
    const scrolled = window.scrollY;
    heroGlows.forEach((glow, index) => {
      const speed = (index + 1) * 0.3;
      glow.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  // Only apply parallax if no reduced motion preference
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // --- Architecture Diagram Interaction ---
  const guilds = document.querySelectorAll('.arch__guild');
  const brainNode = document.querySelector('.arch__node--brain');

  guilds.forEach(guild => {
    guild.addEventListener('mouseenter', () => {
      const guildName = guild.getAttribute('data-guild');
      // Pulse the brain when hovering a guild
      if (brainNode) {
        brainNode.style.borderColor = 'rgba(212, 175, 55, 0.6)';
        brainNode.style.boxShadow = '0 0 40px rgba(212, 175, 55, 0.15)';
      }
    });

    guild.addEventListener('mouseleave', () => {
      if (brainNode) {
        brainNode.style.borderColor = '';
        brainNode.style.boxShadow = '';
      }
    });
  });

  // --- Console Easter Egg ---
  console.log(
    '%c⚔️ GUILDLM %c Specialist Models. Mastered.',
    'background: #D4AF37; color: #0a0a0a; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #1a1a1a; color: #D4AF37; padding: 4px 8px; border-radius: 0 4px 4px 0;'
  );
  console.log('🧠 Join the Guild → https://github.com/guildlm');

})();
