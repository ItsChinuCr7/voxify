// ================= SIDEBAR TOGGLE =================
const sidebar = document.getElementById('voxifySidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const layout = document.getElementById('voxifyLayout');

function toggleSidebar() {
    if (sidebar && layout) {
        sidebar.classList.toggle('collapsed');
        layout.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
}

if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar?.classList.add('collapsed');
            layout?.classList.add('sidebar-collapsed');
        }
    });
}

if (localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar?.classList.add('collapsed');
    layout?.classList.add('sidebar-collapsed');
}

// ================= DROPDOWNS =================
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');

profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown?.classList.toggle('show');
});

statusQuickBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    statusDropdown?.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (profileDropdown && !profileBtn?.contains(e.target)) profileDropdown.classList.remove('show');
    if (statusDropdown && !statusQuickBtn?.contains(e.target)) statusDropdown.classList.remove('show');
});

// ================= TOAST =================
let toastTimer;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ================= SAMPLE DATA =================
const sampleComplaints = [
    { id: 'CMP-10241', title: 'Internet Connectivity Issue', location: 'Andheri West', category: 'Network', status: 'active', date: '2026-04-15T10:30:00' },
    { id: 'CMP-10242', title: 'Billing Discrepancy', location: 'Bandra', category: 'Billing', status: 'progress', date: '2026-04-14T15:20:00' },
    { id: 'CMP-10243', title: 'Technician No Show', location: 'Juhu', category: 'Service', status: 'active', date: '2026-04-14T11:45:00' },
    { id: 'CMP-10244', title: 'Power Outage', location: 'Powai', category: 'Outage', status: 'resolved', date: '2026-04-13T09:15:00' },
    { id: 'CMP-10245', title: 'Slow Internet Speed', location: 'Goregaon', category: 'Network', status: 'progress', date: '2026-04-12T17:30:00' }
];

const sampleOutages = [
    { id: 'OUT-001', title: 'Network Outage', location: 'Andheri West', severity: 'critical', users: 1250, detectedAt: '2026-04-17T10:30:00' },
    { id: 'OUT-002', title: 'Mobile Network Down', location: 'Bandra', severity: 'warning', users: 850, detectedAt: '2026-04-17T09:15:00' },
    { id: 'OUT-003', title: 'Broadband Issue', location: 'Juhu', severity: 'critical', users: 2100, detectedAt: '2026-04-17T08:00:00' }
];

// Load from localStorage
let complaints = [];
let outages = [];

function loadData() {
    const savedComplaints = localStorage.getItem('voxify_complaints');
    if (savedComplaints) {
        try {
            complaints = JSON.parse(savedComplaints);
        } catch(e) {}
    }
    
    if (!complaints || complaints.length === 0) {
        complaints = [...sampleComplaints];
    }
    
    const savedOutages = localStorage.getItem('voxify_outages');
    if (savedOutages) {
        try {
            outages = JSON.parse(savedOutages);
        } catch(e) {}
    }
    
    if (!outages || outages.length === 0) {
        outages = [...sampleOutages];
    }
}

// ================= UPDATE STATS =================
function updateStats() {
    const activeCount = complaints.filter(c => c.status === 'active').length;
    const progressCount = complaints.filter(c => c.status === 'progress').length;
    const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
    const totalCount = complaints.length;
    
    document.getElementById('statActive').textContent = activeCount;
    document.getElementById('statProgress').textContent = progressCount;
    document.getElementById('statResolved').textContent = resolvedCount;
    document.getElementById('statTotal').textContent = totalCount;
    
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('progressCount').textContent = progressCount;
    document.getElementById('resolvedCount').textContent = resolvedCount;
    document.getElementById('sidebarComplaintCount').textContent = totalCount;
    document.getElementById('notifBadge').textContent = activeCount + progressCount;
}

// ================= FORMAT DATE =================
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
        return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
    } else {
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }
}

// ================= RENDER RECENT COMPLAINTS =================
function renderRecentComplaints() {
    const container = document.getElementById('recentComplaintsList');
    if (!container) return;
    
    const recent = [...complaints].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = '<div class="empty-state"><div>📭</div><p>No complaints yet</p><span>Submit your first complaint</span></div>';
        return;
    }
    
    container.innerHTML = recent.map(complaint => `
        <div class="complaint-item" onclick="window.location.href='complaint-dashboard.html'">
            <div class="complaint-info">
                <div class="complaint-id">${complaint.id}</div>
                <div class="complaint-title">${complaint.title}</div>
                <div class="complaint-date">${formatDate(complaint.date)} • ${complaint.location}</div>
            </div>
            <div>
                <span class="status-badge ${complaint.status}">${complaint.status === 'active' ? 'Active' : complaint.status === 'progress' ? 'In Progress' : 'Resolved'}</span>
            </div>
        </div>
    `).join('');
}

// ================= RENDER OUTAGES =================
function renderOutages() {
    const container = document.getElementById('outagesList');
    if (!container) return;
    
    const activeOutages = outages.filter(o => o.severity !== 'resolved');
    
    if (activeOutages.length === 0) {
        container.innerHTML = '<div class="empty-state"><div>✅</div><p>No active outages</p><span>All systems operational</span></div>';
        return;
    }
    
    container.innerHTML = activeOutages.map(outage => `
        <div class="outage-item" onclick="window.location.href='outage-alerts.html'">
            <div class="outage-info">
                <div class="complaint-id">⚠️ ${outage.title}</div>
                <div class="outage-location">📍 ${outage.location}</div>
                <div class="complaint-date">👥 ${outage.users.toLocaleString()} users affected • ${formatDate(outage.detectedAt)}</div>
            </div>
            <div>
                <span class="severity-badge ${outage.severity}">${outage.severity.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

// ================= UPDATE DATE/TIME =================
function updateDateTime() {
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        dateTimeElement.textContent = now.toLocaleDateString('en-IN', options);
    }
}

// ================= SEARCH FUNCTIONALITY =================
const searchInput = document.getElementById('dashboardSearch');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (term === '') {
            renderRecentComplaints();
            renderOutages();
        } else {
            const filteredComplaints = complaints.filter(c => 
                c.title.toLowerCase().includes(term) || 
                c.id.toLowerCase().includes(term) ||
                c.location.toLowerCase().includes(term)
            );
            const filteredOutages = outages.filter(o => 
                o.title.toLowerCase().includes(term) || 
                o.location.toLowerCase().includes(term)
            );
            
            const complaintsContainer = document.getElementById('recentComplaintsList');
            const outagesContainer = document.getElementById('outagesList');
            
            if (complaintsContainer) {
                if (filteredComplaints.length === 0) {
                    complaintsContainer.innerHTML = '<div class="empty-state">No matching complaints</div>';
                } else {
                    complaintsContainer.innerHTML = filteredComplaints.slice(0, 5).map(complaint => `
                        <div class="complaint-item" onclick="window.location.href='complaint-dashboard.html'">
                            <div class="complaint-info">
                                <div class="complaint-id">${complaint.id}</div>
                                <div class="complaint-title">${complaint.title}</div>
                                <div class="complaint-date">${complaint.location}</div>
                            </div>
                            <div><span class="status-badge ${complaint.status}">${complaint.status}</span></div>
                        </div>
                    `).join('');
                }
            }
            
            if (outagesContainer) {
                if (filteredOutages.length === 0) {
                    outagesContainer.innerHTML = '<div class="empty-state">No matching outages</div>';
                } else {
                    outagesContainer.innerHTML = filteredOutages.map(outage => `
                        <div class="outage-item" onclick="window.location.href='outage-alerts.html'">
                            <div class="outage-info">
                                <div class="complaint-id">⚠️ ${outage.title}</div>
                                <div class="outage-location">📍 ${outage.location}</div>
                            </div>
                            <div><span class="severity-badge ${outage.severity}">${outage.severity.toUpperCase()}</span></div>
                        </div>
                    `).join('');
                }
            }
        }
    });
}

// ================= SIMULATE REAL-TIME UPDATES =================
let updateInterval = null;

function startRealTimeUpdates() {
    if (updateInterval) clearInterval(updateInterval);
    
    updateInterval = setInterval(() => {
        // Random chance to add a new outage (20% every 30 seconds)
        if (Math.random() < 0.2) {
            const locations = ['Andheri West', 'Bandra', 'Juhu', 'Powai', 'Goregaon', 'Malad', 'Kandivali'];
            const titles = ['Network Fluctuation', 'DNS Issue', 'High Latency', 'Packet Loss', 'Service Degradation'];
            const severities = ['critical', 'warning', 'warning'];
            
            const newOutage = {
                id: `OUT-${Date.now()}`,
                title: titles[Math.floor(Math.random() * titles.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                severity: severities[Math.floor(Math.random() * severities.length)],
                users: Math.floor(Math.random() * 1500) + 100,
                detectedAt: new Date().toISOString()
            };
            
            outages.unshift(newOutage);
            if (outages.length > 10) outages.pop();
            localStorage.setItem('voxify_outages', JSON.stringify(outages));
            
            renderOutages();
            showToast(`⚠️ New outage detected in ${newOutage.location}`, 'warning');
            
            // Update badge
            const notifBadge = document.getElementById('notifBadge');
            if (notifBadge) {
                const current = parseInt(notifBadge.textContent) || 0;
                notifBadge.textContent = current + 1;
            }
        }
    }, 30000);
}

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateStats();
    updateDateTime();
    renderRecentComplaints();
    renderOutages();
    startRealTimeUpdates();
    
    // Update date/time every minute
    setInterval(updateDateTime, 60000);
    
    showToast('Welcome back, John!', 'success');
});

// Make functions global for onclick handlers
window.showToast = showToast;