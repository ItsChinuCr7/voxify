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

// ================= SAMPLE COMPLAINT DATA =================
const sampleComplaints = [
    { id: 'CMP-10241', customer: 'Rajesh Kumar', location: 'Andheri West', service: 'Broadband', severity: 'high', status: 'open', date: '2026-04-17T10:30:00', description: 'No internet connection since morning' },
    { id: 'CMP-10242', customer: 'Priya Sharma', location: 'Andheri West', service: 'Broadband', severity: 'high', status: 'open', date: '2026-04-17T09:15:00', description: 'Intermittent connectivity issues' },
    { id: 'CMP-10243', customer: 'Amit Patel', location: 'Andheri West', service: 'Broadband', severity: 'high', status: 'progress', date: '2026-04-16T18:00:00', description: 'Complete outage in the area' },
    { id: 'CMP-10244', customer: 'Sneha Reddy', location: 'Andheri West', service: 'Broadband', severity: 'high', status: 'open', date: '2026-04-17T08:00:00', description: 'Slow internet speed' },
    { id: 'CMP-10245', customer: 'Vikram Singh', location: 'Andheri West', service: 'Broadband', severity: 'high', status: 'open', date: '2026-04-16T20:30:00', description: 'Router not working' },
    { id: 'CMP-10246', customer: 'Neha Gupta', location: 'Bandra', service: 'Mobile', severity: 'high', status: 'progress', date: '2026-04-16T14:00:00', description: 'No mobile network' },
    { id: 'CMP-10247', customer: 'Rohan Mehta', location: 'Bandra', service: 'Mobile', severity: 'high', status: 'open', date: '2026-04-17T07:00:00', description: 'Call drops frequently' },
    { id: 'CMP-10248', customer: 'Anjali Desai', location: 'Bandra', service: 'Mobile', severity: 'high', status: 'open', date: '2026-04-17T11:00:00', description: 'Unable to make calls' },
    { id: 'CMP-10249', customer: 'Sanjay Joshi', location: 'Juhu', service: 'Broadband', severity: 'medium', status: 'resolved', date: '2026-04-15T09:00:00', description: 'Connection restored after reboot' },
    { id: 'CMP-10250', customer: 'Meera Nair', location: 'Juhu', service: 'Broadband', severity: 'medium', status: 'open', date: '2026-04-17T10:00:00', description: 'WiFi signal weak' },
    { id: 'CMP-10251', customer: 'Karthik Iyer', location: 'Juhu', service: 'Broadband', severity: 'medium', status: 'open', date: '2026-04-16T16:00:00', description: 'Frequent disconnections' },
    { id: 'CMP-10252', customer: 'Divya Menon', location: 'Powai', service: 'TV', severity: 'low', status: 'progress', date: '2026-04-16T12:00:00', description: 'No signal on TV' },
    { id: 'CMP-10253', customer: 'Arjun Nair', location: 'Powai', service: 'TV', severity: 'low', status: 'open', date: '2026-04-17T09:00:00', description: 'Remote not working' },
    { id: 'CMP-10254', customer: 'Lakshmi Krishnan', location: 'Goregaon', service: 'Broadband', severity: 'medium', status: 'open', date: '2026-04-16T22:00:00', description: 'Service disruption' },
    { id: 'CMP-10255', customer: 'Manoj Tiwari', location: 'Goregaon', service: 'Broadband', severity: 'medium', status: 'open', date: '2026-04-17T06:00:00', description: 'Speed below promised' },
    { id: 'CMP-10256', customer: 'Sunita Verma', location: 'Malad', service: 'Mobile', severity: 'high', status: 'open', date: '2026-04-17T08:30:00', description: 'No 5G connectivity' },
    { id: 'CMP-10257', customer: 'Rakesh Sinha', location: 'Malad', service: 'Mobile', severity: 'high', status: 'open', date: '2026-04-16T19:00:00', description: 'Mobile data not working' },
    { id: 'CMP-10258', customer: 'Pooja Mishra', location: 'Kandivali', service: 'Broadband', severity: 'low', status: 'resolved', date: '2026-04-14T15:00:00', description: 'Fixed after technician visit' }
];

// ================= GLOBAL VARIABLES =================
let currentComplaints = [...sampleComplaints];
let currentClusters = [];
let currentPage = 1;
const itemsPerPage = 6;

// ================= CLUSTERING FUNCTION =================
function createClusters(complaints, threshold) {
    const clusters = {};
    
    complaints.forEach(complaint => {
        const location = complaint.location;
        if (!clusters[location]) {
            clusters[location] = {
                location: location,
                complaints: [],
                count: 0,
                openCount: 0,
                progressCount: 0,
                resolvedCount: 0,
                services: {},
                timeRange: { min: null, max: null }
            };
        }
        
        clusters[location].complaints.push(complaint);
        clusters[location].count++;
        
        if (complaint.status === 'open') clusters[location].openCount++;
        else if (complaint.status === 'progress') clusters[location].progressCount++;
        else if (complaint.status === 'resolved') clusters[location].resolvedCount++;
        
        const service = complaint.service;
        clusters[location].services[service] = (clusters[location].services[service] || 0) + 1;
        
        const complaintDate = new Date(complaint.date);
        if (!clusters[location].timeRange.min || complaintDate < clusters[location].timeRange.min) {
            clusters[location].timeRange.min = complaintDate;
        }
        if (!clusters[location].timeRange.max || complaintDate > clusters[location].timeRange.max) {
            clusters[location].timeRange.max = complaintDate;
        }
    });
    
    let clustersArray = Object.values(clusters).map(cluster => {
        let severity = 'normal';
        if (cluster.count >= threshold) severity = 'critical';
        else if (cluster.count >= threshold * 0.5) severity = 'warning';
        
        return { ...cluster, severity };
    });
    
    clustersArray.sort((a, b) => b.count - a.count);
    return clustersArray;
}

function filterByTimeRange(complaints, timeRange, startDate, endDate) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return complaints.filter(complaint => {
        const complaintDate = new Date(complaint.date);
        
        switch(timeRange) {
            case 'today':
                return complaintDate >= today;
            case 'last24h':
                const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                return complaintDate >= last24h;
            case 'last7d':
                const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return complaintDate >= last7d;
            case 'last30d':
                const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return complaintDate >= last30d;
            case 'custom':
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59);
                    return complaintDate >= start && complaintDate <= end;
                }
                return true;
            default:
                return true;
        }
    });
}

// ================= RENDER FUNCTIONS =================
function renderClusters() {
    const container = document.getElementById('clustersContainer');
    const clustersCountSpan = document.getElementById('clustersCount');
    const totalClustersSpan = document.getElementById('totalClusters');
    const criticalClustersSpan = document.getElementById('criticalClusters');
    const warningClustersSpan = document.getElementById('warningClusters');
    const totalClusterComplaintsSpan = document.getElementById('totalClusterComplaints');
    
    // Update badges
    document.getElementById('totalClustersBadge').textContent = currentClusters.length;
    document.getElementById('criticalClustersBadge').textContent = currentClusters.filter(c => c.severity === 'critical').length;
    document.getElementById('totalComplaintsBadge').textContent = currentClusters.reduce((sum, c) => sum + c.count, 0);
    
    if (totalClustersSpan) totalClustersSpan.textContent = currentClusters.length;
    if (criticalClustersSpan) criticalClustersSpan.textContent = currentClusters.filter(c => c.severity === 'critical').length;
    if (warningClustersSpan) warningClustersSpan.textContent = currentClusters.filter(c => c.severity === 'warning').length;
    if (totalClusterComplaintsSpan) totalClusterComplaintsSpan.textContent = currentClusters.reduce((sum, c) => sum + c.count, 0);
    if (clustersCountSpan) clustersCountSpan.textContent = `Showing ${currentClusters.length} clusters`;
    
    if (currentClusters.length === 0) {
        container.innerHTML = '<div class="empty-state"><div>📍</div><p>No clusters found</p><span>Try adjusting your filters</span></div>';
        return;
    }
    
    // Pagination
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedClusters = currentClusters.slice(start, start + itemsPerPage);
    
    container.innerHTML = paginatedClusters.map(cluster => `
        <div class="cluster-card ${cluster.severity}" data-cluster="${cluster.location}">
            <div class="cluster-card-header">
                <div class="cluster-name">
                    <span>📍</span>
                    ${cluster.location}
                </div>
                <span class="cluster-badge ${cluster.severity}">
                    ${cluster.severity === 'critical' ? '⚠️ CRITICAL' : cluster.severity === 'warning' ? '⚡ WARNING' : '✅ NORMAL'}
                </span>
            </div>
            <div class="cluster-stats">
                <div class="stat-item">
                    <div class="stat-number">${cluster.count}</div>
                    <div class="stat-label-sm">Total Complaints</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="color:#DC3545">${cluster.openCount}</div>
                    <div class="stat-label-sm">Open</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="color:#FFC107">${cluster.progressCount}</div>
                    <div class="stat-label-sm">In Progress</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="color:#28A745">${cluster.resolvedCount}</div>
                    <div class="stat-label-sm">Resolved</div>
                </div>
            </div>
            <div class="cluster-details">
                <div class="detail-row">
                    <span class="detail-label">Time Range:</span>
                    <span class="detail-value">${formatDate(cluster.timeRange.min)} - ${formatDate(cluster.timeRange.max)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Affected Services:</span>
                    <span class="detail-value">${Object.keys(cluster.services).join(', ')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Top Issue:</span>
                    <span class="detail-value">${getTopIssue(cluster.complaints)}</span>
                </div>
            </div>
            <div class="cluster-footer">
                <button class="view-details-btn" onclick="viewClusterDetails('${cluster.location}')">View Complaints →</button>
            </div>
        </div>
    `).join('');
    
    renderPagination();
}

function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
}

function getTopIssue(complaints) {
    const issues = {};
    complaints.forEach(c => {
        const desc = c.description.split(' ').slice(0, 3).join(' ');
        issues[desc] = (issues[desc] || 0) + 1;
    });
    const topIssue = Object.keys(issues).sort((a, b) => issues[b] - issues[a])[0];
    return topIssue || 'Multiple issues';
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(currentClusters.length / itemsPerPage);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
    }
    
    paginationContainer.innerHTML = pages.join('');
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderClusters();
        });
    });
}

// ================= VIEW CLUSTER DETAILS =================
window.viewClusterDetails = function(location) {
    const cluster = currentClusters.find(c => c.location === location);
    if (!cluster) return;
    
    const modal = document.getElementById('clusterDetailModal');
    const modalTitle = document.getElementById('modalClusterTitle');
    const modalBody = document.getElementById('modalClusterBody');
    
    if (!modal || !modalBody) return;
    
    modalTitle.textContent = `📍 ${cluster.location}`;
    
    modalBody.innerHTML = `
        <div class="cluster-summary">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;">
                <div><strong>Total:</strong> ${cluster.count}</div>
                <div><strong>Open:</strong> ${cluster.openCount}</div>
                <div><strong>In Progress:</strong> ${cluster.progressCount}</div>
                <div><strong>Resolved:</strong> ${cluster.resolvedCount}</div>
            </div>
            <div style="margin-bottom: 12px;"><strong>Time Range:</strong> ${formatDate(cluster.timeRange.min)} - ${formatDate(cluster.timeRange.max)}</div>
            <div><strong>Affected Services:</strong> ${Object.keys(cluster.services).join(', ')}</div>
        </div>
        <h4 style="margin-bottom: 12px;">📋 All Complaints in this Cluster</h4>
        <div class="complaint-list">
            ${cluster.complaints.map(c => `
                <div class="complaint-item">
                    <div>
                        <div class="complaint-id">${c.id}</div>
                        <div style="font-size: 12px; color: #5F6368;">${c.customer}</div>
                    </div>
                    <div>
                        <span class="complaint-status ${c.status}">${c.status.toUpperCase()}</span>
                    </div>
                    <div style="font-size: 12px; color: #5F6368;">${new Date(c.date).toLocaleString()}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.add('show');
};

// ================= APPLY FILTERS =================
function applyFilters() {
    const dateRange = document.getElementById('dateRangeSelect')?.value || 'last24h';
    const locationFilter = document.getElementById('locationFilter')?.value || 'all';
    const severityFilter = document.getElementById('severityFilter')?.value || 'all';
    const threshold = parseInt(document.getElementById('thresholdValue')?.value || '5');
    
    let startDate = null, endDate = null;
    if (dateRange === 'custom') {
        startDate = document.getElementById('startDate')?.value;
        endDate = document.getElementById('endDate')?.value;
    }
    
    let filtered = filterByTimeRange(sampleComplaints, dateRange, startDate, endDate);
    
    if (locationFilter !== 'all') {
        filtered = filtered.filter(c => c.location === locationFilter);
    }
    
    currentClusters = createClusters(filtered, threshold);
    
    if (severityFilter !== 'all') {
        currentClusters = currentClusters.filter(c => c.severity === severityFilter);
    }
    
    currentPage = 1;
    renderClusters();
    
    showToast(`Found ${currentClusters.length} clusters`, 'success');
}

function resetFilters() {
    document.getElementById('dateRangeSelect').value = 'last24h';
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('severityFilter').value = 'all';
    document.getElementById('thresholdValue').value = '5';
    document.getElementById('customRangeGroup').style.display = 'none';
    
    applyFilters();
    showToast('Filters reset', 'info');
}

// ================= CUSTOM RANGE HANDLER =================
document.getElementById('dateRangeSelect')?.addEventListener('change', (e) => {
    const customGroup = document.getElementById('customRangeGroup');
    if (customGroup) {
        customGroup.style.display = e.target.value === 'custom' ? 'flex' : 'none';
    }
});

// ================= SEARCH FUNCTIONALITY =================
document.getElementById('searchClusters')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') {
        applyFilters();
    } else {
        const filteredClusters = currentClusters.filter(c => 
            c.location.toLowerCase().includes(searchTerm)
        );
        currentClusters = filteredClusters;
        currentPage = 1;
        renderClusters();
    }
});

// ================= MODAL CONTROLS =================
function closeModal() {
    const modal = document.getElementById('clusterDetailModal');
    if (modal) modal.classList.remove('show');
}

document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
document.getElementById('exportClusterBtn')?.addEventListener('click', () => {
    showToast('Export feature coming soon', 'info');
});

document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);

// ================= INITIAL LOAD =================
document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
    showToast('Cluster data loaded', 'success');
});

window.showToast = showToast;