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
const sampleIssues = [
    { id: 'CMP-10241', customer: 'Rajesh Kumar', location: 'Andheri West', issue: 'Complete network outage', service: 'Broadband', severity: 'high', status: 'open', date: '2026-04-17T10:30:00' },
    { id: 'CMP-10242', customer: 'Priya Sharma', location: 'Andheri West', issue: 'Intermittent connectivity', service: 'Broadband', severity: 'high', status: 'open', date: '2026-04-17T09:15:00' },
    { id: 'CMP-10243', customer: 'Amit Patel', location: 'Andheri West', issue: 'Router malfunction', service: 'Broadband', severity: 'high', status: 'progress', date: '2026-04-16T18:00:00' },
    { id: 'CMP-10244', customer: 'Sneha Reddy', location: 'Bandra', issue: 'No mobile network', service: 'Mobile', severity: 'high', status: 'open', date: '2026-04-17T08:00:00' },
    { id: 'CMP-10245', customer: 'Vikram Singh', location: 'Bandra', issue: 'Call drops frequently', service: 'Mobile', severity: 'high', status: 'open', date: '2026-04-16T20:30:00' },
    { id: 'CMP-10246', customer: 'Neha Gupta', location: 'Malad', issue: '5G connectivity issue', service: 'Mobile', severity: 'high', status: 'progress', date: '2026-04-16T14:00:00' },
    { id: 'CMP-10247', customer: 'Rohan Mehta', location: 'Malad', issue: 'Slow data speed', service: 'Mobile', severity: 'medium', status: 'open', date: '2026-04-17T07:00:00' },
    { id: 'CMP-10248', customer: 'Anjali Desai', location: 'Juhu', issue: 'WiFi signal weak', service: 'Broadband', severity: 'medium', status: 'open', date: '2026-04-17T11:00:00' },
    { id: 'CMP-10249', customer: 'Sanjay Joshi', location: 'Juhu', issue: 'Connection restored', service: 'Broadband', severity: 'low', status: 'resolved', date: '2026-04-15T09:00:00' },
    { id: 'CMP-10250', customer: 'Meera Nair', location: 'Powai', issue: 'TV signal issue', service: 'TV', severity: 'medium', status: 'progress', date: '2026-04-16T12:00:00' },
    { id: 'CMP-10251', customer: 'Karthik Iyer', location: 'Powai', issue: 'Remote not working', service: 'TV', severity: 'low', status: 'open', date: '2026-04-17T09:00:00' },
    { id: 'CMP-10252', customer: 'Lakshmi Krishnan', location: 'Goregaon', issue: 'Service disruption', service: 'Broadband', severity: 'medium', status: 'open', date: '2026-04-16T22:00:00' },
    { id: 'CMP-10253', customer: 'Manoj Tiwari', location: 'Goregaon', issue: 'Speed below promised', service: 'Broadband', severity: 'medium', status: 'open', date: '2026-04-17T06:00:00' },
    { id: 'CMP-10254', customer: 'Sunita Verma', location: 'Kandivali', issue: 'Billing dispute', service: 'Broadband', severity: 'low', status: 'open', date: '2026-04-16T15:00:00' }
];

// ================= GLOBAL VARIABLES =================
let currentIssues = [...sampleIssues];
let filteredIssues = [...sampleIssues];
let currentPage = 1;
const itemsPerPage = 10;

let severityChart = null;
let barChart = null;
let lineChart = null;

// ================= FILTER FUNCTIONS =================
function applyFilters() {
    const severityFilter = document.getElementById('severityFilter')?.value || 'all';
    const locationFilter = document.getElementById('locationFilter')?.value || 'all';
    const serviceFilter = document.getElementById('serviceFilter')?.value || 'all';
    const dateRange = document.getElementById('dateRangeSelect')?.value || 'last24h';
    
    let filtered = [...currentIssues];
    
    if (severityFilter !== 'all') {
        filtered = filtered.filter(i => i.severity === severityFilter);
    }
    
    if (locationFilter !== 'all') {
        filtered = filtered.filter(i => i.location === locationFilter);
    }
    
    if (serviceFilter !== 'all') {
        filtered = filtered.filter(i => i.service === serviceFilter);
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filtered = filtered.filter(issue => {
        const issueDate = new Date(issue.date);
        switch(dateRange) {
            case 'today': return issueDate >= today;
            case 'last24h': return issueDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
            case 'last7d': return issueDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case 'last30d': return issueDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            default: return true;
        }
    });
    
    filteredIssues = filtered;
    currentPage = 1;
    
    updateStats();
    updateCharts();
    renderPriorityLists();
    renderTable();
    
    showToast(`Found ${filteredIssues.length} issues`, 'success');
}

function resetFilters() {
    document.getElementById('severityFilter').value = 'all';
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('serviceFilter').value = 'all';
    document.getElementById('dateRangeSelect').value = 'last24h';
    applyFilters();
    showToast('Filters reset', 'info');
}

// ================= UPDATE STATS =================
function updateStats() {
    const high = filteredIssues.filter(i => i.severity === 'high').length;
    const medium = filteredIssues.filter(i => i.severity === 'medium').length;
    const low = filteredIssues.filter(i => i.severity === 'low').length;
    const total = filteredIssues.length;
    
    document.getElementById('highCount').textContent = high;
    document.getElementById('mediumCount').textContent = medium;
    document.getElementById('lowCount').textContent = low;
    document.getElementById('totalCount').textContent = total;
    
    document.getElementById('highSeverityBadge').textContent = high;
    document.getElementById('mediumSeverityBadge').textContent = medium;
    document.getElementById('lowSeverityBadge').textContent = low;
    document.getElementById('highPriorityCount').textContent = high;
    document.getElementById('mediumPriorityCount').textContent = medium;
}

// ================= UPDATE CHARTS =================
function updateCharts() {
    const high = filteredIssues.filter(i => i.severity === 'high').length;
    const medium = filteredIssues.filter(i => i.severity === 'medium').length;
    const low = filteredIssues.filter(i => i.severity === 'low').length;
    
    document.getElementById('donutHigh').textContent = high;
    document.getElementById('donutMedium').textContent = medium;
    document.getElementById('donutLow').textContent = low;
    
    const donutCtx = document.getElementById('severityDonutChart')?.getContext('2d');
    if (donutCtx) {
        if (severityChart) severityChart.destroy();
        severityChart = new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    data: [high, medium, low],
                    backgroundColor: ['#DC3545', '#FFC107', '#28A745'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }
        });
    }
    
    // Bar chart by location
    const locations = [...new Set(filteredIssues.map(i => i.location))];
    const highByLocation = locations.map(l => filteredIssues.filter(i => i.location === l && i.severity === 'high').length);
    const mediumByLocation = locations.map(l => filteredIssues.filter(i => i.location === l && i.severity === 'medium').length);
    const lowByLocation = locations.map(l => filteredIssues.filter(i => i.location === l && i.severity === 'low').length);
    
    const barCtx = document.getElementById('severityBarChart')?.getContext('2d');
    if (barCtx) {
        if (barChart) barChart.destroy();
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: locations,
                datasets: [
                    { label: 'High', data: highByLocation, backgroundColor: '#DC3545' },
                    { label: 'Medium', data: mediumByLocation, backgroundColor: '#FFC107' },
                    { label: 'Low', data: lowByLocation, backgroundColor: '#28A745' }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
        });
    }
    
    // Line chart trend
    const lineCtx = document.getElementById('severityLineChart')?.getContext('2d');
    if (lineCtx) {
        if (lineChart) lineChart.destroy();
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    { label: 'High', data: [12, 15, 18, 22, 25, 20, 18], borderColor: '#DC3545', fill: false },
                    { label: 'Medium', data: [8, 10, 12, 14, 13, 11, 9], borderColor: '#FFC107', fill: false },
                    { label: 'Low', data: [5, 6, 7, 8, 7, 6, 5], borderColor: '#28A745', fill: false }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
}

// ================= RENDER PRIORITY LISTS =================
function renderPriorityLists() {
    const highIssues = filteredIssues.filter(i => i.severity === 'high');
    const mediumIssues = filteredIssues.filter(i => i.severity === 'medium');
    
    const highContainer = document.getElementById('highPriorityList');
    const mediumContainer = document.getElementById('mediumPriorityList');
    
    if (highContainer) {
        if (highIssues.length === 0) {
            highContainer.innerHTML = '<div class="empty-state">No high priority issues</div>';
        } else {
            highContainer.innerHTML = highIssues.map(issue => `
                <div class="priority-item high">
                    <div class="priority-info">
                        <div class="priority-id">${issue.id}</div>
                        <div class="priority-title">${issue.issue}</div>
                        <div class="priority-meta">${issue.location} | ${issue.service} | ${new Date(issue.date).toLocaleString()}</div>
                    </div>
                    <div>
                        <span class="priority-status ${issue.status}">${issue.status.toUpperCase()}</span>
                        <button class="action-btn" onclick="showToast('Viewing ${issue.id}', 'info')">View</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (mediumContainer) {
        if (mediumIssues.length === 0) {
            mediumContainer.innerHTML = '<div class="empty-state">No medium priority issues</div>';
        } else {
            mediumContainer.innerHTML = mediumIssues.map(issue => `
                <div class="priority-item medium">
                    <div class="priority-info">
                        <div class="priority-id">${issue.id}</div>
                        <div class="priority-title">${issue.issue}</div>
                        <div class="priority-meta">${issue.location} | ${issue.service} | ${new Date(issue.date).toLocaleString()}</div>
                    </div>
                    <div>
                        <span class="priority-status ${issue.status}">${issue.status.toUpperCase()}</span>
                        <button class="action-btn" onclick="showToast('Viewing ${issue.id}', 'info')">View</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// ================= RENDER TABLE =================
function renderTable() {
    const tbody = document.getElementById('severityTableBody');
    const tableCount = document.getElementById('tableCount');
    const pagination = document.getElementById('pagination');
    
    if (!tbody) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filteredIssues.slice(start, start + itemsPerPage);
    
    if (tableCount) tableCount.textContent = `Showing ${filteredIssues.length} issues`;
    
    if (paginated.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No issues found</td></tr>';
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    tbody.innerHTML = paginated.map(issue => `
        <tr>
            <td><strong>${issue.id}</strong></td>
            <td>${issue.customer}<br><small style="color:#5F6368">${issue.location}</small></td>
            <td>${issue.issue}</td>
            <td>${issue.service}</td>
            <td><span class="severity-badge ${issue.severity}">${issue.severity.toUpperCase()}</span></td>
            <td><span class="status-badge ${issue.status}">${issue.status.toUpperCase()}</span></td>
            <td>${new Date(issue.date).toLocaleDateString()}</td>
            <td><a class="view-details-link" onclick="showToast('Viewing ${issue.id}', 'info')">View</a></td>
        </tr>
    `).join('');
    
    // Pagination
    const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
    if (pagination && totalPages > 1) {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
        }
        pagination.innerHTML = pages.join('');
        
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                renderTable();
            });
        });
    } else if (pagination) {
        pagination.innerHTML = '';
    }
}

// ================= SEARCH =================
document.getElementById('searchSeverity')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term === '') {
        filteredIssues = [...currentIssues];
    } else {
        filteredIssues = currentIssues.filter(i => 
            i.location.toLowerCase().includes(term) || 
            i.service.toLowerCase().includes(term) ||
            i.issue.toLowerCase().includes(term)
        );
    }
    currentPage = 1;
    updateStats();
    updateCharts();
    renderPriorityLists();
    renderTable();
    showToast(`Found ${filteredIssues.length} matching issues`, 'info');
});

// ================= EVENT LISTENERS =================
document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);

// ================= INITIAL LOAD =================
document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
    showToast('Severity dashboard loaded', 'success');
});

window.showToast = showToast;