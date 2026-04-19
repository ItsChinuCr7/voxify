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
        title: "Server Failure - Authentication Service",
        region: "Sector 7, Andheri East",
        severity: "critical",
        status: "Active",
        affectedUsers: 1200,
        duration: "45 mins",
        startTime: "2025-04-14T09:30:00",
        serviceType: "Authentication",
        logs: [
            { time: "09:32:15", message: "⚠️ Packet loss detected at 15%", type: "warning" },
            { time: "09:35:22", message: "🔴 Server not responding to health checks", type: "critical" },
            { time: "09:40:05", message: "🔄 Restart attempt initiated by NOC", type: "info" },
            { time: "09:45:30", message: "⚠️ Secondary server taking over traffic", type: "warning" },
            { time: "09:50:00", message: "📡 Monitoring team investigating root cause", type: "info" }
        ]
    },
    {
        id: 2,
        title: "Broadband Outage - Fiber Cut",
        region: "Goregaon West & Malad",
        severity: "critical",
        status: "Active",
        affectedUsers: 3400,
        duration: "2 hours",
        startTime: "2025-04-14T08:15:00",
        serviceType: "Broadband",
        logs: [
            { time: "08:18:00", message: "⚠️ Multiple complaints received from Goregaon", type: "warning" },
            { time: "08:25:30", message: "🔴 Fiber optic cable damage confirmed", type: "critical" },
            { time: "08:40:00", message: "👨‍🔧 Technician dispatched to site", type: "info" },
            { time: "09:10:00", message: "🔧 Repair work in progress", type: "info" },
            { time: "09:45:00", message: "📢 ETA for restoration: 2 hours", type: "info" }
        ]
    },
    {
        id: 3,
        title: "Network Congestion",
        region: "BKC & Bandra",
        severity: "warning",
        status: "Monitoring",
        affectedUsers: 850,
        duration: "1 hour",
        startTime: "2025-04-14T10:00:00",
        serviceType: "Mobile Network",
        logs: [
            { time: "10:05:00", message: "⚠️ High latency detected in BKC area", type: "warning" },
            { time: "10:15:00", message: "📊 Traffic analysis in progress", type: "info" },
            { time: "10:30:00", message: "🔄 Load balancing initiated", type: "info" }
        ]
    }
];

let currentSelectedOutage = activeOutages[0];
let systemLogs = [
    { time: "10:32:15", message: "✅ System monitoring active", type: "success" },
    { time: "10:35:22", message: "📡 Heartbeat signal received from all nodes", type: "info" },
    { time: "10:38:00", message: "⚠️ Packet loss threshold crossed in Sector 7", type: "warning" }
];

// ========= RENDER FUNCTIONS =========
function renderOutageCards() {
    const grid = document.getElementById('outageGrid');
    if (!grid) return;
    
    grid.innerHTML = activeOutages.map(outage => `
        <div class="outage-card ${outage.severity} ${currentSelectedOutage?.id === outage.id ? 'selected' : ''}" onclick="selectOutage(${outage.id})">
            <div class="outage-title">${outage.title}</div>
            <div class="outage-status">
                <span class="status-badge status-${outage.status.toLowerCase()}">● ${outage.status}</span>
            </div>
            <div>📍 ${outage.region}</div>
            <div class="outage-stats">
                <span>👥 ${outage.affectedUsers.toLocaleString()} users</span>
                <span>⏱️ ${outage.duration}</span>
            </div>
        </div>
    `).join('');
}

function renderOutageDetail() {
    const container = document.getElementById('outageDetailBody');
    if (!container || !currentSelectedOutage) return;
    
    const outage = currentSelectedOutage;
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18px; margin-bottom: 8px;">${outage.title}</h3>
            <p><strong>📍 Region:</strong> ${outage.region}</p>
            <p><strong>🛠️ Service:</strong> ${outage.serviceType}</p>
            <p><strong>⏰ Started:</strong> ${new Date(outage.startTime).toLocaleString()}</p>
            <p><strong>📊 Status:</strong> <span class="status-badge status-${outage.status.toLowerCase()}">${outage.status}</span></p>
        </div>
        <div class="impact-metrics" style="margin-top: 16px;">
            <div class="metric-card">
                <div class="metric-value">${outage.affectedUsers.toLocaleString()}</div>
                <div class="metric-label">Affected Users</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${outage.duration}</div>
                <div class="metric-label">Duration</div>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 12px;">📋 Recent Activity Logs</h4>
            <div class="log-container" style="height: auto; max-height: 200px;">
                <div class="log-list">
                    ${outage.logs.slice().reverse().map(log => `
                        <div class="log-entry ${log.type}">
                            <span class="log-time">${log.time}</span> ${log.message}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderImpactMetrics() {
    const container = document.getElementById('impactMetrics');
    if (!container) return;
    
    const totalAffected = activeOutages.reduce((sum, o) => sum + o.affectedUsers, 0);
    const criticalCount = activeOutages.filter(o => o.severity === 'critical').length;
    const warningCount = activeOutages.filter(o => o.severity === 'warning').length;
    
    container.innerHTML = `
        <div class="metric-card">
            <div class="metric-value">${totalAffected.toLocaleString()}</div>
            <div class="metric-label">Total Affected Users</div>
        </div>
        <div class="metric-card">
            <div class="metric-value" style="color: var(--error-red);">${criticalCount}</div>
            <div class="metric-label">Critical Outages</div>
        </div>
        <div class="metric-card">
            <div class="metric-value" style="color: var(--warning-amber);">${warningCount}</div>
            <div class="metric-label">Warning Outages</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${activeOutages.length}</div>
            <div class="metric-label">Active Incidents</div>
        </div>
    `;
}

function renderSystemLogs() {
    const container = document.getElementById('logList');
    if (!container) return;
    
    container.innerHTML = systemLogs.slice().reverse().map(log => `
        <div class="log-entry ${log.type}">
            <span class="log-time">${log.time}</span> ${log.message}
        </div>
    `).join('');
}

// ========= SIMULATE REAL-TIME LOGS =========
function addSystemLog(message, type = 'info') {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    systemLogs.push({ time: timeStr, message: message, type: type });
    if (systemLogs.length > 50) systemLogs.shift();
    renderSystemLogs();
    
    // Auto-scroll log container
    const logContainer = document.querySelector('.log-container');
    if (logContainer) logContainer.scrollTop = logContainer.scrollHeight;
}

function startRealTimeSimulation() {
    setInterval(() => {
        const events = [
            { msg: "📡 Polling all network nodes...", type: "info" },
            { msg: "✅ Health check passed for 12/12 servers", type: "success" },
            { msg: "⚠️ Response time increased by 8%", type: "warning" },
            { msg: "📊 Traffic analysis completed", type: "info" }
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        addSystemLog(randomEvent.msg, randomEvent.type);
        
        // Update badge
        const badge = document.getElementById('globalUnreadBadge');
        if (badge) {
            let count = parseInt(badge.innerText) || 0;
            badge.innerText = count + 1;
        }
    }, 20000);
}

// ========= EVENT HANDLERS =========
window.selectOutage = function(id) {
    const selected = activeOutages.find(o => o.id === id);
    if (selected) {
        currentSelectedOutage = selected;
        renderOutageCards();
        renderOutageDetail();
        addSystemLog(`Viewing details for outage: ${selected.title}`, 'info');
        showToast(`Viewing ${selected.title}`, 'info');
    }
};

const clearLogsBtn = document.getElementById('clearLogsBtn');
if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
        systemLogs = [];
        renderSystemLogs();
        addSystemLog('Logs cleared by operator', 'info');
        showToast('Logs cleared', 'success');
    });
}

const exportLogsBtn = document.getElementById('exportLogsBtn');
if (exportLogsBtn) {
    exportLogsBtn.addEventListener('click', () => {
        const logText = systemLogs.map(l => `[${l.time}] ${l.message}`).join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `outage-logs-${new Date().toISOString().slice(0,19)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Logs exported successfully', 'success');
    });
}

const escalateCriticalBtn = document.getElementById('escalateCriticalBtn');
if (escalateCriticalBtn) {
    escalateCriticalBtn.addEventListener('click', () => {
        addSystemLog('🚨 CRITICAL: Outage escalated to Level 2 support team', 'critical');
        showToast('Outage escalated to Level 2 support', 'error');
    });
}

const notifyTechBtn = document.getElementById('notifyTechBtn');
if (notifyTechBtn) {
    notifyTechBtn.addEventListener('click', () => {
        addSystemLog('📢 Technical team notified for immediate action', 'warning');
        showToast('Technical team notified', 'warning');
    });
}

const broadcastBtn = document.getElementById('broadcastBtn');
if (broadcastBtn) {
    broadcastBtn.addEventListener('click', () => {
        addSystemLog('📣 Broadcast message sent to affected customers', 'info');
        showToast('Broadcast sent to customers', 'success');
    });
}

const resolveOutageBtn = document.getElementById('resolveOutageBtn');
if (resolveOutageBtn) {
    resolveOutageBtn.addEventListener('click', () => {
        if (currentSelectedOutage) {
            addSystemLog(`✅ Outage "${currentSelectedOutage.title}" marked as RESOLVED`, 'success');
            activeOutages = activeOutages.filter(o => o.id !== currentSelectedOutage.id);
            if (activeOutages.length > 0) {
                currentSelectedOutage = activeOutages[0];
            } else {
                currentSelectedOutage = null;
                document.getElementById('outageDetailBody').innerHTML = '<div class="placeholder-text">No active outages. All systems operational.</div>';
            }
            renderOutageCards();
            renderImpactMetrics();
            if (currentSelectedOutage) renderOutageDetail();
            showToast('Outage marked as resolved', 'success');
        } else {
            showToast('No outage selected', 'error');
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
    
    if (type === 'error') {
        if (icon) icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
        toast.style.background = '#b82030';
    } else if (type === 'warning') {
        if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
        toast.style.background = '#E67E22';
    } else if (type === 'info') {
        if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
        toast.style.background = '#1a1a1a';
    } else {
        if (icon) icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
        toast.style.background = '#1a1a1a';
    }
    
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========= SEARCH FUNCTIONALITY =========
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = activeOutages.filter(o => 
            o.title.toLowerCase().includes(term) || 
            o.region.toLowerCase().includes(term) ||
            o.serviceType.toLowerCase().includes(term)
        );
        const grid = document.getElementById('outageGrid');
        if (grid) {
            grid.innerHTML = filtered.map(outage => `
                <div class="outage-card ${outage.severity}" onclick="selectOutage(${outage.id})">
                    <div class="outage-title">${outage.title}</div>
                    <div class="outage-status"><span class="status-badge status-${outage.status.toLowerCase()}">● ${outage.status}</span></div>
                    <div>📍 ${outage.region}</div>
                    <div class="outage-stats">
                        <span>👥 ${outage.affectedUsers.toLocaleString()} users</span>
                        <span>⏱️ ${outage.duration}</span>
                    </div>
                </div>
            `).join('');
            if (filtered.length === 0 && grid) {
                grid.innerHTML = '<div class="placeholder-text" style="grid-column:1/-1;">No outages match your search</div>';
            }
        }
    });
}

// ========= INITIALIZE =========
function init() {
    renderOutageCards();
    renderOutageDetail();
    renderImpactMetrics();
    renderSystemLogs();
    startRealTimeSimulation();
    addSystemLog('Live monitoring started', 'success');
}

init();

// Export for global use
window.showToast = showToast;
window.selectOutage = selectOutage;