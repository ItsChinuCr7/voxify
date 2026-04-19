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
        profileDropdown.classList.remove('open');
    });
}

if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('open');
        statusDropdown.classList.remove('open');
    });
}

document.addEventListener('click', () => {
    if (profileDropdown) profileDropdown.classList.remove('open');
    if (statusDropdown) statusDropdown.classList.remove('open');
});

// ========= TELECOM/BROADBAND/CALLING ALERTS DATA =========
let notifications = [
    // Critical Outages - Broadband/Internet
    { id: 1, title: "🌐 Broadband Outage - Andheri West", description: "Fiber optic cable damaged due to road work. Internet services disrupted in Andheri West, Versova, and Juhu. Estimated restoration: 4 hours.", type: "Outage", severity: "critical", status: "unread", timestamp: "2025-04-14T08:30:00", icon: "🌐", affectedArea: "Andheri West, Versova, Juhu", eta: "4 hours" },
    { id: 2, title: "📡 5G Network Degradation", description: "Signal tower maintenance in progress. Users in Goregaon and Malad may experience slow data speeds. ETA: 2 hours.", type: "Outage", severity: "critical", status: "unread", timestamp: "2025-04-14T07:15:00", icon: "📡", affectedArea: "Goregaon, Malad", eta: "2 hours" },
    { id: 3, title: "📞 Calling Service Disruption", description: "Voice call routing issue affecting outgoing calls to other networks. Incoming calls working normally. Fix in progress.", type: "Outage", severity: "critical", status: "unread", timestamp: "2025-04-13T22:00:00", icon: "📞", affectedArea: "Mumbai Region", eta: "3 hours" },
    
    // Warning Issues
    { id: 4, title: "⚠️ High Latency Alert", description: "Increased ping times detected for broadband users in Powai. Gaming and video calls may be affected. Team investigating.", type: "Outage", severity: "warning", status: "unread", timestamp: "2025-04-14T06:45:00", icon: "⚠️", affectedArea: "Powai", eta: "Under investigation" },
    { id: 5, title: "📱 Mobile Data Fluctuation", description: "4G/5G data speeds fluctuating in BKC area due to tower congestion. Expect slower speeds during peak hours.", type: "Outage", severity: "warning", status: "read", timestamp: "2025-04-13T17:30:00", icon: "📱", affectedArea: "Bandra Kurla Complex", eta: "Ongoing" },
    { id: 6, title: "🔧 Scheduled Maintenance", description: "Planned network upgrade on April 16, 2 AM to 5 AM. Broadband and calling services may be interrupted briefly.", type: "System", severity: "warning", status: "unread", timestamp: "2025-04-14T10:00:00", icon: "🔧", affectedArea: "All Mumbai", eta: "April 16, 2-5 AM" },
    
    // Complaint Status Updates
    { id: 7, title: "✅ Complaint #CMP-10234 Resolved", description: "Your broadband connectivity complaint has been resolved. Technician confirmed service restoration. Please share your feedback.", type: "Complaint", severity: "info", status: "unread", timestamp: "2025-04-14T09:20:00", icon: "✅", complaintId: "CMP-10234" },
    { id: 8, title: "🔄 Complaint #CMP-10567 Escalated", description: "Your calling issue has been escalated to senior network engineer. Resolution expected within 24 hours.", type: "Complaint", severity: "warning", status: "read", timestamp: "2025-04-13T14:15:00", icon: "🔄", complaintId: "CMP-10567" },
    { id: 9, title: "👨‍🔧 Technician Assigned", description: "Technician Rajesh Kumar has been assigned to Complaint #CMP-10892. Expected arrival: 2-4 hours.", type: "Complaint", severity: "info", status: "read", timestamp: "2025-04-13T11:30:00", icon: "👨‍🔧", complaintId: "CMP-10892" },
    { id: 10, title: "⏳ Complaint #CMP-10934 In Progress", description: "Your slow broadband issue is being investigated by our network team. Status: Line testing in progress.", type: "Complaint", severity: "info", status: "read", timestamp: "2025-04-12T16:45:00", icon: "⏳", complaintId: "CMP-10934" },
    
    // Resolution Notifications
    { id: 11, title: "🎉 Service Restored - Andheri", description: "Broadband services in Andheri West are now fully restored. Thank you for your patience.", type: "Resolution", severity: "success", status: "read", timestamp: "2025-04-13T19:00:00", icon: "🎉", affectedArea: "Andheri West" },
    { id: 12, title: "📶 Network Optimization Complete", description: "5G network in Goregaon area has been optimized. Users should experience better speeds now.", type: "Resolution", severity: "success", status: "read", timestamp: "2025-04-13T10:30:00", icon: "📶", affectedArea: "Goregaon" },
    
    // Proactive Alerts
    { id: 13, title: "⚡ Power Fluctuation Alert", description: "Power instability detected in your area. Keep your router connected to UPS to avoid disruption.", type: "Outage", severity: "warning", status: "unread", timestamp: "2025-04-14T05:00:00", icon: "⚡", affectedArea: "Your Location", eta: "Stable now" },
    { id: 14, title: "📢 New Feature: WiFi Calling", description: "You can now make calls over WiFi when cellular signal is weak. Enable in app settings.", type: "System", severity: "info", status: "read", timestamp: "2025-04-12T09:00:00", icon: "📢" },
    { id: 15, title: "💰 Bill Payment Reminder", description: "Your broadband bill payment is due in 3 days. Pay now to avoid service interruption.", type: "System", severity: "info", status: "unread", timestamp: "2025-04-14T00:15:00", icon: "💰" },
    
    // Customer Feedback Related
    { id: 16, title: "⭐ Rate Your Experience", description: "Your complaint #CMP-10234 was resolved. How was your service experience?", type: "System", severity: "info", status: "unread", timestamp: "2025-04-14T09:25:00", icon: "⭐", complaintId: "CMP-10234" },
    
    // Multiple complaints to one outage linkage
    { id: 17, title: "🔗 Outage Linked to Your Complaint", description: "Your complaint #CMP-10589 has been linked to a major outage in Malad. Multiple users affected. Tracking ID: OUT-2024-042", type: "Complaint", severity: "warning", status: "read", timestamp: "2025-04-13T08:00:00", icon: "🔗", complaintId: "CMP-10589" }
];

// ========= FILTER VARIABLES =========
let currentFilterType = "all";
let currentStatusFilter = "all";
let searchKeyword = "";

// ========= HELPER FUNCTIONS =========
function updateStatsAndBadge() {
    const critical = notifications.filter(n => n.severity === "critical").length;
    const warning = notifications.filter(n => n.severity === "warning").length;
    const unread = notifications.filter(n => n.status === "unread").length;
    const resolvedInfo = notifications.filter(n => n.severity === "success" || n.severity === "info").length;
    
    const criticalCountEl = document.getElementById('criticalCount');
    const warningCountEl = document.getElementById('warningCount');
    const unreadCountEl = document.getElementById('unreadCount');
    const resolvedCountEl = document.getElementById('resolvedCount');
    const globalBadge = document.getElementById('globalUnreadBadge');
    
    if (criticalCountEl) criticalCountEl.innerText = critical;
    if (warningCountEl) warningCountEl.innerText = warning;
    if (unreadCountEl) unreadCountEl.innerText = unread;
    if (resolvedCountEl) resolvedCountEl.innerText = resolvedInfo;
    if (globalBadge) globalBadge.innerText = unread > 9 ? "9+" : unread;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

function getSeverityClass(severity) {
    switch(severity) {
        case 'critical': return '';
        case 'warning': return 'warning';
        case 'success': return 'resolved';
        default: return 'info';
    }
}

function getSeverityLabel(severity) {
    switch(severity) {
        case 'critical': return 'CRITICAL';
        case 'warning': return 'WARNING';
        case 'success': return 'RESOLVED';
        default: return 'INFO';
    }
}

// ========= MARK AS READ FUNCTION =========
window.markAsRead = function(id) {
    const idx = notifications.findIndex(n => n.id === id);
    if (idx !== -1 && notifications[idx].status === "unread") {
        notifications[idx].status = "read";
        updateStatsAndBadge();
        renderNotifications();
        showToast("Notification marked as read", "success");
    } else if (notifications[idx] && notifications[idx].status === "read") {
        showToast("Already read", "info");
    }
};

// ========= RENDER NOTIFICATIONS =========
function renderNotifications() {
    const container = document.getElementById("notifList");
    if (!container) return;
    
    let filtered = notifications.filter(n => {
        if (currentFilterType !== "all" && n.type !== currentFilterType) return false;
        if (currentStatusFilter === "unread" && n.status !== "unread") return false;
        if (currentStatusFilter === "read" && n.status !== "read") return false;
        if (searchKeyword && !n.title.toLowerCase().includes(searchKeyword.toLowerCase()) && 
            !n.description.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
        return true;
    });
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">🔕 No notifications match your filters</div>`;
        return;
    }
    
    container.innerHTML = filtered.map(notif => {
        let extraInfo = "";
        if (notif.affectedArea) extraInfo += `<span>📍 ${notif.affectedArea}</span>`;
        if (notif.eta) extraInfo += `<span>⏱️ ETA: ${notif.eta}</span>`;
        if (notif.complaintId) extraInfo += `<span>🆔 ${notif.complaintId}</span>`;
        
        return `
        <div class="notification-item" data-id="${notif.id}">
            <div class="notif-icon">${notif.icon}</div>
            <div class="notif-content">
                <div class="notif-title">
                    ${notif.title}
                    ${notif.status === "unread" ? '<span class="new-badge">NEW</span>' : ''}
                </div>
                <div class="notif-desc">${notif.description}</div>
                <div class="notif-meta">
                    <span>📅 ${formatDate(notif.timestamp)}</span>
                    <span class="severity-tag ${getSeverityClass(notif.severity)}">${getSeverityLabel(notif.severity)}</span>
                    <span>📁 ${notif.type}</span>
                    ${extraInfo ? `<span class="extra-info">${extraInfo}</span>` : ''}
                    <button class="btn btn-outline" style="padding:2px 10px; font-size:11px;" onclick="markAsRead(${notif.id})">
                        ${notif.status === "unread" ? "Mark read" : "Read"}
                    </button>
                </div>
            </div>
        </div>
    `}).join("");
}

// ========= MARK ALL AS READ =========
const markAllReadBtn = document.getElementById('markAllReadBtn');
if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
        let changed = false;
        notifications.forEach(n => {
            if (n.status === "unread") {
                n.status = "read";
                changed = true;
            }
        });
        if (changed) {
            updateStatsAndBadge();
            renderNotifications();
            showToast("All notifications marked as read", "success");
        } else {
            showToast("No unread notifications", "info");
        }
    });
}

// ========= FILTER EVENT LISTENERS =========
const typeFilter = document.getElementById('typeFilter');
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchNotifications');

if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
        currentFilterType = e.target.value;
        renderNotifications();
    });
}

if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        renderNotifications();
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchKeyword = e.target.value;
        renderNotifications();
    });
}

// ========= LIVE ALERTS TOGGLE =========
const liveAlertsToggle = document.getElementById('liveAlertsToggle');
if (liveAlertsToggle) {
    liveAlertsToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            showToast("Live alerts enabled. You'll receive real-time outage updates.", "success");
        } else {
            showToast("Live alerts paused. Enable to get instant notifications.", "info");
        }
    });
}

// ========= NOTIFICATION ICON CLICK =========
const notifIconBtn = document.getElementById('notifIconBtn');
if (notifIconBtn) {
    notifIconBtn.addEventListener('click', () => {
        showToast(`You have ${notifications.filter(n => n.status === "unread").length} unread notifications`, "info");
    });
}

// ========= SIMULATE REAL-TIME ALERT (Demo) =========
function simulateRealTimeAlert() {
    setInterval(() => {
        const liveEnabled = document.getElementById('liveAlertsToggle')?.checked;
        if (liveEnabled) {
            // This would be replaced with actual WebSocket/SSE in production
            console.log("Live alerts monitoring active...");
        }
    }, 30000);
}

// Start real-time simulation (for demo)
setTimeout(() => {
    simulateRealTimeAlert();
}, 5000);

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

// ========= INITIAL RENDER =========
updateStatsAndBadge();
renderNotifications();

// ========= EXPORT FOR GLOBAL ACCESS =========
window.showToast = showToast;