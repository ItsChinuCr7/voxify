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

// ========= ASSIGN TECHNICIAN FUNCTIONALITY =========
const complaintSelect = document.getElementById('complaintSelect');
const prioritySelect = document.getElementById('prioritySelect');
const technicianSelect = document.getElementById('technicianSelect');
const etaInput = document.getElementById('etaInput');
const assignBtn = document.getElementById('assignBtn');
const resetBtn = document.getElementById('resetBtn');

// Store assignments history
let assignments = [
    { complaint: "CMP-10234", issue: "Broadband outage", technician: "Armaan J", priority: "Critical", assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { complaint: "CMP-10567", issue: "No internet connection", technician: "Rahul K", priority: "High", assignedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { complaint: "CMP-10892", issue: "Voice call issue", technician: "Vikram S", priority: "Medium", assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
];

// Function to update recent assignments list
function updateRecentAssignments() {
    const container = document.getElementById('recentAssignmentsList');
    if (!container) return;
    
    if (assignments.length === 0) {
        container.innerHTML = '<div class="empty-state">No assignments yet</div>';
        return;
    }
    
    container.innerHTML = assignments.slice(0, 5).map(ass => {
        let priorityClass = '';
        if (ass.priority === 'Critical') priorityClass = 'critical';
        else if (ass.priority === 'High') priorityClass = 'high';
        else if (ass.priority === 'Medium') priorityClass = 'medium';
        else priorityClass = 'low';
        
        const timeAgo = getTimeAgo(ass.assignedAt);
        
        return `
            <div class="assignment-item">
                <div><strong>${ass.complaint}</strong><br><small>${ass.issue}</small></div>
                <div>${ass.technician} → <span class="status-badge ${priorityClass}">${ass.priority}</span></div>
                <div><small>${timeAgo}</small></div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Global function to select technician from cards
window.selectTechnician = function(techName) {
    if (technicianSelect) {
        for (let i = 0; i < technicianSelect.options.length; i++) {
            if (technicianSelect.options[i].value === techName) {
                technicianSelect.selectedIndex = i;
                break;
            }
        }
    }
    showToast(`Technician ${techName} selected`, 'success');
};

// Assign button click handler
if (assignBtn) {
    assignBtn.addEventListener('click', () => {
        const complaint = complaintSelect ? complaintSelect.value : '';
        const priority = prioritySelect ? prioritySelect.value : '';
        const technician = technicianSelect ? technicianSelect.value : '';
        const eta = etaInput ? etaInput.value : '';
        
        if (!complaint) {
            showToast('Please select a complaint', 'error');
            return;
        }
        
        if (!technician) {
            showToast('Please select a technician', 'error');
            return;
        }
        
        // Get complaint issue text
        let issueText = '';
        if (complaintSelect) {
            const selectedOption = complaintSelect.options[complaintSelect.selectedIndex];
            issueText = selectedOption.text.split(' - ')[1] || 'Complaint';
        }
        
        // Add to assignments
        const newAssignment = {
            complaint: complaint,
            issue: issueText,
            technician: technician,
            priority: priority,
            assignedAt: new Date()
        };
        
        assignments.unshift(newAssignment);
        updateRecentAssignments();
        
        // Show success message
        showToast(`Technician ${technician} assigned to ${complaint} with ${priority} priority. ETA: ${eta || 'Not set'}`, 'success');
        
        // Optional: Reset form after successful assignment
        if (resetBtn) {
            // Don't auto-reset, let user decide
        }
    });
}

// Reset button handler
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (complaintSelect) complaintSelect.selectedIndex = 0;
        if (prioritySelect) prioritySelect.selectedIndex = 0;
        if (technicianSelect) technicianSelect.selectedIndex = 0;
        if (etaInput) etaInput.value = '';
        showToast('Form reset', 'info');
    });
}

// Toast function
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

// Initialize recent assignments on load
updateRecentAssignments();

// Export for global use
window.showToast = showToast;