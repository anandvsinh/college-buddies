/* ============================================================
   College Buddies — Auth Logic
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // ──────────── DOM refs ────────────
  const loginPanel    = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const goToRegister  = document.getElementById('goToRegister');
  const goToLogin     = document.getElementById('goToLogin');
  // Login form
  const loginForm     = document.getElementById('loginForm');
  const loginEmail    = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginBtn      = document.getElementById('loginBtn');
  // Register form
  const registerForm  = document.getElementById('registerForm');
  const regUsername    = document.getElementById('regUsername');
  const regEmail      = document.getElementById('regEmail');
  const regPassword   = document.getElementById('regPassword');
  const regConfirm    = document.getElementById('regConfirm');
  const registerBtn   = document.getElementById('registerBtn');
  // Password strength
  const passwordStrength = document.getElementById('passwordStrength');
  const strengthLabel    = document.getElementById('strengthLabel');
  const passwordRules    = document.getElementById('passwordRules');
  // Success overlay
  const successOverlay = document.getElementById('successOverlay');
  const successGoLogin = document.getElementById('successGoLogin');
  // ──────────── Panel Switching ────────────
  function switchPanel(from, to, direction) {
    // direction: 'left' means the old panel slides left, new comes from right
    from.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right');
    from.classList.remove('active');
    // Slight delay for visual overlap
    setTimeout(() => {
      from.classList.remove('slide-out-left', 'slide-out-right');
      to.classList.add('active');
    }, 150);
    // Clear errors on switch
    clearAllErrors(from);
  }
  goToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    switchPanel(loginPanel, registerPanel, 'left');
  });
  goToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    switchPanel(registerPanel, loginPanel, 'right');
  });
  // ──────────── Toggle Password Visibility ────────────
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.classList.toggle('showing', isPassword);
    });
  });
  // ──────────── Validation Helpers ────────────
  function setError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if (group) {
      group.classList.add('has-error', 'shake');
      // Remove shake after animation
      setTimeout(() => group.classList.remove('shake'), 400);
    }
    if (error) error.textContent = message;
  }
  function clearError(groupId, errorId) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if (group) group.classList.remove('has-error', 'shake');
    if (error) error.textContent = '';
  }
  function clearAllErrors(panel) {
    panel.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('has-error', 'shake');
    });
    panel.querySelectorAll('.error-msg').forEach(e => {
      e.textContent = '';
    });
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  // ──────────── Login Validation ────────────
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    // Clear previous
    clearError('loginEmailGroup', 'loginEmailError');
    clearError('loginPasswordGroup', 'loginPasswordError');
    // Email / username
    if (!loginEmail.value.trim()) {
      setError('loginEmailGroup', 'loginEmailError', 'Please enter your username or email');
      valid = false;
    }
    // Password
    if (!loginPassword.value) {
      setError('loginPasswordGroup', 'loginPasswordError', 'Please enter your password');
      valid = false;
    }
    if (!valid) return;
    // Simulate login
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    setTimeout(() => {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
      // In a real app, you'd redirect. Here we just show a quick alert-style feedback.
      alert('Login successful! (Demo)');
    }, 1400);
  });
  // Live clear errors on input
  loginEmail.addEventListener('input', () => clearError('loginEmailGroup', 'loginEmailError'));
  loginPassword.addEventListener('input', () => clearError('loginPasswordGroup', 'loginPasswordError'));
  // ──────────── Password Strength & Rules ────────────
  const rules = {
    length:  (v) => v.length >= 8,
    upper:   (v) => /[A-Z]/.test(v),
    lower:   (v) => /[a-z]/.test(v),
    number:  (v) => /[0-9]/.test(v),
    special: (v) => /[^A-Za-z0-9]/.test(v),
  };
  const ruleEls = {
    length:  document.getElementById('ruleLength'),
    upper:   document.getElementById('ruleUpper'),
    lower:   document.getElementById('ruleLower'),
    number:  document.getElementById('ruleNumber'),
    special: document.getElementById('ruleSpecial'),
  };
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  function evaluatePassword(value) {
    let score = 0;
    Object.keys(rules).forEach(key => {
      const met = rules[key](value);
      if (met) score++;
      ruleEls[key].classList.toggle('met', met);
      ruleEls[key].querySelector('.rule-icon').textContent = met ? '✓' : '○';
    });
    // Clamp to 1–4 if there is input
    const level = value.length === 0 ? 0 : Math.max(1, Math.min(4, score));
    passwordStrength.dataset.level = level;
    strengthLabel.textContent = strengthLabels[level] || '';
    // Show / hide
    if (value.length > 0) {
      passwordStrength.classList.add('visible');
      passwordRules.classList.add('visible');
    } else {
      passwordStrength.classList.remove('visible');
      passwordRules.classList.remove('visible');
    }
  }
  regPassword.addEventListener('input', () => {
    evaluatePassword(regPassword.value);
    clearError('regPasswordGroup', 'regPasswordError');
  });
  // ──────────── Registration Validation ────────────
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    // Clear all
    clearError('regUsernameGroup', 'regUsernameError');
    clearError('regEmailGroup', 'regEmailError');
    clearError('regPasswordGroup', 'regPasswordError');
    clearError('regConfirmGroup', 'regConfirmError');
    // Username
    if (!regUsername.value.trim()) {
      setError('regUsernameGroup', 'regUsernameError', 'Username is required');
      valid = false;
    } else if (regUsername.value.trim().length < 3) {
      setError('regUsernameGroup', 'regUsernameError', 'Username must be at least 3 characters');
      valid = false;
    }
    // Email
    if (!regEmail.value.trim()) {
      setError('regEmailGroup', 'regEmailError', 'Email address is required');
      valid = false;
    } else if (!isValidEmail(regEmail.value.trim())) {
      setError('regEmailGroup', 'regEmailError', 'Please enter a valid email address');
      valid = false;
    }
    // Password
    const pw = regPassword.value;
    if (!pw) {
      setError('regPasswordGroup', 'regPasswordError', 'Password is required');
      valid = false;
    } else {
      const failedRules = Object.keys(rules).filter(k => !rules[k](pw));
      if (failedRules.length > 0) {
        setError('regPasswordGroup', 'regPasswordError', 'Password does not meet all requirements');
        valid = false;
      }
    }
    // Confirm
    if (!regConfirm.value) {
      setError('regConfirmGroup', 'regConfirmError', 'Please confirm your password');
      valid = false;
    } else if (regConfirm.value !== pw) {
      setError('regConfirmGroup', 'regConfirmError', 'Passwords do not match');
      valid = false;
    }
    if (!valid) return;
    // Simulate registration
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;
    setTimeout(() => {
      registerBtn.classList.remove('loading');
      registerBtn.disabled = false;
      registerForm.reset();
      evaluatePassword('');
      showSuccess();
    }, 1600);
  });
  // Live clear on input
  regUsername.addEventListener('input', () => clearError('regUsernameGroup', 'regUsernameError'));
  regEmail.addEventListener('input', () => clearError('regEmailGroup', 'regEmailError'));
  regConfirm.addEventListener('input', () => clearError('regConfirmGroup', 'regConfirmError'));
  // ──────────── Success Overlay ────────────
  function showSuccess() {
    successOverlay.classList.add('show');
    successOverlay.setAttribute('aria-hidden', 'false');
  }
  function hideSuccess() {
    successOverlay.classList.remove('show');
    successOverlay.setAttribute('aria-hidden', 'true');
    // Reset SVG animations
    successOverlay.querySelectorAll('.circle-draw, .check-draw').forEach(el => {
      el.style.animation = 'none';
      // Force reflow
      void el.offsetWidth;
      el.style.animation = '';
    });
    // Switch to login panel
    switchPanel(registerPanel, loginPanel, 'right');
  }
  successGoLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hideSuccess();
  });
  // Close overlay on backdrop click
  successOverlay.addEventListener('click', (e) => {
    if (e.target === successOverlay) hideSuccess();
  });
  // ──────────── Keyboard: close overlay with Escape ────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successOverlay.classList.contains('show')) {
      hideSuccess();
    }
  });
});
