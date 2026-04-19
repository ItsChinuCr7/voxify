// ================= SIDEBAR TOGGLE FUNCTIONALITY =================
const sidebar = document.getElementById('voxifySidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const layout = document.getElementById('voxifyLayout');

function toggleSidebar() {
    if (sidebar && layout) {
        sidebar.classList.toggle('collapsed');
        layout.classList.toggle('sidebar-collapsed');
        
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
}

function closeSidebar() {
    if (window.innerWidth <= 768) {
        if (sidebar && layout) {
            sidebar.classList.add('collapsed');
            layout.classList.add('sidebar-collapsed');
        }
    }
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        if (sidebar && layout && window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            layout.classList.add('sidebar-collapsed');
        }
    });
}

const savedState = localStorage.getItem('sidebarCollapsed');
if (savedState === 'true' && sidebar && layout) {
    sidebar.classList.add('collapsed');
    layout.classList.add('sidebar-collapsed');
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (sidebarOverlay) sidebarOverlay.style.display = 'none';
    } else {
        if (sidebarOverlay) sidebarOverlay.style.display = 'block';
    }
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

// ================= STATUS DROPDOWN =================
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');

if (statusQuickBtn && statusDropdown) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('show');
    });
}

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

// ================= CHARACTER COUNTER =================
const description = document.getElementById('description');
const charCount = document.getElementById('charCount');

if (description && charCount) {
    description.addEventListener('input', () => {
        const len = description.value.length;
        charCount.textContent = `${len} / 500 characters`;
        if (len > 500) {
            charCount.style.color = '#DC3545';
            description.value = description.value.substring(0, 500);
            charCount.textContent = '500 / 500 characters';
        } else {
            charCount.style.color = '#5F6368';
        }
    });
}

// ================= FORM SUBMIT =================
const form = document.getElementById('complaintForm');
const successMessageDiv = document.getElementById('successMessage');

function generateComplaintId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CMP-${year}-${random}`;
}

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customerName = document.getElementById('customerName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const location = document.getElementById('location').value.trim();
        const category = document.getElementById('category').value;
        const descriptionText = document.getElementById('description').value.trim();
        
        if (!customerName || !phoneNumber || !location || !category || !descriptionText) {
            showToast('Please fill all required fields', 'error');
            return;
        }
        
        if (!/^\d{10}$/.test(phoneNumber)) {
            showToast('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        const complaintId = generateComplaintId();
        const timestamp = new Date().toLocaleString();
        
        const complaint = {
            id: complaintId,
            customerName: customerName,
            phone: phoneNumber,
            location: location,
            category: category,
            description: descriptionText,
            source: "Phone Call",
            timestamp: timestamp,
            status: "Open",
            createdAt: new Date().toISOString()
        };
        
        let complaints = JSON.parse(localStorage.getItem('voxify_complaints') || '[]');
        complaints.unshift(complaint);
        localStorage.setItem('voxify_complaints', JSON.stringify(complaints));
        
        successMessageDiv.innerHTML = `
            ✅ Complaint Logged Successfully!<br><br>
            <strong>Complaint ID:</strong> ${complaintId}<br>
            <strong>Source:</strong> Phone Call<br>
            <strong>Timestamp:</strong> ${timestamp}<br>
            <strong>Status:</strong> Open
        `;
        successMessageDiv.classList.remove('hidden');
        
        showToast(`Complaint ${complaintId} logged successfully!`, 'success');
        
        form.reset();
        if (charCount) charCount.textContent = '0 / 500 characters';
        
        setTimeout(() => {
            successMessageDiv.classList.add('hidden');
        }, 5000);
    });
}

// ================= RESET BUTTON =================
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        form.reset();
        if (charCount) charCount.textContent = '0 / 500 characters';
        successMessageDiv.classList.add('hidden');
        showToast('Form cleared', 'info');
    });
}

// ================= ACTIVE SIDEBAR LINK =================
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '' || currentPage === 'agent-log-complaint.html') && link.getAttribute('href') === 'agent-log-complaint.html') {
        link.classList.add('active');
    }
});

// Make functions global
window.showToast = showToast;