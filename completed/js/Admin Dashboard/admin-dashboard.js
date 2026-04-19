// ================= SIDEBAR TOGGLE FUNCTIONALITY =================
const sidebar = document.getElementById('voxifySidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const layout = document.getElementById('voxifyLayout');

function toggleSidebar() {
    if (sidebar && layout) {
        sidebar.classList.toggle('collapsed');
        layout.classList.toggle('sidebar-collapsed');
        
        // Save state to localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
}

function closeSidebar() {
    if (window.innerWidth <= 768) {
        if (sidebar && layout) {
            sidebar.classList.add('collapsed');
            layout.classList.add('sidebar-collapsed');
        }
    }
}

// Toggle sidebar on button click
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

// Close sidebar when clicking overlay (mobile)
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        if (sidebar && layout && window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            layout.classList.add('sidebar-collapsed');
        }
    });
}

// Restore sidebar state from localStorage
const savedState = localStorage.getItem('sidebarCollapsed');
if (savedState === 'true' && sidebar && layout) {
    sidebar.classList.add('collapsed');
    layout.classList.add('sidebar-collapsed');
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (sidebarOverlay) sidebarOverlay.style.display = 'none';
    } else {
        if (sidebarOverlay) sidebarOverlay.style.display = 'block';
    }
});

// ================= PROFILE DROPDOWN =================
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
}

// ================= STATUS DROPDOWN =================
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');

if (statusQuickBtn && statusDropdown) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('show');
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (profileDropdown && !profileBtn?.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
    if (statusDropdown && !statusQuickBtn?.contains(e.target)) {
        statusDropdown.classList.remove('show');
    }
});

// ================= TOAST NOTIFICATION =================
let toastTimer;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    
    if (type === 'success') {
        toastIcon.textContent = '✓';
        toast.style.borderLeft = '4px solid #28A745';
    } else if (type === 'error') {
        toastIcon.textContent = '✗';
        toast.style.borderLeft = '4px solid #DC3545';
    } else {
        toastIcon.textContent = 'ℹ';
        toast.style.borderLeft = '4px solid #1F4FD8';
    }
    
    toast.classList.add('show');
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ================= DASHBOARD DATA & AUTO REFRESH =================
let autoRefreshInterval = null;
let isAutoRefreshEnabled = true;

// Update last updated time
function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = timeString;
    }
}

// Simulate fetching dashboard data
function refreshDashboardData() {
    // Randomize KPI values for demo
    const totalUsers = 280 + Math.floor(Math.random() * 20);
    const activeComplaints = 140 + Math.floor(Math.random() * 30);
    const activeAlerts = 30 + Math.floor(Math.random() * 15);
    const templates = 12 + Math.floor(Math.random() * 5);
    const apiKeys = 8 + Math.floor(Math.random() * 4);
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeComplaints').textContent = activeComplaints;
    document.getElementById('activeAlerts').textContent = activeAlerts;
    document.getElementById('templates').textContent = templates;
    document.getElementById('apiKeys').textContent = apiKeys;
    
    // Update status dropdown badges
    const activeBadge = document.querySelector('.status-dropdown .status.active');
    const pendingBadge = document.querySelector('.status-dropdown .status.pending');
    const resolvedBadge = document.querySelector('.status-dropdown .status.resolved');
    
    if (activeBadge) activeBadge.textContent = activeComplaints;
    if (pendingBadge) pendingBadge.textContent = Math.floor(activeComplaints * 0.3);
    if (resolvedBadge) resolvedBadge.textContent = 95 + Math.floor(Math.random() * 20);
    
    // Update nav badge
    const navBadge = document.querySelector('.nav-badge');
    if (navBadge) navBadge.textContent = activeAlerts;
    
    // Add new activity log entry
    const actions = ['Updated SLA Rule', 'Resolved Complaint', 'Added New User', 'Generated Report', 'Modified Alert Template'];
    const users = ['System', 'Admin User', 'John Doe', 'Susan Lee', 'Mike Ross'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const activityTable = document.getElementById('activityLogs');
    if (activityTable) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${timeStr}</td><td>${randomUser}</td><td>${randomAction}</td>`;
        activityTable.insertBefore(newRow, activityTable.firstChild);
        
        // Keep only last 6 rows
        while (activityTable.children.length > 6) {
            activityTable.removeChild(activityTable.lastChild);
        }
    }
    
    updateLastUpdated();
    showToast('Dashboard data refreshed', 'success');
}

// Auto refresh setup
function setupAutoRefresh() {
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    
    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', (e) => {
            isAutoRefreshEnabled = e.target.checked;
            if (isAutoRefreshEnabled) {
                startAutoRefresh();
                showToast('Auto refresh enabled', 'success');
            } else {
                stopAutoRefresh();
                showToast('Auto refresh disabled', 'info');
            }
        });
    }
    
    // Start with auto refresh enabled
    if (isAutoRefreshEnabled) {
        startAutoRefresh();
    }
}

function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(() => {
        if (isAutoRefreshEnabled) {
            refreshDashboardData();
        }
    }, 30000); // Refresh every 30 seconds
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Manual refresh button
const manualRefreshBtn = document.getElementById('manualRefreshBtn');
if (manualRefreshBtn) {
    manualRefreshBtn.addEventListener('click', () => {
        refreshDashboardData();
    });
}

// Date range select handler
const dateRangeSelect = document.getElementById('dateRangeSelect');
if (dateRangeSelect) {
    dateRangeSelect.addEventListener('change', (e) => {
        showToast(`Showing data for: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        refreshDashboardData();
    });
}

// System health random update
function updateSystemHealth() {
    const healthValue = 85 + Math.floor(Math.random() * 15);
    const circleValue = document.querySelector('.circle-value');
    if (circleValue) {
        circleValue.textContent = healthValue + '%';
        if (healthValue >= 90) {
            circleValue.style.background = 'linear-gradient(135deg, #11998e, #38ef7d)';
        } else if (healthValue >= 70) {
            circleValue.style.background = 'linear-gradient(135deg, #ff7a18, #ffb347)';
        } else {
            circleValue.style.background = 'linear-gradient(135deg, #ff4b2b, #ff416c)';
        }
    }
}

// Update random bar heights for chart animation
function animateCharts() {
    const bars = document.querySelectorAll('.bar-chart div');
    bars.forEach(bar => {
        const newHeight = 30 + Math.floor(Math.random() * 70);
        bar.style.height = newHeight + 'px';
    });
}

// Initial load and periodic updates
document.addEventListener('DOMContentLoaded', () => {
    updateLastUpdated();
    setupAutoRefresh();
    
    // Initial data load
    setTimeout(() => {
        refreshDashboardData();
        updateSystemHealth();
        animateCharts();
    }, 500);
    
    // Update system health periodically
    setInterval(() => {
        updateSystemHealth();
        animateCharts();
    }, 45000);
});

// Make showToast available globally
window.showToast = showToast;

// ================= ACTIVE SIDEBAR LINK =================
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '' || currentPage === 'admin-dashboard.html') && link.getAttribute('href') === 'admin-dashboard.html') {
        link.classList.add('active');
    }
});

// ================= CLICK OUTSIDE DROPDOWN HANDLER =================
document.addEventListener('click', function(event) {
    const statusContainer = document.querySelector('.status-quick-view');
    const profileContainer = document.querySelector('.navbar-profile');
    
    if (statusContainer && !statusContainer.contains(event.target)) {
        const dropdown = document.getElementById('statusDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
    
    if (profileContainer && !profileContainer.contains(event.target)) {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});