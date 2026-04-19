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

// ================= SAMPLE DATA =================
const locations = ['Andheri West', 'Bandra', 'Juhu', 'Powai', 'Goregaon', 'Malad', 'Kandivali'];
const services = ['Broadband', 'Mobile', 'TV', 'Voice'];
const categories = ['Network', 'Billing', 'Service', 'Outage', 'Hardware'];

// Generate random complaint data
function generateComplaintData(days = 30) {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i < days * 5; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + Math.floor(Math.random() * days));
        
        data.push({
            id: `CMP-${Math.floor(Math.random() * 10000)}`,
            date: date.toISOString(),
            location: locations[Math.floor(Math.random() * locations.length)],
            service: services[Math.floor(Math.random() * services.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            status: Math.random() > 0.6 ? 'Resolved' : (Math.random() > 0.5 ? 'Open' : 'In Progress'),
            severity: Math.random() > 0.7 ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Low')
        });
    }
    return data;
}

let complaintData = generateComplaintData(90);
let outages = [];
let timelineEvents = [];

// ================= CHART INSTANCES =================
let trendChart = null;
let pieChart = null;
let barChart = null;

// ================= FILTER VARIABLES =================
let currentDateRange = 'last7d';
let currentLocation = 'all';
let currentService = 'all';
let currentTrend = 'daily';
let customStartDate = null;
let customEndDate = null;

// ================= FILTER FUNCTIONS =================
function filterData() {
    let filtered = [...complaintData];
    
    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (currentDateRange === 'today') {
        filtered = filtered.filter(d => new Date(d.date) >= today);
    } else if (currentDateRange === 'last7d') {
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(d => new Date(d.date) >= last7d);
    } else if (currentDateRange === 'last30d') {
        const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(d => new Date(d.date) >= last30d);
    } else if (currentDateRange === 'last90d') {
        const last90d = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(d => new Date(d.date) >= last90d);
    } else if (currentDateRange === 'custom' && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59);
        filtered = filtered.filter(d => {
            const date = new Date(d.date);
            return date >= start && date <= end;
        });
    }
    
    // Location filter
    if (currentLocation !== 'all') {
        filtered = filtered.filter(d => d.location === currentLocation);
    }
    
    // Service filter
    if (currentService !== 'all') {
        filtered = filtered.filter(d => d.service === currentService);
    }
    
    return filtered;
}

function updateStats() {
    const filtered = filterData();
    const total = filtered.length;
    const resolved = filtered.filter(d => d.status === 'Resolved').length;
    const pending = filtered.filter(d => d.status !== 'Resolved').length;
    
    document.getElementById('totalComplaints').textContent = total;
    document.getElementById('resolvedComplaints').textContent = resolved;
    document.getElementById('pendingComplaints').textContent = pending;
    
    document.getElementById('totalComplaintsBadge').textContent = total;
    document.getElementById('resolvedBadge').textContent = resolved;
    
    // Update trends (simulated)
    const prevTotal = Math.floor(total * 0.88);
    const prevResolved = Math.floor(resolved * 0.92);
    const totalTrend = ((total - prevTotal) / prevTotal * 100).toFixed(0);
    const resolvedTrend = ((resolved - prevResolved) / prevResolved * 100).toFixed(0);
    
    const totalTrendEl = document.getElementById('totalTrend');
    const resolvedTrendEl = document.getElementById('resolvedTrend');
    
    if (totalTrendEl) {
        totalTrendEl.innerHTML = `${totalTrend >= 0 ? '↑' : '↓'} ${Math.abs(totalTrend)}%`;
        totalTrendEl.className = `stat-trend ${totalTrend >= 0 ? 'up' : 'down'}`;
    }
    if (resolvedTrendEl) {
        resolvedTrendEl.innerHTML = `${resolvedTrend >= 0 ? '↑' : '↓'} ${Math.abs(resolvedTrend)}%`;
        resolvedTrendEl.className = `stat-trend ${resolvedTrend >= 0 ? 'up' : 'down'}`;
    }
    
    return filtered;
}

// ================= CHART UPDATES =================
function updateTrendChart(filteredData) {
    const ctx = document.getElementById('trendChart')?.getContext('2d');
    if (!ctx) return;
    
    // Group by date based on trend selection
    const grouped = {};
    filteredData.forEach(d => {
        let dateKey;
        const date = new Date(d.date);
        
        if (currentTrend === 'daily') {
            dateKey = date.toLocaleDateString();
        } else if (currentTrend === 'weekly') {
            const weekNum = Math.ceil(date.getDate() / 7);
            dateKey = `Week ${weekNum}`;
        } else {
            dateKey = date.toLocaleString('default', { month: 'short' });
        }
        
        if (!grouped[dateKey]) grouped[dateKey] = 0;
        grouped[dateKey]++;
    });
    
    const labels = Object.keys(grouped).slice(-14);
    const values = labels.map(l => grouped[l]);
    
    if (trendChart) trendChart.destroy();
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Complaints',
                data: values,
                borderColor: '#1F4FD8',
                backgroundColor: 'rgba(31, 79, 216, 0.1)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#1F4FD8',
                pointBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
}

function updatePieChart(filteredData) {
    const ctx = document.getElementById('pieChart')?.getContext('2d');
    if (!ctx) return;
    
    const categoryCount = {};
    filteredData.forEach(d => {
        categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    });
    
    const labels = Object.keys(categoryCount);
    const values = Object.values(categoryCount);
    const colors = ['#1F4FD8', '#28A745', '#FFC107', '#DC3545', '#6C3FC5'];
    
    if (pieChart) pieChart.destroy();
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} (${((ctx.raw / filteredData.length) * 100).toFixed(1)}%)` } }
            }
        }
    });
}

function updateBarChart(filteredData) {
    const ctx = document.getElementById('barChart')?.getContext('2d');
    if (!ctx) return;
    
    const locationCount = {};
    filteredData.forEach(d => {
        locationCount[d.location] = (locationCount[d.location] || 0) + 1;
    });
    
    const labels = Object.keys(locationCount);
    const values = Object.values(locationCount);
    
    if (barChart) barChart.destroy();
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Complaints',
                data: values,
                backgroundColor: 'rgba(31, 79, 216, 0.7)',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } }
        }
    });
}

function refreshCharts() {
    const filtered = updateStats();
    
    if (filtered.length === 0) {
        document.getElementById('noDataMessage').style.display = 'block';
        return;
    }
    document.getElementById('noDataMessage').style.display = 'none';
    
    updateTrendChart(filtered);
    updatePieChart(filtered);
    updateBarChart(filtered);
}

// ================= OUTAGE DETECTION =================
const regions = ['Andheri West', 'Bandra', 'Juhu', 'Powai', 'Goregaon', 'Malad', 'Kandivali', 'BKC', 'Lower Parel'];
const servicesList = ['Broadband', 'Mobile Network', 'TV Service', 'Voice Service', 'Cloud Services'];

function generateRandomOutage() {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const service = servicesList[Math.floor(Math.random() * servicesList.length)];
    const severity = Math.random() > 0.7 ? 'critical' : (Math.random() > 0.5 ? 'warning' : 'info');
    const usersAffected = Math.floor(Math.random() * 5000) + 100;
    
    return {
        id: `OUT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        region,
        service,
        severity,
        usersAffected,
        detectedAt: new Date().toISOString(),
        detectedAtDisplay: new Date().toLocaleString(),
        status: 'active'
    };
}

function addOutage(outage) {
    outages.unshift(outage);
    if (outages.length > 10) outages.pop();
    
    // Add to timeline
    const timelineEvent = {
        id: `TL-${Date.now()}`,
        type: 'outage',
        title: `${outage.severity.toUpperCase()} Outage Detected`,
        description: `${outage.service} outage in ${outage.region} affecting ${outage.usersAffected} users`,
        time: outage.detectedAtDisplay,
        severity: outage.severity
    };
    timelineEvents.unshift(timelineEvent);
    if (timelineEvents.length > 20) timelineEvents.pop();
    
    renderOutages();
    renderTimeline();
    updateOutageStats();
    
    // Show toast popup for new outage
    showToast(`🚨 NEW OUTAGE: ${outage.severity.toUpperCase()} - ${outage.service} in ${outage.region}`, 'error');
    
    // Update badge
    const unreadBadge = document.getElementById('unreadBadge');
    if (unreadBadge) {
        const current = parseInt(unreadBadge.textContent) || 0;
        unreadBadge.textContent = current + 1;
    }
    
    // Update active outages badge
    const activeOutagesBadge = document.getElementById('activeOutagesBadge');
    if (activeOutagesBadge) {
        activeOutagesBadge.textContent = outages.filter(o => o.status === 'active').length;
    }
}

function simulateOutage() {
    const newOutage = generateRandomOutage();
    addOutage(newOutage);
    showToast(`🔴 Simulated outage created in ${newOutage.region}`, 'warning');
}

function renderOutages() {
    const container = document.getElementById('activeOutagesGrid');
    if (!container) return;
    
    const activeOutages = outages.filter(o => o.status === 'active');
    
    if (activeOutages.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;">✅ No active outages</div>';
        return;
    }
    
    container.innerHTML = activeOutages.map(outage => `
        <div class="outage-card ${outage.severity}">
            <div class="outage-title">
                ${outage.service}
                <span class="severity-badge ${outage.severity}">${outage.severity.toUpperCase()}</span>
            </div>
            <div class="outage-location">📍 ${outage.region}</div>
            <div class="outage-stats">
                <span>👥 ${outage.usersAffected.toLocaleString()} affected</span>
            </div>
            <div class="outage-time">🕐 ${outage.detectedAtDisplay}</div>
            <button class="btn outline-btn btn-sm" style="margin-top:10px;width:100%;" onclick="resolveOutage('${outage.id}')">✅ Mark Resolved</button>
        </div>
    `).join('');
}

function resolveOutage(id) {
    const outage = outages.find(o => o.id === id);
    if (outage) {
        outage.status = 'resolved';
        
        // Add resolution to timeline
        timelineEvents.unshift({
            id: `TL-${Date.now()}`,
            type: 'resolution',
            title: 'Outage Resolved',
            description: `${outage.service} outage in ${outage.region} has been resolved. Service restored to ${outage.usersAffected} users.`,
            time: new Date().toLocaleString(),
            severity: 'resolved'
        });
        
        renderOutages();
        renderTimeline();
        updateOutageStats();
        showToast(`✅ Outage in ${outage.region} marked as resolved`, 'success');
    }
}

function renderTimeline() {
    const container = document.getElementById('timelineFeed');
    if (!container) return;
    
    if (timelineEvents.length === 0) {
        container.innerHTML = '<div class="empty-state" style="text-align:center;padding:20px;">No events yet</div>';
        return;
    }
    
    container.innerHTML = timelineEvents.slice(0, 15).map(event => `
        <div class="timeline-item">
            <div class="timeline-icon">${event.type === 'outage' ? '🔴' : '✅'}</div>
            <div class="timeline-content">
                <div class="timeline-title">${event.title}</div>
                <div class="timeline-desc">${event.description}</div>
                <div class="timeline-time">${event.time}</div>
            </div>
        </div>
    `).join('');
}

function updateOutageStats() {
    const critical = outages.filter(o => o.severity === 'critical' && o.status === 'active').length;
    const warning = outages.filter(o => o.severity === 'warning' && o.status === 'active').length;
    const info = outages.filter(o => o.severity === 'info' && o.status === 'active').length;
    const resolved = outages.filter(o => o.status === 'resolved').length;
    
    document.getElementById('criticalOutages').textContent = critical;
    document.getElementById('warningOutages').textContent = warning;
    document.getElementById('infoOutages').textContent = info;
    document.getElementById('resolvedOutages').textContent = resolved;
    document.getElementById('activeOutages').textContent = outages.filter(o => o.status === 'active').length;
    document.getElementById('activeOutagesBadge').textContent = outages.filter(o => o.status === 'active').length;
}

function clearTimeline() {
    timelineEvents.length = 0;
    renderTimeline();
    showToast('Timeline cleared', 'info');
}

function refreshOutages() {
    renderOutages();
    renderTimeline();
    showToast('Outages refreshed', 'success');
}

// ================= AUTO REFRESH (Simulate Real-time) =================
let autoRefreshInterval = null;

function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(() => {
        // Random chance to generate new outage (30% every 15 seconds)
        if (Math.random() < 0.3) {
            const newOutage = generateRandomOutage();
            addOutage(newOutage);
        }
        refreshCharts();
    }, 15000);
}

// ================= FILTER HANDLERS =================
function applyFilters() {
    currentDateRange = document.getElementById('dateRangeSelect')?.value || 'last7d';
    currentLocation = document.getElementById('locationFilter')?.value || 'all';
    currentService = document.getElementById('serviceFilter')?.value || 'all';
    
    const customRangeGroup = document.getElementById('customRangeGroup');
    if (currentDateRange === 'custom') {
        customRangeGroup.style.display = 'flex';
        customStartDate = document.getElementById('startDate')?.value;
        customEndDate = document.getElementById('endDate')?.value;
    } else {
        customRangeGroup.style.display = 'none';
    }
    
    refreshCharts();
    showToast('Filters applied', 'success');
}

function resetFilters() {
    document.getElementById('dateRangeSelect').value = 'last7d';
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('serviceFilter').value = 'all';
    document.getElementById('customRangeGroup').style.display = 'none';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    
    currentDateRange = 'last7d';
    currentLocation = 'all';
    currentService = 'all';
    customStartDate = null;
    customEndDate = null;
    
    refreshCharts();
    showToast('Filters reset', 'info');
}

// ================= TREND TOGGLE =================
document.querySelectorAll('.trend-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.trend-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTrend = btn.dataset.trend;
        refreshCharts();
    });
});

// ================= DATE RANGE HANDLER =================
document.getElementById('dateRangeSelect')?.addEventListener('change', (e) => {
    const customGroup = document.getElementById('customRangeGroup');
    if (customGroup) {
        customGroup.style.display = e.target.value === 'custom' ? 'flex' : 'none';
    }
});

// ================= SEARCH FUNCTIONALITY =================
document.getElementById('searchDashboard')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term === '') {
        refreshCharts();
    } else {
        const filtered = complaintData.filter(d => 
            d.location.toLowerCase().includes(term) || 
            d.service.toLowerCase().includes(term) ||
            d.category.toLowerCase().includes(term)
        );
        updateTrendChart(filtered);
        updatePieChart(filtered);
        updateBarChart(filtered);
        updateStats(filtered);
    }
});

// ================= EVENT LISTENERS =================
document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);
document.getElementById('simulateOutageBtn')?.addEventListener('click', simulateOutage);
document.getElementById('clearTimelineBtn')?.addEventListener('click', clearTimeline);
document.getElementById('refreshOutagesBtn')?.addEventListener('click', refreshOutages);
document.getElementById('clearFiltersNoDataBtn')?.addEventListener('click', resetFilters);

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    // Add sample outage for demo
    setTimeout(() => {
        const sampleOutage = {
            id: 'OUT-SAMPLE-001',
            region: 'Andheri West',
            service: 'Broadband',
            severity: 'critical',
            usersAffected: 1250,
            detectedAt: new Date().toISOString(),
            detectedAtDisplay: new Date().toLocaleString(),
            status: 'active'
        };
        outages.push(sampleOutage);
        
        timelineEvents.push({
            id: 'TL-SAMPLE-001',
            type: 'outage',
            title: 'Critical Outage Detected',
            description: 'Broadband outage in Andheri West affecting 1250 users',
            time: new Date().toLocaleString(),
            severity: 'critical'
        });
        
        renderOutages();
        renderTimeline();
        updateOutageStats();
    }, 1000);
    
    refreshCharts();
    startAutoRefresh();
    
    showToast('Analytics Dashboard ready', 'success');
});

// Make functions global for onclick handlers
window.resolveOutage = resolveOutage;
window.showToast = showToast;