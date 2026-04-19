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

// ========= STAR RATING =========
let currentRating = 0;
const stars = document.querySelectorAll('.star');
const ratingText = document.getElementById('ratingText');

stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
        const value = parseInt(star.dataset.value);
        highlightStars(value);
    });

    star.addEventListener('mouseleave', () => {
        highlightStars(currentRating);
    });

    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.value);
        highlightStars(currentRating);
        const ratingMessages = {
            1: 'Very Poor - We will work harder',
            2: 'Poor - Needs improvement',
            3: 'Average - Could be better',
            4: 'Good - Satisfied',
            5: 'Excellent - Very satisfied!'
        };
        ratingText.textContent = ratingMessages[currentRating] || 'Select a rating';
        ratingText.style.color = currentRating >= 4 ? 'var(--success-green)' : currentRating === 3 ? 'var(--warning-amber)' : 'var(--error-red)';
    });
});

function highlightStars(value) {
    stars.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        if (starValue <= value) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
}

// ========= CHARACTER COUNTER =========
const feedbackMessage = document.getElementById('feedbackMessage');
const charCount = document.getElementById('charCount');

if (feedbackMessage) {
    feedbackMessage.addEventListener('input', () => {
        const len = feedbackMessage.value.length;
        charCount.textContent = `${len} / 500 characters`;
        if (len > 500) {
            charCount.style.color = 'var(--error-red)';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    });
}

// ========= RECOMMENDATION BUTTONS =========
let currentRecommend = null;
const recBtns = document.querySelectorAll('.rec-btn');

recBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const recommend = btn.dataset.recommend;
        currentRecommend = recommend;
        
        recBtns.forEach(b => {
            b.classList.remove('selected-yes', 'selected-maybe', 'selected-no');
        });
        
        if (recommend === 'yes') btn.classList.add('selected-yes');
        else if (recommend === 'maybe') btn.classList.add('selected-maybe');
        else if (recommend === 'no') btn.classList.add('selected-no');
    });
});

// ========= STORAGE FUNCTIONS =========
function loadFeedback() {
    const stored = localStorage.getItem('voxify_feedback');
    return stored ? JSON.parse(stored) : [];
}

function saveFeedback(feedback) {
    localStorage.setItem('voxify_feedback', JSON.stringify(feedback));
}

function renderRecentFeedback() {
    const container = document.getElementById('recentFeedbackList');
    const countSpan = document.getElementById('feedbackCount');
    const feedbacks = loadFeedback();
    
    if (!container) return;
    
    if (feedbacks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💬</div>
                <p>No feedback yet</p>
                <span>Be the first to share your experience</span>
            </div>
        `;
        if (countSpan) countSpan.textContent = '0';
        return;
    }
    
    if (countSpan) countSpan.textContent = feedbacks.length;
    
    container.innerHTML = feedbacks.slice(0, 10).map(fb => `
        <div class="feedback-item">
            <div class="feedback-header">
                <div class="feedback-stars">${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}</div>
                <div class="feedback-date">${fb.date}</div>
            </div>
            <div class="feedback-category">${fb.category || 'General'}</div>
            <div class="feedback-message">${escapeHtml(fb.message.substring(0, 150))}${fb.message.length > 150 ? '...' : ''}</div>
            <div class="feedback-recommend">
                <span>${getRecommendIcon(fb.recommend)}</span>
                <span>${getRecommendText(fb.recommend)}</span>
            </div>
        </div>
    `).join('');
}

function getRecommendIcon(recommend) {
    if (recommend === 'yes') return '👍';
    if (recommend === 'maybe') return '🤔';
    if (recommend === 'no') return '👎';
    return '💬';
}

function getRecommendText(recommend) {
    if (recommend === 'yes') return 'Would recommend';
    if (recommend === 'maybe') return 'Might recommend';
    if (recommend === 'no') return 'Would not recommend';
    return 'No recommendation';
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========= SUBMIT FEEDBACK =========
function submitFeedback() {
    if (currentRating === 0) {
        showToast('Please select a rating', 'error');
        return;
    }
    
    const category = document.getElementById('feedbackCategory')?.value || '';
    const message = document.getElementById('feedbackMessage')?.value.trim() || '';
    
    if (!message) {
        showToast('Please enter your feedback', 'error');
        return;
    }
    
    if (message.length > 500) {
        showToast('Feedback message cannot exceed 500 characters', 'error');
        return;
    }
    
    const feedback = {
        id: Date.now(),
        rating: currentRating,
        category: category,
        message: message,
        recommend: currentRecommend,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        timestamp: new Date().toISOString()
    };
    
    const feedbacks = loadFeedback();
    feedbacks.unshift(feedback);
    saveFeedback(feedbacks);
    
    showToast('Thank you for your feedback! 🙏', 'success');
    clearForm();
    renderRecentFeedback();
}

function clearForm() {
    currentRating = 0;
    highlightStars(0);
    ratingText.textContent = 'Select a rating';
    ratingText.style.color = 'var(--text-secondary)';
    
    document.getElementById('feedbackCategory').selectedIndex = 0;
    document.getElementById('feedbackMessage').value = '';
    charCount.textContent = '0 / 500 characters';
    charCount.style.color = 'var(--text-secondary)';
    
    currentRecommend = null;
    recBtns.forEach(btn => {
        btn.classList.remove('selected-yes', 'selected-maybe', 'selected-no');
    });
}

// ========= BUTTON HANDLERS =========
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
    submitBtn.addEventListener('click', submitFeedback);
}

const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', clearForm);
}

// ========= TOAST FUNCTION =========
let toastTimer;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const icon = toast?.querySelector('svg');
    
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
renderRecentFeedback();

// Make functions global
window.showToast = showToast;
window.submitFeedback = submitFeedback;