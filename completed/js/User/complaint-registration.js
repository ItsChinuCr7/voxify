// ========= SIDEBAR TOGGLE =========
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('voxifySidebar');
const layout = document.getElementById('voxifyLayout');
const overlay = document.getElementById('sidebarOverlay');
const isMobile = () => window.innerWidth <= 768;

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMobile()) {
            if (sidebar) sidebar.classList.toggle('mobile-open');
            if (overlay) overlay.classList.toggle('show');
        } else {
            if (sidebar) sidebar.classList.toggle('collapsed');
            if (layout) layout.classList.toggle('sidebar-collapsed');
        }
    });
}
if (overlay) {
    overlay.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('show');
    });
}
window.addEventListener('resize', () => {
    if (!isMobile()) {
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('show');
    }
});

// ========= DROPDOWNS =========
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (statusQuickBtn && statusDropdown) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('open');
        if (profileDropdown) profileDropdown.classList.remove('open');
    });
}
if (profileBtn && profileDropdown) {
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

// ========= CATEGORY SPECIFIC FIELDS =========
const categoryFields = {
    'Network Issue': {
        icon: '🌐',
        fields: [
            { type: 'select', id: 'connectionType', label: 'Connection Type', options: ['Broadband', 'Fiber', '5G', '4G', 'WiFi'] },
            { type: 'text', id: 'signalStrength', label: 'Signal Strength (0-100%)', placeholder: 'e.g., 40%' },
            { type: 'text', id: 'outageDuration', label: 'Outage Duration', placeholder: 'e.g., 2 hours' }
        ]
    },
    'Power Outage': {
        icon: '⚡',
        fields: [
            { type: 'select', id: 'powerIssue', label: 'Power Issue Type', options: ['Complete Blackout', 'Voltage Fluctuation', 'Partial Power', 'Frequent Tripping'] },
            { type: 'text', id: 'affectedArea', label: 'Affected Area/Building', placeholder: 'e.g., Wing A, Building 5' },
            { type: 'text', id: 'outageStartTime', label: 'Outage Start Time', placeholder: 'e.g., 2:30 PM' }
        ]
    },
    'Billing Issue': {
        icon: '💰',
        fields: [
            { type: 'select', id: 'billingType', label: 'Billing Issue Type', options: ['Wrong Amount Charged', 'Duplicate Payment', 'Missing Payment', 'Bill Not Received', 'GST Issue'] },
            { type: 'text', id: 'billAmount', label: 'Bill Amount (₹)', placeholder: 'e.g., 1499' },
            { type: 'text', id: 'billMonth', label: 'Billing Month', placeholder: 'e.g., March 2025' }
        ]
    },
    'Service Delay': {
        icon: '⏰',
        fields: [
            { type: 'select', id: 'serviceType', label: 'Service Type', options: ['Installation', 'Repair', 'Maintenance', 'Activation', 'Disconnection'] },
            { type: 'text', id: 'requestDate', label: 'Request Date', placeholder: 'e.g., 2025-04-10' },
            { type: 'text', id: 'promisedDate', label: 'Promised Date', placeholder: 'e.g., 2025-04-12' }
        ]
    },
    'Infrastructure': {
        icon: '🏗️',
        fields: [
            { type: 'select', id: 'infraType', label: 'Infrastructure Type', options: ['Road', 'Street Light', 'Drainage', 'Footpath', 'Bridge', 'Water Pipeline'] },
            { type: 'text', id: 'locationDetail', label: 'Exact Location', placeholder: 'e.g., Near Main Road Crossing' },
            { type: 'text', id: 'hazardLevel', label: 'Hazard Level', placeholder: 'High / Medium / Low' }
        ]
    },
    'Other': {
        icon: '📝',
        fields: [
            { type: 'text', id: 'otherCategory', label: 'Specify Category', placeholder: 'Please specify the issue category' },
            { type: 'textarea', id: 'otherDetails', label: 'Additional Details', placeholder: 'Provide more information about your issue' }
        ]
    }
};

const categorySelect = document.getElementById('category');
const categoryFieldsDiv = document.getElementById('categorySpecificFields');

function updateCategoryFields() {
    const selected = categorySelect.value;
    categoryFieldsDiv.innerHTML = '';
    categoryFieldsDiv.classList.remove('show');
    
    if (selected && categoryFields[selected]) {
        const cat = categoryFields[selected];
        let html = `<h4>${cat.icon} ${selected} Details</h4><div class="form-row" id="categoryFieldsRow">`;
        
        cat.fields.forEach(field => {
            if (field.type === 'select') {
                html += `
                    <div class="form-group">
                        <label>${field.label}</label>
                        <select id="${field.id}">
                            <option value="">Select ${field.label}</option>
                            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'textarea') {
                html += `
                    <div class="form-group full-width">
                        <label>${field.label}</label>
                        <textarea id="${field.id}" rows="2" placeholder="${field.placeholder}"></textarea>
                    </div>
                `;
            } else {
                html += `
                    <div class="form-group">
                        <label>${field.label}</label>
                        <input type="text" id="${field.id}" placeholder="${field.placeholder}">
                    </div>
                `;
            }
        });
        
        html += `</div>`;
        categoryFieldsDiv.innerHTML = html;
        categoryFieldsDiv.classList.add('show');
    }
}

categorySelect.addEventListener('change', updateCategoryFields);
updateCategoryFields();

// ========= CHARACTER COUNTER =========
const description = document.getElementById('description');
const charCount = document.getElementById('charCount');
if (description) {
    description.addEventListener('input', () => {
        const len = description.value.length;
        charCount.textContent = `${len} / 500 characters`;
        if (len > 500) charCount.style.color = 'var(--error-red)';
        else charCount.style.color = 'var(--text-secondary)';
        validateField('description', len > 0 && len <= 500);
    });
}

// ========= REAL-TIME VALIDATION FUNCTIONS =========
function validateField(fieldId, isValid, errorMsgId = null, errorMessage = '') {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        if (errorMsgId) {
            const errorDiv = document.getElementById(errorMsgId);
            if (errorDiv) errorDiv.classList.remove('show');
        }
        // Show valid message if exists
        const validMsg = document.getElementById(`${fieldId}Valid`);
        if (validMsg) validMsg.classList.add('show');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        if (errorMsgId && errorMessage) {
            const errorDiv = document.getElementById(errorMsgId);
            if (errorDiv) {
                errorDiv.textContent = errorMessage;
                errorDiv.classList.add('show');
            }
        }
        // Hide valid message
        const validMsg = document.getElementById(`${fieldId}Valid`);
        if (validMsg) validMsg.classList.remove('show');
    }
}

// Validate Customer Name
const customerName = document.getElementById('customerName');
if (customerName) {
    customerName.addEventListener('input', () => {
        const isValid = customerName.value.trim().length >= 2;
        validateField('customerName', isValid, 'nameError', 'Name must be at least 2 characters');
    });
    customerName.addEventListener('blur', () => {
        const isValid = customerName.value.trim().length >= 2;
        validateField('customerName', isValid, 'nameError', 'Name must be at least 2 characters');
    });
}

// Validate Mobile Number (only numbers, 10 digits)
const contactNumber = document.getElementById('contactNumber');
if (contactNumber) {
    contactNumber.addEventListener('input', () => {
        let value = contactNumber.value.replace(/[^0-9]/g, '');
        contactNumber.value = value;
        const isValid = value.length === 10;
        validateField('contactNumber', isValid, 'mobileError', 'Enter valid 10-digit mobile number');
    });
    contactNumber.addEventListener('blur', () => {
        const value = contactNumber.value;
        const isValid = value.length === 10 && /^\d{10}$/.test(value);
        validateField('contactNumber', isValid, 'mobileError', 'Enter valid 10-digit mobile number');
    });
}

// Validate Email
const email = document.getElementById('email');
if (email) {
    email.addEventListener('input', () => {
        const value = email.value.trim();
        const isValid = value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        validateField('email', isValid, 'emailError', 'Enter valid email address (e.g., name@example.com)');
    });
    email.addEventListener('blur', () => {
        const value = email.value.trim();
        const isValid = value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        validateField('email', isValid, 'emailError', 'Enter valid email address (e.g., name@example.com)');
    });
}

// Validate Category
const category = document.getElementById('category');
if (category) {
    category.addEventListener('change', () => {
        const isValid = category.value !== '';
        validateField('category', isValid, 'categoryError', 'Please select a complaint category');
    });
}

// Validate State
const state = document.getElementById('state');
if (state) {
    state.addEventListener('input', () => {
        const isValid = state.value.trim().length >= 2;
        validateField('state', isValid, 'stateError', 'State is required');
    });
    state.addEventListener('blur', () => {
        const isValid = state.value.trim().length >= 2;
        validateField('state', isValid, 'stateError', 'State is required');
    });
}

// Validate City
const city = document.getElementById('city');
if (city) {
    city.addEventListener('input', () => {
        const isValid = city.value.trim().length >= 2;
        validateField('city', isValid, 'cityError', 'City is required');
    });
    city.addEventListener('blur', () => {
        const isValid = city.value.trim().length >= 2;
        validateField('city', isValid, 'cityError', 'City is required');
    });
}

// Validate House No
const houseNo = document.getElementById('houseNo');
if (houseNo) {
    houseNo.addEventListener('input', () => {
        const isValid = houseNo.value.trim().length >= 1;
        validateField('houseNo', isValid, 'houseError', 'House/Flat number is required');
    });
    houseNo.addEventListener('blur', () => {
        const isValid = houseNo.value.trim().length >= 1;
        validateField('houseNo', isValid, 'houseError', 'House/Flat number is required');
    });
}

// Validate Street
const street = document.getElementById('street');
if (street) {
    street.addEventListener('input', () => {
        const isValid = street.value.trim().length >= 2;
        validateField('street', isValid, 'streetError', 'Street/Area is required');
    });
    street.addEventListener('blur', () => {
        const isValid = street.value.trim().length >= 2;
        validateField('street', isValid, 'streetError', 'Street/Area is required');
    });
}

// Validate Pincode (only numbers, 6 digits)
const pincode = document.getElementById('pincode');
if (pincode) {
    pincode.addEventListener('input', () => {
        let value = pincode.value.replace(/[^0-9]/g, '');
        pincode.value = value;
        const isValid = value.length === 6;
        validateField('pincode', isValid, 'pincodeError', 'Enter valid 6-digit pincode');
    });
    pincode.addEventListener('blur', () => {
        const value = pincode.value;
        const isValid = value.length === 6 && /^\d{6}$/.test(value);
        validateField('pincode', isValid, 'pincodeError', 'Enter valid 6-digit pincode');
    });
}

// Validate Description
if (description) {
    description.addEventListener('input', () => {
        const len = description.value.length;
        const isValid = len > 0 && len <= 500;
        validateField('description', isValid, 'descError', len === 0 ? 'Description is required' : 'Description exceeds 500 characters');
    });
    description.addEventListener('blur', () => {
        const len = description.value.length;
        const isValid = len > 0 && len <= 500;
        validateField('description', isValid, 'descError', len === 0 ? 'Description is required' : 'Description exceeds 500 characters');
    });
}

// ========= FULL FORM VALIDATION =========
function validateForm() {
    let isValid = true;
    
    // Name validation
    const nameVal = customerName.value.trim().length >= 2;
    if (!nameVal) {
        validateField('customerName', false, 'nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Mobile validation
    const mobileVal = contactNumber.value.length === 10 && /^\d{10}$/.test(contactNumber.value);
    if (!mobileVal) {
        validateField('contactNumber', false, 'mobileError', 'Enter valid 10-digit mobile number');
        isValid = false;
    }
    
    // Email validation (optional but if entered must be valid)
    const emailVal = email.value.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailVal) {
        validateField('email', false, 'emailError', 'Enter valid email address');
        isValid = false;
    }
    
    // Category validation
    const categoryVal = category.value !== '';
    if (!categoryVal) {
        validateField('category', false, 'categoryError', 'Please select a complaint category');
        isValid = false;
    }
    
    // State validation
    const stateVal = state.value.trim().length >= 2;
    if (!stateVal) {
        validateField('state', false, 'stateError', 'State is required');
        isValid = false;
    }
    
    // City validation
    const cityVal = city.value.trim().length >= 2;
    if (!cityVal) {
        validateField('city', false, 'cityError', 'City is required');
        isValid = false;
    }
    
    // House No validation
    const houseVal = houseNo.value.trim().length >= 1;
    if (!houseVal) {
        validateField('houseNo', false, 'houseError', 'House/Flat number is required');
        isValid = false;
    }
    
    // Street validation
    const streetVal = street.value.trim().length >= 2;
    if (!streetVal) {
        validateField('street', false, 'streetError', 'Street/Area is required');
        isValid = false;
    }
    
    // Pincode validation
    const pincodeVal = pincode.value.length === 6 && /^\d{6}$/.test(pincode.value);
    if (!pincodeVal) {
        validateField('pincode', false, 'pincodeError', 'Enter valid 6-digit pincode');
        isValid = false;
    }
    
    // Description validation
    const descLen = description.value.length;
    const descVal = descLen > 0 && descLen <= 500;
    if (!descVal) {
        validateField('description', false, 'descError', descLen === 0 ? 'Description is required' : 'Description exceeds 500 characters');
        isValid = false;
    }
    
    return isValid;
}

// ========= GENERATE COMPLAINT ID =========
function generateComplaintId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CMP-${year}-${random}`;
}

// ========= SUBMIT FORM =========
const form = document.getElementById('complaintForm');
const modal = document.getElementById('successModal');
const complaintIdDisplay = document.getElementById('complaintIdDisplay');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            const complaintId = generateComplaintId();
            complaintIdDisplay.textContent = complaintId;
            
            const complaintData = {
                id: complaintId,
                customerName: customerName.value,
                contactNumber: contactNumber.value,
                email: email.value,
                category: category.value,
                state: state.value,
                city: city.value,
                houseNo: houseNo.value,
                street: street.value,
                pincode: pincode.value,
                landmark: document.getElementById('landmark')?.value || '',
                description: description.value,
                status: 'Open',
                createdAt: new Date().toISOString()
            };
            
            let complaints = JSON.parse(localStorage.getItem('voxify_complaints') || '[]');
            complaints.unshift(complaintData);
            localStorage.setItem('voxify_complaints', JSON.stringify(complaints));
            
            modal.classList.add('show');
            form.reset();
            charCount.textContent = '0 / 500 characters';
            updateCategoryFields();
            
            // Reset validation styles
            document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
                field.classList.remove('valid', 'invalid');
            });
            document.querySelectorAll('.error-msg').forEach(err => err.classList.remove('show'));
            document.querySelectorAll('.valid-msg').forEach(valid => valid.classList.remove('show'));
        } else {
            showToast('Please fill all required fields correctly', 'error');
        }
    });
}

// ========= CLEAR FORM =========
const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        form.reset();
        charCount.textContent = '0 / 500 characters';
        updateCategoryFields();
        
        // Reset validation styles
        document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
        document.querySelectorAll('.error-msg').forEach(err => err.classList.remove('show'));
        document.querySelectorAll('.valid-msg').forEach(valid => valid.classList.remove('show'));
        
        showToast('Form cleared', 'info');
    });
}
// ========= MODAL HANDLERS =========
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
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
});

// ========= TOAST FUNCTION =========
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

// ========= ACTIVE SIDEBAR LINK =========
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

window.showToast = showToast;