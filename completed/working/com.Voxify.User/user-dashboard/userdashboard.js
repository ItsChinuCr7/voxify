
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

// Collapse sidebar on resize to desktop if it was mobile-opened
window.addEventListener('resize', () => {
  if (!isMobile()) {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('show');
  }
});

// ========= STATUS QUICK VIEW DROPDOWN =========

const statusQuickBtn  = document.getElementById('statusQuickBtn');
const statusDropdown  = document.getElementById('statusDropdown');

statusQuickBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  statusDropdown.classList.toggle('open');
  profileDropdown.classList.remove('open');
});

// ========= PROFILE DROPDOWN =========

const profileBtn      = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle('open');
  statusDropdown.classList.remove('open');
});

// Close all dropdowns when clicking outside
document.addEventListener('click', () => {
  profileDropdown.classList.remove('open');
  statusDropdown.classList.remove('open');
});

// ========= SIDEBAR ACTIVE LINK =========

const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

sidebarLinks.forEach(link => {
  link.addEventListener('click', function () {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

