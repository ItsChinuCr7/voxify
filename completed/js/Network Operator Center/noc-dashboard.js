// noc-dashboard.js - NOC Command Center

// Sample Incident Data
const incidents = [
    { id: 'INC-1042', region: 'Mumbai West', service: 'Fiber Network', severity: 'critical', started: '10:32 AM', duration: '47 min', status: 'investigating' },
    { id: 'INC-1038', region: 'Delhi NCR', service: 'BSNL Peer', severity: 'high', started: '11:15 AM', duration: '32 min', status: 'in-progress' },
    { id: 'INC-1035', region: 'Bangalore', service: 'Core Router', severity: 'high', started: '11:45 AM', duration: '28 min', status: 'in-progress' },
    { id: 'INC-1029', region: 'Mumbai East', service: '5G Network', severity: 'medium', started: '09:20 AM', duration: '2h 15m', status: 'investigating' }
];

// Chart instances
let trendChart;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    loadIncidentsTable();
    updateKPIs();
    startLiveFeed();
    setupEventListeners();
    updateLastUpdated();
    
    // Auto refresh every 30 seconds
    setInterval(() => {
        updateLastUpdated();
        simulateNewFeed();
    }, 30000);
});

// ================= PROFILE DROPDOWN =================
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
}

/*// ================= STATUS DROPDOWN =================
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');

if (statusQuickBtn && statusDropdown) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('show');
    });
}
*/
// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (profileDropdown && !profileBtn?.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
    if (statusDropdown && !statusQuickBtn?.contains(e.target)) {
        statusDropdown.classList.remove('show');
    }
});

// ================= TOAST NOTIFICATION =================
let toastTimer;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    
    if (type === 'success') {
        toastIcon.textContent = '✓';
        toast.style.borderLeft = '4px solid #28A745';
    } else if (type === 'error') {
        toastIcon.textContent = '✗';
        toast.style.borderLeft = '4px solid #DC3545';
    } else {
        toastIcon.textContent = 'ℹ';
        toast.style.borderLeft = '4px solid #1F4FD8';
    }
    
    toast.classList.add('show');
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('incidentTrendChart').getContext('2d');
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [{
                label: 'Incidents',
                data: [2, 1, 0, 0, 1, 3, 5, 4, 3, 2, 1, 0],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });
}

// Load Incidents Table
function loadIncidentsTable() {
    const tbody = document.getElementById('incidentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = incidents.map(incident => `
        <tr>
            <td><strong>${incident.id}</strong></td>
            <td>${incident.region}</td>
            <td>${incident.service}</td>
            <td><span class="severity-${incident.severity}">${incident.severity.toUpperCase()}</span></td>
            <td>${incident.started}</td>
            <td>${incident.duration}</td>
            <td><span class="status-badge ${incident.status}">${incident.status.toUpperCase()}</span></td>
            <td><button class="btn view-btn" onclick="viewIncident('${incident.id}')">View</button></td>
            <td><button class="btn view-btn" style="background: #FFF5F5; color: #E53E3E; border-color: #FED7D7;" onclick="escalateIncident('${incident.id}')">🚨 Escalate</button></td>
        </tr>
    `).join('');
}

// Update KPIs
function updateKPIs() {
    document.getElementById('activeIncidents').textContent = incidents.length;
    document.getElementById('affectedCustomers').textContent = '2,847';
}

// View Incident
function viewIncident(incidentId) {
    showToast(`Viewing incident ${incidentId}`, 'info');
}

// Escalate Incident
let currentEscalateId = '';

function escalateIncident(incidentId) {
    currentEscalateId = incidentId;
    document.getElementById('escalateIncidentId').textContent = incidentId;
    document.getElementById('escalateModal').classList.add('show');
}

// Setup Event Listeners
function setupEventListeners() {
    // Close modal buttons
    const closeModalBtn = document.getElementById('closeEscalateModal');
    const cancelBtn = document.getElementById('cancelEscalateBtn');
    const confirmBtn = document.getElementById('confirmEscalateBtn');
    const refreshBtn = document.getElementById('refreshIncidentsBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('escalateModal').classList.remove('show');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('escalateModal').classList.remove('show');
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const level = document.getElementById('escalationLevel').value;
            const reason = document.getElementById('escalationReason').value;
            showToast(`Incident ${currentEscalateId} escalated to ${level}`, 'success');
            document.getElementById('escalateModal').classList.remove('show');
            document.getElementById('escalationReason').value = '';
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            showToast('Incidents refreshed', 'success');
            loadIncidentsTable();
        });
    }
    
    // Trend period change
    const periodSelect = document.getElementById('trendPeriod');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            updateChartData(e.target.value);
        });
    }
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('escalateModal');
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Update Chart Data
function updateChartData(period) {
    let data;
    if (period === '24') {
        data = [2, 1, 0, 0, 1, 3, 5, 4, 3, 2, 1, 0];
    } else if (period === '7') {
        data = [12, 8, 15, 10, 7, 5, 3];
        trendChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
        data = [45, 38, 42, 40, 35, 30, 28, 25, 22, 20, 18, 15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
        trendChart.data.labels = Array.from({length: 30}, (_, i) => `Day ${i+1}`);
    }
    
    trendChart.data.datasets[0].data = data;
    trendChart.update();
}

// Dispatch Technician
function dispatchTechnician(name) {
    showToast(`${name} has been dispatched to the site`, 'success');
}

// Start Live Feed Simulation
function startLiveFeed() {
    // Simulate real-time feed updates
    setInterval(() => {
        simulateNewFeed();
    }, 45000);
}

function simulateNewFeed() {
    const feedContainer = document.getElementById('liveFeed');
    if (!feedContainer) return;
    
    const messages = [
        '🔴 New incident reported: Core router down in Bangalore',
        '🟠 High latency detected on Mumbai - Delhi backbone',
        '✅ Incident INC-1032 marked as resolved',
        '📢 Broadcast: Scheduled maintenance extended by 2 hours',
        '⚠️ BGP route flapping detected in Chennai region'
    ];
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newFeed = document.createElement('div');
    newFeed.className = 'feed-item';
    newFeed.innerHTML = `
        <span class="feed-time">${timeStr}</span>
        <span class="feed-message">${randomMsg}</span>
    `;
    
    feedContainer.insertBefore(newFeed, feedContainer.firstChild);
    
    // Keep only last 10 items
    while (feedContainer.children.length > 10) {
        feedContainer.removeChild(feedContainer.lastChild);
    }
}

// Update Last Updated Time
function updateLastUpdated() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const lastUpdatedSpan = document.getElementById('lastUpdated');
    if (lastUpdatedSpan) {
        lastUpdatedSpan.textContent = timeStr;
    }
}

// Show Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.classList.add('show');
    
    // Change color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#1F4FD8'
    };
    toast.style.background = colors[type] || colors.success;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Export functions for global use
window.viewIncident = viewIncident;
window.escalateIncident = escalateIncident;
window.dispatchTechnician = dispatchTechnician;
window.showToast = showToast;