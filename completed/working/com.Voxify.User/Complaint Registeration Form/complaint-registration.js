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
        if (profileDropdown) profileDropdown.classList.remove('open');
    });
}

if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('open');
        if (statusDropdown) statusDropdown.classList.remove('open');
    });
}

document.addEventListener('click', () => {
    if (profileDropdown) profileDropdown.classList.remove('open');
    if (statusDropdown) statusDropdown.classList.remove('open');
});

// ========= FORM VALIDATION & SUBMISSION =========
const form = document.getElementById('complaintForm');
const customerName = document.getElementById('customerName');
const contactNumber = document.getElementById('contactNumber');
const email = document.getElementById('email');
const category = document.getElementById('category');
const state = document.getElementById('state');
const city = document.getElementById('city');
const houseNo = document.getElementById('houseNo');
const street = document.getElementById('street');
const pincode = document.getElementById('pincode');
const description = document.getElementById('description');
const charCountSpan = document.getElementById('charCount');
const modal = document.getElementById('successModal');
const complaintIdDisplay = document.getElementById('complaintIdDisplay');

// Character counter for description
if (description) {
    description.addEventListener('input', () => {
        const len = description.value.length;
        charCountSpan.textContent = `${len} / 500 characters`;
        if (len > 500) {
            charCountSpan.style.color = 'var(--error-red)';
        } else {
            charCountSpan.style.color = 'var(--text-secondary)';
        }
    });
}

// Generate random Complaint ID
function generateComplaintId() {
    const prefix = 'CMP';
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${random}`;
}

// Validate form
function validateForm() {
    let isValid = true;
    let errorMessage = '';

    // Customer Name
    if (!customerName.value.trim()) {
        errorMessage = 'Please enter customer name';
        isValid = false;
    }
    // Contact Number
    else if (!contactNumber.value.trim()) {
        errorMessage = 'Please enter contact number';
        isValid = false;
    }
    else if (!/^\d{10}$/.test(contactNumber.value.trim())) {
        errorMessage = 'Please enter a valid 10-digit mobile number';
        isValid = false;
    }
    // Email (optional but validate if provided)
    else if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
    }
    // Category
    else if (!category.value) {
        errorMessage = 'Please select a complaint category';
        isValid = false;
    }
    // State
    else if (!state.value.trim()) {
        errorMessage = 'Please enter state';
        isValid = false;
    }
    // City
    else if (!city.value.trim()) {
        errorMessage = 'Please enter city';
        isValid = false;
    }
    // House No
    else if (!houseNo.value.trim()) {
        errorMessage = 'Please enter house/flat number';
        isValid = false;
    }
    // Street
    else if (!street.value.trim()) {
        errorMessage = 'Please enter street or area';
        isValid = false;
    }
    // Pincode
    else if (!pincode.value.trim()) {
        errorMessage = 'Please enter pincode';
        isValid = false;
    }
    else if (!/^\d{6}$/.test(pincode.value.trim())) {
        errorMessage = 'Please enter a valid 6-digit pincode';
        isValid = false;
    }
    // Description
    else if (!description.value.trim()) {
        errorMessage = 'Please describe your complaint';
        isValid = false;
    }
    else if (description.value.length > 500) {
        errorMessage = 'Description cannot exceed 500 characters';
        isValid = false;
    }

    if (!isValid) {
        showToast(errorMessage, 'error');
        return false;
    }
    return true;
}

// Submit form
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Generate Complaint ID
            const complaintId = generateComplaintId();
            complaintIdDisplay.textContent = complaintId;
            
            // Store in localStorage for tracking (simulate database)
            const complaintData = {
                id: complaintId,
                customerName: customerName.value.trim(),
                contactNumber: contactNumber.value.trim(),
                email: email.value.trim(),
                category: category.value,
                state: state.value.trim(),
                city: city.value.trim(),
                houseNo: houseNo.value.trim(),
                street: street.value.trim(),
                pincode: pincode.value.trim(),
                landmark: document.getElementById('landmark')?.value.trim() || '',
                description: description.value.trim(),
                status: 'Open',
                createdAt: new Date().toISOString()
            };
            
            // Get existing complaints from localStorage
            let complaints = JSON.parse(localStorage.getItem('voxify_complaints') || '[]');
            complaints.unshift(complaintData);
            localStorage.setItem('voxify_complaints', JSON.stringify(complaints));
            
            // Update global badge count
            const badge = document.getElementById('globalUnreadBadge');
            if (badge) {
                let count = parseInt(badge.innerText) || 0;
                badge.innerText = count + 1;
            }
            
            // Show success modal
            modal.classList.add('show');
            
            // Reset form
            form.reset();
            if (charCountSpan) charCountSpan.textContent = '0 / 500 characters';
        }
    });
}

// Clear form button
const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        form.reset();
        if (charCountSpan) charCountSpan.textContent = '0 / 500 characters';
        showToast('Form cleared', 'info');
    });
}

// Modal close handlers
const closeModalBtn = document.getElementById('closeModalBtn');
const trackComplaintBtn = document.getElementById('trackComplaintBtn');

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

if (trackComplaintBtn) {
    trackComplaintBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        window.location.href = 'tracking.html';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

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

// ========= INITIALIZE =========
function init() {
    // Set default date for any dynamic elements
    console.log('Complaint Registration Form loaded');
}

init();

// Export for global use
window.showToast = showToast;