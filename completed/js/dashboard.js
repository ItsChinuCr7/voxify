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

// ========= MOCK DATA =========
const recentTickets = [
    { id: '#TKT-10234', customer: 'John Smith', issue: 'Broadband Outage', priority: 'Critical', status: 'Open', time: '2 min ago' },
    { id: '#TKT-10567', customer: 'Sarah Jones', issue: 'No Internet', priority: 'High', status: 'In Progress', time: '15 min ago' },
    { id: '#TKT-10892', customer: 'Mike Brown', issue: 'Voice Call Issue', priority: 'Medium', status: 'In Progress', time: '1 hour ago' },
    { id: '#TKT-10934', customer: 'Emily Davis', issue: 'Slow 5G Speed', priority: 'Low', status: 'Assigned', time: '2 hours ago' },
    { id: '#TKT-11201', customer: 'David Wilson', issue: 'Fiber Cut', priority: 'Critical', status: 'Open', time: '3 hours ago' }
];

const liveAlerts = [
    { title: '⚠️ Server Down Alert', message: 'Authentication server is experiencing issues', severity: 'critical', time: '2 min ago' },
    { title: '📞 Ticket Escalated', message: 'Ticket #TKT-10234 escalated to Level 2', severity: 'warning', time: '15 min ago' },
    { title: '✅ Issue Resolved', message: 'Broadband outage in Andheri resolved', severity: 'success', time: '1 hour ago' },
    { title: '🔔 New Complaint', message: '5 new complaints received in last hour', severity: 'info', time: '2 hours ago' },
    { title: '⚠️ SLA Alert', message: 'Ticket #TKT-10567 nearing SLA breach', severity: 'critical', time: '3 hours ago' }
];

const activeOutages = [
    { area: 'Andheri West', issue: 'Fiber Optic Cut', severity: 'Critical', eta: '2 hours', affected: '2,500+ users' },
    { area: 'Goregaon', issue: 'Network Congestion', severity: 'High', eta: '1 hour', affected: '1,200+ users' },
    { area: 'Malad', issue: 'Power Fluctuation', severity: 'Medium', eta: '4 hours', affected: '800+ users' }
];

// ========= RENDER FUNCTIONS =========
function renderRecentTickets() {
    const tbody = document.getElementById('recentTicketsBody');
    if (!tbody) return;
    
    tbody.innerHTML = recentTickets.map(ticket => {
        let priorityClass = '';
        if (ticket.priority === 'Critical') priorityClass = 'priority-critical';
        else if (ticket.priority === 'High') priorityClass = 'priority-high';
        else if (ticket.priority === 'Medium') priorityClass = 'priority-medium';
        else priorityClass = 'priority-low';
        
        let statusClass = '';
        if (ticket.status === 'Open') statusClass = 'status-open';
        else if (ticket.status === 'In Progress') statusClass = 'status-progress';
        else if (ticket.status === 'Resolved') statusClass = 'status-resolved';
        else statusClass = 'status-closed';
        
        return `
            <tr>
                <td><strong>${ticket.id}</strong><br><small>${ticket.time}</small></td>
                <td>${ticket.customer}</td>
                <td>${ticket.issue}</td>
                <td><span class="priority-badge ${priorityClass}">${ticket.priority}</span></td>
                <td><span class="status-badge ${statusClass}">${ticket.status}</span></td>
                <td><button class="btn secondary-btn" style="padding:4px 8px; font-size:11px;" onclick="viewTicket('${ticket.id}')">View</button></td>
            </tr>
        `;
    }).join('');
}

function renderLiveAlerts() {
    const container = document.getElementById('liveAlertsList');
    if (!container) return;
    
    container.innerHTML = liveAlerts.map(alert => `
        <div class="alert-item ${alert.severity}">
            <div class="alert-title">${alert.title}</div>
            <div class="alert-message" style="font-size:12px; margin:4px 0;">${alert.message}</div>
            <div class="alert-time">🕐 ${alert.time}</div>
        </div>
    `).join('');
}

function renderOutages() {
    const container = document.getElementById('outageList');
    if (!container) return;
    
    if (activeOutages.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);">No active outages</div>';
        return;
    }
    
    container.innerHTML = activeOutages.map(outage => `
        <div class="outage-item">
            <div>
                <div class="outage-area">📍 ${outage.area}</div>
                <div style="font-size:12px; color:var(--text-secondary);">${outage.issue}</div>
                <div style="font-size:11px; margin-top:4px;">👥 ${outage.affected}</div>
            </div>
            <div style="text-align:right;">
                <div><span class="priority-badge priority-critical">${outage.severity}</span></div>
                <div style="font-size:11px; margin-top:4px;">⏱️ ETA: ${outage.eta}</div>
            </div>
        </div>
    `).join('');
}

// ========= CHART INITIALIZATION =========
function initCharts() {
    // Line Chart - Ticket Trend
    const lineCtx = document.getElementById('lineChart')?.getContext('2d');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Tickets',
                    data: [45, 62, 78, 55, 89, 72, 48],
                    borderColor: '#1F4FD8',
                    backgroundColor: 'rgba(31, 79, 216, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#1F4FD8',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'top' } }
            }
        });
    }
    
    // Bar Chart - Issue Distribution
    const barCtx = document.getElementById('barChart')?.getContext('2d');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Network', 'Server', 'Application', 'Hardware', 'Billing'],
                datasets: [{
                    label: 'Complaints',
                    data: [142, 98, 76, 54, 32],
                    backgroundColor: ['#DC3545', '#E67E22', '#FFC107', '#28A745', '#1F4FD8'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'top' } }
            }
        });
    }
}

// ========= EVENT HANDLERS =========
window.viewTicket = function(ticketId) {
    showToast(`Viewing details for ${ticketId}`, 'info');
};

const refreshAlertsBtn = document.getElementById('refreshAlertsBtn');
if (refreshAlertsBtn) {
    refreshAlertsBtn.addEventListener('click', () => {
        showToast('Alerts refreshed!', 'success');
        renderLiveAlerts();
    });
}

const viewAllBtn = document.getElementById('viewAllBtn');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
        showToast('Navigating to all tickets...', 'info');
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

// ========= SIMULATE REAL-TIME UPDATES =========
function startRealTimeSimulation() {
    setInterval(() => {
        const newAlert = {
            title: '📡 New Outage Detected',
            message: 'Network disruption reported in Powai area',
            severity: 'warning',
            time: 'Just now'
        };
        liveAlerts.unshift(newAlert);
        if (liveAlerts.length > 10) liveAlerts.pop();
        renderLiveAlerts();
        
        const badge = document.getElementById('globalUnreadBadge');
        if (badge) {
            let count = parseInt(badge.innerText) || 0;
            badge.innerText = count + 1;
        }
    }, 45000);
}

// ========= INITIALIZE =========
function init() {
    renderRecentTickets();
    renderLiveAlerts();
    renderOutages();
    initCharts();
    startRealTimeSimulation();
}

init();

// Export for global use
window.showToast = showToast;