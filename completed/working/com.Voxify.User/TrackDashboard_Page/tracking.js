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

// ========= TICKET DATA =========
const ticketsData = {
    'TKT-9901': {
        id: 'TKT-9901',
        title: 'Server Failure - Authentication Service',
        priority: 'critical',
        status: 'Open',
        customer: 'John Doe',
        issue: 'Server Down - Unable to authenticate',
        created: '2025-04-14 09:30',
        lastUpdated: '2025-04-14 09:30',
        currentStep: 1,
        steps: [
            { name: 'Ticket Created', completed: true, date: '2025-04-14 09:30', description: 'Ticket automatically generated' },
            { name: 'Assigned', completed: false, date: null, description: 'Awaiting assignment to technician' },
            { name: 'In Progress', completed: false, date: null, description: 'Technician will investigate' },
            { name: 'Resolved', completed: false, date: null, description: 'Issue fixed and verified' },
            { name: 'Closed', completed: false, date: null, description: 'Ticket closed with feedback' }
        ]
    },
    'TKT-9902': {
        id: 'TKT-9902',
        title: 'Network Instability',
        priority: 'high',
        status: 'In Progress',
        customer: 'John Doe',
        issue: 'Network Issue - Frequent disconnections',
        created: '2025-04-14 08:15',
        lastUpdated: '2025-04-14 10:30',
        currentStep: 3,
        steps: [
            { name: 'Ticket Created', completed: true, date: '2025-04-14 08:15', description: 'Ticket created by customer' },
            { name: 'Assigned', completed: true, date: '2025-04-14 08:45', description: 'Assigned to Network Team' },
            { name: 'In Progress', completed: true, date: '2025-04-14 10:30', description: 'Engineer investigating' },
            { name: 'Resolved', completed: false, date: null, description: 'Awaiting resolution' },
            { name: 'Closed', completed: false, date: null, description: 'Will close after confirmation' }
        ]
    },
    'TKT-9903': {
        id: 'TKT-9903',
        title: 'Password Reset Request',
        priority: 'low',
        status: 'Resolved',
        customer: 'John Doe',
        issue: 'Password Reset - Account access',
        created: '2025-04-13 14:30',
        lastUpdated: '2025-04-14 09:00',
        currentStep: 5,
        steps: [
            { name: 'Ticket Created', completed: true, date: '2025-04-13 14:30', description: 'Password reset requested' },
            { name: 'Assigned', completed: true, date: '2025-04-13 15:00', description: 'Assigned to support agent' },
            { name: 'In Progress', completed: true, date: '2025-04-13 15:30', description: 'Verification in progress' },
            { name: 'Resolved', completed: true, date: '2025-04-14 08:30', description: 'Password reset completed' },
            { name: 'Closed', completed: true, date: '2025-04-14 09:00', description: 'Ticket closed' }
        ]
    }
};

const userTickets = [
    { id: 'TKT-9901', issue: 'Server Failure - Authentication', priority: 'Critical', status: 'Open', created: '2025-04-14 09:30' },
    { id: 'TKT-9902', issue: 'Network Instability', priority: 'High', status: 'In Progress', created: '2025-04-14 08:15' },
    { id: 'TKT-9903', issue: 'Password Reset Request', priority: 'Low', status: 'Resolved', created: '2025-04-13 14:30' }
];

let currentTicket = null;

// ========= HELPER FUNCTIONS =========
function getPriorityClass(priority) {
    switch(priority.toLowerCase()) {
        case 'critical': return 'critical';
        case 'high': return 'high';
        case 'medium': return 'medium';
        default: return 'low';
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'Open': return 'status-open';
        case 'In Progress': return 'status-progress';
        default: return 'status-resolved';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'Pending';
    return dateStr;
}

// ========= RENDER FUNCTIONS =========
function renderTicketQueue() {
    const tbody = document.getElementById('ticketTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = userTickets.map(ticket => {
        let rowClass = '';
        if (ticket.priority === 'Critical') rowClass = 'ticket-row critical';
        else if (ticket.priority === 'High') rowClass = 'ticket-row high';
        else rowClass = 'ticket-row low';
        
        return `
            <tr class="${rowClass}" onclick="viewTicketDetails('${ticket.id}')" style="cursor:pointer;">
                <td><strong>${ticket.id}</strong></td>
                <td>${ticket.issue}</td>
                <td><span class="priority-badge ${getPriorityClass(ticket.priority)}">${ticket.priority}</span></td>
                <td><span class="status-badge ${getStatusClass(ticket.status)}">${ticket.status}</span></td>
                <td>${ticket.created}</td>
                <td><a href="#" class="action-link" onclick="viewTicketDetails('${ticket.id}'); return false;">Track →</a></td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('ticketCount').innerText = `Showing ${userTickets.length} tickets`;
}

function renderTicketDetails(ticketId) {
    const ticket = ticketsData[ticketId];
    if (!ticket) return false;
    
    currentTicket = ticket;
    
    // Show the details card
    const detailsCard = document.getElementById('ticketDetailsCard');
    if (detailsCard) detailsCard.style.display = 'block';
    
    // Update header
    document.getElementById('trackTicketTitle').innerHTML = `Ticket #${ticket.id}`;
    document.getElementById('trackTicketSubtitle').innerText = ticket.title;
    const priorityBadge = document.getElementById('trackPriorityBadge');
    priorityBadge.innerText = ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1);
    priorityBadge.className = `priority-badge ${getPriorityClass(ticket.priority)}`;
    
    // Update info grid
    const infoGrid = document.getElementById('trackTicketInfo');
    infoGrid.innerHTML = `
        <div class="info-item"><div class="info-label">Customer</div><div class="info-value">${ticket.customer}</div></div>
        <div class="info-item"><div class="info-label">Issue Type</div><div class="info-value">${ticket.issue}</div></div>
        <div class="info-item"><div class="info-label">Created</div><div class="info-value">${ticket.created}</div></div>
        <div class="info-item"><div class="info-label">Last Updated</div><div class="info-value">${ticket.lastUpdated}</div></div>
        <div class="info-item"><div class="info-label">Current Status</div><div class="info-value"><span class="status-badge ${getStatusClass(ticket.status)}">${ticket.status}</span></div></div>
    `;
    
    // Render timeline steps
    const timelineContainer = document.getElementById('timelineSteps');
    timelineContainer.innerHTML = ticket.steps.map((step, index) => {
        let stepClass = '';
        if (step.completed) stepClass = 'completed';
        else if (index + 1 === ticket.currentStep) stepClass = 'active';
        
        return `
            <div class="step ${stepClass}">
                <div class="step-dot">${step.completed ? '✓' : (index + 1)}</div>
                <div class="step-label">${step.name}</div>
                <div class="step-date">${step.date ? formatDate(step.date) : 'Pending'}</div>
                <div class="step-desc" style="font-size: 10px; color: var(--text-secondary); margin-top: 5px;">${step.description}</div>
            </div>
        `;
    }).join('');
    
    return true;
}

// ========= EVENT HANDLERS =========
window.viewTicketDetails = function(ticketId) {
    if (renderTicketDetails(ticketId)) {
        showToast(`Loading details for ${ticketId}`, 'info');
        // Scroll to details
        document.getElementById('ticketDetailsCard').scrollIntoView({ behavior: 'smooth' });
    } else {
        showToast('Ticket details not found', 'error');
    }
};

const trackBtn = document.getElementById('trackBtn');
if (trackBtn) {
    trackBtn.addEventListener('click', () => {
        const ticketId = document.getElementById('trackTicketId').value.trim().toUpperCase();
        if (!ticketId) {
            showToast('Please enter a Ticket ID', 'error');
            return;
        }
        
        if (ticketsData[ticketId]) {
            renderTicketDetails(ticketId);
            showToast(`Tracking ticket ${ticketId}`, 'success');
        } else {
            showToast(`Ticket ${ticketId} not found. Please check the ID.`, 'error');
        }
    });
}

const refreshStatusBtn = document.getElementById('refreshStatusBtn');
if (refreshStatusBtn) {
    refreshStatusBtn.addEventListener('click', () => {
        if (currentTicket) {
            showToast(`Status refreshed for ${currentTicket.id}`, 'success');
        } else {
            showToast('No ticket selected', 'info');
        }
    });
}

const shareStatusBtn = document.getElementById('shareStatusBtn');
if (shareStatusBtn) {
    shareStatusBtn.addEventListener('click', () => {
        if (currentTicket) {
            showToast(`Status link for ${currentTicket.id} copied to clipboard`, 'success');
        } else {
            showToast('No ticket selected', 'info');
        }
    });
}

const refreshQueueBtn = document.getElementById('refreshQueueBtn');
if (refreshQueueBtn) {
    refreshQueueBtn.addEventListener('click', () => {
        renderTicketQueue();
        showToast('Ticket queue refreshed', 'success');
    });
}

// Global search from navbar
const globalSearch = document.getElementById('searchInput');
if (globalSearch) {
    globalSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const ticketId = e.target.value.trim().toUpperCase();
            if (ticketId && ticketsData[ticketId]) {
                renderTicketDetails(ticketId);
                document.getElementById('trackTicketId').value = ticketId;
                showToast(`Tracking ticket ${ticketId}`, 'success');
            } else if (ticketId) {
                showToast(`Ticket ${ticketId} not found`, 'error');
            }
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

// ========= INITIALIZE =========
function init() {
    renderTicketQueue();
}

init();

// Export for global use
window.showToast = showToast;
window.viewTicketDetails = viewTicketDetails;