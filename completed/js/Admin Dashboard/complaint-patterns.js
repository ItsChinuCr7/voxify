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
    { id: 'CMP-10241', customer: 'Rajesh Kumar', location: 'Andheri West', service: 'Broadband', category: 'Network', status: 'open', date: '2026-04-17T10:30:00' },
    { id: 'CMP-10242', customer: 'Priya Sharma', location: 'Andheri West', service: 'Broadband', category: 'Network', status: 'open', date: '2026-04-17T09:15:00' },
    { id: 'CMP-10243', customer: 'Amit Patel', location: 'Andheri West', service: 'Broadband', category: 'Network', status: 'progress', date: '2026-04-16T18:00:00' },
    { id: 'CMP-10244', customer: 'Sneha Reddy', location: 'Bandra', service: 'Mobile', category: 'Network', status: 'open', date: '2026-04-17T08:00:00' },
    { id: 'CMP-10245', customer: 'Vikram Singh', location: 'Bandra', service: 'Mobile', category: 'Network', status: 'open', date: '2026-04-16T20:30:00' },
    { id: 'CMP-10246', customer: 'Neha Gupta', location: 'Bandra', service: 'Mobile', category: 'Network', status: 'progress', date: '2026-04-16T14:00:00' },
    { id: 'CMP-10247', customer: 'Rohan Mehta', location: 'Bandra', service: 'Mobile', category: 'Network', status: 'open', date: '2026-04-17T07:00:00' },
    { id: 'CMP-10248', customer: 'Anjali Desai', location: 'Juhu', service: 'Broadband', category: 'Network', status: 'open', date: '2026-04-17T11:00:00' },
    { id: 'CMP-10249', customer: 'Sanjay Joshi', location: 'Juhu', service: 'Broadband', category: 'Network', status: 'resolved', date: '2026-04-15T09:00:00' },
    { id: 'CMP-10250', customer: 'Meera Nair', location: 'Powai', service: 'TV', category: 'Service', status: 'open', date: '2026-04-17T10:00:00' },
    { id: 'CMP-10251', customer: 'Karthik Iyer', location: 'Powai', service: 'TV', category: 'Service', status: 'open', date: '2026-04-16T16:00:00' },
    { id: 'CMP-10252', customer: 'Divya Menon', location: 'Powai', service: 'TV', category: 'Service', status: 'progress', date: '2026-04-16T12:00:00' },
    { id: 'CMP-10253', customer: 'Arjun Nair', location: 'Powai', service: 'TV', category: 'Service', status: 'open', date: '2026-04-17T09:00:00' },
    { id: 'CMP-10254', customer: 'Lakshmi Krishnan', location: 'Goregaon', service: 'Broadband', category: 'Network', status: 'open', date: '2026-04-16T22:00:00' },
    { id: 'CMP-10255', customer: 'Manoj Tiwari', location: 'Goregaon', service: 'Broadband', category: 'Network', status: 'open', date: '2026-04-17T06:00:00' },
];

// ================= GLOBAL VARIABLES =================
let currentComplaints = [...sampleComplaints];
let currentGroups = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentThreshold = 10;

// ================= GROUPING FUNCTION =================
function groupComplaints(complaints, groupBy, timeRange, timeGrouping, threshold) {
    currentThreshold = threshold;
    
    // Filter by time range first
    let filtered = filterByTimeRange(complaints, timeRange);
    
    // Group by selected criteria
    const groups = {};
    
    filtered.forEach(complaint => {
        let key;
        if (groupBy === 'location') {
            key = complaint.location;
        } else if (groupBy === 'service') {
            key = complaint.service;
        } else {
            key = complaint.category;
        }
        
        if (!groups[key]) {
            groups[key] = {
                name: key,
                complaints: [],
                count: 0,
                openCount: 0,
                progressCount: 0,
                resolvedCount: 0,
                type: groupBy
            };
        }
        
        groups[key].complaints.push(complaint);
        groups[key].count++;
        
        if (complaint.status === 'open') groups[key].openCount++;
        else if (complaint.status === 'progress') groups[key].progressCount++;
        else if (complaint.status === 'resolved') groups[key].resolvedCount++;
    });
    
    // Convert to array and add severity level
    let groupsArray = Object.values(groups).map(group => {
        let severity = 'normal';
        if (group.count >= threshold) severity = 'critical';
        else if (group.count >= threshold * 0.75) severity = 'warning';
        return { ...group, severity };
    });
    
    // Sort by count descending
    groupsArray.sort((a, b) => b.count - a.count);
    
    return groupsArray;
}

function filterByTimeRange(complaints, timeRange) {
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
            default:
                return true;
        }
    });
}

// ================= RENDER FUNCTIONS =================
function renderGroups() {
    const container = document.getElementById('groupsContainer');
    const groupsCountSpan = document.getElementById('groupsCount');
    const totalComplaintsSpan = document.getElementById('totalComplaints');
    const totalGroupsSpan = document.getElementById('totalGroups');
    const criticalGroupsSpan = document.getElementById('criticalGroups');
    const warningGroupsSpan = document.getElementById('warningGroups');
    
    if (!container) return;
    
    if (currentGroups.length === 0) {
        container.innerHTML = '<div class="empty-state"><div>📊</div><p>No complaints found for the selected criteria</p><span>Try adjusting your filters</span></div>';
        return;
    }
    
    // Update stats
    const totalComplaints = currentGroups.reduce((sum, g) => sum + g.count, 0);
    const criticalCount = currentGroups.filter(g => g.severity === 'critical').length;
    const warningCount = currentGroups.filter(g => g.severity === 'warning').length;
    
    if (totalComplaintsSpan) totalComplaintsSpan.textContent = totalComplaints;
    if (totalGroupsSpan) totalGroupsSpan.textContent = currentGroups.length;
    if (criticalGroupsSpan) criticalGroupsSpan.textContent = criticalCount;
    if (warningGroupsSpan) warningGroupsSpan.textContent = warningCount;
    if (groupsCountSpan) groupsCountSpan.textContent = `Showing ${currentGroups.length} groups`;
    
    // Paginate
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedGroups = currentGroups.slice(start, start + itemsPerPage);
    
    container.innerHTML = paginatedGroups.map(group => `
        <div class="group-card ${group.severity}" data-group-name="${group.name}">
            <div class="group-card-header">
                <div class="group-name">
                    <span>${group.type === 'location' ? '📍' : group.type === 'service' ? '🔧' : '📂'}</span>
                    ${group.name}
                </div>
                <span class="group-badge ${group.severity}">${group.severity === 'critical' ? '⚠️ Critical' : group.severity === 'warning' ? '⚡ Warning' : '✅ Normal'}</span>
            </div>
            <div class="group-stats">
                <div class="stat-item">
                    <div class="stat-number">${group.count}</div>
                    <div class="stat-label-sm">Total</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="color:#DC3545">${group.openCount}</div>
                    <div class="stat-label-sm">Open</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="color:#FFC107">${group.progressCount}</div>
                    <div class="stat-label-sm">Progress</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="color:#28A745">${group.resolvedCount}</div>
                    <div class="stat-label-sm">Resolved</div>
                </div>
            </div>
            <div class="group-details">
                <div class="detail-row">
                    <span class="detail-label">Complaint IDs:</span>
                    <span class="detail-value">${group.complaints.slice(0, 3).map(c => c.id).join(', ')}${group.complaints.length > 3 ? '...' : ''}</span>
                </div>
            </div>
            <div class="group-footer">
                <button class="view-details-btn" onclick="viewGroupDetails('${group.name}')">View Details →</button>
            </div>
        </div>
    `).join('');
    
    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(currentGroups.length / itemsPerPage);
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
            renderGroups();
        });
    });
}

// ================= VIEW GROUP DETAILS =================
window.viewGroupDetails = function(groupName) {
    const group = currentGroups.find(g => g.name === groupName);
    if (!group) return;
    
    const modal = document.getElementById('groupDetailModal');
    const modalTitle = document.getElementById('modalGroupTitle');
    const modalBody = document.getElementById('modalGroupBody');
    
    if (!modal || !modalBody) return;
    
    modalTitle.textContent = `${group.type === 'location' ? '📍' : group.type === 'service' ? '🔧' : '📂'} ${group.name}`;
    
    modalBody.innerHTML = `
        <div class="group-summary" style="margin-bottom: 20px; padding: 16px; background: #F8F9FA; border-radius: 12px;">
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <div><strong>Total Complaints:</strong> ${group.count}</div>
                <div><strong>Open:</strong> ${group.openCount}</div>
                <div><strong>In Progress:</strong> ${group.progressCount}</div>
                <div><strong>Resolved:</strong> ${group.resolvedCount}</div>
                <div><strong>Severity:</strong> <span class="group-badge ${group.severity}">${group.severity.toUpperCase()}</span></div>
            </div>
        </div>
        <h4 style="margin-bottom: 12px;">📋 Complaint List</h4>
        <div class="complaint-list">
            ${group.complaints.map(c => `
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
    const groupBy = document.getElementById('groupBySelect')?.value || 'location';
    const timeRange = document.getElementById('timeRangeSelect')?.value || 'last24h';
    const timeGrouping = document.getElementById('timeGroupingSelect')?.value || 'daily';
    const threshold = parseInt(document.getElementById('thresholdValue')?.value || '10');
    
    const titleMap = {
        location: 'Complaint Groups by Location',
        service: 'Complaint Groups by Service Type',
        category: 'Complaint Groups by Category'
    };
    
    document.getElementById('groupingTitle').textContent = titleMap[groupBy];
    
    currentGroups = groupComplaints(currentComplaints, groupBy, timeRange, timeGrouping, threshold);
    currentPage = 1;
    renderGroups();
    
    showToast(`Grouped by ${groupBy}`, 'success');
}

function resetFilters() {
    document.getElementById('groupBySelect').value = 'location';
    document.getElementById('timeRangeSelect').value = 'last24h';
    document.getElementById('timeGroupingSelect').value = 'daily';
    document.getElementById('thresholdValue').value = '10';
    
    applyFilters();
    showToast('Filters reset', 'info');
}

// ================= CUSTOM RANGE HANDLER =================
document.getElementById('timeRangeSelect')?.addEventListener('change', (e) => {
    const customGroup = document.getElementById('customRangeGroup');
    if (customGroup) {
        customGroup.style.display = e.target.value === 'custom' ? 'flex' : 'none';
    }
});

// ================= SEARCH FUNCTIONALITY =================
document.getElementById('searchPatterns')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') {
        applyFilters();
    } else {
        const filtered = currentComplaints.filter(c => 
            c.location.toLowerCase().includes(searchTerm) ||
            c.service.toLowerCase().includes(searchTerm) ||
            c.category.toLowerCase().includes(searchTerm)
        );
        currentComplaints = filtered;
        applyFilters();
        currentComplaints = [...sampleComplaints];
    }
});

// ================= MODAL CONTROLS =================
function closeModal() {
    const modal = document.getElementById('groupDetailModal');
    if (modal) modal.classList.remove('show');
}

document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
document.getElementById('exportGroupBtn')?.addEventListener('click', () => {
    showToast('Export feature coming soon', 'info');
});

document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);

// ================= INITIAL LOAD =================
document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
    showToast('Complaint patterns loaded', 'success');
});

window.showToast = showToast;