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
let autoRules = [
    { id: 1, name: 'Critical Issue Escalation', priority: 'critical', threshold: 30, targetLevel: 'Level 2', target: 'Department Manager', enabled: true, description: 'Escalate critical issues after 30 minutes', createdAt: '2025-04-10T10:00:00' },
    { id: 2, name: 'High Priority Escalation', priority: 'high', threshold: 60, targetLevel: 'Level 2', target: 'Team Lead', enabled: true, description: 'Escalate high priority issues after 1 hour', createdAt: '2025-04-10T10:00:00' },
    { id: 3, name: 'Medium Priority Escalation', priority: 'medium', threshold: 120, targetLevel: 'Level 2', target: 'Senior Engineer', enabled: false, description: 'Escalate medium priority issues after 2 hours', createdAt: '2025-04-10T10:00:00' },
    { id: 4, name: 'Level 2 Escalation Rule', priority: 'critical', threshold: 60, targetLevel: 'Level 3', target: 'Senior Manager', enabled: true, description: 'Second level escalation for critical issues', createdAt: '2025-04-10T10:00:00' }
];

let activeIssues = [
    { id: 'TKT-9901', title: 'Server Failure - Authentication Service', priority: 'critical', currentLevel: 'Level 1', createdAt: '2025-04-15T09:30:00', nextEscalationTime: '2025-04-15T10:00:00', nextLevel: 'Level 2', nextTarget: 'Department Manager' },
    { id: 'TKT-9902', title: 'Broadband Outage - Fiber Cut', priority: 'critical', currentLevel: 'Level 1', createdAt: '2025-04-15T08:15:00', nextEscalationTime: '2025-04-15T08:45:00', nextLevel: 'Level 2', nextTarget: 'Department Manager' },
    { id: 'TKT-9903', title: 'Network Congestion - BKC Area', priority: 'high', currentLevel: 'Level 2', createdAt: '2025-04-15T10:00:00', nextEscalationTime: '2025-04-15T11:00:00', nextLevel: 'Level 3', nextTarget: 'Senior Manager' }
];

let autoEscalationHistory = [
    { id: 1, issueId: 'TKT-9902', issueTitle: 'Broadband Outage - Fiber Cut', fromLevel: 'Level 1', toLevel: 'Level 2', escalatedTo: 'Department Manager', reason: 'Auto-escalation: Time threshold exceeded (45 min)', timestamp: '2025-04-15T08:45:00' },
    { id: 2, issueId: 'TKT-9901', issueTitle: 'Server Failure - Authentication Service', fromLevel: 'Level 1', toLevel: 'Level 2', escalatedTo: 'Department Manager', reason: 'Auto-escalation: Time threshold exceeded (30 min)', timestamp: '2025-04-15T10:00:00' }
];

let currentEditingRule = null;
let currentDeletingRule = null;
let countdownIntervals = [];

// ========= HELPER FUNCTIONS =========
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    return date.toLocaleString();
}

function getPriorityClass(priority) {
    switch(priority) {
        case 'critical': return 'critical';
        case 'high': return 'high';
        case 'medium': return 'medium';
        default: return 'low';
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========= COUNTDOWN TIMER =========
function startCountdownTimer(elementId, targetTime, issueId, nextLevel, nextTarget) {
    const timerElement = document.getElementById(elementId);
    if (!timerElement) return;
    
    const updateTimer = () => {
        const now = new Date();
        const target = new Date(targetTime);
        const diff = target - now;
        
        if (diff <= 0) {
            timerElement.innerHTML = '<span style="color: #ff6b6b;">⚠️ Escalation overdue!</span>';
            return;
        }
        
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        timerElement.innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    countdownIntervals.push(interval);
}

// ========= RENDER RULES =========
function renderRules() {
    const container = document.getElementById('rulesGrid');
    if (!container) return;
    
    const searchTerm = document.getElementById('ruleSearch')?.value.toLowerCase() || '';
    let filtered = autoRules;
    if (searchTerm) {
        filtered = autoRules.filter(r => r.name.toLowerCase().includes(searchTerm));
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No Rules Found</h3><p>Click "Add Escalation Rule" to create your first rule.</p></div>';
        return;
    }
    
    container.innerHTML = filtered.map(rule => `
        <div class="rule-card ${!rule.enabled ? 'disabled' : ''}">
            <div class="rule-header">
                <span class="rule-name">${escapeHtml(rule.name)}</span>
                <span class="rule-status ${rule.enabled ? 'active' : 'inactive'}">${rule.enabled ? 'Active' : 'Inactive'}</span>
            </div>
            <div class="rule-body">
                <div class="rule-detail"><strong>Priority:</strong> <span class="rule-priority ${getPriorityClass(rule.priority)}">${rule.priority.toUpperCase()}</span></div>
                <div class="rule-detail"><strong>Time Threshold:</strong> ${rule.threshold} minutes</div>
                <div class="rule-detail"><strong>Escalate to:</strong> ${rule.targetLevel} - ${rule.target}</div>
                ${rule.description ? `<div class="rule-detail"><strong>Description:</strong> ${escapeHtml(rule.description)}</div>` : ''}
            </div>
            <div class="rule-actions">
                <button class="edit-rule" onclick="editRule(${rule.id})">✏️ Edit</button>
                <button class="toggle-rule" onclick="toggleRule(${rule.id})">${rule.enabled ? '⏸️ Disable' : '▶️ Enable'}</button>
                <button class="delete-rule" onclick="deleteRulePrompt(${rule.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// ========= RENDER ACTIVE ISSUES =========
function renderActiveIssues() {
    const container = document.getElementById('activeIssuesGrid');
    if (!container) return;
    
    if (activeIssues.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⏱️</div><h3>No Active Escalations</h3><p>No issues are currently in escalation process.</p></div>';
        return;
    }
    
    // Clear existing intervals
    countdownIntervals.forEach(interval => clearInterval(interval));
    countdownIntervals = [];
    
    container.innerHTML = activeIssues.map((issue, index) => {
        const timerId = `timer-${issue.id}-${index}`;
        setTimeout(() => startCountdownTimer(timerId, issue.nextEscalationTime, issue.id, issue.nextLevel, issue.nextTarget), 100);
        
        return `
            <div class="active-issue-card">
                <div class="active-issue-header">
                    <span class="active-issue-id">${issue.id}</span>
                    <span class="active-issue-level">Current: ${issue.currentLevel}</span>
                </div>
                <div class="active-issue-body">
                    <div class="active-issue-title">${escapeHtml(issue.title)}</div>
                    <div class="active-issue-details">
                        <span>🔴 Priority: ${issue.priority.toUpperCase()}</span>
                        <span>📅 Created: ${formatDate(issue.createdAt)}</span>
                    </div>
                    <div class="countdown-timer">
                        <div class="timer-label">⏰ Time to Next Escalation</div>
                        <div class="timer-value" id="${timerId}">--:--</div>
                        <div class="timer-next">Next: ${issue.nextLevel} → ${issue.nextTarget}</div>
                    </div>
                    <div class="next-escalation">
                        <strong>Auto-escalation active</strong><br>
                        Will escalate to ${issue.nextLevel} (${issue.nextTarget}) when timer reaches zero.
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========= RENDER HISTORY =========
function renderHistory() {
    const container = document.getElementById('autoHistoryTimeline');
    if (!container) return;
    
    if (autoEscalationHistory.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📜</div><h3>No History</h3><p>No auto-escalation events have occurred yet.</p></div>';
        return;
    }
    
    container.innerHTML = autoEscalationHistory.map(history => `
        <div class="history-item">
            <div class="history-icon">🤖</div>
            <div class="history-content">
                <div class="history-title">Auto-Escalation: ${escapeHtml(history.issueTitle)}</div>
                <div class="history-details">
                    From <strong>${history.fromLevel}</strong> → To <strong>${history.toLevel}</strong>
                    <br>Escalated to: ${history.escalatedTo}
                    <br>Reason: ${escapeHtml(history.reason)}
                </div>
                <div class="history-meta">
                    <span>🤖 System</span>
                    <span>🕐 ${formatDate(history.timestamp)}</span>
                    <span class="system-badge">Auto-Triggered</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========= RULE CRUD =========
window.editRule = function(id) {
    const rule = autoRules.find(r => r.id === id);
    if (rule) {
        currentEditingRule = rule;
        document.getElementById('ruleModalTitle').textContent = 'Edit Escalation Rule';
        document.getElementById('ruleName').value = rule.name;
        document.getElementById('rulePriority').value = rule.priority;
        document.getElementById('timeThreshold').value = rule.threshold;
        document.getElementById('escalationTargetLevel').value = rule.targetLevel;
        document.getElementById('escalationTarget').value = rule.target;
        document.getElementById('ruleDescription').value = rule.description || '';
        document.getElementById('ruleEnabled').checked = rule.enabled;
        document.getElementById('ruleStatusText').textContent = rule.enabled ? 'Active' : 'Inactive';
        document.getElementById('ruleModal').classList.add('show');
    }
};

window.toggleRule = function(id) {
    const rule = autoRules.find(r => r.id === id);
    if (rule) {
        rule.enabled = !rule.enabled;
        renderRules();
        showToast(`Rule "${rule.name}" ${rule.enabled ? 'enabled' : 'disabled'}`, 'success');
    }
};

window.deleteRulePrompt = function(id) {
    const rule = autoRules.find(r => r.id === id);
    if (rule) {
        currentDeletingRule = rule;
        document.getElementById('deleteRuleName').textContent = rule.name;
        document.getElementById('deleteModal').classList.add('show');
    }
};

function saveRule() {
    const name = document.getElementById('ruleName').value.trim();
    const priority = document.getElementById('rulePriority').value;
    const threshold = parseInt(document.getElementById('timeThreshold').value);
    const targetLevel = document.getElementById('escalationTargetLevel').value;
    const target = document.getElementById('escalationTarget').value;
    const description = document.getElementById('ruleDescription').value;
    const enabled = document.getElementById('ruleEnabled').checked;
    
    if (!name) { showToast('Please enter rule name', 'error'); return; }
    if (!threshold || threshold <= 0) { showToast('Please enter valid threshold', 'error'); return; }
    
    if (currentEditingRule) {
        currentEditingRule.name = name;
        currentEditingRule.priority = priority;
        currentEditingRule.threshold = threshold;
        currentEditingRule.targetLevel = targetLevel;
        currentEditingRule.target = target;
        currentEditingRule.description = description;
        currentEditingRule.enabled = enabled;
        showToast('Rule updated successfully', 'success');
    } else {
        const newId = Math.max(...autoRules.map(r => r.id), 0) + 1;
        autoRules.push({ id: newId, name, priority, threshold, targetLevel, target, enabled, description, createdAt: new Date().toISOString() });
        showToast('Rule created successfully', 'success');
    }
    
    document.getElementById('ruleModal').classList.remove('show');
    renderRules();
}

function deleteRule() {
    if (currentDeletingRule) {
        autoRules = autoRules.filter(r => r.id !== currentDeletingRule.id);
        renderRules();
        showToast('Rule deleted successfully', 'success');
        document.getElementById('deleteModal').classList.remove('show');
        currentDeletingRule = null;
    }
}

// ========= TAB SWITCHING =========
const autoTabs = document.querySelectorAll('.auto-tab');
autoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        autoTabs.forEach(t => t.classList.remove('active'));
        const tabContents = document.querySelectorAll('.auto-tab-content');
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        const targetTab = document.getElementById(tabId === 'rules' ? 'rulesTab' : (tabId === 'active' ? 'activeTab' : 'historyTab'));
        if (targetTab) targetTab.classList.add('active');
        if (tabId === 'active') renderActiveIssues();
        if (tabId === 'history') renderHistory();
    });
});

// ========= MODAL HANDLERS =========
const addRuleBtn = document.getElementById('addRuleBtn');
if (addRuleBtn) {
    addRuleBtn.addEventListener('click', () => {
        currentEditingRule = null;
        document.getElementById('ruleModalTitle').textContent = 'Add Escalation Rule';
        document.getElementById('ruleForm').reset();
        document.getElementById('ruleEnabled').checked = true;
        document.getElementById('ruleStatusText').textContent = 'Active';
        document.getElementById('ruleModal').classList.add('show');
    });
}

const ruleEnabledCheckbox = document.getElementById('ruleEnabled');
if (ruleEnabledCheckbox) {
    ruleEnabledCheckbox.addEventListener('change', () => {
        document.getElementById('ruleStatusText').textContent = ruleEnabledCheckbox.checked ? 'Active' : 'Inactive';
    });
}

const saveRuleBtn = document.getElementById('saveRuleBtn');
if (saveRuleBtn) saveRuleBtn.addEventListener('click', saveRule);

const cancelRuleBtn = document.getElementById('cancelRuleBtn');
if (cancelRuleBtn) {
    cancelRuleBtn.addEventListener('click', () => document.getElementById('ruleModal').classList.remove('show'));
}

const closeRuleModal = document.getElementById('closeRuleModal');
if (closeRuleModal) {
    closeRuleModal.addEventListener('click', () => document.getElementById('ruleModal').classList.remove('show'));
}

const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', deleteRule);

const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => document.getElementById('deleteModal').classList.remove('show'));
}

const closeDeleteModal = document.getElementById('closeDeleteModal');
if (closeDeleteModal) {
    closeDeleteModal.addEventListener('click', () => document.getElementById('deleteModal').classList.remove('show'));
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ========= SEARCH =========
const ruleSearch = document.getElementById('ruleSearch');
if (ruleSearch) ruleSearch.addEventListener('input', () => renderRules());

// ========= SIMULATE AUTO-ESCALATION (Demo) =========
function simulateAutoEscalation() {
    setInterval(() => {
        const now = new Date();
        let escalated = false;
        
        activeIssues.forEach(issue => {
            const nextTime = new Date(issue.nextEscalationTime);
            if (now >= nextTime) {
                // Perform escalation
                autoEscalationHistory.unshift({
                    id: autoEscalationHistory.length + 1,
                    issueId: issue.id,
                    issueTitle: issue.title,
                    fromLevel: issue.currentLevel,
                    toLevel: issue.nextLevel,
                    escalatedTo: issue.nextTarget,
                    reason: `Auto-escalation: Time threshold exceeded`,
                    timestamp: now.toISOString()
                });
                
                // Update issue level
                issue.currentLevel = issue.nextLevel;
                
                // Set next escalation (if not at max level)
                const levelNum = parseInt(issue.currentLevel.split(' ')[1]);
                if (levelNum < 5) {
                    issue.nextLevel = `Level ${levelNum + 1}`;
                    const newTime = new Date(now);
                    newTime.setMinutes(now.getMinutes() + 30);
                    issue.nextEscalationTime = newTime.toISOString();
                    if (levelNum + 1 === 2) issue.nextTarget = 'Department Manager';
                    else if (levelNum + 1 === 3) issue.nextTarget = 'Senior Manager';
                    else if (levelNum + 1 === 4) issue.nextTarget = 'Director';
                    else issue.nextTarget = 'C-Level Executive';
                } else {
                    issue.nextLevel = 'Max Level Reached';
                    issue.nextTarget = 'Executive Team';
                }
                escalated = true;
            }
        });
        
        if (escalated) {
            renderActiveIssues();
            renderHistory();
            showToast('Auto-escalation triggered for some issues', 'warning');
        }
    }, 10000);
}

// ========= TOAST FUNCTION =========
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

// ========= INITIAL RENDER =========
renderRules();
renderActiveIssues();
renderHistory();
simulateAutoEscalation();

// Make functions global
window.showToast = showToast;
window.editRule = editRule;
window.toggleRule = toggleRule;
window.deleteRulePrompt = deleteRulePrompt;