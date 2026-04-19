// ========= SIDEBAR TOGGLE =========
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('voxifySidebar');
const layout = document.getElementById('voxifyLayout');
const overlay = document.getElementById('sidebarOverlay');

const isMobile = () => window.innerWidth <= 768;

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMobile()) {
            sidebar.classList.toggle('mobile-open');
            if (overlay) overlay.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            if (layout) layout.classList.toggle('sidebar-collapsed');
        }
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('show');
    });
}

window.addEventListener('resize', () => {
    if (!isMobile()) {
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('show');
    }
});

// ========= DROPDOWNS =========
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (statusQuickBtn && statusDropdown) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('open');
        if (profileDropdown) profileDropdown.classList.remove('open');
    });
}

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('open');
        if (statusDropdown) statusDropdown.classList.remove('open');
    });
}

document.addEventListener('click', () => {
    if (profileDropdown) profileDropdown.classList.remove('open');
    if (statusDropdown) statusDropdown.classList.remove('open');
});

// ========= SMOOTH SCROLL TO SECTION =========
const quickNavCards = document.querySelectorAll('.quick-nav-card');
quickNavCards.forEach(card => {
    card.addEventListener('click', () => {
        const sectionId = card.getAttribute('data-section');
        const section = document.getElementById(`section-${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Highlight effect
            section.style.transition = 'all 0.3s';
            section.style.boxShadow = '0 0 0 3px var(--primary-blue)';
            setTimeout(() => {
                section.style.boxShadow = '';
            }, 1000);
        }
    });
});

// ========= ACCEPT BUTTON =========
const acceptPolicyBtn = document.getElementById('acceptPolicyBtn');
if (acceptPolicyBtn) {
    acceptPolicyBtn.addEventListener('click', () => {
        localStorage.setItem('voxify_privacy_accepted', 'true');
        localStorage.setItem('voxify_privacy_accept_date', new Date().toISOString());
        showToast('Thank you for accepting our Privacy Policy', 'success');
        
        // Animate button
        acceptPolicyBtn.style.transform = 'scale(0.98)';
        setTimeout(() => { acceptPolicyBtn.style.transform = ''; }, 200);
        
        // Optional: Redirect back after 1.5 seconds
        setTimeout(() => {
            if (document.referrer && document.referrer.includes(window.location.hostname)) {
                window.location.href = document.referrer;
            }
        }, 1500);
    });
}

// ========= PRINT BUTTON =========
const printPolicyBtn = document.getElementById('printPolicyBtn');
if (printPolicyBtn) {
    printPolicyBtn.addEventListener('click', () => {
        window.print();
        showToast('Print dialog opened', 'info');
    });
}

// ========= CHECK IF USER HAS ALREADY ACCEPTED =========
function checkPrivacyAcceptance() {
    const accepted = localStorage.getItem('voxify_privacy_accepted');
    if (accepted === 'true') {
        setTimeout(() => {
            showToast('You have already accepted our Privacy Policy ✓', 'info');
        }, 1000);
    }
}

// ========= ANIMATE SECTIONS ON SCROLL =========
const sections = document.querySelectorAll('.privacy-section');
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
});

// ========= TOAST FUNCTION =========
let toastTimer;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const icon = toast ? toast.querySelector('svg') : null;
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.className = 'toast ' + type;
    
    if (icon) {
        if (type === 'error') {
            icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
            toast.style.background = '#b82030';
        } else if (type === 'info') {
            icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
            toast.style.background = '#1a1a1a';
        } else {
            icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
            toast.style.background = '#1a1a1a';
        }
    }
    
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========= INITIALIZE =========
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    checkPrivacyAcceptance();
});

// Make functions available globally
window.showToast = showToast;