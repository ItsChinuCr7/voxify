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

// ========= DROPDOWNS =========
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

// ========= TICKET DATA =========
const tickets = [
    { id: 'TKT-9901', customer: 'TechCorp Inc', issue: 'Server Failure - Authentication', priority: 'Critical', status: 'Open', created: '2025-04-14 09:30', description: 'Authentication server is down, users unable to login. Impacting 500+ enterprise customers.', assignedTo: 'John (Senior Engineer)', resolution: null, timeline: [{ time: '09:30', action: 'Ticket created by monitoring system', user: 'System' }, { time: '09:35', action: 'Alert sent to NOC team', user: 'System' }] },
    { id: 'TKT-9902', customer: 'John Smith', issue: 'Broadband Outage - Fiber Cut', priority: 'Critical', status: 'In Progress', created: '2025-04-14 08:15', description: 'Complete internet outage due to fiber optic cable damage during road work.', assignedTo: 'Rahul K (Field Technician)', resolution: null, timeline: [{ time: '08:15', action: 'Ticket created by customer', user: 'John Smith' }, { time: '08:30', action: 'Ticket assigned to NOC team', user: 'System' }, { time: '08:45', action: 'Technician dispatched to site', user: 'Dispatch Team' }] },
    { id: 'TKT-9903', customer: 'Sarah Jones', issue: 'Network Congestion - BKC', priority: 'High', status: 'In Progress', created: '2025-04-14 10:00', description: 'Slow network speeds and high latency in BKC business district during peak hours.', assignedTo: 'Network Team', resolution: null, timeline: [{ time: '10:00', action: 'Ticket created', user: 'Sarah Jones' }, { time: '10:15', action: 'Network team investigating', user: 'System' }] },
    { id: 'TKT-9904', customer: 'Mike Brown', issue: 'DNS Resolution Issue', priority: 'High', status: 'Open', created: '2025-04-14 10:45', description: 'Unable to resolve domain names. Websites not loading.', assignedTo: null, resolution: null, timeline: [{ time: '10:45', action: 'Ticket created', user: 'Mike Brown' }] },
    { id: 'TKT-9905', customer: 'Emily Davis', issue: 'Voice Call Problem', priority: 'Medium', status: 'In Progress', created: '2025-04-14 11:15', description: 'Calls dropping frequently. Unable to make outgoing calls.', assignedTo: 'Voice Team', resolution: null, timeline: [{ time: '11:15', action: 'Ticket created', user: 'Emily Davis' }, { time: '11:30', action: 'Assigned to Voice Team', user: 'System' }] },
    { id: 'TKT-9906', customer: 'David Wilson', issue: 'Slow Internet Speed', priority: 'Low', status: 'Resolved', created: '2025-04-13 14:30', description: 'Internet speed dropping below 10 Mbps consistently.', assignedTo: 'Vikram S', resolution: 'Router configuration fixed. Speed restored to 100 Mbps.', timeline: [{ time: '14:30', action: 'Ticket created', user: 'David Wilson' }, { time: '15:00', action: 'Technician assigned', user: 'System' }, { time: '16:30', action: 'Issue resolved - Router reset and firmware updated', user: 'Vikram S' }] },
    { id: 'TKT-9907', customer: 'Lisa Anderson', issue: 'Billing System Error', priority: 'Medium', status: 'Open', created: '2025-04-14 09:00', description: 'Wrong amount charged on monthly bill. Overcharged by ₹500.', assignedTo: null, resolution: null, timeline: [{ time: '09:00', action: 'Ticket created', user: 'Lisa Anderson' }] }
];

const outages = [
    { title: 'Server Failure', region: 'Sector 7', affected: '1200+', duration: '45 mins', severity: 'critical' },
    { title: 'Network Instability', region: 'Downtown', affected: '530', duration: '20 mins', severity: 'high' },
    { title: 'Minor Service Lag', region: 'Suburbs', affected: '120', duration: '10 mins', severity: 'low' }
];

let currentFilter = { status: 'all', priority: 'all', search: '' };

// ========= RENDER FUNCTIONS =========
function getPriorityClass(priority) {
    switch(priority) { case 'Critical': return 'priority-critical'; case 'High': return 'priority-high'; case 'Medium': return 'priority-medium'; default: return 'priority-low'; }
}
function getStatusClass(status) {
    switch(status) { case 'Open': return 'status-open'; case 'In Progress': return 'status-progress'; default: return 'status-resolved'; }
}

function renderTicketTable() {
    const tbody = document.getElementById('ticketTableBody');
    if (!tbody) return;
    let filtered = tickets.filter(t => {
        if (currentFilter.status !== 'all' && t.status !== currentFilter.status) return false;
        if (currentFilter.priority !== 'all' && t.priority !== currentFilter.priority) return false;
        if (currentFilter.search && !t.id.toLowerCase().includes(currentFilter.search.toLowerCase()) && !t.customer.toLowerCase().includes(currentFilter.search.toLowerCase()) && !t.issue.toLowerCase().includes(currentFilter.search.toLowerCase())) return false;
        return true;
    });
    if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px;">No tickets found</td></tr>'; document.getElementById('ticketCount').innerText = 'Showing 0 tickets'; return; }
    tbody.innerHTML = filtered.map(ticket => ` <tr><td><strong>${ticket.id}</strong></td><td>${ticket.customer}</td><td>${ticket.issue}</td><td><span class="priority-badge ${getPriorityClass(ticket.priority)}">${ticket.priority}</span></td><td><span class="status-badge ${getStatusClass(ticket.status)}">${ticket.status}</span></td><td>${ticket.created}</td><td><a href="#" class="action-link" onclick="viewTicketDetails('${ticket.id}'); return false;">View Details →</a></td></tr>`).join('');
    document.getElementById('ticketCount').innerText = `Showing ${filtered.length} tickets`;
}

function renderOutageCards() {
    const container = document.getElementById('outageCardsList');
    if (!container) return;
    container.innerHTML = outages.map(outage => ` <div class="outage-card ${outage.severity}"><div class="outage-header"><h4>${outage.title}</h4><span class="outage-badge ${outage.severity}">${outage.severity.toUpperCase()}</span></div><div class="outage-details"><p><strong>📍 Region:</strong> ${outage.region}</p><p><strong>👥 Affected Users:</strong> ${outage.affected}</p><p><strong>⏱️ Duration:</strong> ${outage.duration}</p></div><div class="outage-actions"><button class="outage-btn ${outage.severity === 'critical' ? 'danger' : (outage.severity === 'high' ? 'warning' : 'info')}" onclick="handleOutageAction('${outage.title}', 'dispatch')">${outage.severity === 'critical' ? '🚨 Dispatch' : '👨‍🔧 Assign'}</button><button class="outage-btn info" onclick="handleOutageAction('${outage.title}', 'monitor')">📊 Monitor</button></div></div>`).join('');
}

function viewTicketDetails(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const modal = document.getElementById('ticketDetailModal');
    const body = document.getElementById('ticketDetailBody');
    document.getElementById('modalTicketTitle').textContent = `Ticket #${ticket.id}`;
    body.innerHTML = ` <div class="ticket-detail-header"><h2>${ticket.issue}</h2><p>${ticket.description}</p></div><div class="ticket-detail-grid"><div class="ticket-detail-item"><div class="ticket-detail-label">Customer</div><div class="ticket-detail-value">${ticket.customer}</div></div><div class="ticket-detail-item"><div class="ticket-detail-label">Priority</div><div class="ticket-detail-value"><span class="priority-badge ${getPriorityClass(ticket.priority)}">${ticket.priority}</span></div></div><div class="ticket-detail-item"><div class="ticket-detail-label">Status</div><div class="ticket-detail-value"><span class="status-badge ${getStatusClass(ticket.status)}">${ticket.status}</span></div></div><div class="ticket-detail-item"><div class="ticket-detail-label">Created</div><div class="ticket-detail-value">${ticket.created}</div></div><div class="ticket-detail-item"><div class="ticket-detail-label">Assigned To</div><div class="ticket-detail-value">${ticket.assignedTo || 'Not assigned yet'}</div></div>${ticket.resolution ? `<div class="ticket-detail-item"><div class="ticket-detail-label">Resolution</div><div class="ticket-detail-value">${ticket.resolution}</div></div>` : ''}</div><div class="timeline"><h4 style="margin-bottom: 16px;">📋 Activity Timeline</h4>${ticket.timeline.map(item => `<div class="timeline-item"><div class="timeline-time">${item.time}</div><div class="timeline-text"><strong>${item.action}</strong><br><span style="font-size: 11px; color: var(--text-secondary);">by ${item.user}</span></div></div>`).join('')}</div>`;
    modal.classList.add('show');
}

window.viewTicketDetails = viewTicketDetails;
window.handleOutageAction = function(title, action) { showToast(`${action === 'dispatch' ? 'Dispatch team notified for' : 'Monitoring'} ${title}`, action === 'dispatch' ? 'error' : 'info'); };

// ========= FILTERS =========
document.getElementById('applyFiltersBtn').addEventListener('click', () => {
    currentFilter.status = document.getElementById('statusFilter').value;
    currentFilter.priority = document.getElementById('priorityFilter').value;
    renderTicketTable();
    showToast('Filters applied', 'success');
});
document.getElementById('resetFiltersBtn').addEventListener('click', () => {
    currentFilter = { status: 'all', priority: 'all', search: '' };
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('searchTicket').value = '';
    document.getElementById('searchTickets').value = '';
    renderTicketTable();
    showToast('Filters reset', 'info');
});
document.getElementById('searchTicket').addEventListener('input', (e) => { currentFilter.search = e.target.value; renderTicketTable(); });
document.getElementById('searchTickets').addEventListener('input', (e) => { currentFilter.search = e.target.value; document.getElementById('searchTicket').value = e.target.value; renderTicketTable(); });

// ========= EXPORT =========
document.getElementById('exportTicketsBtn').addEventListener('click', () => {
    let csv = 'Ticket ID,Customer,Issue,Priority,Status,Created\n';
    tickets.forEach(t => csv += `${t.id},${t.customer},${t.issue},${t.priority},${t.status},${t.created}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-export-${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Tickets exported successfully', 'success');
});
document.getElementById('viewAllOutagesBtn').addEventListener('click', () => showToast('Navigating to outage alerts page', 'info'));

// ========= MODAL =========
function closeModal() { document.getElementById('ticketDetailModal').classList.remove('show'); }
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === document.getElementById('ticketDetailModal')) closeModal(); });

// ========= TOAST =========
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

// ========= INIT =========
renderTicketTable();
renderOutageCards();
window.showToast = showToast;