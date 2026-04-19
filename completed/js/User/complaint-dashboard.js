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
let complaints = [
    {
        id: "CMP-10241",
        customerName: "Rahul Mehta",
        phone: "9876543210",
        email: "rahul@example.com",
        location: "Andheri West",
        category: "Network",
        description: "Internet down since morning. No connectivity at all.",
        source: "Online",
        timestamp: "2026-04-15T10:25:00",
        status: "Open",
        priority: "High"
    },
    {
        id: "CMP-10242",
        customerName: "Priya Sharma",
        phone: "9823456789",
        email: "priya@example.com",
        location: "Bandra",
        category: "Billing",
        description: "Extra charges applied this month. Bill shows amount higher than plan.",
        source: "Phone Call",
        timestamp: "2026-04-14T15:30:00",
        status: "In Progress",
        priority: "Medium"
    },
    {
        id: "CMP-10243",
        customerName: "Amit Patel",
        phone: "9988776655",
        email: "amit@example.com",
        location: "Juhu",
        category: "Service",
        description: "Technician did not visit as scheduled. Waited whole day.",
        source: "Online",
        timestamp: "2026-04-14T11:45:00",
        status: "Open",
        priority: "High"
    },
    {
        id: "CMP-10244",
        customerName: "Sneha Reddy",
        phone: "9876501234",
        email: "sneha@example.com",
        location: "Powai",
        category: "Outage",
        description: "Power outage in entire block since 2 hours.",
        source: "Phone Call",
        timestamp: "2026-04-13T09:20:00",
        status: "Resolved",
        priority: "Critical"
    },
    {
        id: "CMP-10245",
        customerName: "Vikram Singh",
        phone: "9123456780",
        email: "vikram@example.com",
        location: "Goregaon",
        category: "Network",
        description: "Frequent disconnections every 10 minutes.",
        source: "Online",
        timestamp: "2026-04-12T17:55:00",
        status: "In Progress",
        priority: "High"
    },
    {
        id: "CMP-10246",
        customerName: "Neha Gupta",
        phone: "9988223344",
        email: "neha@example.com",
        location: "Malad",
        category: "Billing",
        description: "Payment not reflected in account even after deduction.",
        source: "Phone Call",
        timestamp: "2026-04-11T14:20:00",
        status: "Resolved",
        priority: "Medium"
    },
    {
        id: "CMP-10247",
        customerName: "Rohan Mehta",
        phone: "9876509876",
        email: "rohan@example.com",
        location: "Kandivali",
        category: "Network",
        description: "Slow internet speed since last week.",
        source: "Online",
        timestamp: "2026-04-10T10:15:00",
        status: "Open",
        priority: "Low"
    },
    {
        id: "CMP-10248",
        customerName: "Anjali Desai",
        phone: "9988771122",
        email: "anjali@example.com",
        location: "Andheri West",
        category: "Service",
        description: "New connection not activated even after 5 days.",
        source: "Phone Call",
        timestamp: "2026-04-09T16:40:00",
        status: "In Progress",
        priority: "High"
    },
    {
        id: "CMP-10249",
        customerName: "Sanjay Joshi",
        phone: "9876512345",
        email: "sanjay@example.com",
        location: "Bandra",
        category: "Network",
        description: "No signal in basement area.",
        source: "Online",
        timestamp: "2026-04-08T11:30:00",
        status: "Resolved",
        priority: "Medium"
    },
    {
        id: "CMP-10250",
        customerName: "Meera Nair",
        phone: "9988773344",
        email: "meera@example.com",
        location: "Juhu",
        category: "Outage",
        description: "TV signal completely down.",
        source: "Phone Call",
        timestamp: "2026-04-07T19:15:00",
        status: "Open",
        priority: "High"
    }
];

// Load from localStorage if available
const savedComplaints = localStorage.getItem('voxify_complaints');
if (savedComplaints) {
    try {
        const parsed = JSON.parse(savedComplaints);
        if (parsed && parsed.length > 0) {
            complaints = parsed;
        }
    } catch(e) {}
}

// Save to localStorage
function saveComplaints() {
    localStorage.setItem('voxify_complaints', JSON.stringify(complaints));
}

// ================= GLOBAL VARIABLES =================
let filteredComplaints = [...complaints];
let currentPage = 1;
let rowsPerPage = 10;
let sortColumn = 'timestamp';
let sortDirection = 'desc';

// ================= HELPER FUNCTIONS =================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'Open': return 'open';
        case 'In Progress': return 'progress';
        case 'Resolved': return 'resolved';
        case 'Closed': return 'closed';
        default: return 'open';
    }
}

// ================= FILTER FUNCTION =================
function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('filterCategory')?.value || '';
    const location = document.getElementById('filterLocation')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';
    
    filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = searchTerm === '' || 
            complaint.id.toLowerCase().includes(searchTerm) ||
            complaint.customerName.toLowerCase().includes(searchTerm) ||
            complaint.location.toLowerCase().includes(searchTerm);
        
        const matchesCategory = category === '' || complaint.category === category;
        const matchesLocation = location === '' || complaint.location === location;
        const matchesStatus = status === '' || complaint.status === status;
        
        return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
    });
    
    // Apply sorting
    sortComplaints();
    
    currentPage = 1;
    renderTable();
    updateStats();
    updateFilterCount();
}

function sortComplaints() {
    filteredComplaints.sort((a, b) => {
        let valA, valB;
        
        if (sortColumn === 'timestamp') {
            valA = new Date(a.timestamp);
            valB = new Date(b.timestamp);
        } else if (sortColumn === 'id') {
            valA = a.id;
            valB = b.id;
        } else {
            valA = a[sortColumn];
            valB = b[sortColumn];
        }
        
        if (sortDirection === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('filterStatus').value = '';
    applyFilters();
    showToast('All filters cleared', 'info');
}

function updateFilterCount() {
    const countSpan = document.getElementById('filterResultCount');
    if (countSpan) {
        countSpan.textContent = `Showing ${filteredComplaints.length} complaints`;
    }
}

// ================= STATS UPDATE =================
function updateStats() {
    const openCount = complaints.filter(c => c.status === 'Open').length;
    const progressCount = complaints.filter(c => c.status === 'In Progress').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
    const totalCount = complaints.length;
    
    document.getElementById('statOpen').textContent = openCount;
    document.getElementById('statProgress').textContent = progressCount;
    document.getElementById('statResolved').textContent = resolvedCount;
    document.getElementById('statTotal').textContent = totalCount;
    
    document.getElementById('openCount').textContent = openCount;
    document.getElementById('progressCount').textContent = progressCount;
    document.getElementById('resolvedCount').textContent = resolvedCount;
    document.getElementById('sidebarComplaintCount').textContent = totalCount;
}

// ================= POPULATE LOCATIONS =================
function populateLocations() {
    const locationSelect = document.getElementById('filterLocation');
    if (!locationSelect) return;
    
    const locations = [...new Set(complaints.map(c => c.location))];
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });
}

// ================= RENDER TABLE =================
function renderTable() {
    const tbody = document.getElementById('complaintTableBody');
    if (!tbody) return;
    
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filteredComplaints.slice(start, start + rowsPerPage);
    
    if (paginated.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-state">📭 No complaints found</td></tr>';
        renderPagination();
        return;
    }
    
    tbody.innerHTML = paginated.map(complaint => `
        <tr>
            <td data-label="Complaint ID"><strong>${complaint.id}</strong></td>
            <td data-label="Date & Time">${formatDate(complaint.timestamp)}</td>
            <td data-label="Customer">${complaint.customerName}</td>
            <td data-label="Category">${complaint.category}</td>
            <td data-label="Location">${complaint.location}</td>
            <td data-label="Status">
                <span class="status-badge ${getStatusClass(complaint.status)}">${complaint.status}</span>
            </td>
            <td data-label="Action">
                <button class="action-btn" onclick="viewComplaint('${complaint.id}')">View Details</button>
            </td>
        </tr>
    `).join('');
    
    renderPagination();
}

function renderPagination() {
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;
    
    const totalPages = Math.ceil(filteredComplaints.length / rowsPerPage);
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let pages = [];
    pages.push(`<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>`);
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            pages.push(`<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            pages.push(`<span>...</span>`);
        }
    }
    
    pages.push(`<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`);
    
    paginationDiv.innerHTML = pages.join('');
}

function changePage(page) {
    const totalPages = Math.ceil(filteredComplaints.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

// ================= SORTING =================
function sortByDate() {
    sortColumn = 'timestamp';
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    sortComplaints();
    currentPage = 1;
    renderTable();
    showToast(`Sorted by date (${sortDirection === 'asc' ? 'oldest first' : 'newest first'})`, 'info');
}

function sortById() {
    sortColumn = 'id';
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    sortComplaints();
    currentPage = 1;
    renderTable();
    showToast(`Sorted by ID (${sortDirection === 'asc' ? 'ascending' : 'descending'})`, 'info');
}

// ================= VIEW COMPLAINT DETAILS =================
function viewComplaint(id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    const modal = document.getElementById('complaintModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    modalTitle.textContent = `Complaint ${complaint.id}`;
    
    modalBody.innerHTML = `
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Complaint ID:</div>
            <div class="complaint-detail-value"><strong>${complaint.id}</strong></div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Customer Name:</div>
            <div class="complaint-detail-value">${complaint.customerName}</div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Contact:</div>
            <div class="complaint-detail-value">${complaint.phone} | ${complaint.email}</div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Location:</div>
            <div class="complaint-detail-value">${complaint.location}</div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Category:</div>
            <div class="complaint-detail-value">${complaint.category}</div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Status:</div>
            <div class="complaint-detail-value">
                <span class="status-badge ${getStatusClass(complaint.status)}">${complaint.status}</span>
            </div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Priority:</div>
            <div class="complaint-detail-value">${complaint.priority || 'Normal'}</div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Submitted On:</div>
            <div class="complaint-detail-value">${formatDate(complaint.timestamp)}</div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Source:</div>
            <div class="complaint-detail-value">${complaint.source || 'Online'}</div>
        </div>
        <div class="complaint-detail-row">
            <div class="complaint-detail-label">Description:</div>
            <div class="complaint-detail-value">${complaint.description}</div>
        </div>
    `;
    
    modal.classList.add('show');
    
    // Store current complaint ID for tracking
    window.currentComplaintId = id;
}

function closeModal() {
    const modal = document.getElementById('complaintModal');
    if (modal) modal.classList.remove('show');
}

function trackComplaint() {
    if (window.currentComplaintId) {
        closeModal();
        window.location.href = `tracking.html?id=${window.currentComplaintId}`;
    }
}

// ================= EXPORT DATA =================
function exportData() {
    if (filteredComplaints.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    const exportData = filteredComplaints.map(c => ({
        'Complaint ID': c.id,
        'Customer Name': c.customerName,
        'Phone': c.phone,
        'Email': c.email,
        'Location': c.location,
        'Category': c.category,
        'Description': c.description,
        'Status': c.status,
        'Submitted On': formatDate(c.timestamp),
        'Source': c.source
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `complaints_export_${new Date().toISOString().slice(0, 19)}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', exportFileName);
    link.click();
    
    showToast(`Exported ${filteredComplaints.length} complaints`, 'success');
}

function refreshData() {
    applyFilters();
    showToast('Data refreshed', 'success');
}

function newComplaint() {
    window.location.href = 'complaint-registration.html';
}

// ================= ROWS PER PAGE HANDLER =================
document.getElementById('rowsPerPage')?.addEventListener('change', (e) => {
    rowsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
});

// ================= EVENT LISTENERS =================
document.getElementById('applyFiltersBtn')?.addEventListener('click', applyFilters);
document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
document.getElementById('refreshBtn')?.addEventListener('click', refreshData);
document.getElementById('exportBtn')?.addEventListener('click', exportData);
document.getElementById('newComplaintBtn')?.addEventListener('click', newComplaint);
document.getElementById('sortDateBtn')?.addEventListener('click', sortByDate);
document.getElementById('sortIdBtn')?.addEventListener('click', sortById);
document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
document.getElementById('trackComplaintBtn')?.addEventListener('click', trackComplaint);

// Real-time search
document.getElementById('searchInput')?.addEventListener('input', applyFilters);
document.getElementById('filterCategory')?.addEventListener('change', applyFilters);
document.getElementById('filterLocation')?.addEventListener('change', applyFilters);
document.getElementById('filterStatus')?.addEventListener('change', applyFilters);

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    populateLocations();
    updateStats();
    applyFilters();
    showToast('Dashboard ready', 'success');
});

// Make functions global for onclick handlers
window.viewComplaint = viewComplaint;
window.changePage = changePage;
window.showToast = showToast;
window.closeModal = closeModal;
window.trackComplaint = trackComplaint;