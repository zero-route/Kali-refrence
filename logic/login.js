
  const VALID_USERNAME = "Admin";   // ← GANTI USERNAME DI SINI
  const VALID_PASSWORD = "191007"; 
    // GANTI PASSWORD DI SINI
  const MAIN_PAGE = "main-page.html";

  /* ── Particles ── */
  (function spawnParticles() {
    const container = document.getElementById('particles');
    const count = 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left       = Math.random() * 100 + 'vw';
      p.style.bottom     = -10 + 'px';
      p.style.animationDuration  = (8 + Math.random() * 14) + 's';
      p.style.animationDelay     = (Math.random() * 12) + 's';
      p.style.width  = p.style.height = (1 + Math.random() * 2) + 'px';
      if (Math.random() > 0.6) p.style.background = '#7c3aed';
      container.appendChild(p);
    }
  })();

  /* ── Toggle password visibility ── */
  function togglePassword() {
    const input = document.getElementById('password');
    const icon  = document.getElementById('eyeIcon');
    const shown = input.type === 'text';
    input.type  = shown ? 'password' : 'text';

    /* Swap SVG path: eye-slash when visible, eye when hidden */
    icon.innerHTML = shown
      ? /* eye-open */
        `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
              -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`
      : /* eye-slash */
        `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
              a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
              M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
              m7.532 7.532l3.29 3.29M3 3l3.59 3.59
              m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
              a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`;
  }

  /* ── Enter key support ── */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleLogin();
  });

  /* ── Login handler ── */
  function handleLogin() {
    const btn  = document.getElementById('loginBtn');
    const err  = document.getElementById('errorMsg');
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    /* Reset error */
    err.classList.remove('show');

    /* Basic empty check */
    if (!user || !pass) {
      showError('Username dan password tidak boleh kosong.');
      return;
    }

    /* Loading state */
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>Memverifikasi…';

    /* Simulate short auth delay (feels more real) */
    setTimeout(function() {
      if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
        /* ── SUCCESS ── */
        document.getElementById('successOverlay').classList.add('show');
        setTimeout(function() {
          sessionStorage.setItem('authenticated', 'true');
      window.location.href = MAIN_PAGE;
        }, 1400);
      } else {
        /* ── FAIL ── */
        btn.disabled = false;
        btn.innerHTML = 'MASUK';
        showError('⛔ Username atau password salah. Akses ditolak.');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    }, 900);
  }

  function showError(msg) {
    const err = document.getElementById('errorMsg');
    err.textContent = msg;
    err.classList.add('show');
  }