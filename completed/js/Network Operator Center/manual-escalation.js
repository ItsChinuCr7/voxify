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

// ========= SAMPLE DATA =========
let issues = [
    { id: 'TKT-9901', title: 'Server Failure - Authentication Service', priority: 'critical', status: 'Open', currentLevel: 'Level 1', currentAssignee: 'John Doe', createdAt: '2025-04-15 09:30:00' },
    { id: 'TKT-9902', title: 'Broadband Outage - Fiber Cut', priority: 'critical', status: 'In Progress', currentLevel: 'Level 1', currentAssignee: 'Rahul K', createdAt: '2025-04-15 08:15:00' },
    { id: 'TKT-9903', title: 'Network Congestion - BKC Area', priority: 'high', status: 'In Progress', currentLevel: 'Level 2', currentAssignee: 'Sarah Johnson', createdAt: '2025-04-15 10:00:00' },
    { id: 'TKT-9904', title: 'DNS Resolution Issue', priority: 'high', status: 'Open', currentLevel: 'Level 1', currentAssignee: 'Mike Chen', createdAt: '2025-04-15 10:45:00' },
    { id: 'OUT-001', title: 'Power Outage - Sector 7', priority: 'critical', status: 'Open', currentLevel: 'Level 1', currentAssignee: 'Technical Team', createdAt: '2025-04-15 07:30:00' }
];

let escalationHistory = [
    { id: 1, issueId: 'TKT-9903', issueTitle: 'Network Congestion - BKC Area', fromLevel: 'Level 1', toLevel: 'Level 2', escalatedBy: 'Admin User', escalatedTo: 'Sarah Johnson', reason: 'Issue requires management approval', timestamp: '2025-04-15 09:15:00' },
    { id: 2, issueId: 'TKT-9901', issueTitle: 'Server Failure - Authentication Service', fromLevel: 'Level 1', toLevel: 'Level 2', escalatedBy: 'Admin User', escalatedTo: 'Department Manager', reason: 'SLA breach imminent', timestamp: '2025-04-14 16:30:00' }
];

let currentEscalatingIssue = null;

// ========= HELPER FUNCTIONS =========
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

function getPriorityClass(priority) {
    switch(priority) {
        case 'critical': return 'critical';
        case 'high': return 'high';
        case 'medium': return 'medium';
        default: return 'low';
    }
}

function getEscalationLevelClass(level) {
    switch(level) {
        case 'Level 1': return 'level1';
        case 'Level 2': return 'level2';
        case 'Level 3': return 'level3';
        case 'Level 4': return 'level4';
        case 'Level 5': return 'level5';
        default: return 'level1';
    }
}

// ========= RENDER ISSUES =========
function renderIssues() {
    const container = document.getElementById('issuesGrid');
    if (!container) return;
    
    if (issues.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column:1/-1; text-align:center; padding:40px;">No open issues found</div>';
        return;
    }
    
    container.innerHTML = issues.map(issue => `
        <div class="issue-card ${getPriorityClass(issue.priority)}">
            <div class="issue-header">
                <span class="issue-id">${issue.id}</span>
                <span class="escalation-badge ${getEscalationLevelClass(issue.currentLevel)}">${issue.currentLevel}</span>
            </div>
            <div class="issue-title">${escapeHtml(issue.title)}</div>
            <div class="issue-details">
                <span>🔴 Priority: ${issue.priority.toUpperCase()}</span>
                <span>📅 Created: ${formatDate(issue.createdAt)}</span>
            </div>
            <div class="issue-current-level">
                <strong>Current Status:</strong> ${issue.status} | Assigned to: ${issue.currentAssignee}
            </div>
            <div class="issue-actions">
                <button class="escalate-btn" onclick="openEscalationModal('${issue.id}')">🚨 Escalate</button>
                <button class="view-btn" onclick="viewIssueDetails('${issue.id}')">📋 View Details</button>
            </div>
        </div>
    `).join('');
}

// ========= RENDER ESCALATION HISTORY =========
function renderEscalationHistory() {
    const container = document.getElementById('escalationTimeline');
    if (!container) return;
    
    if (escalationHistory.length === 0) {
        container.innerHTML = '<div class="empty-state" style="text-align:center; padding:40px;">No escalation history available</div>';
        return;
    }
    
    container.innerHTML = escalationHistory.map(history => `
        <div class="timeline-item">
            <div class="timeline-icon">🚨</div>
            <div class="timeline-content">
                <div class="timeline-title">Escalated: ${escapeHtml(history.issueTitle)}</div>
                <div class="timeline-details">
                    From <strong>${history.fromLevel}</strong> → To <strong>${history.toLevel}</strong>
                    <br>Escalated to: ${history.escalatedTo}
                    <br>Reason: ${escapeHtml(history.reason)}
                </div>
                <div class="timeline-meta">
                    <span>👤 By: ${history.escalatedBy}</span>
                    <span>🕐 ${formatDate(history.timestamp)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========= ESCALATION MODAL =========
window.openEscalationModal = function(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;
    
    currentEscalatingIssue = issue;
    
    const modal = document.getElementById('escalationModal');
    const issueInfo = document.getElementById('issueInfo');
    
    issueInfo.innerHTML = `
        <p><strong>Issue ID:</strong> ${issue.id}</p>
        <p><strong>Title:</strong> ${escapeHtml(issue.title)}</p>
        <p><strong>Current Level:</strong> ${issue.currentLevel}</p>
        <p><strong>Current Assignee:</strong> ${issue.currentAssignee}</p>
    `;
    
    // Reset form
    document.getElementById('escalationForm').reset();
    document.getElementById('escalationReason').value = '';
    document.getElementById('additionalNotes').value = '';
    
    // Set default escalation level (next level)
    const levelSelect = document.getElementById('escalationLevel');
    const currentLevelNum = parseInt(issue.currentLevel.split(' ')[1]);
    const nextLevel = `Level ${currentLevelNum + 1}`;
    if (currentLevelNum < 5) {
        for (let i = 0; i < levelSelect.options.length; i++) {
            if (levelSelect.options[i].value === nextLevel) {
                levelSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    modal.classList.add('show');
};

window.viewIssueDetails = function(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
        showToast(`Viewing details for ${issue.id}`, 'info');
    }
};

function performEscalation() {
    const level = document.getElementById('escalationLevel').value;
    const assignTo = document.getElementById('assignTo').value;
    const reason = document.getElementById('escalationReason').value.trim();
    const additionalNotes = document.getElementById('additionalNotes').value;
    
    if (!level) {
        showToast('Please select escalation level', 'error');
        return;
    }
    if (!assignTo) {
        showToast('Please select recipient', 'error');
        return;
    }
    if (!reason) {
        showToast('Please provide reason for escalation', 'error');
        return;
    }
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('show');
    
    // Simulate API call
    setTimeout(() => {
        // Update issue
        const issue = issues.find(i => i.id === currentEscalatingIssue.id);
        if (issue) {
            const oldLevel = issue.currentLevel;
            issue.currentLevel = level;
            issue.currentAssignee = assignTo.split(' (')[0];
            
            // Add to escalation history
            escalationHistory.unshift({
                id: escalationHistory.length + 1,
                issueId: issue.id,
                issueTitle: issue.title,
                fromLevel: oldLevel,
                toLevel: level,
                escalatedBy: 'Admin User',
                escalatedTo: assignTo,
                reason: reason + (additionalNotes ? `\nAdditional Notes: ${additionalNotes}` : ''),
                timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
            });
            
            // Re-render
            renderIssues();
            renderEscalationHistory();
            
            // Close modal and loading
            document.getElementById('escalationModal').classList.remove('show');
            loadingOverlay.classList.remove('show');
            
            showToast(`Issue escalated to ${level} successfully!`, 'success');
        }
    }, 1500);
}

// ========= MODAL HANDLERS =========
const confirmEscalateBtn = document.getElementById('confirmEscalateBtn');
if (confirmEscalateBtn) {
    confirmEscalateBtn.addEventListener('click', performEscalation);
}

const cancelEscalateBtn = document.getElementById('cancelEscalateBtn');
if (cancelEscalateBtn) {
    cancelEscalateBtn.addEventListener('click', () => {
        document.getElementById('escalationModal').classList.remove('show');
    });
}

const closeModalBtn = document.getElementById('closeModalBtn');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        document.getElementById('escalationModal').classList.remove('show');
    });
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('escalationModal');
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// ========= SEARCH FUNCTIONALITY =========
const searchInput = document.getElementById('searchTickets');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = issues.filter(i => 
            i.id.toLowerCase().includes(term) || 
            i.title.toLowerCase().includes(term)
        );
        const container = document.getElementById('issuesGrid');
        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state" style="grid-column:1/-1; text-align:center; padding:40px;">No matching issues found</div>';
        } else {
            container.innerHTML = filtered.map(issue => `
                <div class="issue-card ${getPriorityClass(issue.priority)}">
                    <div class="issue-header">
                        <span class="issue-id">${issue.id}</span>
                        <span class="escalation-badge ${getEscalationLevelClass(issue.currentLevel)}">${issue.currentLevel}</span>
                    </div>
                    <div class="issue-title">${escapeHtml(issue.title)}</div>
                    <div class="issue-details">
                        <span>🔴 Priority: ${issue.priority.toUpperCase()}</span>
                        <span>📅 Created: ${formatDate(issue.createdAt)}</span>
                    </div>
                    <div class="issue-current-level">
                        <strong>Current Status:</strong> ${issue.status} | Assigned to: ${issue.currentAssignee}
                    </div>
                    <div class="issue-actions">
                        <button class="escalate-btn" onclick="openEscalationModal('${issue.id}')">🚨 Escalate</button>
                        <button class="view-btn" onclick="viewIssueDetails('${issue.id}')">📋 View Details</button>
                    </div>
                </div>
            `).join('');
        }
    });
}

// ========= ESCAPE HTML =========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

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

// ========= INITIAL RENDER =========
renderIssues();
renderEscalationHistory();

// Make functions global
window.showToast = showToast;
window.openEscalationModal = openEscalationModal;
window.viewIssueDetails = viewIssueDetails;