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

// ================= RESOLUTION DATA =================
let resolutions = [];
let nextId = 1;

// Load saved resolutions from localStorage
function loadResolutions() {
    const saved = localStorage.getItem('resolution_notifications');
    if (saved) {
        resolutions = JSON.parse(saved);
        nextId = resolutions.length > 0 ? Math.max(...resolutions.map(r => r.id)) + 1 : 1;
    }
    renderHistory();
    updateStats();
}

// Save resolutions to localStorage
function saveResolutions() {
    localStorage.setItem('resolution_notifications', JSON.stringify(resolutions));
}

// ================= PREVIEW GENERATION =================
function generatePreview() {
    const area = document.getElementById('affectedArea')?.value || '[Affected Area]';
    const service = document.getElementById('serviceType')?.value || '[Service Type]';
    const outageId = document.getElementById('outageId')?.value || 'N/A';
    const resolutionTimeInput = document.getElementById('resolutionTime')?.value;
    const resolutionDetails = document.getElementById('resolutionDetails')?.value || 'Service has been fully restored.';
    const template = document.getElementById('templateSelect')?.value || 'default';
    
    let resolutionTime = 'Just now';
    if (resolutionTimeInput) {
        resolutionTime = new Date(resolutionTimeInput).toLocaleString();
    }
    
    let message = '';
    if (template === 'default') {
        message = `We are pleased to inform you that the service disruption in ${area} has been resolved. All services are now back to normal. We apologize for any inconvenience caused.`;
    } else if (template === 'detailed') {
        message = `The ${service} outage that affected ${area} has been fully resolved. ${resolutionDetails} Our team has verified that all systems are operating normally. Thank you for your patience.`;
    } else {
        message = `We sincerely apologize for the service interruption in ${area}. The issue has been resolved and ${service} services are now fully restored. ${resolutionDetails} We appreciate your understanding.`;
    }
    
    const previewHtml = `
        <div class="preview-card">
            <div class="preview-title">✅ SERVICE RESTORED</div>
            <div class="preview-area">
                📍 <strong>Affected Area:</strong> ${area}
            </div>
            <div class="preview-area">
                🔧 <strong>Service:</strong> ${service}
            </div>
            ${outageId !== 'N/A' ? `<div class="preview-area">🆔 <strong>Reference ID:</strong> ${outageId}</div>` : ''}
            <div class="preview-message">
                ${message}
            </div>
            <div class="preview-time">
                ✅ Resolved at: ${resolutionTime}
            </div>
        </div>
    `;
    
    const previewContainer = document.getElementById('notificationPreview');
    if (previewContainer) {
        previewContainer.innerHTML = previewHtml;
    }
}

// ================= SEND RESOLUTION NOTIFICATION =================
async function sendResolution() {
    const area = document.getElementById('affectedArea')?.value.trim();
    const service = document.getElementById('serviceType')?.value;
    const resolutionTimeInput = document.getElementById('resolutionTime')?.value;
    const outageId = document.getElementById('outageId')?.value.trim() || 'N/A';
    const resolutionDetails = document.getElementById('resolutionDetails')?.value.trim() || 'Service restored';
    
    if (!area || !service || !resolutionTimeInput) {
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
    
    const resolutionTime = new Date(resolutionTimeInput).toLocaleString();
    const timestamp = new Date().toISOString();
    const timestampDisplay = new Date().toLocaleString();
    const template = document.getElementById('templateSelect')?.value || 'default';
    
    // Simulate sending with status
    const resolution = {
        id: nextId++,
        area,
        service,
        outageId,
        resolutionDetails,
        resolutionTime,
        template,
        channels,
        timestamp,
        timestampDisplay,
        status: 'sent',
        read: false
    };
    
    resolutions.unshift(resolution);
    saveResolutions();
    renderHistory();
    updateStats();
    
    showToast(`Sending resolution notification via ${channels.join(', ')}...`, 'info');
    
    // Simulate delivery process
    setTimeout(() => {
        resolution.status = 'sent';
        saveResolutions();
        renderHistory();
        updateStats();
        
        showToast(`✅ Resolution notification sent successfully via ${channels.join(', ')}`, 'success');
        
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
    document.getElementById('outageId').value = '';
    document.getElementById('resolutionDetails').value = '';
    document.getElementById('templateSelect').value = 'default';
    document.getElementById('channelEmail').checked = true;
    document.getElementById('channelSms').checked = true;
    document.getElementById('channelPush').checked = false;
    document.getElementById('channelWebhook').checked = false;
    
    // Set default resolution time to now
    const resolutionTimeInput = document.getElementById('resolutionTime');
    if (resolutionTimeInput) {
        const now = new Date();
        resolutionTimeInput.value = now.toISOString().slice(0, 16);
    }
    
    generatePreview();
    showToast('Form cleared', 'info');
}

// ================= MARK AS READ =================
function markAsRead(id) {
    const resolution = resolutions.find(r => r.id === id);
    if (resolution && !resolution.read) {
        resolution.read = true;
        resolution.status = 'read';
        saveResolutions();
        renderHistory();
        updateStats();
        showToast('Marked as read', 'success');
    }
}

// ================= MARK ALL AS READ =================
function markAllAsRead() {
    let count = 0;
    resolutions.forEach(r => {
        if (!r.read) {
            r.read = true;
            r.status = 'read';
            count++;
        }
    });
    if (count > 0) {
        saveResolutions();
        renderHistory();
        updateStats();
        showToast(`${count} notifications marked as read`, 'success');
    } else {
        showToast('No unread notifications', 'info');
    }
}

// ================= RENDER HISTORY =================
function renderHistory() {
    const container = document.getElementById('resolutionHistory');
    const searchTerm = document.getElementById('historySearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    
    let filtered = [...resolutions];
    
    if (searchTerm) {
        filtered = filtered.filter(r => 
            r.area.toLowerCase().includes(searchTerm) ||
            r.service.toLowerCase().includes(searchTerm) ||
            (r.outageId && r.outageId.toLowerCase().includes(searchTerm))
        );
    }
    
    if (statusFilter !== 'all') {
        if (statusFilter === 'read') {
            filtered = filtered.filter(r => r.read === true);
        } else if (statusFilter === 'unread') {
            filtered = filtered.filter(r => r.read === false);
        } else if (statusFilter === 'sent') {
            filtered = filtered.filter(r => r.status === 'sent');
        }
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div>✅</div><p>No resolution notifications sent yet</p><span>Send a resolution notification to get started</span></div>';
        return;
    }
    
    container.innerHTML = filtered.map(res => `
        <div class="history-item ${res.read ? 'read' : 'unread'}" onclick="markAsRead(${res.id})">
            <div class="history-header">
                <span class="history-area">📍 ${res.area}</span>
                <span class="history-time">${res.timestampDisplay}</span>
            </div>
            <div class="history-details">
                <strong>${res.service}</strong> - Service Restored
                ${res.outageId !== 'N/A' ? `<br>🆔 Outage ID: ${res.outageId}` : ''}
            </div>
            <div class="history-details">
                ✅ Resolved: ${res.resolutionTime}
            </div>
            <div class="history-channels">
                📧 ${res.channels.join(', ')}
            </div>
            <div style="margin-top: 8px;">
                <span class="history-status ${res.read ? 'read' : 'unread'}">${res.read ? 'READ' : 'UNREAD'}</span>
            </div>
        </div>
    `).join('');
}

// ================= UPDATE STATS =================
function updateStats() {
    const total = resolutions.length;
    const read = resolutions.filter(r => r.read === true).length;
    const unread = resolutions.filter(r => r.read === false).length;
    
    document.getElementById('totalResolved').textContent = total;
    document.getElementById('totalSentResolutions').textContent = total;
    document.getElementById('readResolutions').textContent = read;
    document.getElementById('unreadResolutions').textContent = unread;
    
    document.getElementById('sentCount').textContent = total;
    document.getElementById('readCount').textContent = read;
    document.getElementById('unreadCountStat').textContent = unread;
    
    // Update badge
    const unreadBadge = document.getElementById('unreadBadge');
    if (unreadBadge) {
        unreadBadge.textContent = unread;
    }
}

// ================= EXPORT HISTORY =================
function exportHistory() {
    if (resolutions.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    const exportData = resolutions.map(r => ({
        id: r.id,
        area: r.area,
        service: r.service,
        outageId: r.outageId,
        resolutionDetails: r.resolutionDetails,
        resolutionTime: r.resolutionTime,
        channels: r.channels,
        sentAt: r.timestampDisplay,
        read: r.read
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `resolution_notifications_${new Date().toISOString().slice(0, 19)}.json`;
    
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
    const resolutionDetails = document.getElementById('resolutionDetails');
    
    if (template === 'apology' && resolutionDetails && !resolutionDetails.value) {
        resolutionDetails.value = 'We have implemented additional monitoring to prevent future issues.';
    } else if (template === 'detailed' && resolutionDetails && !resolutionDetails.value) {
        resolutionDetails.value = 'The root cause was identified as a fiber cut which has been repaired.';
    }
    
    generatePreview();
});

// ================= EVENT LISTENERS =================
document.getElementById('sendResolutionBtn')?.addEventListener('click', sendResolution);
document.getElementById('clearFormBtn')?.addEventListener('click', clearForm);
document.getElementById('markAllReadBtn')?.addEventListener('click', markAllAsRead);
document.getElementById('exportHistoryBtn')?.addEventListener('click', exportHistory);
document.getElementById('refreshPreviewBtn')?.addEventListener('click', generatePreview);

// Auto-update preview on input changes
const formInputs = ['affectedArea', 'serviceType', 'outageId', 'resolutionTime', 'resolutionDetails', 'templateSelect'];
formInputs.forEach(id => {
    document.getElementById(id)?.addEventListener('input', generatePreview);
    document.getElementById(id)?.addEventListener('change', generatePreview);
});

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    loadResolutions();
    
    // Set default resolution time to now
    const resolutionTimeInput = document.getElementById('resolutionTime');
    if (resolutionTimeInput) {
        const now = new Date();
        resolutionTimeInput.value = now.toISOString().slice(0, 16);
    }
    
    generatePreview();
    
    // Add sample data if empty
    if (resolutions.length === 0) {
        // Add sample resolution for demo
        const sampleResolution = {
            id: nextId++,
            area: 'Andheri West, Mumbai',
            service: 'Broadband Internet',
            outageId: 'OUT-20240417-001',
            resolutionDetails: 'Fiber optic cable was repaired and service restored.',
            resolutionTime: new Date().toLocaleString(),
            template: 'default',
            channels: ['Email', 'SMS'],
            timestamp: new Date().toISOString(),
            timestampDisplay: new Date().toLocaleString(),
            status: 'sent',
            read: false
        };
        resolutions.push(sampleResolution);
        saveResolutions();
        renderHistory();
        updateStats();
    }
    
    showToast('Resolution Notification System ready', 'success');
});

// Make functions global for onclick handlers
window.markAsRead = markAsRead;
window.showToast = showToast;