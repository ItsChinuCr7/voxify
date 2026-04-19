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
    { id: 1, category: 'getting-started', question: 'How do I create an account?', answer: 'Click on the "Register" button on the login page. Fill in your name, email, phone number, and create a password. You will receive a verification email to activate your account.' },
    { id: 2, category: 'getting-started', question: 'How do I reset my password?', answer: 'On the login page, click "Forgot Password". Enter your registered email address. You will receive a password reset link. Follow the instructions to set a new password.' },
    { id: 3, category: 'complaints', question: 'How do I submit a complaint?', answer: 'Go to the "Submit Complaint" page from the sidebar. Fill in all required details including your contact information, complaint category, address, and description. Click "Submit Complaint" to register.' },
    { id: 4, category: 'complaints', question: 'How can I track my complaint status?', answer: 'Go to the "Track Status" page and enter your complaint ID. You can also view all your complaints from the "My Complaints" section in the sidebar.' },
    { id: 5, category: 'account', question: 'How do I update my profile information?', answer: 'Go to "Profile & Settings" from the sidebar. You can update your name, email, phone number, address, and other personal information. Click "Save Changes" to update.' },
    { id: 6, category: 'account', question: 'How do I change my notification preferences?', answer: 'Go to "Settings" > "Notifications". You can toggle email, SMS, and push notifications for complaint updates, outage alerts, and promotional messages.' },
    { id: 7, category: 'billing', question: 'Is there any charge for submitting complaints?', answer: 'No, submitting complaints through VOXIFY is completely free for all citizens. We are a public service platform dedicated to helping citizens report issues.' },
    { id: 8, category: 'billing', question: 'How do I report a billing issue?', answer: 'Select "Billing Issue" as the complaint category when submitting your complaint. Provide details about the incorrect charge, bill amount, and billing period.' },
    { id: 9, category: 'technical', question: 'Why is the website loading slowly?', answer: 'Slow loading could be due to high traffic or your internet connection. Try refreshing the page or clearing your browser cache. If the issue persists, contact our support team.' },
    { id: 10, category: 'technical', question: 'How do I enable notifications?', answer: 'Go to Settings > Notifications and enable the types of notifications you want to receive. Also ensure your browser allows notifications for our website.' }
];

const featuredArticles = [
    { id: 1, category: 'getting-started', icon: '🚀', title: 'Getting Started with VOXIFY', desc: 'Learn the basics of using our complaint management system', content: '<p>Welcome to VOXIFY! This guide will help you get started with our platform.</p><h4>Step 1: Create an Account</h4><p>Register using your email and phone number. Verify your account through the email link.</p><h4>Step 2: Submit Your First Complaint</h4><p>Go to Submit Complaint, fill in the details, and submit. You will receive a complaint ID.</p><h4>Step 3: Track Status</h4><p>Use your complaint ID to track the progress in real-time.</p>' },
    { id: 2, category: 'complaints', icon: '📝', title: 'How to Submit a Complaint', desc: 'Step-by-step guide to registering a complaint', content: '<p>Follow these steps to submit a complaint:</p><ol><li>Navigate to "Submit Complaint" from the sidebar</li><li>Fill in your personal details (Name, Contact, Email)</li><li>Select the appropriate complaint category</li><li>Provide your complete address</li><li>Write a detailed description of the issue</li><li>Upload supporting documents (optional)</li><li>Click "Submit Complaint"</li></ol><p>You will receive a unique Complaint ID for tracking.</p>' },
    { id: 3, category: 'account', icon: '🔒', title: 'Account Security Tips', desc: 'Keep your account safe and secure', content: '<p>Protect your VOXIFY account with these tips:</p><ul><li>Use a strong, unique password</li><li>Enable two-factor authentication</li><li>Never share your password with anyone</li><li>Log out from shared devices</li><li>Update your recovery email and phone number</li></ul>' }
];

let currentCategory = 'all';
let currentSearchTerm = '';

// ========= RENDER FUNCTIONS =========
function renderFAQs() {
    const container = document.getElementById('faqGrid');
    if (!container) return;
    
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
    
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px;">No FAQs found matching your search.</div>';
        return;
    }
    
    container.innerHTML = filtered.map(faq => {
        return `<div class="faq-item">
            <div class="faq-question" data-id="${faq.id}">
                <span>${faq.question}</span>
                <span class="icon">▼</span>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>`;
    }).join('');
    
    // Attach click events to FAQ questions
    document.querySelectorAll('.faq-question').forEach(q => {
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

function renderFeatured() {
    const container = document.getElementById('featuredGrid');
    if (!container) return;
    
    let filtered = featuredArticles;
    if (currentCategory !== 'all') {
        filtered = featuredArticles.filter(a => a.category === currentCategory);
    }
    if (currentSearchTerm) {
        filtered = filtered.filter(a => 
            a.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) || 
            a.desc.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }
    
    if (filtered.length === 0 && currentSearchTerm) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = filtered.map(article => {
        return `<div class="featured-card" data-id="${article.id}">
            <div class="featured-icon">${article.icon}</div>
            <h3>${article.title}</h3>
            <p>${article.desc}</p>
        </div>`;
    }).join('');
    
    // Attach click events to featured cards
    document.querySelectorAll('.featured-card').forEach(card => {
        card.removeEventListener('click', handleArticleClick);
        card.addEventListener('click', handleArticleClick);
    });
}

function handleArticleClick(e) {
    const card = e.currentTarget;
    const id = parseInt(card.getAttribute('data-id'));
    const article = featuredArticles.find(a => a.id === id);
    if (article) {
        openArticle(article);
    }
}

function openArticle(article) {
    const modal = document.getElementById('articleModal');
    const titleEl = document.getElementById('articleModalTitle');
    const bodyEl = document.getElementById('articleModalBody');
    
    if (titleEl) titleEl.textContent = article.title;
    if (bodyEl) bodyEl.innerHTML = article.content;
    if (modal) modal.classList.add('show');
}

// ========= SEARCH FUNCTIONALITY =========
const searchInput = document.getElementById('searchHelp');
const searchBanner = document.getElementById('searchResultsBanner');
const searchTermSpan = document.getElementById('searchTerm');
const clearSearchBtn = document.getElementById('clearSearchBtn');

function performSearch() {
    if (!searchInput) return;
    currentSearchTerm = searchInput.value.trim();
    
    if (currentSearchTerm) {
        if (searchTermSpan) searchTermSpan.textContent = currentSearchTerm;
        if (searchBanner) searchBanner.style.display = 'flex';
        // Reset category tab highlight
        document.querySelectorAll('.cat-tab').forEach(tab => tab.classList.remove('active'));
        currentCategory = 'all';
    } else {
        if (searchBanner) searchBanner.style.display = 'none';
    }
    renderFeatured();
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
        renderFeatured();
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
        renderFeatured();
        renderFAQs();
    });
});

// ========= CONTACT BUTTONS =========
const startChatBtn = document.getElementById('startChatBtn');
const emailSupportBtn = document.getElementById('emailSupportBtn');
const callSupportBtn = document.getElementById('callSupportBtn');
const knowledgeBaseBtn = document.getElementById('knowledgeBaseBtn');
const submitRequestBtn = document.getElementById('submitRequestBtn');

if (startChatBtn) {
    startChatBtn.addEventListener('click', () => showToast('Live chat connecting...', 'info'));
}
if (emailSupportBtn) {
    emailSupportBtn.addEventListener('click', () => {
        window.location.href = 'mailto:support@voxify.com';
        showToast('Opening email client', 'info');
    });
}
if (callSupportBtn) {
    callSupportBtn.addEventListener('click', () => {
        window.location.href = 'tel:+911234567890';
        showToast('Calling support...', 'info');
    });
}
if (knowledgeBaseBtn) {
    knowledgeBaseBtn.addEventListener('click', () => showToast('Knowledge Base - More articles coming soon', 'info'));
}
if (submitRequestBtn) {
    submitRequestBtn.addEventListener('click', () => {
        const modal = document.getElementById('supportModal');
        if (modal) modal.classList.add('show');
    });
}

// ========= SUPPORT MODAL =========
const supportModal = document.getElementById('supportModal');
const closeSupportModalBtn = document.getElementById('closeSupportModal');
const cancelSupportBtn = document.getElementById('cancelSupportBtn');
const sendSupportBtn = document.getElementById('sendSupportBtn');
const supportForm = document.getElementById('supportForm');

function closeSupportModal() {
    if (supportModal) supportModal.classList.remove('show');
}

if (closeSupportModalBtn) {
    closeSupportModalBtn.addEventListener('click', closeSupportModal);
}
if (cancelSupportBtn) {
    cancelSupportBtn.addEventListener('click', closeSupportModal);
}
if (sendSupportBtn) {
    sendSupportBtn.addEventListener('click', () => {
        const subject = document.getElementById('supportSubject');
        const message = document.getElementById('supportMessage');
        
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

// ========= ARTICLE MODAL =========
const articleModal = document.getElementById('articleModal');
const closeArticleModalBtn = document.getElementById('closeArticleModal');
const articleModalCloseBtn = document.getElementById('articleModalCloseBtn');
const wasHelpfulBtn = document.getElementById('wasHelpfulBtn');

function closeArticleModal() {
    if (articleModal) articleModal.classList.remove('show');
}

if (closeArticleModalBtn) {
    closeArticleModalBtn.addEventListener('click', closeArticleModal);
}
if (articleModalCloseBtn) {
    articleModalCloseBtn.addEventListener('click', closeArticleModal);
}
if (wasHelpfulBtn) {
    wasHelpfulBtn.addEventListener('click', () => {
        showToast('Thank you for your feedback!', 'success');
        closeArticleModal();
    });
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (supportModal && e.target === supportModal) closeSupportModal();
    if (articleModal && e.target === articleModal) closeArticleModal();
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
renderFeatured();
renderFAQs();

// Make functions available globally
window.showToast = showToast;
window.openArticle = openArticle;