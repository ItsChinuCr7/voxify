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

// ================= DETECTION LOGIC =================
let logs = [];
let outages = [];
let detectionInterval = null;
let isRunning = true;

// Regions and Services for simulation
const regions = [
    "Mumbai (Andheri)", "Mumbai (Bandra)", "Mumbai (Juhu)", "Mumbai (Powai)",
    "Delhi (Connaught Place)", "Delhi (Noida)", "Delhi (Gurgaon)",
    "Bangalore (Whitefield)", "Bangalore (Electronic City)", "Bangalore (MG Road)",
    "Hyderabad (Hitech City)", "Hyderabad (Gachibowli)", "Chennai (OMR)"
];

const services = [
    "Network Connectivity", "Authentication Service", "Broadband Internet",
    "Mobile Network", "DNS Resolution", "API Gateway", "Database Cluster",
    "Content Delivery", "Email Service", "VoIP Service"
];

// Get current threshold values
function getThresholds() {
    return {
        packetLoss: parseInt(document.getElementById('packetLossThreshold')?.value || 20),
        responseTime: parseInt(document.getElementById('responseTimeThreshold')?.value || 500),
        complaintSpike: parseInt(document.getElementById('complaintSpikeThreshold')?.value || 50),
        interval: parseInt(document.getElementById('detectionInterval')?.value || 8) * 1000
    };
}

// Generate random metric values
function generateMetrics() {
    return {
        packetLoss: Math.random() * 100,
        responseTime: Math.random() * 1000,
        complaintsPerHour: Math.floor(Math.random() * 150)
    };
}

// Determine severity based on metrics
function determineSeverity(metrics, thresholds) {
    let severity = 'success';
    let reasons = [];
    
    if (metrics.packetLoss > thresholds.packetLoss) {
        severity = 'critical';
        reasons.push(`${metrics.packetLoss.toFixed(1)}% packet loss`);
    }
    if (metrics.responseTime > thresholds.responseTime) {
        if (severity !== 'critical') severity = 'warning';
        reasons.push(`${metrics.responseTime}ms response time`);
    }
    if (metrics.complaintsPerHour > thresholds.complaintSpike) {
        if (severity !== 'critical') severity = 'warning';
        reasons.push(`${metrics.complaintsPerHour} complaints/hour`);
    }
    
    return { severity, reasons: reasons.join(', ') };
}

// Add log entry
function addLog(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    logs.unshift({ message, type, time });
    
    // Keep only last 100 logs
    if (logs.length > 100) logs.pop();
    
    renderLogs();
}

// Render logs
function renderLogs() {
    const container = document.getElementById('logList');
    if (!container) return;
    
    if (logs.length === 0) {
        container.innerHTML = '<div class="empty-state">Waiting for detection events...</div>';
        return;
    }
    
    container.innerHTML = logs.slice(0, 50).map(log => `
        <div class="log-entry ${log.type}">
            <span class="log-time">${log.time}</span>
            <span>${log.message}</span>
        </div>
    `).join('');
}

// Add detected outage
function addOutage(region, service, metrics, severity, reason) {
    const outage = {
        id: `OUT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        region,
        service,
        usersAffected: Math.floor(Math.random() * 5000) + 100,
        severity,
        reason,
        metrics,
        detectedAt: new Date().toISOString()
    };
    
    outages.unshift(outage);
    
    // Keep only last 20 outages
    if (outages.length > 20) outages.pop();
    
    renderOutages();
    updateStats();
    
    // Update badge
    const unreadBadge = document.getElementById('unreadBadge');
    if (unreadBadge) {
        const currentCount = parseInt(unreadBadge.textContent) || 0;
        unreadBadge.textContent = currentCount + 1;
    }
    
    // Show toast for critical outages
    if (severity === 'critical') {
        showToast(`🚨 CRITICAL: ${severity} outage detected in ${region}`, 'error');
    } else if (severity === 'warning') {
        showToast(`⚠️ Warning: ${severity} issue in ${region}`, 'warning');
    }
}

// Render outages
function renderOutages() {
    const container = document.getElementById('outageGrid');
    if (!container) return;
    
    if (outages.length === 0) {
        container.innerHTML = '<div class="empty-state">No outages detected yet</div>';
        return;
    }
    
    container.innerHTML = outages.map(outage => `
        <div class="outage-card ${outage.severity}" onclick="showToast('Viewing ${outage.id}', 'info')">
            <div class="outage-title">
                ${outage.service}
                <span class="severity-badge ${outage.severity}">${outage.severity.toUpperCase()}</span>
            </div>
            <div class="outage-region">
                📍 ${outage.region}
            </div>
            <div class="outage-stats">
                <div class="outage-stat">👥 ${outage.usersAffected.toLocaleString()} affected</div>
                <div class="outage-stat">📊 ${outage.metrics.complaintsPerHour} complaints/hr</div>
            </div>
            <div class="outage-stats">
                <div class="outage-stat">📡 ${outage.metrics.packetLoss.toFixed(1)}% loss</div>
                <div class="outage-stat">⏱️ ${outage.metrics.responseTime}ms</div>
            </div>
            <div class="outage-time">
                🕐 Detected: ${new Date(outage.detectedAt).toLocaleString()}
            </div>
        </div>
    `).join('');
}

// Update stats counters
function updateStats() {
    const criticalCount = outages.filter(o => o.severity === 'critical').length;
    const warningCount = outages.filter(o => o.severity === 'warning').length;
    const resolvedCount = outages.filter(o => o.severity === 'resolved').length;
    
    const criticalEl = document.getElementById('criticalCount');
    const warningEl = document.getElementById('warningCount');
    const totalEl = document.getElementById('totalDetections');
    const activeOutagesBadge = document.getElementById('activeOutagesBadge');
    const criticalBadge = document.getElementById('criticalBadge');
    const resolvedBadge = document.getElementById('resolvedBadge');
    
    if (criticalEl) criticalEl.textContent = criticalCount;
    if (warningEl) warningEl.textContent = warningCount;
    if (totalEl) totalEl.textContent = outages.length;
    if (activeOutagesBadge) activeOutagesBadge.textContent = outages.length;
    if (criticalBadge) criticalBadge.textContent = criticalCount;
    if (resolvedBadge) resolvedBadge.textContent = resolvedCount;
}

// Run detection check
function runDetection() {
    if (!isRunning) return;
    
    const thresholds = getThresholds();
    const region = regions[Math.floor(Math.random() * regions.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const metrics = generateMetrics();
    const { severity, reasons } = determineSeverity(metrics, thresholds);
    
    const severityType = severity === 'critical' ? 'critical' : severity === 'warning' ? 'warning' : 'success';
    
    if (severity !== 'success') {
        addLog(`⚠️ ANOMALY DETECTED in ${region} (${service}) - ${reasons}`, severityType);
        addOutage(region, service, metrics, severity, reasons);
    } else {
        addLog(`✅ System check passed for ${region} (${service}) - All metrics normal`, 'info');
    }
}

// Start detection
function startDetection() {
    if (detectionInterval) clearInterval(detectionInterval);
    
    const thresholds = getThresholds();
    const intervalMs = thresholds.interval;
    
    detectionInterval = setInterval(() => {
        runDetection();
    }, intervalMs);
    
    addLog(`🔄 Detection started - Checking every ${thresholds.interval/1000} seconds`, 'info');
    showToast(`Detection started (interval: ${thresholds.interval/1000}s)`, 'success');
}

// Stop detection
function stopDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
        addLog(`⏹️ Detection stopped`, 'info');
    }
}

// Restart detection with new settings
function restartDetection() {
    stopDetection();
    startDetection();
    showToast('Detection restarted with new thresholds', 'success');
}

// Manual check
function manualCheck() {
    runDetection();
    showToast('Manual detection check completed', 'info');
}

// Clear logs
function clearLogs() {
    logs = [];
    renderLogs();
    showToast('Logs cleared', 'info');
}

// Reset rules to default
function resetRules() {
    const packetLossInput = document.getElementById('packetLossThreshold');
    const responseTimeInput = document.getElementById('responseTimeThreshold');
    const complaintSpikeInput = document.getElementById('complaintSpikeThreshold');
    const intervalInput = document.getElementById('detectionInterval');
    
    if (packetLossInput) packetLossInput.value = '20';
    if (responseTimeInput) responseTimeInput.value = '500';
    if (complaintSpikeInput) complaintSpikeInput.value = '50';
    if (intervalInput) intervalInput.value = '8';
    
    showToast('Rules reset to default', 'info');
}

// Export outages
function exportOutages() {
    if (outages.length === 0) {
        showToast('No outages to export', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(outages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `outages_${new Date().toISOString().slice(0,19)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Outages exported successfully', 'success');
}

// Search functionality
document.getElementById('searchDetection')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term === '') {
        renderOutages();
    } else {
        const filtered = outages.filter(o => 
            o.region.toLowerCase().includes(term) || 
            o.service.toLowerCase().includes(term)
        );
        const container = document.getElementById('outageGrid');
        if (container && filtered.length === 0) {
            container.innerHTML = '<div class="empty-state">No matching outages found</div>';
        } else if (container) {
            container.innerHTML = filtered.map(outage => `
                <div class="outage-card ${outage.severity}">
                    <div class="outage-title">
                        ${outage.service}
                        <span class="severity-badge ${outage.severity}">${outage.severity.toUpperCase()}</span>
                    </div>
                    <div class="outage-region">📍 ${outage.region}</div>
                    <div class="outage-stats">
                        <div class="outage-stat">👥 ${outage.usersAffected.toLocaleString()} affected</div>
                    </div>
                    <div class="outage-time">🕐 ${new Date(outage.detectedAt).toLocaleString()}</div>
                </div>
            `).join('');
        }
    }
});

// ================= EVENT LISTENERS =================
document.getElementById('applyRulesBtn')?.addEventListener('click', restartDetection);
document.getElementById('resetRulesBtn')?.addEventListener('click', resetRules);
document.getElementById('manualCheckBtn')?.addEventListener('click', manualCheck);
document.getElementById('clearLogsBtn')?.addEventListener('click', clearLogs);
document.getElementById('exportOutagesBtn')?.addEventListener('click', exportOutages);

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    // Add some initial sample data
    addLog('🟢 Auto Detection System initialized', 'success');
    addLog('📡 Monitoring 13 regions across India', 'info');
    addLog('🔧 Detection rules loaded', 'info');
    
    startDetection();
    
    showToast('Auto Detection System started', 'success');
});

window.showToast = showToast;