// ========= SIDEBAR TOGGLE =========
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('voxifySidebar');
const layout = document.getElementById('voxifyLayout');
const overlay = document.getElementById('sidebarOverlay');

const isMobile = () => window.innerWidth <= 768;

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        if (isMobile()) {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            layout.classList.toggle('sidebar-collapsed');
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
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('show');
    }
});

// ========= NAVBAR DROPDOWNS =========
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (statusQuickBtn) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('open');
        if (profileDropdown) profileDropdown.classList.remove('open');
    });
}

if (profileBtn) {
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

// ========= OUTAGE DATA =========
let activeOutages = [
    {
        id: 1,
        title: "Server Failure - Authentication",
        region: "Sector 7, Andheri East",
        severity: "critical",
        affectedUsers: 1240,
        duration: "45 mins",
        startTime: "2025-04-14T09:30:00",
        service: "Authentication Service"
    },
    {
        id: 2,
        title: "Fiber Optic Cut",
        region: "Goregaon West & Malad",
        severity: "critical",
        affectedUsers: 3420,
        duration: "2 hours 15 mins",
        startTime: "2025-04-14T08:15:00",
        service: "Broadband Internet"
    },
    {
        id: 3,
        title: "Network Congestion",
        region: "BKC & Bandra",
        severity: "high",
        affectedUsers: 850,
        duration: "1 hour",
        startTime: "2025-04-14T10:00:00",
        service: "Mobile Network"
    },
    {
        id: 4,
        title: "DNS Resolution Issue",
        region: "Powai & Vikhroli",
        severity: "high",
        affectedUsers: 620,
        duration: "30 mins",
        startTime: "2025-04-14T10:45:00",
        service: "DNS Services"
    },
    {
        id: 5,
        title: "Voice Call Routing Problem",
        region: "Mumbai Region",
        severity: "medium",
        affectedUsers: 430,
        duration: "20 mins",
        startTime: "2025-04-14T11:15:00",
        service: "VoIP/Calling"
    },
    {
        id: 6,
        title: "High Latency - International Gateway",
        region: "Global - Mumbai POP",
        severity: "low",
        affectedUsers: 210,
        duration: "15 mins",
        startTime: "2025-04-14T11:30:00",
        service: "International Connectivity"
    }
];

let resolvedOutages = [
    { title: "Email Service Disruption", region: "All Regions", resolvedTime: "2 hours ago", resolutionNotes: "Fixed email server configuration" },
    { title: "VPN Connectivity Issue", region: "Andheri", resolvedTime: "4 hours ago", resolutionNotes: "Restarted VPN gateway" },
    { title: "Billing System Downtime", region: "Mumbai", resolvedTime: "6 hours ago", resolutionNotes: "Database connection restored" },
    { title: "SMS Delivery Delay", region: "Maharashtra", resolvedTime: "8 hours ago", resolutionNotes: "Cleared SMS queue backlog" }
];

let currentFilter = "all";
let currentResolvingOutage = null;

// ========= HELPER FUNCTIONS =========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========= RENDER FUNCTIONS =========
function renderStats() {
    const container = document.getElementById('statsSummary');
    if (!container) return;
    
    const criticalCount = activeOutages.filter(o => o.severity === 'critical').length;
    const highCount = activeOutages.filter(o => o.severity === 'high').length;
    const mediumCount = activeOutages.filter(o => o.severity === 'medium').length;
    const lowCount = activeOutages.filter(o => o.severity === 'low').length;
    const totalAffected = activeOutages.reduce((sum, o) => sum + o.affectedUsers, 0);
    
    container.innerHTML = `
        <div class="stat-summary-card critical">
            <div class="stat-summary-number">${criticalCount}</div>
            <div class="stat-summary-label">Critical</div>
        </div>
        <div class="stat-summary-card high">
            <div class="stat-summary-number">${highCount}</div>
            <div class="stat-summary-label">High Priority</div>
        </div>
        <div class="stat-summary-card medium">
            <div class="stat-summary-number">${mediumCount}</div>
            <div class="stat-summary-label">Medium</div>
        </div>
        <div class="stat-summary-card low">
            <div class="stat-summary-number">${lowCount}</div>
            <div class="stat-summary-label">Low</div>
        </div>
        <div class="stat-summary-card" style="border-top-color: var(--primary-blue);">
            <div class="stat-summary-number">${totalAffected.toLocaleString()}</div>
            <div class="stat-summary-label">Total Affected Users</div>
        </div>
    `;
    
    const bannerText = document.getElementById('alertBannerText');
    if (bannerText) {
        if (criticalCount > 0) {
            bannerText.innerText = `${criticalCount} critical outage${criticalCount > 1 ? 's' : ''} requiring immediate attention`;
        } else if (highCount > 0) {
            bannerText.innerText = `${highCount} high priority outage${highCount > 1 ? 's' : ''} requiring attention`;
        } else {
            bannerText.innerText = `All systems operational - ${activeOutages.length} active incident${activeOutages.length !== 1 ? 's' : ''} being monitored`;
        }
    }
}

function renderOutageCards() {
    const container = document.getElementById('outageGrid');
    if (!container) return;
    
    let filtered = activeOutages;
    if (currentFilter !== 'all') {
        filtered = activeOutages.filter(o => o.severity === currentFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column:1/-1; text-align:center; padding:40px;">✅ No active outages match the selected filter</div>';
        return;
    }
    
    container.innerHTML = filtered.map(outage => {
        let severityDisplay = outage.severity.charAt(0).toUpperCase() + outage.severity.slice(1);
        return `
            <div class="outage-card ${outage.severity}">
                <div class="outage-header">
                    <h3>${escapeHtml(outage.title)}</h3>
                    <span class="outage-badge ${outage.severity}">${severityDisplay}</span>
                </div>
                <div class="outage-detail">
                    <p><strong>📍 Region:</strong> ${escapeHtml(outage.region)}</p>
                    <p><strong>👥 Affected Users:</strong> ${outage.affectedUsers.toLocaleString()}+</p>
                    <p><strong>⏱️ Duration:</strong> ${outage.duration}</p>
                    <p><strong>🛠️ Service:</strong> ${escapeHtml(outage.service)}</p>
                    <p><strong>🕐 Started:</strong> ${new Date(outage.startTime).toLocaleTimeString()}</p>
                </div>
                <div class="outage-actions">
                    <button class="action-btn ${outage.severity === 'critical' ? 'dispatch' : 'assign'}" onclick="handleAction('${outage.id}', '${outage.severity === 'critical' ? 'dispatch' : 'assign'}')">
                        ${outage.severity === 'critical' ? '🚨 Dispatch Team' : '👨‍🔧 Assign Technician'}
                    </button>
                    <button class="action-btn monitor" onclick="handleAction('${outage.id}', 'monitor')">
                        📊 Monitor
                    </button>
                    <button class="action-btn resolve" onclick="handleAction('${outage.id}', 'resolve')" style="margin-right: 5px;">
                        ✅ Resolve
                    </button>
                    <button class="action-btn escalate" onclick="handleAction('${outage.id}', 'escalate')" style="background: #FFF5F5; color: #E53E3E; border: 1px solid #FED7D7;">
                        🚨 Escalate
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderResolvedList() {
    const container = document.getElementById('resolvedList');
    if (!container) return;
    
    if (resolvedOutages.length === 0) {
        container.innerHTML = '<div class="empty-state" style="text-align:center; padding:20px;">No resolved outages yet</div>';
        return;
    }
    
    container.innerHTML = resolvedOutages.map(outage => `
        <div class="resolved-item">
            <div>
                <div class="resolved-title">${escapeHtml(outage.title)}</div>
                <div style="font-size: 11px; color: var(--text-secondary);">📍 ${escapeHtml(outage.region)}</div>
                ${outage.resolutionNotes ? `<div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">📝 ${escapeHtml(outage.resolutionNotes.substring(0, 80))}${outage.resolutionNotes.length > 80 ? '...' : ''}</div>` : ''}
            </div>
            <div class="resolved-time">✅ ${outage.resolvedTime}</div>
        </div>
    `).join('');
}

// ========= ACTION HANDLERS =========
window.handleAction = function(id, action) {
    const outage = activeOutages.find(o => o.id == id);
    if (!outage) return;
    
    switch(action) {
        case 'dispatch':
            window.location.href = `assign-technician.html?outage=${encodeURIComponent(outage.title)}&region=${encodeURIComponent(outage.region)}&severity=${outage.severity}`;
            break;
        case 'assign':
            window.location.href = `assign-technician.html?outage=${encodeURIComponent(outage.title)}&region=${encodeURIComponent(outage.region)}&severity=${outage.severity}`;
            break;
        case 'monitor':
            showToast(`📊 Monitoring ${outage.title} - Live updates enabled`, 'info');
            break;
        case 'resolve':
            currentResolvingOutage = outage;
            const modal = document.getElementById('resolveModal');
            const notesInput = document.getElementById('resolutionNotesInput');
            if (notesInput) notesInput.value = '';
            if (modal) modal.classList.add('show');
            break;
        case 'escalate':
            openEscalationModal(outage);
            break;
    }
};

function openEscalationModal(outage) {
    const modal = document.getElementById('escalationModal');
    const info = document.getElementById('escalationOutageInfo');
    if (!modal || !info) return;

    info.innerHTML = `
        <p><strong>Outage:</strong> ${escapeHtml(outage.title)}</p>
        <p><strong>Region:</strong> ${escapeHtml(outage.region)}</p>
        <p><strong>Severity:</strong> <span class="outage-badge ${outage.severity}">${outage.severity.toUpperCase()}</span></p>
    `;

    document.getElementById('escalationReason').value = '';
    modal.classList.add('show');
    window.currentEscalatingOutage = outage;
}

function closeEscalationModal() {
    const modal = document.getElementById('escalationModal');
    if (modal) modal.classList.remove('show');
}

document.getElementById('closeEscalationModalBtn')?.addEventListener('click', closeEscalationModal);
document.getElementById('cancelEscalateBtn')?.addEventListener('click', closeEscalationModal);
document.getElementById('confirmEscalateBtn')?.addEventListener('click', () => {
    const reason = document.getElementById('escalationReason').value.trim();
    if (!reason) {
        showToast('Please provide a reason for escalation', 'error');
        return;
    }
    const level = document.getElementById('escalationLevel').value;
    showToast(`🚨 ${window.currentEscalatingOutage.title} escalated to ${level}`, 'success');
    closeEscalationModal();
});

// ========= RESOLVE MODAL FUNCTIONS =========
function closeResolveModal() {
    const modal = document.getElementById('resolveModal');
    if (modal) modal.classList.remove('show');
    currentResolvingOutage = null;
    const notesInput = document.getElementById('resolutionNotesInput');
    if (notesInput) notesInput.value = '';
}

function confirmResolve() {
    if (!currentResolvingOutage) return;
    
    const notesInput = document.getElementById('resolutionNotesInput');
    const resolutionNotes = notesInput ? notesInput.value.trim() : '';
    
    resolvedOutages.unshift({
        title: currentResolvingOutage.title,
        region: currentResolvingOutage.region,
        resolvedTime: 'Just now',
        resolutionNotes: resolutionNotes || 'No additional notes'
    });
    
    activeOutages = activeOutages.filter(o => o.id !== currentResolvingOutage.id);
    
    renderStats();
    renderOutageCards();
    renderResolvedList();
    
    showToast(`✅ ${currentResolvingOutage.title} marked as resolved`, 'success');
    
    const badge = document.getElementById('globalUnreadBadge');
    if (badge) {
        let count = parseInt(badge.innerText) || 0;
        badge.innerText = count + 1;
    }
    
    closeResolveModal();
}

// ========= MODAL EVENT LISTENERS =========
const closeModalBtn = document.getElementById('closeResolveModalBtn');
const cancelResolveBtn = document.getElementById('cancelResolveBtn');
const confirmResolveBtn = document.getElementById('confirmResolveBtn');
const resolveModal = document.getElementById('resolveModal');

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeResolveModal);
}
if (cancelResolveBtn) {
    cancelResolveBtn.addEventListener('click', closeResolveModal);
}
if (confirmResolveBtn) {
    confirmResolveBtn.addEventListener('click', confirmResolve);
}
if (resolveModal) {
    resolveModal.addEventListener('click', (e) => {
        if (e.target === resolveModal) {
            closeResolveModal();
        }
    });
}

// ========= FILTER FUNCTIONALITY =========
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderOutageCards();
    });
});

// ========= SEARCH FUNCTIONALITY =========
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = activeOutages.filter(o => 
            o.title.toLowerCase().includes(term) || 
            o.region.toLowerCase().includes(term) ||
            o.service.toLowerCase().includes(term)
        );
        
        const container = document.getElementById('outageGrid');
        if (!container) return;
        
        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state" style="grid-column:1/-1; text-align:center; padding:40px;">🔍 No outages match your search</div>';
        } else {
            container.innerHTML = filtered.map(outage => {
                let severityDisplay = outage.severity.charAt(0).toUpperCase() + outage.severity.slice(1);
                return `
                    <div class="outage-card ${outage.severity}">
                        <div class="outage-header">
                            <h3>${escapeHtml(outage.title)}</h3>
                            <span class="outage-badge ${outage.severity}">${severityDisplay}</span>
                        </div>
                        <div class="outage-detail">
                            <p><strong>📍 Region:</strong> ${escapeHtml(outage.region)}</p>
                            <p><strong>👥 Affected Users:</strong> ${outage.affectedUsers.toLocaleString()}+</p>
                            <p><strong>⏱️ Duration:</strong> ${outage.duration}</p>
                            <p><strong>🛠️ Service:</strong> ${escapeHtml(outage.service)}</p>
                        </div>
                        <div class="outage-actions">
                            <button class="action-btn ${outage.severity === 'critical' ? 'dispatch' : 'assign'}" onclick="handleAction('${outage.id}', '${outage.severity === 'critical' ? 'dispatch' : 'assign'}')">
                                ${outage.severity === 'critical' ? '🚨 Dispatch Team' : '👨‍🔧 Assign Technician'}
                            </button>
                            <button class="action-btn monitor" onclick="handleAction('${outage.id}', 'monitor')">📊 Monitor</button>
                            <button class="action-btn resolve" onclick="handleAction('${outage.id}', 'resolve')">✅ Resolve</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    });
}

// ========= TOAST FUNCTION =========
let toastTimer;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const icon = toast?.querySelector('svg');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.className = 'toast ' + type;
    
    if (icon) {
        if (type === 'error') {
            icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
            toast.style.background = '#b82030';
        } else if (type === 'warning') {
            icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
            toast.style.background = '#E67E22';
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

// ========= SIMULATE REAL-TIME ALERTS =========
function startRealTimeSimulation() {
    setInterval(() => {
        const badge = document.getElementById('globalUnreadBadge');
        if (badge) {
            let count = parseInt(badge.innerText) || 0;
            badge.innerText = count + 1;
        }
    }, 45000);
}

// ========= INITIALIZE =========
function init() {
    renderStats();
    renderOutageCards();
    renderResolvedList();
    startRealTimeSimulation();
}

init();

// Export for global use
window.showToast = showToast;
window.handleAction = handleAction;