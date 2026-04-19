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
            if (sidebar) sidebar.classList.toggle('mobile-open');
            if (overlay) overlay.classList.toggle('show');
        } else {
            if (sidebar) sidebar.classList.toggle('collapsed');
            if (layout) layout.classList.toggle('sidebar-collapsed');
        }
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('show');
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

// ========= ACCEPT TERMS =========
const acceptTermsBtn = document.getElementById('acceptTermsBtn');
if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener('click', () => {
        localStorage.setItem('voxify_terms_accepted', 'true');
        localStorage.setItem('voxify_terms_accept_date', new Date().toISOString());
        showToast('Thank you for accepting the Terms of Service', 'success');
        
        // Animate button
        acceptTermsBtn.style.transform = 'scale(0.98)';
        setTimeout(() => { acceptTermsBtn.style.transform = ''; }, 200);
    });
}

// ========= PRINT / DOWNLOAD PDF =========
const printTermsBtn = document.getElementById('printTermsBtn');
if (printTermsBtn) {
    printTermsBtn.addEventListener('click', () => {
        window.print();
        showToast('Print dialog opened', 'info');
    });
}

// ========= CHECK IF USER HAS ALREADY ACCEPTED =========
function checkTermsAcceptance() {
    const accepted = localStorage.getItem('voxify_terms_accepted');
    if (accepted === 'true') {
        setTimeout(() => {
            showToast('You have already accepted our Terms of Service ✓', 'info');
        }, 1000);
    }
}

// ========= SMOOTH SCROLL FOR QUICK NAV =========
const quickNavLinks = document.querySelectorAll('.quick-nav-link');
quickNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Highlight effect
            targetElement.style.transition = 'all 0.3s';
            targetElement.style.boxShadow = '0 0 0 3px var(--primary-blue)';
            setTimeout(() => {
                targetElement.style.boxShadow = '';
            }, 1000);
        }
    });
});

// ========= ANIMATE SECTIONS ON SCROLL =========
const sections = document.querySelectorAll('.terms-section');
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
    checkTermsAcceptance();
});

// Make functions global
window.showToast = showToast;