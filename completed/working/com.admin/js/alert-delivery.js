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
let recipients = [
    { id: 1, name: 'John Doe', role: 'Admin', email: 'john.doe@voxify.com', phone: '+91 98765 43210', slack: '@john.doe', preferences: { email: true, sms: true, slack: true }, createdAt: '2025-04-10T10:00:00' },
    { id: 2, name: 'Sarah Johnson', role: 'NOC Engineer', email: 'sarah.j@voxify.com', phone: '+91 87654 32109', slack: '@sarah.j', preferences: { email: true, sms: true, slack: false }, createdAt: '2025-04-11T14:30:00' },
    { id: 3, name: 'Mike Chen', role: 'Support Manager', email: 'mike.c@voxify.com', phone: '+91 76543 21098', slack: '@mike.c', preferences: { email: true, sms: false, slack: true }, createdAt: '2025-04-12T09:15:00' },
    { id: 4, name: 'Priya Sharma', role: 'Technical Lead', email: 'priya.s@voxify.com', phone: '+91 65432 10987', slack: '@priya.s', preferences: { email: true, sms: true, slack: true }, createdAt: '2025-04-13T11:00:00' }
];

let deliveryHistory = [
    { id: 1, alertTitle: 'Critical Outage Detected', severity: 'critical', channel: 'email', recipient: 'john.doe@voxify.com', status: 'delivered', sentAt: '2025-04-14T09:35:00', message: 'Outage detected in Sector 7 - Immediate action required' },
    { id: 2, alertTitle: 'Critical Outage Detected', severity: 'critical', channel: 'sms', recipient: '+91 98765 43210', status: 'delivered', sentAt: '2025-04-14T09:35:30', message: 'Outage detected in Sector 7 - Immediate action required' },
    { id: 3, alertTitle: 'SLA Breach Alert', severity: 'warning', channel: 'email', recipient: 'sarah.j@voxify.com', status: 'delivered', sentAt: '2025-04-14T10:20:00', message: 'Ticket #TKT-9901 has exceeded SLA threshold' },
    { id: 4, alertTitle: 'High Ticket Volume', severity: 'warning', channel: 'slack', recipient: '#alerts', status: 'pending', sentAt: '2025-04-14T11:05:00', message: 'Ticket volume spiked to 67 per hour' },
    { id: 5, alertTitle: 'Network Latency Alert', severity: 'info', channel: 'email', recipient: 'mike.c@voxify.com', status: 'failed', sentAt: '2025-04-14T10:45:00', message: 'Network latency detected at 120ms', error: 'SMTP connection timeout' }
];

let currentEditingRecipient = null;
let currentDeletingRecipient = null;
let currentResendAlert = null;

// ========= HELPER FUNCTIONS =========
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
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

// ========= TAB SWITCHING =========
function initTabs() {
    const deliveryTabs = document.querySelectorAll('.delivery-tab');
    deliveryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            deliveryTabs.forEach(t => t.classList.remove('active'));
            const tabContents = document.querySelectorAll('.delivery-tab-content');
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            let targetTab = null;
            if (tabId === 'channels') targetTab = document.getElementById('channelsTab');
            else if (tabId === 'recipients') targetTab = document.getElementById('recipientsTab');
            else if (tabId === 'history') targetTab = document.getElementById('historyTab');
            
            if (targetTab) targetTab.classList.add('active');
            if (tabId === 'recipients') renderRecipients();
            if (tabId === 'history') renderHistory();
        });
    });
}

// ========= RENDER RECIPIENTS =========
function renderRecipients() {
    const container = document.getElementById('recipientsGrid');
    if (!container) return;
    
    const searchInput = document.getElementById('recipientSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let filtered = recipients;
    if (searchTerm) {
        filtered = recipients.filter(r => r.name.toLowerCase().includes(searchTerm) || r.email.toLowerCase().includes(searchTerm) || r.role.toLowerCase().includes(searchTerm));
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👥</div><h3>No Recipients Found</h3><p>Click "Add Recipient" to add your first recipient.</p></div>`;
        return;
    }
    
    container.innerHTML = filtered.map(recipient => `
        <div class="recipient-card">
            <div class="recipient-header">
                <div>
                    <div class="recipient-name">${escapeHtml(recipient.name)}</div>
                    <div class="recipient-role">${escapeHtml(recipient.role)}</div>
                </div>
            </div>
            <div class="recipient-body">
                <div class="recipient-contact"><span>📧</span> ${escapeHtml(recipient.email)}</div>
                <div class="recipient-contact"><span>📱</span> ${escapeHtml(recipient.phone)}</div>
                <div class="recipient-contact"><span>💬</span> ${escapeHtml(recipient.slack)}</div>
                <div class="recipient-channels">
                    ${recipient.preferences.email ? '<span class="channel-tag">📧 Email</span>' : ''}
                    ${recipient.preferences.sms ? '<span class="channel-tag">📱 SMS</span>' : ''}
                    ${recipient.preferences.slack ? '<span class="channel-tag">💬 Slack</span>' : ''}
                </div>
            </div>
            <div class="recipient-actions">
                <button class="edit-recipient" onclick="editRecipient(${recipient.id})">✏️ Edit</button>
                <button class="delete-recipient" onclick="deleteRecipientPrompt(${recipient.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// ========= RENDER HISTORY =========
function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    const severityFilter = document.getElementById('historySeverityFilter');
    const statusFilter = document.getElementById('historyStatusFilter');
    const searchInput = document.getElementById('historySearch');
    
    const severityVal = severityFilter ? severityFilter.value : 'all';
    const statusVal = statusFilter ? statusFilter.value : 'all';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let filtered = [...deliveryHistory];
    if (severityVal !== 'all') filtered = filtered.filter(h => h.severity === severityVal);
    if (statusVal !== 'all') filtered = filtered.filter(h => h.status === statusVal);
    if (searchTerm) filtered = filtered.filter(h => h.alertTitle.toLowerCase().includes(searchTerm) || h.recipient.toLowerCase().includes(searchTerm));
    
    filtered.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📜</div><h3>No History Found</h3><p>No alert delivery records match your filters.</p></div>`;
        return;
    }
    
    container.innerHTML = filtered.map(history => `
        <div class="history-item">
            <div class="history-header">
                <span class="history-title">${escapeHtml(history.alertTitle)}</span>
                <span class="history-badge ${history.status}">${history.status === 'delivered' ? '✅ Delivered' : (history.status === 'pending' ? '⏳ Pending' : '❌ Failed')}</span>
            </div>
            <div class="history-details">
                <span>📧 Channel: ${history.channel.toUpperCase()}</span>
                <span>👤 To: ${escapeHtml(history.recipient)}</span>
                <span>🕐 ${formatDate(history.sentAt)}</span>
                <span>📅 ${new Date(history.sentAt).toLocaleString()}</span>
            </div>
            <div class="history-message">${escapeHtml(history.message)}</div>
            ${history.error ? `<div class="history-details" style="color: var(--error-red);">❌ Error: ${escapeHtml(history.error)}</div>` : ''}
            <div style="margin-top: 8px;">
                <button class="resend-btn" onclick="resendAlertPrompt(${history.id})">🔄 Resend Alert</button>
            </div>
        </div>
    `).join('');
}

// ========= RECIPIENT CRUD =========
function openRecipientModal(recipient = null) {
    const modal = document.getElementById('recipientModal');
    if (!modal) return;
    
    const title = document.getElementById('recipientModalTitle');
    
    if (recipient) {
        currentEditingRecipient = recipient;
        if (title) title.textContent = 'Edit Recipient';
        const nameInput = document.getElementById('recipientName');
        const roleSelect = document.getElementById('recipientRole');
        const emailInput = document.getElementById('recipientEmail');
        const phoneInput = document.getElementById('recipientPhone');
        const slackInput = document.getElementById('recipientSlack');
        const prefEmail = document.getElementById('prefEmail');
        const prefSms = document.getElementById('prefSms');
        const prefSlack = document.getElementById('prefSlack');
        
        if (nameInput) nameInput.value = recipient.name;
        if (roleSelect) roleSelect.value = recipient.role;
        if (emailInput) emailInput.value = recipient.email;
        if (phoneInput) phoneInput.value = recipient.phone;
        if (slackInput) slackInput.value = recipient.slack;
        if (prefEmail) prefEmail.checked = recipient.preferences.email;
        if (prefSms) prefSms.checked = recipient.preferences.sms;
        if (prefSlack) prefSlack.checked = recipient.preferences.slack;
    } else {
        currentEditingRecipient = null;
        if (title) title.textContent = 'Add Recipient';
        const form = document.getElementById('recipientForm');
        if (form) form.reset();
        const prefEmail = document.getElementById('prefEmail');
        if (prefEmail) prefEmail.checked = true;
    }
    modal.classList.add('show');
}

window.editRecipient = function(id) {
    const recipient = recipients.find(r => r.id === id);
    if (recipient) openRecipientModal(recipient);
};

window.deleteRecipientPrompt = function(id) {
    const recipient = recipients.find(r => r.id === id);
    if (recipient) {
        currentDeletingRecipient = recipient;
        const nameSpan = document.getElementById('deleteRecipientName');
        if (nameSpan) nameSpan.textContent = recipient.name;
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) deleteModal.classList.add('show');
    }
};

function saveRecipient() {
    const name = document.getElementById('recipientName')?.value.trim() || '';
    const role = document.getElementById('recipientRole')?.value || '';
    const email = document.getElementById('recipientEmail')?.value.trim() || '';
    const phone = document.getElementById('recipientPhone')?.value.trim() || '';
    const slack = document.getElementById('recipientSlack')?.value.trim() || '';
    const preferences = {
        email: document.getElementById('prefEmail')?.checked || false,
        sms: document.getElementById('prefSms')?.checked || false,
        slack: document.getElementById('prefSlack')?.checked || false
    };
    
    if (!name) { showToast('Please enter recipient name', 'error'); return; }
    
    if (currentEditingRecipient) {
        currentEditingRecipient.name = name;
        currentEditingRecipient.role = role;
        currentEditingRecipient.email = email;
        currentEditingRecipient.phone = phone;
        currentEditingRecipient.slack = slack;
        currentEditingRecipient.preferences = preferences;
        showToast('Recipient updated successfully', 'success');
    } else {
        const newId = recipients.length > 0 ? Math.max(...recipients.map(r => r.id), 0) + 1 : 1;
        recipients.push({ id: newId, name, role, email, phone, slack, preferences, createdAt: new Date().toISOString() });
        showToast('Recipient added successfully', 'success');
    }
    
    const modal = document.getElementById('recipientModal');
    if (modal) modal.classList.remove('show');
    renderRecipients();
}

function deleteRecipient() {
    if (currentDeletingRecipient) {
        recipients = recipients.filter(r => r.id !== currentDeletingRecipient.id);
        renderRecipients();
        showToast('Recipient deleted successfully', 'success');
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) deleteModal.classList.remove('show');
        currentDeletingRecipient = null;
    }
}

// ========= RESEND ALERT =========
window.resendAlertPrompt = function(id) {
    const history = deliveryHistory.find(h => h.id === id);
    if (history) {
        currentResendAlert = history;
        const modal = document.getElementById('resendModal');
        if (modal) modal.classList.add('show');
        
        // Set default checkboxes based on original channel
        const emailCheck = document.getElementById('resendEmail');
        const smsCheck = document.getElementById('resendSms');
        const slackCheck = document.getElementById('resendSlack');
        const webhookCheck = document.getElementById('resendWebhook');
        
        if (emailCheck) emailCheck.checked = history.channel === 'email';
        if (smsCheck) smsCheck.checked = history.channel === 'sms';
        if (slackCheck) slackCheck.checked = history.channel === 'slack';
        if (webhookCheck) webhookCheck.checked = false;
    }
};

function resendAlert() {
    if (!currentResendAlert) return;
    
    const channels = [];
    if (document.getElementById('resendEmail')?.checked) channels.push('email');
    if (document.getElementById('resendSms')?.checked) channels.push('sms');
    if (document.getElementById('resendSlack')?.checked) channels.push('slack');
    if (document.getElementById('resendWebhook')?.checked) channels.push('webhook');
    
    if (channels.length === 0) { showToast('Please select at least one channel', 'error'); return; }
    
    // Simulate resend
    channels.forEach(channel => {
        const newHistory = {
            id: deliveryHistory.length + 1,
            alertTitle: currentResendAlert.alertTitle,
            severity: currentResendAlert.severity,
            channel: channel,
            recipient: currentResendAlert.recipient,
            status: 'delivered',
            sentAt: new Date().toISOString(),
            message: currentResendAlert.message + ' (Resent)'
        };
        deliveryHistory.unshift(newHistory);
    });
    
    showToast(`Alert resent via ${channels.join(', ')}`, 'success');
    const modal = document.getElementById('resendModal');
    if (modal) modal.classList.remove('show');
    renderHistory();
    currentResendAlert = null;
}

// ========= SAVE CHANNEL SETTINGS =========
function saveChannelSettings() {
    // Save channel enabled states
    const emailEnabled = document.getElementById('emailEnabled')?.checked || false;
    const smsEnabled = document.getElementById('smsEnabled')?.checked || false;
    const webhookEnabled = document.getElementById('webhookEnabled')?.checked || false;
    const slackEnabled = document.getElementById('slackEnabled')?.checked || false;
    
    // Save SMTP settings
    const smtpServer = document.getElementById('smtpServer')?.value || '';
    const fromEmail = document.getElementById('fromEmail')?.value || '';
    const smsGateway = document.getElementById('smsGateway')?.value || '';
    const senderId = document.getElementById('senderId')?.value || '';
    
    // Save severity preferences
    const severitySettings = {};
    const severityChannels = document.querySelectorAll('.severity-channel');
    severityChannels.forEach(checkbox => {
        const severity = checkbox.getAttribute('data-severity');
        const channel = checkbox.getAttribute('data-channel');
        if (!severitySettings[severity]) severitySettings[severity] = {};
        severitySettings[severity][channel] = checkbox.checked;
    });
    
    localStorage.setItem('channelSettings', JSON.stringify({
        emailEnabled, smsEnabled, webhookEnabled, slackEnabled,
        smtpServer, fromEmail, smsGateway, senderId,
        severitySettings
    }));
    
    showToast('Channel settings saved successfully', 'success');
}
// ========= LOAD SAVED SETTINGS =========
function loadSavedSettings() {
    const saved = localStorage.getItem('channelSettings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            const emailEnabledEl = document.getElementById('emailEnabled');
            const smsEnabledEl = document.getElementById('smsEnabled');
            const webhookEnabledEl = document.getElementById('webhookEnabled');
            const slackEnabledEl = document.getElementById('slackEnabled');
            const smtpServerEl = document.getElementById('smtpServer');
            const fromEmailEl = document.getElementById('fromEmail');
            const smsGatewayEl = document.getElementById('smsGateway');
            const senderIdEl = document.getElementById('senderId');
            
            if (emailEnabledEl) emailEnabledEl.checked = settings.emailEnabled || false;
            if (smsEnabledEl) smsEnabledEl.checked = settings.smsEnabled || false;
            if (webhookEnabledEl) webhookEnabledEl.checked = settings.webhookEnabled || false;
            if (slackEnabledEl) slackEnabledEl.checked = settings.slackEnabled || false;
            if (smtpServerEl) smtpServerEl.value = settings.smtpServer || '';
            if (fromEmailEl) fromEmailEl.value = settings.fromEmail || '';
            if (smsGatewayEl) smsGatewayEl.value = settings.smsGateway || '';
            if (senderIdEl) senderIdEl.value = settings.senderId || '';
            
            if (settings.severitySettings) {
                const severityChannels = document.querySelectorAll('.severity-channel');
                severityChannels.forEach(checkbox => {
                    const severity = checkbox.getAttribute('data-severity');
                    const channel = checkbox.getAttribute('data-channel');
                    if (settings.severitySettings[severity] && settings.severitySettings[severity][channel] !== undefined) {
                        checkbox.checked = settings.severitySettings[severity][channel];
                    }
                });
            }
        } catch(e) { 
            console.error('Error loading settings:', e); 
        }
    }
}

// ========= FILTER EVENT LISTENERS =========
function initEventListeners() {
    const recipientSearch = document.getElementById('recipientSearch');
    if (recipientSearch) recipientSearch.addEventListener('input', () => renderRecipients());
    
    const historySeverityFilter = document.getElementById('historySeverityFilter');
    if (historySeverityFilter) historySeverityFilter.addEventListener('change', () => renderHistory());
    
    const historyStatusFilter = document.getElementById('historyStatusFilter');
    if (historyStatusFilter) historyStatusFilter.addEventListener('change', () => renderHistory());
    
    const historySearch = document.getElementById('historySearch');
    if (historySearch) historySearch.addEventListener('input', () => renderHistory());
    
    const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
    if (refreshHistoryBtn) {
        refreshHistoryBtn.addEventListener('click', () => { 
            renderHistory(); 
            showToast('History refreshed', 'success'); 
        });
    }
    
    const saveChannelBtn = document.getElementById('saveChannelSettings');
    if (saveChannelBtn) {
        saveChannelBtn.addEventListener('click', saveChannelSettings);
    }
}

// ========= MODAL BUTTON HANDLERS =========
function initModalHandlers() {
    const addRecipientBtn = document.getElementById('addRecipientBtn');
    if (addRecipientBtn) addRecipientBtn.addEventListener('click', () => openRecipientModal(null));
    
    const saveRecipientBtn = document.getElementById('saveRecipientBtn');
    if (saveRecipientBtn) saveRecipientBtn.addEventListener('click', saveRecipient);
    
    const cancelRecipientBtn = document.getElementById('cancelRecipientBtn');
    if (cancelRecipientBtn) {
        cancelRecipientBtn.addEventListener('click', () => {
            const modal = document.getElementById('recipientModal');
            if (modal) modal.classList.remove('show');
        });
    }
    
    const closeRecipientModal = document.getElementById('closeRecipientModal');
    if (closeRecipientModal) {
        closeRecipientModal.addEventListener('click', () => {
            const modal = document.getElementById('recipientModal');
            if (modal) modal.classList.remove('show');
        });
    }
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', deleteRecipient);
    
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
    
    const confirmResendBtn = document.getElementById('confirmResendBtn');
    if (confirmResendBtn) confirmResendBtn.addEventListener('click', resendAlert);
    
    const cancelResendBtn = document.getElementById('cancelResendBtn');
    if (cancelResendBtn) {
        cancelResendBtn.addEventListener('click', () => {
            const modal = document.getElementById('resendModal');
            if (modal) modal.classList.remove('show');
        });
    }
    
    const closeResendModal = document.getElementById('closeResendModal');
    if (closeResendModal) {
        closeResendModal.addEventListener('click', () => {
            const modal = document.getElementById('resendModal');
            if (modal) modal.classList.remove('show');
        });
    }
}

// ========= CLOSE MODALS ON OUTSIDE CLICK =========
function initOutsideClickHandler() {
    window.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
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
function init() {
    console.log('Initializing Alert Delivery page...');
    initTabs();
    initEventListeners();
    initModalHandlers();
    initOutsideClickHandler();
    renderRecipients();
    renderHistory();
    loadSavedSettings();
    console.log('Alert Delivery page initialized successfully');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make functions available globally
window.showToast = showToast;
window.editRecipient = editRecipient;
window.deleteRecipientPrompt = deleteRecipientPrompt;
window.resendAlertPrompt = resendAlertPrompt;