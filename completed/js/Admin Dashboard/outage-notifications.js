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

// ================= NOTIFICATION DATA =================
let notifications = [];
let nextId = 1;

// Load saved notifications from localStorage
function loadNotifications() {
    const saved = localStorage.getItem('outage_notifications');
    if (saved) {
        notifications = JSON.parse(saved);
        nextId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
    }
    renderHistory();
    updateStats();
}

// Save notifications to localStorage
function saveNotifications() {
    localStorage.setItem('outage_notifications', JSON.stringify(notifications));
}

// ================= PREVIEW GENERATION =================
function generatePreview() {
    const area = document.getElementById('affectedArea')?.value || '[Affected Area]';
    const service = document.getElementById('serviceType')?.value || '[Service Type]';
    const issue = document.getElementById('issueDescription')?.value || '[Issue Description]';
    const etaInput = document.getElementById('etaTime')?.value;
    const severity = document.getElementById('severityLevel')?.value || 'medium';
    
    let eta = 'To be announced';
    if (etaInput) {
        eta = new Date(etaInput).toLocaleString();
    }
    
    const severityText = {
        critical: 'CRITICAL OUTAGE',
        high: 'HIGH PRIORITY ALERT',
        medium: 'Service Disruption',
        low: 'Service Advisory'
    };
    
    const previewHtml = `
        <div class="preview-card ${severity}">
            <div class="preview-title">⚠️ ${severityText[severity]}</div>
            <div class="preview-area">
                📍 <strong>Affected Area:</strong> ${area}
            </div>
            <div class="preview-area">
                🔧 <strong>Service:</strong> ${service}
            </div>
            <div class="preview-message">
                <strong>Issue:</strong> ${issue}<br><br>
                Our technical team is working urgently to restore services. We apologize for the inconvenience caused.
            </div>
            <div class="preview-eta">
                ⏰ Estimated Restoration: ${eta}
            </div>
        </div>
    `;
    
    const previewContainer = document.getElementById('notificationPreview');
    if (previewContainer) {
        previewContainer.innerHTML = previewHtml;
    }
}

// ================= SEND NOTIFICATION =================
async function sendNotification() {
    const area = document.getElementById('affectedArea')?.value.trim();
    const service = document.getElementById('serviceType')?.value;
    const issue = document.getElementById('issueDescription')?.value.trim();
    const etaInput = document.getElementById('etaTime')?.value;
    const severity = document.getElementById('severityLevel')?.value;
    const affectedCustomers = document.getElementById('affectedCustomers')?.value;
    
    if (!area || !service || !issue || !etaInput) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const channels = [];
    if (document.getElementById('channelEmail')?.checked) channels.push('Email');
    if (document.getElementById('channelSms')?.checked) channels.push('SMS');
    if (document.getElementById('channelPush')?.checked) channels.push('Push');
    if (document.getElementById('channelWebhook')?.checked) channels.push('Webhook');
    
    if (channels.length === 0) {
        showToast('Please select at least one delivery channel', 'error');
        return;
    }
    
    const eta = new Date(etaInput).toLocaleString();
    const timestamp = new Date().toISOString();
    const timestampDisplay = new Date().toLocaleString();
    
    // Simulate sending with status updates
    const notification = {
        id: nextId++,
        area,
        service,
        issue,
        eta,
        severity,
        affectedCustomers: parseInt(affectedCustomers) || 0,
        channels,
        timestamp,
        timestampDisplay,
        status: 'pending'
    };
    
    notifications.unshift(notification);
    saveNotifications();
    renderHistory();
    updateStats();
    
    showToast(`Sending notification to ${channels.join(', ')}...`, 'info');
    
    // Simulate delivery process
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        notification.status = success ? 'delivered' : 'failed';
        
        if (success) {
            showToast(`✅ Notification sent successfully via ${channels.join(', ')}`, 'success');
        } else {
            showToast(`❌ Failed to send notification. Please try again.`, 'error');
        }
        
        saveNotifications();
        renderHistory();
        updateStats();
        
        // Update badge
        const unreadBadge = document.getElementById('unreadBadge');
        if (unreadBadge) {
            const currentCount = parseInt(unreadBadge.textContent) || 0;
            unreadBadge.textContent = currentCount + 1;
        }
    }, 1500);
    
    // Clear form
    clearForm();
}

// ================= CLEAR FORM =================
function clearForm() {
    document.getElementById('affectedArea').value = '';
    document.getElementById('serviceType').value = '';
    document.getElementById('issueDescription').value = '';
    document.getElementById('etaTime').value = '';
    document.getElementById('severityLevel').value = 'medium';
    document.getElementById('affectedCustomers').value = '500';
    document.getElementById('channelEmail').checked = true;
    document.getElementById('channelSms').checked = true;
    document.getElementById('channelPush').checked = false;
    document.getElementById('channelWebhook').checked = false;
    document.getElementById('templateSelect').value = 'default';
    
    generatePreview();
    showToast('Form cleared', 'info');
}

// ================= RENDER HISTORY =================
function renderHistory() {
    const container = document.getElementById('notificationHistory');
    const searchTerm = document.getElementById('historySearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    
    let filtered = [...notifications];
    
    if (searchTerm) {
        filtered = filtered.filter(n => 
            n.area.toLowerCase().includes(searchTerm) ||
            n.service.toLowerCase().includes(searchTerm) ||
            n.issue.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(n => n.status === statusFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div>📭</div><p>No notifications found</p></div>';
        return;
    }
    
    container.innerHTML = filtered.map(notif => `
        <div class="history-item ${notif.status}">
            <div class="history-header">
                <span class="history-area">📍 ${notif.area}</span>
                <span class="history-time">${notif.timestampDisplay}</span>
            </div>
            <div class="history-details">
                <strong>${notif.service}</strong> - ${notif.issue}
            </div>
            <div class="history-details">
                ⏰ ETA: ${notif.eta} | 👥 ${notif.affectedCustomers} customers affected
            </div>
            <div class="history-channels">
                📧 ${notif.channels.join(', ')}
            </div>
            <div style="margin-top: 8px;">
                <span class="history-status ${notif.status}">${notif.status.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

// ================= UPDATE STATS =================
function updateStats() {
    const total = notifications.length;
    const delivered = notifications.filter(n => n.status === 'delivered').length;
    const pending = notifications.filter(n => n.status === 'pending').length;
    const failed = notifications.filter(n => n.status === 'failed').length;
    
    document.getElementById('totalSent').textContent = total;
    document.getElementById('deliveredCount').textContent = delivered;
    document.getElementById('pendingCountStat').textContent = pending;
    document.getElementById('failedCountStat').textContent = failed;
    
    document.getElementById('sentCount').textContent = delivered;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('failedCount').textContent = failed;
}

// ================= CLEAR HISTORY =================
function clearHistory() {
    if (confirm('Are you sure you want to clear all notification history? This cannot be undone.')) {
        notifications = [];
        nextId = 1;
        saveNotifications();
        renderHistory();
        updateStats();
        showToast('History cleared', 'info');
    }
}

// ================= EXPORT HISTORY =================
function exportHistory() {
    if (notifications.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(notifications, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `outage_notifications_${new Date().toISOString().slice(0, 19)}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', exportFileName);
    link.click();
    
    showToast('History exported successfully', 'success');
}

// ================= SEARCH & FILTER =================
document.getElementById('historySearch')?.addEventListener('input', () => {
    renderHistory();
});

document.getElementById('statusFilter')?.addEventListener('change', () => {
    renderHistory();
});

// ================= TEMPLATE SELECTOR =================
document.getElementById('templateSelect')?.addEventListener('change', (e) => {
    const template = e.target.value;
    const area = document.getElementById('affectedArea');
    const service = document.getElementById('serviceType');
    const issue = document.getElementById('issueDescription');
    
    if (template === 'critical') {
        if (area && !area.value) area.value = 'Multiple Locations';
        if (service && !service.value) service.value = 'All Services';
        if (issue && !issue.value) issue.value = 'Major Network Outage';
        document.getElementById('severityLevel').value = 'critical';
    } else if (template === 'maintenance') {
        if (issue && !issue.value) issue.value = 'Scheduled Maintenance';
        document.getElementById('severityLevel').value = 'low';
    } else if (template === 'resolved') {
        if (issue && !issue.value) issue.value = 'Service has been restored';
        document.getElementById('severityLevel').value = 'low';
    }
    
    generatePreview();
});

// ================= EVENT LISTENERS =================
document.getElementById('sendNotificationBtn')?.addEventListener('click', sendNotification);
document.getElementById('clearFormBtn')?.addEventListener('click', clearForm);
document.getElementById('clearHistoryBtn')?.addEventListener('click', clearHistory);
document.getElementById('exportHistoryBtn')?.addEventListener('click', exportHistory);
document.getElementById('refreshPreviewBtn')?.addEventListener('click', generatePreview);

// Auto-update preview on input changes
const formInputs = ['affectedArea', 'serviceType', 'issueDescription', 'etaTime', 'severityLevel'];
formInputs.forEach(id => {
    document.getElementById(id)?.addEventListener('input', generatePreview);
    document.getElementById(id)?.addEventListener('change', generatePreview);
});

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
    generatePreview();
    
    // Set default ETA to 2 hours from now
    const etaInput = document.getElementById('etaTime');
    if (etaInput) {
        const defaultEta = new Date();
        defaultEta.setHours(defaultEta.getHours() + 2);
        etaInput.value = defaultEta.toISOString().slice(0, 16);
        generatePreview();
    }
    
    showToast('Outage Notification System ready', 'success');
});

window.showToast = showToast;