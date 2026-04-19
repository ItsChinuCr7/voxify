console.log("from script file");

// ========= SIDEBAR TOGGLE =========
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar       = document.getElementById('voxifySidebar');
const layout        = document.getElementById('voxifyLayout');
const overlay       = document.getElementById('sidebarOverlay');

const isMobile = () => window.innerWidth <= 768;

sidebarToggle.addEventListener('click', () => {
  if (isMobile()) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
  } else {
    sidebar.classList.toggle('collapsed');
    layout.classList.toggle('sidebar-collapsed');
  }
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('show');
});

window.addEventListener('resize', () => {
  if (!isMobile()) {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('show');
  }
});

// ========= NAVBAR DROPDOWNS =========
const statusQuickBtn  = document.getElementById('statusQuickBtn');
const statusDropdown  = document.getElementById('statusDropdown');
const profileBtn      = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

statusQuickBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  statusDropdown.classList.toggle('open');
  profileDropdown.classList.remove('open');
});

profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle('open');
  statusDropdown.classList.remove('open');
});

document.addEventListener('click', () => {
  profileDropdown.classList.remove('open');
  statusDropdown.classList.remove('open');
});

// ========= SETTINGS TABS =========
const tabBtns  = document.querySelectorAll('.settings-tab-btn');
const panels   = document.querySelectorAll('.settings-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById('panel-' + target);
    if (panel) {
      panel.classList.add('active');
      // smooth scroll to top of panel on mobile
      if (isMobile()) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========= RADIO OPTIONS =========
document.querySelectorAll('.radio-option').forEach(opt => {
  opt.addEventListener('click', () => {
    const group = opt.closest('.radio-group');
    group.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input[type="radio"]').checked = true;
  });
});

// ========= THEME SWATCHES =========
document.querySelectorAll('.theme-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('selected'));
    swatch.classList.add('selected');
  });
});

// ========= PASSWORD STRENGTH =========
function checkPasswordStrength(value) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

  if (!value) {
    fill.style.width = '0%';
    fill.style.background = '#e0e0e0';
    label.textContent = 'Enter a password';
    label.style.color = 'var(--text-secondary)';
    return;
  }

  let score = 0;
  if (value.length >= 8)  score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const levels = [
    { pct: '20%', color: '#DC3545', text: 'Very Weak' },
    { pct: '40%', color: '#FD7E14', text: 'Weak' },
    { pct: '60%', color: '#FFC107', text: 'Fair' },
    { pct: '80%', color: '#20C997', text: 'Strong' },
    { pct: '100%', color: '#28A745', text: 'Very Strong' },
  ];

  const level = levels[Math.min(score - 1, 4)] || levels[0];
  fill.style.width    = level.pct;
  fill.style.background = level.color;
  label.textContent   = level.text;
  label.style.color   = level.color;
}

// ========= PASSWORD CHANGE HANDLER =========
function handlePasswordChange() {
  const current  = document.getElementById('currentPass').value;
  const newPass  = document.getElementById('newPass').value;
  const confirm  = document.getElementById('confirmPass').value;

  if (!current || !newPass || !confirm) {
    showToast('Please fill in all password fields', 'error'); return;
  }
  if (newPass !== confirm) {
    showToast('New passwords do not match', 'error'); return;
  }
  if (newPass.length < 8) {
    showToast('Password must be at least 8 characters', 'error'); return;
  }
  showToast('Password updated successfully!', 'success');
  document.getElementById('currentPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
  checkPasswordStrength('');
}

// ========= DELETE CONFIRMATION =========
function confirmDelete() {
  if (confirm('Are you sure you want to permanently delete your account?\n\nThis action CANNOT be undone. All your complaints and data will be removed.')) {
    showToast('Account deletion request submitted', 'success');
  }
}

// ========= TOAST =========
let toastTimer;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toastMsg');
  const icon  = toast.querySelector('svg');

  msg.textContent = message;
  toast.className = 'toast ' + type;

  // Swap icon
  if (type === 'error') {
    icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    toast.style.background = '#b82030';
  } else {
    icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
    toast.style.background = '#1a1a1a';
  }

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
