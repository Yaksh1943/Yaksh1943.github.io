document.addEventListener('DOMContentLoaded', () => {

  // Light Theme Enforced
  document.documentElement.setAttribute('data-theme', 'light');

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
  // 4. INTERACTIVE CODE WINDOW (3 Tabs: Python, SQL, Output)
  // =========================================================
  const tabSourceBtn = document.getElementById('tabSourceBtn');
  const tabSqlBtn = document.getElementById('tabSqlBtn');
  const tabOutputBtn = document.getElementById('tabOutputBtn');
  const codeView = document.getElementById('codeView');
  const sqlView = document.getElementById('sqlView');
  const outputView = document.getElementById('outputView');
  const runCodeBtn = document.getElementById('runCodeBtn');

  function activateTab(tabName) {
    // Reset all buttons
    [tabSourceBtn, tabSqlBtn, tabOutputBtn].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    // Hide all views
    [codeView, sqlView, outputView].forEach(v => {
      if (v) v.classList.add('hidden-view');
    });

    if (tabName === 'source' && tabSourceBtn && codeView) {
      tabSourceBtn.classList.add('active');
      codeView.classList.remove('hidden-view');
    } else if (tabName === 'sql' && tabSqlBtn && sqlView) {
      tabSqlBtn.classList.add('active');
      sqlView.classList.remove('hidden-view');
    } else if (tabName === 'output' && tabOutputBtn && outputView) {
      tabOutputBtn.classList.add('active');
      outputView.classList.remove('hidden-view');
    }
  }

  if (tabSourceBtn) tabSourceBtn.addEventListener('click', () => activateTab('source'));
  if (tabSqlBtn) tabSqlBtn.addEventListener('click', () => activateTab('sql'));
  if (tabOutputBtn) tabOutputBtn.addEventListener('click', () => activateTab('output'));

  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', () => {
      const originalText = runCodeBtn.innerHTML;
      runCodeBtn.innerHTML = `<span>Validating AST...</span>`;
      runCodeBtn.style.opacity = '0.75';

      setTimeout(() => {
        runCodeBtn.innerHTML = originalText;
        runCodeBtn.style.opacity = '1';
        activateTab('output');
        showToast('✓ AST validation clean: 0 syntax errors detected');
      }, 260);
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
  // 7. BACK TO TOP (Supports both floating and bottom bar buttons)
  // =========================================================
  const backToTopBtns = [
    document.getElementById('backToTop'),
    document.getElementById('footerBackToTop')
  ].filter(Boolean);

  backToTopBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

});
