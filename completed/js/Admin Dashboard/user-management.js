// ========= USER DATA =========
let users = [
    { id: 1, name: 'John Doe', email: 'john.doe@voxify.com', role: 'admin', status: 'active', createdAt: '2025-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@voxify.com', role: 'support', status: 'active', createdAt: '2025-01-20' },
    { id: 3, name: 'Mike Chen', email: 'mike.c@voxify.com', role: 'support', status: 'active', createdAt: '2025-02-01' },
    { id: 4, name: 'Priya Sharma', email: 'priya.s@voxify.com', role: 'noc', status: 'active', createdAt: '2025-02-10' },
    { id: 5, name: 'Rahul Mehta', email: 'rahul.m@voxify.com', role: 'customer', status: 'active', createdAt: '2025-02-15' },
    { id: 6, name: 'Anita Desai', email: 'anita.d@voxify.com', role: 'customer', status: 'inactive', createdAt: '2025-02-20' },
    { id: 7, name: 'Vikram Singh', email: 'vikram.s@voxify.com', role: 'support', status: 'active', createdAt: '2025-03-01' },
    { id: 8, name: 'Neha Gupta', email: 'neha.g@voxify.com', role: 'noc', status: 'suspended', createdAt: '2025-03-05' }
];

let currentPage = 1;
let rowsPerPage = 5;
let searchTerm = '';
let editingUserId = null;
let deletingUserId = null;


// ================= PROFILE DROPDOWN =================
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
}

// ================= STATUS DROPDOWN =================
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');

if (statusQuickBtn && statusDropdown) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('show');
    });
}


// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (profileDropdown && !profileBtn?.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
    if (statusDropdown && !statusQuickBtn?.contains(e.target)) {
        statusDropdown.classList.remove('show');
    }
});
// ========= HELPER FUNCTIONS =========
function getRoleBadgeClass(role) {
    switch(role) {
        case 'admin': return 'role-admin';
        case 'support': return 'role-support';
        case 'noc': return 'role-noc';
        default: return 'role-customer';
    }
}

function getRoleDisplayName(role) {
    switch(role) {
        case 'admin': return 'Administrator';
        case 'support': return 'Support Agent';
        case 'noc': return 'NOC Operator';
        default: return 'Customer';
    }
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'active': return 'status-active';
        case 'inactive': return 'status-inactive';
        default: return 'status-suspended';
    }
}

function getStatusDisplayName(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function updateStatusCounts() {
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const agentCount = users.filter(u => u.role === 'support').length;
    
    const totalSpan = document.getElementById('totalUsersCount');
    const adminSpan = document.getElementById('adminCount');
    const agentSpan = document.getElementById('agentCount');
    
    if (totalSpan) totalSpan.textContent = totalUsers;
    if (adminSpan) adminSpan.textContent = adminCount;
    if (agentSpan) agentSpan.textContent = agentCount;
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    let filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               getRoleDisplayName(user.role).toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    
    if (paginatedUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px;">No users found</td></tr>';
    } else {
        tbody.innerHTML = paginatedUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td><strong>${escapeHtml(user.name)}</strong></td>
                <td>${escapeHtml(user.email)}</td>
                <td><span class="role-badge ${getRoleBadgeClass(user.role)}">${getRoleDisplayName(user.role)}</span></td>
                <td><span class="status-badge ${getStatusBadgeClass(user.status)}">${getStatusDisplayName(user.status)}</span></td>
                <td>${user.createdAt}</td>
                <td>
                    <button class="btn action-btn edit-btn" onclick="openEditUserModal(${user.id})">✏️ Edit</button>
                    <button class="btn action-btn delete-btn" onclick="openDeleteModal(${user.id})">🗑️ Delete</button>
                </td>
            </tr>
        `).join('');
    }
    
    renderPagination(filteredUsers.length, totalPages);
    updateStatusCounts();
}

function renderPagination(totalItems, totalPages) {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = `<span class="pagination-info">Showing ${((currentPage - 1) * rowsPerPage) + 1} to ${Math.min(currentPage * rowsPerPage, totalItems)} of ${totalItems} users</span>`;
    paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Previous</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;
    
    container.innerHTML = paginationHTML;
}

window.changePage = function(page) {
    currentPage = page;
    renderUsersTable();
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function generateComplaintId() {
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `USR-${random}`;
}

// ========= MODAL FUNCTIONS =========
const addUserBtn = document.getElementById('addUserBtn');
if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
        editingUserId = null;
        document.getElementById('modalTitle').textContent = 'Add New User';
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        document.getElementById('userPassword').required = true;
        document.getElementById('userModal').classList.add('show');
    });
}

window.openEditUserModal = function(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    editingUserId = id;
    document.getElementById('modalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    document.getElementById('userPassword').value = '';
    document.getElementById('userPassword').required = false;
    document.getElementById('userModal').classList.add('show');
};

window.openDeleteModal = function(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    deletingUserId = id;
    document.getElementById('deleteUserName').textContent = user.name;
    document.getElementById('deleteModal').classList.add('show');
};

function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
}

const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const password = document.getElementById('userPassword').value;
        const role = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;
        
        if (!name) { showToast('Please enter user name', 'error'); return; }
        if (!email) { showToast('Please enter email address', 'error'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter valid email address', 'error'); return; }
        if (!role) { showToast('Please select a role', 'error'); return; }
        
        if (editingUserId === null) {
            if (!password) { showToast('Please enter password for new user', 'error'); return; }
            if (!validatePassword(password)) { showToast('Password must be at least 8 characters, contain 1 number and 1 special character', 'error'); return; }
            
            const newId = Math.max(...users.map(u => u.id), 0) + 1;
            const newUser = {
                id: newId,
                name: name,
                email: email,
                role: role,
                status: status,
                createdAt: new Date().toISOString().split('T')[0]
            };
            users.push(newUser);
            showToast('User added successfully', 'success');
        } else {
            const userIndex = users.findIndex(u => u.id === editingUserId);
            if (userIndex !== -1) {
                users[userIndex].name = name;
                users[userIndex].email = email;
                users[userIndex].role = role;
                users[userIndex].status = status;
                showToast('User updated successfully', 'success');
            }
        }
        
        renderUsersTable();
        document.getElementById('userModal').classList.remove('show');
    });
}

const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
        if (deletingUserId) {
            users = users.filter(u => u.id !== deletingUserId);
            renderUsersTable();
            showToast('User deleted successfully', 'success');
            document.getElementById('deleteModal').classList.remove('show');
            deletingUserId = null;
        }
    });
}

// ========= CLOSE MODALS =========
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

if (closeModalBtn) closeModalBtn.addEventListener('click', () => document.getElementById('userModal').classList.remove('show'));
if (cancelBtn) cancelBtn.addEventListener('click', () => document.getElementById('userModal').classList.remove('show'));
if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', () => document.getElementById('deleteModal').classList.remove('show'));
if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => document.getElementById('deleteModal').classList.remove('show'));

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ========= SEARCH =========
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        currentPage = 1;
        renderUsersTable();
    });
}

// ========= GLOBAL SEARCH FROM NAVBAR =========
const globalSearch = document.querySelector('.navbar-search input');
if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        currentPage = 1;
        renderUsersTable();
        if (searchInput) searchInput.value = searchTerm;
    });
}

// ========= TOAST FUNCTION =========
let toastTimer;
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span id="toastMsg"></span>`;
        document.body.appendChild(toast);
    }
    const toastMsg = document.getElementById('toastMsg');
    const icon = toast.querySelector('svg');
    if (!toastMsg) return;
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

// ========= INITIALIZE =========
renderUsersTable();
updateStatusCounts();

window.showToast = showToast;