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
            sidebar.classList.toggle('mobile-open');
            if (overlay) overlay.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            if (layout) layout.classList.toggle('sidebar-collapsed');
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

// ========= FAQ DATA =========
const faqs = [
    // Getting Started
    { id: 1, category: 'getting-started', question: 'How do I create an account on VOXIFY?', answer: 'Click on the "Register" button on the login page. Fill in your name, email address, phone number, and create a strong password. You will receive a verification email. Click the link in the email to activate your account.', helpful: 0 },
    { id: 2, category: 'getting-started', question: 'How do I reset my password?', answer: 'On the login page, click "Forgot Password". Enter your registered email address. You will receive a password reset link via email. Click the link and follow the instructions to create a new password.', helpful: 0 },
    { id: 3, category: 'getting-started', question: 'Is VOXIFY free to use?', answer: 'Yes, VOXIFY is completely free for all citizens. There are no charges for submitting complaints, tracking status, or receiving updates. We are a public service platform dedicated to helping citizens report issues efficiently.', helpful: 0 },
    
    // Complaints
    { id: 4, category: 'complaints', question: 'How do I submit a complaint?', answer: 'Go to the "Submit Complaint" page from the sidebar menu. Fill in all required details including your contact information, complaint category, complete address, and a detailed description of the issue. You can also attach supporting documents like photos or bills. Click "Submit Complaint" to register.', helpful: 0 },
    { id: 5, category: 'complaints', question: 'What types of complaints can I submit?', answer: 'You can submit complaints related to: Network Issues (broadband, mobile data, WiFi), Power Outages, Billing Issues (incorrect charges, payment problems), Service Delays, Infrastructure Problems (roads, street lights, drainage), and Other general issues.', helpful: 0 },
    { id: 6, category: 'complaints', question: 'Can I edit my complaint after submitting?', answer: 'Once a complaint is submitted, you cannot edit it directly. However, you can add comments or additional information by contacting support with your complaint ID. For critical changes, please contact our support team.', helpful: 0 },
    { id: 7, category: 'complaints', question: 'What happens after I submit a complaint?', answer: 'After submission, you receive a unique Complaint ID. The complaint goes through these stages: Submitted → Acknowledged → Categorized & Prioritized → Assigned to Team → In Progress → Resolved → Closed. You can track progress using the Complaint ID.', helpful: 0 },
    
    // Tracking
    { id: 8, category: 'tracking', question: 'How can I track my complaint status?', answer: 'Go to the "Track Status" page from the sidebar. Enter your Complaint ID (e.g., CMP-2025-1234). You will see the current status, assigned team/technician, and a complete timeline of actions taken on your complaint.', helpful: 0 },
    { id: 9, category: 'tracking', question: 'What do the different status meanings?', answer: 'Open: Complaint received but not yet assigned. In Progress: Team is actively working on resolution. Resolved: Issue has been fixed and verified. Closed: Ticket closed after feedback. Pending: Waiting for additional information or parts.', helpful: 0 },
    { id: 10, category: 'tracking', question: 'How will I receive updates about my complaint?', answer: 'You will receive updates via email, SMS, and in-app notifications based on your notification preferences. You can also check real-time status on the Track Status page anytime.', helpful: 0 },
    
    // Account
    { id: 11, category: 'account', question: 'How do I update my profile information?', answer: 'Go to "Profile & Settings" from the sidebar. You can update your name, email address, phone number, address, and other personal information. Click "Save Changes" to update your profile.', helpful: 0 },
    { id: 12, category: 'account', question: 'How do I change my notification preferences?', answer: 'Go to Settings > Notifications. You can toggle email notifications, SMS alerts, and push notifications for complaint updates, outage alerts, promotional messages, and weekly summaries.', helpful: 0 },
    { id: 13, category: 'account', question: 'Can I delete my account?', answer: 'Yes, you can delete your account from Settings > Account. Go to the Danger Zone section and click "Delete Account". Please note this action is permanent and will remove all your complaint data.', helpful: 0 },
    
    // Billing
    { id: 14, category: 'billing', question: 'Why was I charged incorrectly on my bill?', answer: 'Billing issues can occur due to system errors, plan changes, or promotional offers. Please submit a complaint with the "Billing Issue" category, mentioning your bill amount, billing period, and the discrepancy. Our team will investigate and resolve.', helpful: 0 },
    { id: 15, category: 'billing', question: 'How do I get a refund?', answer: 'If you believe you are eligible for a refund, please submit a billing complaint with supporting documents (bill copy, payment receipt). Our billing team will review and process refunds within 7-10 business days if approved.', helpful: 0 },
    
    // Technical
    { id: 16, category: 'technical', question: 'Why is the website loading slowly?', answer: 'Slow loading could be due to high traffic on our platform, your internet connection speed, or browser cache issues. Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our support team.', helpful: 0 },
    { id: 17, category: 'technical', question: 'How do I enable browser notifications?', answer: 'Go to Settings > Notifications and enable "Push Notifications". You will see a browser prompt asking for permission. Click "Allow" to receive real-time notifications about your complaints and outages.', helpful: 0 },
    { id: 18, category: 'technical', question: 'Is my data secure on VOXIFY?', answer: 'Yes, we take data security seriously. All data is encrypted in transit and at rest. We follow industry best practices for security and comply with data protection regulations. Your personal information is never shared without your consent.', helpful: 0 },
    
    // Privacy & Security
    { id: 19, category: 'privacy', question: 'How is my personal information protected?', answer: 'We use encryption, secure servers, and strict access controls to protect your data. We never sell your personal information to third parties. You can review our full Privacy Policy for more details.', helpful: 0 },
    { id: 20, category: 'privacy', question: 'Can others see my complaints?', answer: 'Your complaints are private and visible only to you and authorized VOXIFY support personnel. Your personal information is never publicly displayed. You can choose to share your complaint ID with support for assistance.', helpful: 0 }
];

let currentCategory = 'all';
let currentSearchTerm = '';
let helpfulCount = 0;

// ========= RENDER FUNCTIONS =========
function renderFAQs() {
    const container = document.getElementById('faqAccordion');
    const noResultsDiv = document.getElementById('noResults');
    const totalFaqsSpan = document.getElementById('totalFaqs');
    const displayedFaqsSpan = document.getElementById('displayedFaqs');
    const helpfulCountSpan = document.getElementById('helpfulCount');
    
    if (!container) return;
    
    // Calculate helpful count
    helpfulCount = faqs.reduce((sum, f) => sum + (f.helpful || 0), 0);
    if (helpfulCountSpan) helpfulCountSpan.textContent = helpfulCount;
    if (totalFaqsSpan) totalFaqsSpan.textContent = faqs.length;
    
    let filtered = faqs;
    if (currentCategory !== 'all') {
        filtered = faqs.filter(f => f.category === currentCategory);
    }
    if (currentSearchTerm) {
        filtered = filtered.filter(f => 
            f.question.toLowerCase().includes(currentSearchTerm.toLowerCase()) || 
            f.answer.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }
    
    if (displayedFaqsSpan) displayedFaqsSpan.textContent = filtered.length;
    
    if (filtered.length === 0) {
        container.innerHTML = '';
        if (noResultsDiv) noResultsDiv.style.display = 'block';
        return;
    }
    
    if (noResultsDiv) noResultsDiv.style.display = 'none';
    
    container.innerHTML = filtered.map(faq => {
        let categoryLabel = '';
        switch(faq.category) {
            case 'getting-started': categoryLabel = '🚀 Getting Started'; break;
            case 'complaints': categoryLabel = '📝 Complaints'; break;
            case 'tracking': categoryLabel = '📍 Tracking'; break;
            case 'account': categoryLabel = '👤 Account'; break;
            case 'billing': categoryLabel = '💰 Billing'; break;
            case 'technical': categoryLabel = '🔧 Technical'; break;
            case 'privacy': categoryLabel = '🔒 Privacy & Security'; break;
            default: categoryLabel = 'General';
        }
        
        return `<div class="faq-item" data-id="${faq.id}">
            <div class="faq-question">
                <span>${faq.question}</span>
                <span class="icon">▼</span>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
                <span class="faq-category">${categoryLabel}</span>
                <button class="helpful-btn" onclick="markHelpful(${faq.id})">👍 Was this helpful? (${faq.helpful || 0})</button>
            </div>
        </div>`;
    }).join('');
    
    // Attach click events to FAQ questions
    document.querySelectorAll('.faq-item .faq-question').forEach(q => {
        q.removeEventListener('click', handleFAQClick);
        q.addEventListener('click', handleFAQClick);
    });
}

function handleFAQClick(e) {
    const questionDiv = e.currentTarget;
    const answerDiv = questionDiv.nextElementSibling;
    const icon = questionDiv.querySelector('.icon');
    
    if (answerDiv) {
        answerDiv.classList.toggle('show');
        if (icon) {
            icon.style.transform = answerDiv.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
        }
    }
}

// ========= MARK HELPFUL =========
window.markHelpful = function(id) {
    const faq = faqs.find(f => f.id === id);
    if (faq) {
        faq.helpful = (faq.helpful || 0) + 1;
        renderFAQs();
        showToast('Thank you for your feedback!', 'success');
    }
};

// ========= SEARCH FUNCTIONALITY =========
const searchInput = document.getElementById('searchFaqs');
const searchBanner = document.getElementById('searchResultsBanner');
const searchTermSpan = document.getElementById('searchTerm');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const resetSearchBtn = document.getElementById('resetSearchBtn');

function performSearch() {
    if (!searchInput) return;
    currentSearchTerm = searchInput.value.trim();
    
    if (currentSearchTerm) {
        if (searchTermSpan) searchTermSpan.textContent = currentSearchTerm;
        if (searchBanner) searchBanner.style.display = 'flex';
        document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
        currentCategory = 'all';
    } else {
        if (searchBanner) searchBanner.style.display = 'none';
    }
    renderFAQs();
}

if (searchInput) {
    searchInput.addEventListener('input', performSearch);
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentSearchTerm = '';
        if (searchBanner) searchBanner.style.display = 'none';
        renderFAQs();
    });
}

if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentSearchTerm = '';
        if (searchBanner) searchBanner.style.display = 'none';
        renderFAQs();
    });
}

// ========= CATEGORY FILTERS =========
const catTabs = document.querySelectorAll('.cat-tab');
catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-cat');
        if (currentSearchTerm) {
            currentSearchTerm = '';
            if (searchInput) searchInput.value = '';
            if (searchBanner) searchBanner.style.display = 'none';
        }
        renderFAQs();
    });
});

// ========= CONTACT MODAL =========
const supportModal = document.getElementById('supportModal');
const contactSupportBtn = document.getElementById('contactSupportBtn');
const liveChatBtn = document.getElementById('liveChatBtn');
const closeSupportModalBtn = document.getElementById('closeSupportModal');
const cancelSupportBtn = document.getElementById('cancelSupportBtn');
const sendSupportBtn = document.getElementById('sendSupportBtn');
const supportForm = document.getElementById('supportForm');

function openSupportModal() {
    if (supportModal) supportModal.classList.add('show');
}

function closeSupportModal() {
    if (supportModal) supportModal.classList.remove('show');
}

if (contactSupportBtn) {
    contactSupportBtn.addEventListener('click', openSupportModal);
}
if (liveChatBtn) {
    liveChatBtn.addEventListener('click', () => showToast('Live chat connecting...', 'info'));
}
if (closeSupportModalBtn) {
    closeSupportModalBtn.addEventListener('click', closeSupportModal);
}
if (cancelSupportBtn) {
    cancelSupportBtn.addEventListener('click', closeSupportModal);
}
if (sendSupportBtn) {
    sendSupportBtn.addEventListener('click', () => {
        const name = document.getElementById('supportName');
        const email = document.getElementById('supportEmail');
        const subject = document.getElementById('supportSubject');
        const message = document.getElementById('supportMessage');
        
        if (!name || !name.value.trim()) {
            showToast('Please enter your name', 'error');
            return;
        }
        if (!email || !email.value.trim()) {
            showToast('Please enter your email', 'error');
            return;
        }
        if (!subject || !subject.value.trim()) {
            showToast('Please enter a subject', 'error');
            return;
        }
        if (!message || !message.value.trim()) {
            showToast('Please enter your message', 'error');
            return;
        }
        
        showToast('Support request sent successfully! We will respond within 24 hours.', 'success');
        closeSupportModal();
        if (supportForm) supportForm.reset();
    });
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (supportModal && e.target === supportModal) closeSupportModal();
});

// ========= TOAST FUNCTION =========
let toastTimer;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const icon = toast ? toast.querySelector('svg') : null;
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.className = 'toast ' + type;
    
    if (icon) {
        if (type === 'error') {
            icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
            toast.style.background = '#b82030';
        } else if (type === 'info') {
            icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>';
            toast.style.background = '#1a1a1a';
        } else {
            icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
            toast.style.background = '#1a1a1a';
        }
    }
    
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========= INITIAL RENDER =========
renderFAQs();

// Make functions available globally
window.showToast = showToast;
window.markHelpful = markHelpful;