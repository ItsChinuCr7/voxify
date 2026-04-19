console.log("feedback.js loaded");

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

// ========= STAR RATINGS =========
// Tracks selected values per star-group
const ratings = {};

document.querySelectorAll('.star-group').forEach(group => {
  const id = group.dataset.id;
  const stars = group.querySelectorAll('.star-btn');

  ratings[id] = 0;

  stars.forEach(star => {
    const val = parseInt(star.dataset.val);

    star.addEventListener('mouseenter', () => {
      stars.forEach(s => {
        s.classList.toggle('hovered', parseInt(s.dataset.val) <= val);
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hovered'));
      // restore selected state
      stars.forEach(s => {
        s.classList.toggle('selected', parseInt(s.dataset.val) <= ratings[id]);
      });
    });

    star.addEventListener('click', () => {
      ratings[id] = val;
      stars.forEach(s => {
        s.classList.toggle('selected', parseInt(s.dataset.val) <= val);
      });
      // Update hint text for general rating
      if (id === 'general') {
        const hints = ['Poor', 'Not great', 'Okay', 'Good', 'Excellent!'];
        const hint = document.getElementById('generalRateHint');
        if (hint) {
          hint.textContent = hints[val - 1];
          hint.style.color = val >= 4 ? 'var(--success-green)' : val === 3 ? 'var(--warning-amber)' : 'var(--error-red)';
        }
      }
    });
  });
});

// ========= SUBMIT PENDING FEEDBACK =========
function submitFeedback(itemId, btn) {
  const rating = ratings[itemId] || 0;
  if (rating === 0) {
    showToast('Please select a star rating before submitting', 'error');
    return;
  }

  const item = document.getElementById(itemId);
  item.classList.add('resolved-item');

  setTimeout(() => {
    item.style.transition = 'all 0.4s ease';
    item.style.opacity = '0';
    item.style.maxHeight = item.offsetHeight + 'px';
    setTimeout(() => {
      item.style.maxHeight = '0';
      item.style.padding = '0';
      item.style.margin = '0';
      item.style.overflow = 'hidden';
    }, 100);
    setTimeout(() => {
      item.remove();
      checkNoPending();
    }, 500);
  }, 800);

  showToast('Feedback submitted! Thank you 🎉', 'success');
}

function skipFeedback(itemId) {
  const item = document.getElementById(itemId);
  item.style.transition = 'all 0.3s ease';
  item.style.opacity = '0';
  setTimeout(() => item.remove(), 300);
  showToast('Skipped. You can rate later from My Complaints.', 'success');
}

function checkNoPending() {
  const container = document.querySelector('.fb-card-body');
  const remaining = document.querySelectorAll('.pending-feedback-item');
  if (remaining.length === 0 && container) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px 0; color:var(--text-secondary);">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="color:var(--success-green);margin-bottom:12px;">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="8 12 11 15 16 9"/>
        </svg>
        <p style="font-size:15px;font-weight:600;color:var(--text-primary)">All caught up!</p>
        <p style="font-size:13px;margin-top:4px;">No pending feedback at the moment.</p>
      </div>`;
    const badge = document.querySelector('.pending-badge');
    if (badge) badge.textContent = '0 Pending';
  }
}

// ========= GENERAL FEEDBACK =========
let recommendChoice = null;

function selectRecommend(choice) {
  recommendChoice = choice;
  document.getElementById('recYes').className   = 'rec-btn' + (choice === 'yes'   ? ' selected-yes'   : '');
  document.getElementById('recMaybe').className = 'rec-btn' + (choice === 'maybe' ? ' selected-maybe' : '');
  document.getElementById('recNo').className    = 'rec-btn' + (choice === 'no'    ? ' selected-no'    : '');
}

function clearGeneral() {
  ratings['general'] = 0;
  document.querySelectorAll('.large-stars .star-btn').forEach(s => s.classList.remove('selected', 'hovered'));
  document.getElementById('generalComment').value = '';
  document.getElementById('generalRateHint').textContent = 'Tap to rate';
  document.getElementById('generalRateHint').style.color = 'var(--text-secondary)';
  document.querySelector('.form-group select').selectedIndex = 0;
  recommendChoice = null;
  ['recYes', 'recMaybe', 'recNo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'rec-btn';
  });
}

function submitGeneral() {
  const rating  = ratings['general'] || 0;
  const comment = document.getElementById('generalComment').value.trim();

  if (rating === 0) {
    showToast('Please give an overall rating', 'error');
    return;
  }
  if (!comment) {
    showToast('Please add a comment before submitting', 'error');
    return;
  }
  showToast('General feedback submitted! Thank you 🙏', 'success');
  clearGeneral();
}

// ========= FILTER PAST FEEDBACK =========
function filterFeedback() {
  const val = document.getElementById('filterSelect').value;
  const items = document.querySelectorAll('.past-feedback-item');

  items.forEach(item => {
    const stars = parseInt(item.dataset.stars);
    let show = false;
    if (val === 'all')  show = true;
    else if (val === '5')   show = stars === 5;
    else if (val === '4')   show = stars === 4;
    else if (val === '3')   show = stars === 3;
    else if (val === '1-2') show = stars <= 2;
    item.classList.toggle('hidden', !show);
  });
}

// ========= ANIMATE RATING BARS on load =========
window.addEventListener('load', () => {
  document.querySelectorAll('.rbar-fill').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = target; }, 300);
  });
});

// ========= TOAST =========
let toastTimer;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toastMsg');
  const icon  = toast.querySelector('svg');

  msg.textContent = message;
  toast.className = 'toast ' + type;

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
