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
let alertRules = [
    { id: 1, name: 'High Priority Ticket Breach', metricType: 'response_time', threshold: 30, severity: 'critical', status: 'active', description: 'Trigger when high priority tickets exceed 30 minutes response time', createdAt: '2025-04-10T10:00:00' },
    { id: 2, name: 'Critical Outage Detection', metricType: 'outage_duration', threshold: 15, severity: 'critical', status: 'active', description: 'Trigger when outage lasts more than 15 minutes', createdAt: '2025-04-10T10:00:00' },
    { id: 3, name: 'Ticket Volume Spike', metricType: 'ticket_volume', threshold: 50, severity: 'warning', status: 'active', description: 'Trigger when ticket volume exceeds 50 per hour', createdAt: '2025-04-10T10:00:00' },
    { id: 4, name: 'SLA Resolution Breach', metricType: 'resolution_time', threshold: 4, severity: 'warning', status: 'inactive', description: 'Trigger when resolution time exceeds 4 hours', createdAt: '2025-04-10T10:00:00' },
    { id: 5, name: 'Network Latency Alert', metricType: 'response_time', threshold: 100, severity: 'info', status: 'active', description: 'Trigger when network latency exceeds 100ms', createdAt: '2025-04-10T10:00:00' }
];

let generatedAlerts = [
    { id: 1, ruleId: 1, ruleName: 'High Priority Ticket Breach', severity: 'critical', status: 'active', metricValue: '45 minutes', threshold: '30 minutes', triggeredAt: '2025-04-14T09:30:00', description: 'Ticket #TKT-9901 has been pending for 45 minutes exceeding SLA threshold' },
    { id: 2, ruleId: 2, ruleName: 'Critical Outage Detection', severity: 'critical', status: 'acknowledged', metricValue: '18 minutes', threshold: '15 minutes', triggeredAt: '2025-04-14T08:45:00', description: 'Outage in Sector 7 has exceeded 15 minutes threshold' },
    { id: 3, ruleId: 1, ruleName: 'High Priority Ticket Breach', severity: 'critical', status: 'active', metricValue: '32 minutes', threshold: '30 minutes', triggeredAt: '2025-04-14T10:15:00', description: 'Ticket #TKT-9902 has been pending for 32 minutes exceeding SLA threshold' },
    { id: 4, ruleId: 3, ruleName: 'Ticket Volume Spike', severity: 'warning', status: 'active', metricValue: '67 tickets', threshold: '50 tickets', triggeredAt: '2025-04-14T11:00:00', description: 'Ticket volume spiked to 67 per hour in Mumbai region' },
    { id: 5, ruleId: 5, ruleName: 'Network Latency Alert', severity: 'info', status: 'active', metricValue: '120ms', threshold: '100ms', triggeredAt: '2025-04-14T10:30:00', description: 'Network latency detected at 120ms in BKC area' },
    { id: 6, ruleId: 2, ruleName: 'Critical Outage Detection', severity: 'critical', status: 'resolved', metricValue: '25 minutes', threshold: '15 minutes', triggeredAt: '2025-04-13T16:20:00', description: 'Outage in Goregaon lasted 25 minutes - now resolved' },
    { id: 7, ruleId: 3, ruleName: 'Ticket Volume Spike', severity: 'warning', status: 'resolved', metricValue: '55 tickets', threshold: '50 tickets', triggeredAt: '2025-04-13T14:00:00', description: 'Ticket volume normalized after spike' }
];

let currentEditingRule = null;
let currentDeletingRule = null;
let currentAlert = null;

// ========= HELPER FUNCTIONS =========
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

function getMetricLabel(metricType) {
    const labels = { response_time: 'Response Time', resolution_time: 'Resolution Time', ticket_volume: 'Ticket Volume', outage_duration: 'Outage Duration' };
    return labels[metricType] || metricType;
}

function getMetricUnit(metricType) {
    const units = { response_time: 'minutes', resolution_time: 'hours', ticket_volume: 'tickets', outage_duration: 'minutes' };
    return units[metricType] || '';
}

function getSeverityLabel(severity) {
    const labels = { critical: '🔴 Critical', warning: '🟠 Warning', info: '🔵 Info' };
    return labels[severity] || severity;
}

function getSeverityIcon(severity) {
    switch(severity) {
        case 'critical': return '🔴';
        case 'warning': return '🟠';
        case 'info': return '🔵';
        default: return '📢';
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

function updateAlertStats() {
    const criticalCount = generatedAlerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
    const warningCount = generatedAlerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length;
    const infoCount = generatedAlerts.filter(a => a.severity === 'info' && a.status !== 'resolved').length;
    const resolvedCount = generatedAlerts.filter(a => a.status === 'resolved').length;
    
    const criticalEl = document.getElementById('criticalAlertCount');
    const warningEl = document.getElementById('warningAlertCount');
    const infoEl = document.getElementById('infoAlertCount');
    const resolvedEl = document.getElementById('resolvedAlertCount');
    
    if (criticalEl) criticalEl.innerText = criticalCount;
    if (warningEl) warningEl.innerText = warningCount;
    if (infoEl) infoEl.innerText = infoCount;
    if (resolvedEl) resolvedEl.innerText = resolvedCount;
}

// ========= RENDER RULES =========
function renderRules() {
    const container = document.getElementById('rulesGrid');
    if (!container) return;
    
    const searchInput = document.getElementById('ruleSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let filtered = alertRules;
    if (searchTerm) {
        filtered = alertRules.filter(r => r.name.toLowerCase().includes(searchTerm));
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No Rules Found</h3><p>Click "Add New Rule" to create your first alert rule.</p></div>`;
        return;
    }
    
    container.innerHTML = filtered.map(rule => `
        <div class="rule-card ${rule.severity} ${rule.status === 'inactive' ? 'inactive' : ''}">
            <div class="rule-header">
                <span class="rule-name">${escapeHtml(rule.name)}</span>
                <span class="rule-status ${rule.status}">${rule.status === 'active' ? '✅ Active' : '⏸️ Inactive'}</span>
            </div>
            <div class="rule-body">
                <div class="rule-metric"><strong>Metric:</strong> ${getMetricLabel(rule.metricType)}</div>
                <div class="rule-metric"><strong>Threshold:</strong> ${rule.threshold} ${getMetricUnit(rule.metricType)}</div>
                <div class="rule-severity ${rule.severity}">${getSeverityLabel(rule.severity)}</div>
                ${rule.description ? `<div class="rule-metric" style="margin-top:8px;"><strong>Description:</strong> ${escapeHtml(rule.description)}</div>` : ''}
            </div>
            <div class="rule-actions">
                <button class="edit-btn" onclick="editRule(${rule.id})">✏️ Edit</button>
                <button class="toggle-btn" onclick="toggleRuleStatus(${rule.id})">${rule.status === 'active' ? '⏸️ Disable' : '▶️ Enable'}</button>
                <button class="delete-btn" onclick="deleteRulePrompt(${rule.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// ========= RENDER ALERTS =========
function renderAlerts() {
    const container = document.getElementById('alertsList');
    if (!container) return;
    
    const severityFilter = document.getElementById('severityFilter');
    const statusFilter = document.getElementById('statusFilter');
    const alertSearch = document.getElementById('alertSearch');
    
    const severityVal = severityFilter ? severityFilter.value : 'all';
    const statusVal = statusFilter ? statusFilter.value : 'all';
    const searchTerm = alertSearch ? alertSearch.value.toLowerCase() : '';
    
    let filtered = [...generatedAlerts];
    if (severityVal !== 'all') filtered = filtered.filter(a => a.severity === severityVal);
    if (statusVal !== 'all') filtered = filtered.filter(a => a.status === statusVal);
    if (searchTerm) filtered = filtered.filter(a => a.ruleName.toLowerCase().includes(searchTerm) || a.description.toLowerCase().includes(searchTerm));
    
    filtered.sort((a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt));
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔔</div><h3>No Alerts Found</h3><p>No alerts match your current filters.</p></div>`;
        return;
    }
    
    container.innerHTML = filtered.map(alert => `
        <div class="alert-item ${alert.severity}">
            <div class="alert-header">
                <div class="alert-title">
                    <span>${getSeverityIcon(alert.severity)} ${escapeHtml(alert.ruleName)}</span>
                    <span class="alert-badge ${alert.severity}">${alert.severity.toUpperCase()}</span>
                    <span class="alert-badge ${alert.status}">${alert.status === 'active' ? '⚠️ Active' : (alert.status === 'acknowledged' ? '👀 Acknowledged' : '✅ Resolved')}</span>
                </div>
            </div>
            <div class="alert-metric">
                <strong>Breached:</strong> ${alert.metricValue} (Threshold: ${alert.threshold})
            </div>
            <div class="alert-metric">
                ${escapeHtml(alert.description)}
            </div>
            <div class="alert-time">
                <span>🕐 Triggered: ${formatDate(alert.triggeredAt)}</span>
                <span>📅 ${new Date(alert.triggeredAt).toLocaleString()}</span>
            </div>
            <div class="alert-actions">
                ${alert.status === 'active' ? `<button class="acknowledge-btn" onclick="acknowledgeAlert(${alert.id})">✓ Acknowledge</button>` : ''}
                ${alert.status !== 'resolved' ? `<button class="resolve-btn" onclick="resolveAlert(${alert.id})">✅ Mark Resolved</button>` : ''}
                <button class="view-btn" onclick="viewAlertDetails(${alert.id})">📋 View Details</button>
            </div>
        </div>
    `).join('');
}

// ========= RULE CRUD OPERATIONS =========
function openRuleModal(rule = null) {
    const modal = document.getElementById('ruleModal');
    if (!modal) return;
    
    const title = document.getElementById('ruleModalTitle');
    const form = document.getElementById('ruleForm');
    
    if (rule) {
        currentEditingRule = rule;
        if (title) title.textContent = 'Edit Alert Rule';
        const nameInput = document.getElementById('ruleName');
        const metricSelect = document.getElementById('metricType');
        const thresholdInput = document.getElementById('thresholdValue');
        const severitySelect = document.getElementById('severity');
        const statusSelect = document.getElementById('ruleStatus');
        const descTextarea = document.getElementById('ruleDescription');
        
        if (nameInput) nameInput.value = rule.name;
        if (metricSelect) metricSelect.value = rule.metricType;
        if (thresholdInput) thresholdInput.value = rule.threshold;
        if (severitySelect) severitySelect.value = rule.severity;
        if (statusSelect) statusSelect.value = rule.status;
        if (descTextarea) descTextarea.value = rule.description || '';
    } else {
        currentEditingRule = null;
        if (title) title.textContent = 'Add New Alert Rule';
        if (form) form.reset();
    }
    modal.classList.add('show');
}

window.editRule = function(id) {
    const rule = alertRules.find(r => r.id === id);
    if (rule) openRuleModal(rule);
};

window.toggleRuleStatus = function(id) {
    const rule = alertRules.find(r => r.id === id);
    if (rule) {
        rule.status = rule.status === 'active' ? 'inactive' : 'active';
        renderRules();
        showToast(`Rule "${rule.name}" ${rule.status === 'active' ? 'enabled' : 'disabled'}`, 'success');
    }
};

window.deleteRulePrompt = function(id) {
    const rule = alertRules.find(r => r.id === id);
    if (rule) {
        currentDeletingRule = rule;
        const deleteNameSpan = document.getElementById('deleteRuleName');
        if (deleteNameSpan) deleteNameSpan.textContent = rule.name;
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) deleteModal.classList.add('show');
    }
};

function saveRule() {
    const nameInput = document.getElementById('ruleName');
    const metricSelect = document.getElementById('metricType');
    const thresholdInput = document.getElementById('thresholdValue');
    const severitySelect = document.getElementById('severity');
    const statusSelect = document.getElementById('ruleStatus');
    const descTextarea = document.getElementById('ruleDescription');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const metricType = metricSelect ? metricSelect.value : 'response_time';
    const threshold = thresholdInput ? parseInt(thresholdInput.value) : 0;
    const severity = severitySelect ? severitySelect.value : 'info';
    const status = statusSelect ? statusSelect.value : 'active';
    const description = descTextarea ? descTextarea.value : '';
    
    if (!name) { showToast('Please enter rule name', 'error'); return; }
    if (!threshold || threshold <= 0) { showToast('Please enter valid threshold value', 'error'); return; }
    
    if (currentEditingRule) {
        currentEditingRule.name = name;
        currentEditingRule.metricType = metricType;
        currentEditingRule.threshold = threshold;
        currentEditingRule.severity = severity;
        currentEditingRule.status = status;
        currentEditingRule.description = description;
        showToast('Rule updated successfully', 'success');
    } else {
        const newId = Math.max(...alertRules.map(r => r.id), 0) + 1;
        alertRules.push({ id: newId, name, metricType, threshold, severity, status, description, createdAt: new Date().toISOString() });
        showToast('Rule created successfully', 'success');
    }
    
    const ruleModal = document.getElementById('ruleModal');
    if (ruleModal) ruleModal.classList.remove('show');
    renderRules();
}

function deleteRule() {
    if (currentDeletingRule) {
        alertRules = alertRules.filter(r => r.id !== currentDeletingRule.id);
        renderRules();
        showToast('Rule deleted successfully', 'success');
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) deleteModal.classList.remove('show');
        currentDeletingRule = null;
    }
}

// ========= ALERT ACTIONS =========
window.acknowledgeAlert = function(id) {
    const alert = generatedAlerts.find(a => a.id === id);
    if (alert && alert.status === 'active') {
        alert.status = 'acknowledged';
        renderAlerts();
        updateAlertStats();
        showToast('Alert acknowledged', 'success');
    }
};

window.resolveAlert = function(id) {
    const alert = generatedAlerts.find(a => a.id === id);
    if (alert && alert.status !== 'resolved') {
        alert.status = 'resolved';
        renderAlerts();
        updateAlertStats();
        showToast('Alert marked as resolved', 'success');
    }
};

window.viewAlertDetails = function(id) {
    const alert = generatedAlerts.find(a => a.id === id);
    if (!alert) return;
    currentAlert = alert;
    
    const modal = document.getElementById('alertDetailModal');
    const title = document.getElementById('alertDetailTitle');
    const body = document.getElementById('alertDetailBody');
    
    if (title) title.textContent = `Alert: ${alert.ruleName}`;
    if (body) {
        body.innerHTML = `
            <div class="ticket-detail-grid">
                <div class="ticket-detail-item"><div class="ticket-detail-label">Severity</div><div class="ticket-detail-value"><span class="alert-badge ${alert.severity}">${alert.severity.toUpperCase()}</span></div></div>
                <div class="ticket-detail-item"><div class="ticket-detail-label">Status</div><div class="ticket-detail-value"><span class="alert-badge ${alert.status}">${alert.status}</span></div></div>
                <div class="ticket-detail-item"><div class="ticket-detail-label">Metric Breached</div><div class="ticket-detail-value">${alert.metricValue} (Threshold: ${alert.threshold})</div></div>
                <div class="ticket-detail-item"><div class="ticket-detail-label">Triggered At</div><div class="ticket-detail-value">${new Date(alert.triggeredAt).toLocaleString()}</div></div>
            </div>
            <div class="ticket-detail-item"><div class="ticket-detail-label">Description</div><div class="ticket-detail-value">${escapeHtml(alert.description)}</div></div>
        `;
    }
    if (modal) modal.classList.add('show');
};
// ========= TAB SWITCHING =========
const slaTabs = document.querySelectorAll('.sla-tab');
slaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        slaTabs.forEach(t => t.classList.remove('active'));
        const tabContents = document.querySelectorAll('.sla-tab-content');
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        const targetTab = document.getElementById(tabId === 'rules' ? 'rulesTab' : 'alertsTab');
        if (targetTab) targetTab.classList.add('active');
        if (tabId === 'alerts') renderAlerts();
    });
});

// ========= FILTER EVENT LISTENERS =========
const ruleSearch = document.getElementById('ruleSearch');
if (ruleSearch) ruleSearch.addEventListener('input', () => renderRules());

const severityFilter = document.getElementById('severityFilter');
if (severityFilter) severityFilter.addEventListener('change', () => renderAlerts());

const statusFilterAlert = document.getElementById('statusFilter');
if (statusFilterAlert) statusFilterAlert.addEventListener('change', () => renderAlerts());

const alertSearch = document.getElementById('alertSearch');
if (alertSearch) alertSearch.addEventListener('input', () => renderAlerts());

const refreshAlertsBtn = document.getElementById('refreshAlertsBtn');
if (refreshAlertsBtn) {
    refreshAlertsBtn.addEventListener('click', () => { 
        renderAlerts(); 
        showToast('Alerts refreshed', 'success'); 
    });
}

// ========= MODAL BUTTON HANDLERS =========
const addRuleBtn = document.getElementById('addRuleBtn');
if (addRuleBtn) addRuleBtn.addEventListener('click', () => openRuleModal(null));

const saveRuleBtn = document.getElementById('saveRuleBtn');
if (saveRuleBtn) saveRuleBtn.addEventListener('click', saveRule);

const cancelRuleBtn = document.getElementById('cancelRuleBtn');
if (cancelRuleBtn) {
    cancelRuleBtn.addEventListener('click', () => {
        const modal = document.getElementById('ruleModal');
        if (modal) modal.classList.remove('show');
    });
}

const closeRuleModal = document.getElementById('closeRuleModal');
if (closeRuleModal) {
    closeRuleModal.addEventListener('click', () => {
        const modal = document.getElementById('ruleModal');
        if (modal) modal.classList.remove('show');
    });
}

const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', deleteRule);

const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
        const modal = document.getElementById('deleteModal');
        if (modal) modal.classList.remove('show');
    });
}

const closeDeleteModal = document.getElementById('closeDeleteModal');
if (closeDeleteModal) {
    closeDeleteModal.addEventListener('click', () => {
        const modal = document.getElementById('deleteModal');
        if (modal) modal.classList.remove('show');
    });
}

const closeAlertModal = document.getElementById('closeAlertModal');
if (closeAlertModal) {
    closeAlertModal.addEventListener('click', () => {
        const modal = document.getElementById('alertDetailModal');
        if (modal) modal.classList.remove('show');
    });
}

const closeAlertDetailBtn = document.getElementById('closeAlertDetailBtn');
if (closeAlertDetailBtn) {
    closeAlertDetailBtn.addEventListener('click', () => {
        const modal = document.getElementById('alertDetailModal');
        if (modal) modal.classList.remove('show');
    });
}

const acknowledgeAlertBtn = document.getElementById('acknowledgeAlertBtn');
if (acknowledgeAlertBtn) {
    acknowledgeAlertBtn.addEventListener('click', () => { 
        if (currentAlert) { 
            acknowledgeAlert(currentAlert.id); 
            const modal = document.getElementById('alertDetailModal');
            if (modal) modal.classList.remove('show');
        } 
    });
}

const resolveAlertBtn = document.getElementById('resolveAlertBtn');
if (resolveAlertBtn) {
    resolveAlertBtn.addEventListener('click', () => { 
        if (currentAlert) { 
            resolveAlert(currentAlert.id); 
            const modal = document.getElementById('alertDetailModal');
            if (modal) modal.classList.remove('show');
        } 
    });
}

// ========= CLOSE MODALS ON OUTSIDE CLICK =========
window.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

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
renderRules();
renderAlerts();
updateAlertStats();

// Make functions available globally
window.showToast = showToast;
window.editRule = editRule;
window.toggleRuleStatus = toggleRuleStatus;
window.deleteRulePrompt = deleteRulePrompt;
window.acknowledgeAlert = acknowledgeAlert;
window.resolveAlert = resolveAlert;
window.viewAlertDetails = viewAlertDetails;
