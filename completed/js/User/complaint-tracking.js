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

// ========= COMPLAINT DATA =========
const complaintsData = {
    'CMP-10241': {
        id: 'CMP-10241',
        ticketId: 'TKT-10241',
        customer: 'Rahul Mehta',
        contact: '+91 98765 43210',
        location: 'Gandhinagar',
        category: 'Network Issue',
        priority: 'high',
        description: 'Internet down since morning. No connectivity for past 6 hours.',
        status: 'In Progress',
        currentStage: 6,
        assignedTo: 'Rahul K (Field Technician)',
        createdAt: '2025-04-15 09:30:00',
        lastUpdated: '2025-04-15 11:45:00',
        escalationLevel: 'Level 1',
        escalationHistory: [],
        stages: [
            { id: 1, name: 'Complaint Submitted', description: 'Unique complaint ID generated', completed: true, completedAt: '2025-04-15 09:30:00', icon: '📝' },
            { id: 2, name: 'Ticket Created', description: 'Unique ticket ID generated and acknowledged', completed: true, completedAt: '2025-04-15 09:31:00', icon: '🎫' },
            { id: 3, name: 'Acknowledged', description: 'System and agent confirmation sent', completed: true, completedAt: '2025-04-15 09:35:00', icon: '✓' },
            { id: 4, name: 'Categorized & Prioritized', description: 'Priority set to High', completed: true, completedAt: '2025-04-15 09:40:00', icon: '🏷️' },
            { id: 5, name: 'Assigned to Team', description: 'Assigned to Network Team', completed: true, completedAt: '2025-04-15 09:45:00', icon: '👥' },
            { id: 6, name: 'In Progress', description: 'Technician dispatched for investigation', completed: true, completedAt: '2025-04-15 10:30:00', icon: '⚙️' },
            { id: 7, name: 'Technician Assigned', description: 'Field technician en route. ETA: 30 mins', completed: false, completedAt: null, icon: '👨‍🔧' },
            { id: 8, name: 'Resolved', description: 'Issue fixed and verified', completed: false, completedAt: null, icon: '✅' },
            { id: 9, name: 'Closed', description: 'Ticket closed and feedback requested', completed: false, completedAt: null, icon: '🔒' }
        ],
        activities: [
            { icon: '📝', title: 'Complaint submitted', time: '2025-04-15 09:30:00', detail: 'Complaint ID: CMP-10241 generated' },
            { icon: '🎫', title: 'Ticket created', time: '2025-04-15 09:31:00', detail: 'Ticket ID: TKT-10241 assigned' },
            { icon: '📧', title: 'Acknowledgment sent', time: '2025-04-15 09:35:00', detail: 'Email and SMS notification sent to customer' },
            { icon: '🏷️', title: 'Priority assigned', time: '2025-04-15 09:40:00', detail: 'Priority set to High based on severity' },
            { icon: '👥', title: 'Team assigned', time: '2025-04-15 09:45:00', detail: 'Network Team assigned for resolution' },
            { icon: '🚗', title: 'Technician dispatched', time: '2025-04-15 10:30:00', detail: 'Technician Rahul K dispatched. ETA: 30 minutes' },
            { icon: '⏳', title: 'Status update', time: '2025-04-15 11:45:00', detail: 'Technician en route to location' }
        ]
    },
    'TKT-9901': {
        id: 'TKT-9901',
        ticketId: 'TKT-9901',
        customer: 'TechCorp Inc',
        contact: '+91 87654 32109',
        location: 'Sector 7, Andheri East',
        category: 'Server Issue',
        priority: 'critical',
        description: 'Authentication server is down, users unable to login. Impacting 500+ enterprise customers.',
        status: 'Open',
        currentStage: 5,
        assignedTo: 'John (Senior Engineer)',
        createdAt: '2025-04-15 09:30:00',
        lastUpdated: '2025-04-15 10:15:00',
        escalationLevel: 'Level 2',
        escalationHistory: [{ level: 'Level 2', reason: 'SLA breach imminent', escalatedTo: 'Department Manager', time: '2025-04-15 10:00:00' }],
        stages: [
            { id: 1, name: 'Complaint Submitted', description: 'Unique complaint ID generated', completed: true, completedAt: '2025-04-15 09:30:00', icon: '📝' },
            { id: 2, name: 'Ticket Created', description: 'Unique ticket ID generated', completed: true, completedAt: '2025-04-15 09:31:00', icon: '🎫' },
            { id: 3, name: 'Acknowledged', description: 'System confirmation sent', completed: true, completedAt: '2025-04-15 09:35:00', icon: '✓' },
            { id: 4, name: 'Categorized & Prioritized', description: 'Priority set to Critical', completed: true, completedAt: '2025-04-15 09:40:00', icon: '🏷️' },
            { id: 5, name: 'Assigned to Team', description: 'Assigned to Senior Engineer', completed: true, completedAt: '2025-04-15 09:45:00', icon: '👥' },
            { id: 6, name: 'In Progress', description: 'Investigation ongoing', completed: false, completedAt: null, icon: '⚙️' },
            { id: 7, name: 'Technician Assigned', description: 'Awaiting technician assignment', completed: false, completedAt: null, icon: '👨‍🔧' },
            { id: 8, name: 'Resolved', description: 'Pending resolution', completed: false, completedAt: null, icon: '✅' },
            { id: 9, name: 'Closed', description: 'Pending closure', completed: false, completedAt: null, icon: '🔒' }
        ],
        activities: [
            { icon: '📝', title: 'Complaint submitted', time: '2025-04-15 09:30:00', detail: 'Complaint ID: CMP-10242 generated' },
            { icon: '🎫', title: 'Ticket created', time: '2025-04-15 09:31:00', detail: 'Ticket ID: TKT-9901 assigned' },
            { icon: '📧', title: 'Acknowledgment sent', time: '2025-04-15 09:35:00', detail: 'Notification sent to customer' },
            { icon: '🏷️', title: 'Priority assigned', time: '2025-04-15 09:40:00', detail: 'Priority set to Critical' },
            { icon: '👥', title: 'Team assigned', time: '2025-04-15 09:45:00', detail: 'Assigned to John (Senior Engineer)' },
            { icon: '🚨', title: 'Escalation triggered', time: '2025-04-15 10:00:00', detail: 'Escalated to Level 2 - Department Manager (SLA breach imminent)' }
        ]
    },
    'CMP-10257': {
        id: 'CMP-10257',
        ticketId: 'TKT-10257',
        customer: 'Anita Sharma',
        contact: '+91 98981 23456',
        location: 'Ahmedabad',
        category: 'Billing Issue',
        priority: 'medium',
        description: 'Extra charges applied on this month\'s bill. Overcharged by ₹500.',
        status: 'In Progress',
        currentStage: 6,
        assignedTo: 'Billing Team',
        createdAt: '2025-04-14 15:14:00',
        lastUpdated: '2025-04-15 09:00:00',
        escalationLevel: 'Level 1',
        escalationHistory: [],
        stages: [
            { id: 1, name: 'Complaint Submitted', description: 'Complaint registered', completed: true, completedAt: '2025-04-14 15:14:00', icon: '📝' },
            { id: 2, name: 'Ticket Created', description: 'Ticket generated', completed: true, completedAt: '2025-04-14 15:15:00', icon: '🎫' },
            { id: 3, name: 'Acknowledged', description: 'Acknowledgment sent', completed: true, completedAt: '2025-04-14 15:20:00', icon: '✓' },
            { id: 4, name: 'Categorized & Prioritized', description: 'Priority: Medium', completed: true, completedAt: '2025-04-14 15:25:00', icon: '🏷️' },
            { id: 5, name: 'Assigned to Team', description: 'Billing Team assigned', completed: true, completedAt: '2025-04-14 15:30:00', icon: '👥' },
            { id: 6, name: 'In Progress', description: 'Verification in progress', completed: true, completedAt: '2025-04-15 09:00:00', icon: '⚙️' },
            { id: 7, name: 'Technician Assigned', description: 'Billing specialist assigned', completed: false, completedAt: null, icon: '👨‍🔧' },
            { id: 8, name: 'Resolved', description: 'Awaiting resolution', completed: false, completedAt: null, icon: '✅' },
            { id: 9, name: 'Closed', description: 'Pending closure', completed: false, completedAt: null, icon: '🔒' }
        ],
        activities: [
            { icon: '📝', title: 'Complaint submitted', time: '2025-04-14 15:14:00', detail: 'Billing issue reported' },
            { icon: '🎫', title: 'Ticket created', time: '2025-04-14 15:15:00', detail: 'Ticket ID: TKT-10257 assigned' },
            { icon: '📧', title: 'Acknowledgment sent', time: '2025-04-14 15:20:00', detail: 'Notification sent to customer' },
            { icon: '🏷️', title: 'Priority assigned', time: '2025-04-14 15:25:00', detail: 'Priority set to Medium' },
            { icon: '👥', title: 'Team assigned', time: '2025-04-14 15:30:00', detail: 'Billing Team assigned' },
            { icon: '📊', title: 'Verification started', time: '2025-04-15 09:00:00', detail: 'Billing verification in progress' }
        ]
    }
};

let currentComplaint = null;

// ========= HELPER FUNCTIONS =========
function formatDate(dateString) {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getPriorityClass(priority) {
    switch(priority) {
        case 'critical': return 'critical';
        case 'high': return 'high';
        case 'medium': return 'medium';
        default: return 'low';
    }
}

// ========= RENDER TIMELINE =========
function renderTimeline(complaint) {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
    container.innerHTML = complaint.stages.map((stage, index) => {
        let stageClass = '';
        if (stage.completed) stageClass = 'completed';
        else if (index + 1 === complaint.currentStage) stageClass = 'active';
        else stageClass = 'pending';
        
        return `
            <div class="timeline-stage ${stageClass}">
                <div class="timeline-icon">${stage.icon}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${stage.name}</div>
                    <div class="timeline-desc">${stage.description}</div>
                    <div class="timeline-time">
                        ${stage.completedAt ? `<span>✅ ${formatDate(stage.completedAt)}</span>` : '<span class="timeline-badge warning">⏳ In Progress</span>'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========= RENDER ACTIVITIES =========
function renderActivities(complaint) {
    const container = document.getElementById('activityList');
    if (!container) return;
    
    container.innerHTML = complaint.activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${formatDate(activity.time)}</div>
                <div class="activity-detail">${activity.detail}</div>
            </div>
        </div>
    `).join('');
}

// ========= RENDER ESCALATION INFO =========
function renderEscalationInfo(complaint) {
    const escalationCard = document.getElementById('escalationCard');
    const escalationLevel = document.getElementById('escalationLevel');
    const lastEscalation = document.getElementById('lastEscalation');
    
    if (!escalationCard) return;
    
    escalationCard.style.display = 'block';
    escalationLevel.textContent = complaint.escalationLevel;
    
    if (complaint.escalationHistory && complaint.escalationHistory.length > 0) {
        const last = complaint.escalationHistory[complaint.escalationHistory.length - 1];
        lastEscalation.textContent = `${formatDate(last.time)} - ${last.reason}`;
    } else {
        lastEscalation.textContent = 'Not escalated yet';
    }
}

// ========= LOAD COMPLAINT =========
function loadComplaint(complaintId) {
    const complaint = complaintsData[complaintId];
    if (!complaint) {
        showToast(`Complaint ${complaintId} not found`, 'error');
        return false;
    }
    
    currentComplaint = complaint;
    
    // Show all cards
    document.getElementById('detailsCard').style.display = 'block';
    document.getElementById('timelineCard').style.display = 'block';
    document.getElementById('activityCard').style.display = 'block';
    document.getElementById('actionButtons').style.display = 'flex';
    
    // Update details
    document.getElementById('complaintTitle').textContent = `Complaint #${complaint.id}`;
    document.getElementById('complaintSubtitle').textContent = complaint.description;
    document.getElementById('customerName').textContent = complaint.customer;
    document.getElementById('customerContact').textContent = complaint.contact;
    document.getElementById('customerLocation').textContent = complaint.location;
    document.getElementById('complaintCategory').textContent = complaint.category;
    document.getElementById('createdDate').textContent = formatDate(complaint.createdAt);
    document.getElementById('assignedTo').textContent = complaint.assignedTo;
    
    const priorityBadge = document.getElementById('priorityBadge');
    priorityBadge.textContent = complaint.priority.toUpperCase();
    priorityBadge.className = `priority-badge ${getPriorityClass(complaint.priority)}`;
    
    // Render sections
    renderTimeline(complaint);
    renderActivities(complaint);
    renderEscalationInfo(complaint);
    
    showToast(`Loaded complaint ${complaintId}`, 'success');
    return true;
}

// ========= SEARCH =========
const trackBtn = document.getElementById('trackBtn');
const complaintIdInput = document.getElementById('complaintIdInput');
const exampleBtns = document.querySelectorAll('.example-btn');

if (trackBtn) {
    trackBtn.addEventListener('click', () => {
        const id = complaintIdInput.value.trim().toUpperCase();
        if (id) {
            loadComplaint(id);
        } else {
            showToast('Please enter a Complaint ID or Ticket ID', 'error');
        }
    });
}

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        complaintIdInput.value = id;
        loadComplaint(id);
    });
});

// ========= ESCALATION MODAL =========
const escalateBtn = document.getElementById('escalateBtn');
const escalationModal = document.getElementById('escalationModal');
const closeEscalationModal = document.getElementById('closeEscalationModal');
const cancelEscalationBtn = document.getElementById('cancelEscalationBtn');
const confirmEscalationBtn = document.getElementById('confirmEscalationBtn');

if (escalateBtn) {
    escalateBtn.addEventListener('click', () => {
        if (currentComplaint) {
            escalationModal.classList.add('show');
        } else {
            showToast('No complaint loaded', 'error');
        }
    });
}

if (closeEscalationModal) {
    closeEscalationModal.addEventListener('click', () => {
        escalationModal.classList.remove('show');
    });
}

if (cancelEscalationBtn) {
    cancelEscalationBtn.addEventListener('click', () => {
        escalationModal.classList.remove('show');
    });
}

if (confirmEscalationBtn) {
    confirmEscalationBtn.addEventListener('click', () => {
        const level = document.getElementById('escalationLevelSelect').value;
        const reason = document.getElementById('escalationReason').value;
        const assignee = document.getElementById('escalationAssignee').value;
        
        if (!reason) {
            showToast('Please provide a reason for escalation', 'error');
            return;
        }
        
        if (currentComplaint) {
            currentComplaint.escalationLevel = level;
            if (!currentComplaint.escalationHistory) currentComplaint.escalationHistory = [];
            currentComplaint.escalationHistory.push({
                level: level,
                reason: reason,
                escalatedTo: assignee,
                time: new Date().toISOString()
            });
            
            // Add activity
            currentComplaint.activities.push({
                icon: '🚨',
                title: 'Escalation triggered',
                time: new Date().toISOString(),
                detail: `Escalated to ${level} - ${assignee}. Reason: ${reason}`
            });
            
            renderEscalationInfo(currentComplaint);
            renderActivities(currentComplaint);
            
            showToast(`Complaint escalated to ${level}`, 'success');
            escalationModal.classList.remove('show');
            document.getElementById('escalationReason').value = '';
        }
    });
}

// ========= REFRESH =========
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        if (currentComplaint) {
            showToast('Status refreshed', 'success');
        } else {
            showToast('No complaint loaded', 'error');
        }
    });
}

// ========= MARK RESOLVED =========
const markResolvedBtn = document.getElementById('markResolvedBtn');
if (markResolvedBtn) {
    markResolvedBtn.addEventListener('click', () => {
        if (currentComplaint) {
            showToast('Complaint marked as resolved', 'success');
        } else {
            showToast('No complaint loaded', 'error');
        }
    });
}

// ========= SEARCH FROM NAVBAR =========
const searchInput = document.getElementById('searchComplaint');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const id = searchInput.value.trim().toUpperCase();
            if (id && loadComplaint(id)) {
                complaintIdInput.value = id;
            } else if (id) {
                showToast(`Complaint ${id} not found`, 'error');
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

// ========= INIT =========
console.log('Complaint Tracking System loaded');
window.showToast = showToast;