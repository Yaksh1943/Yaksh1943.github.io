document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. THEME SWITCHER (Dark / Light with LocalStorage)
  // =========================================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Determine initial theme: saved preference -> system preference -> default dark
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlRoot.setAttribute('data-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // =========================================================
  // 2. MOBILE NAVIGATION
  // =========================================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================
  // 3. SCROLLSPY (Active Navigation Link Highlighting)
  // =========================================================
  const sections = document.querySelectorAll('section[id], header.hero');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.scrollY;
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id') || '';
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (currentId && item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  highlightNavOnScroll();

  // =========================================================
  // 4. INTERACTIVE CODE WINDOW (whoami.py tabs & runner)
  // =========================================================
  const tabSourceBtn = document.getElementById('tabSourceBtn');
  const tabOutputBtn = document.getElementById('tabOutputBtn');
  const codeView = document.getElementById('codeView');
  const outputView = document.getElementById('outputView');
  const runCodeBtn = document.getElementById('runCodeBtn');

  function switchTab(showOutput) {
    if (showOutput) {
      tabOutputBtn.classList.add('active');
      tabSourceBtn.classList.remove('active');
      codeView.classList.add('hidden-view');
      outputView.classList.remove('hidden-view');
    } else {
      tabSourceBtn.classList.add('active');
      tabOutputBtn.classList.remove('active');
      outputView.classList.add('hidden-view');
      codeView.classList.remove('hidden-view');
    }
  }

  if (tabSourceBtn && tabOutputBtn) {
    tabSourceBtn.addEventListener('click', () => switchTab(false));
    tabOutputBtn.addEventListener('click', () => switchTab(true));
  }

  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', () => {
      const originalText = runCodeBtn.innerHTML;
      runCodeBtn.innerHTML = `<span>Executing...</span>`;
      runCodeBtn.style.opacity = '0.7';

      setTimeout(() => {
        runCodeBtn.innerHTML = originalText;
        runCodeBtn.style.opacity = '1';
        switchTab(true);
        showToast('✓ whoami.py executed in 12ms');
      }, 240);
    });
  }

  // =========================================================
  // 5. TOAST NOTIFICATION & 1-CLICK COPY EMAIL
  // =========================================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  const copyButtons = [
    document.getElementById('copyEmailBtn'),
    document.getElementById('contactCopyBtn')
  ].filter(Boolean);

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'yaksh.190403varu@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied ${email} to clipboard!`);
      }
    });
  });

  // =========================================================
  // 6. SCROLL REVEAL (IntersectionObserver)
  // =========================================================
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // =========================================================
  // 7. BACK TO TOP
  // =========================================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 420);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});