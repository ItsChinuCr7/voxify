// support-dashboard.js - Support Agent Dashboard Functionality

// DOM Elements
let trendChart, categoryChart;

// Sample Data
const ticketsData = [
    { id: 'TKT-9921', customer: 'John Doe', issue: 'Internet connectivity issue', priority: 'critical', status: 'open', created: '2025-04-17T10:30:00' },
    { id: 'TKT-9920', customer: 'Sarah Johnson', issue: 'Slow broadband speed', priority: 'high', status: 'in-progress', created: '2025-04-17T09:15:00' },
    { id: 'TKT-9919', customer: 'Mike Chen', issue: 'Voice call dropping', priority: 'medium', status: 'open', created: '2025-04-17T08:45:00' },
    { id: 'TKT-9918', customer: 'Priya Sharma', issue: 'No internet connection', priority: 'critical', status: 'in-progress', created: '2025-04-17T08:00:00' },
    { id: 'TKT-9917', customer: 'Arjun Reddy', issue: 'Billing dispute', priority: 'low', status: 'open', created: '2025-04-16T18:30:00' },
    { id: 'TKT-9916', customer: 'Neha Gupta', issue: 'Fiber cut complaint', priority: 'critical', status: 'in-progress', created: '2025-04-16T14:20:00' },
    { id: 'TKT-9915', customer: 'Vikram Singh', issue: 'Router configuration', priority: 'medium', status: 'resolved', created: '2025-04-16T11:00:00' },
];

const trendData = {
    '7': [42, 38, 45, 52, 48, 55, 47],
    '30': [180, 175, 190, 185, 195, 200, 188, 192, 185, 178, 182, 190, 195, 188, 192, 185, 178, 182, 190, 195, 188, 192, 185, 178, 182, 190, 195, 188, 192, 185]
};

const categoryData = {
    labels: ['Network', 'Billing', 'Service', 'Outage', 'Other'],
    values: [45, 20, 15, 12, 8]
};

// ================= PROFILE DROPDOWN =================
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
}

/*// ================= STATUS DROPDOWN =================
const statusQuickBtn = document.getElementById('statusQuickBtn');
const statusDropdown = document.getElementById('statusDropdown');

if (statusQuickBtn && statusDropdown) {
    statusQuickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusDropdown.classList.toggle('show');
    });
}
*/
// Close dropdowns when clicking outside
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
// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadRecentTickets();
    updateStats();
    setupEventListeners();
    startAutoRefresh();
});

// Initialize Charts
function initializeCharts() {
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Tickets',
                data: trendData['7'],
                borderColor: '#1F4FD8',
                backgroundColor: 'rgba(31, 79, 216, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#1F4FD8',
                pointBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.values,
                backgroundColor: ['#1F4FD8', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 } } }
            }
        }
    });
}

// Load Recent Tickets
function loadRecentTickets() {
    const tbody = document.getElementById('recentTicketsBody');
    if (!tbody) return;

    const recentTickets = ticketsData.slice(0, 5);
    tbody.innerHTML = recentTickets.map(ticket => `
        <tr>
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.customer}</td>
            <td>${ticket.issue}</td>
            <td><span class="priority-badge ${ticket.priority}">${ticket.priority.toUpperCase()}</span></td>
            <td><span class="status-badge ${ticket.status}">${ticket.status.toUpperCase()}</span></td>
            <td><button class="action-btn" onclick="viewTicket('${ticket.id}')">View</button></td>
        </tr>
    `).join('');
}

// Update Stats
function updateStats() {
    const openCount = ticketsData.filter(t => t.status === 'open').length;
    const inProgressCount = ticketsData.filter(t => t.status === 'in-progress').length;
    const resolvedCount = ticketsData.filter(t => t.status === 'resolved').length;
    const criticalCount = ticketsData.filter(t => t.priority === 'critical').length;
    const highCount = ticketsData.filter(t => t.priority === 'high').length;
    const mediumCount = ticketsData.filter(t => t.priority === 'medium').length;
    const lowCount = ticketsData.filter(t => t.priority === 'low').length;

    document.getElementById('openTickets').textContent = openCount;
    document.getElementById('inProgressTickets').textContent = inProgressCount;
    document.getElementById('resolvedToday').textContent = resolvedCount;
    document.getElementById('escalatedTickets').textContent = criticalCount;
    
    document.getElementById('criticalCount').textContent = criticalCount;
    document.getElementById('highCount').textContent = highCount;
    document.getElementById('mediumCount').textContent = mediumCount;
    document.getElementById('lowCount').textContent = lowCount;
}

// View Ticket Details
function viewTicket(ticketId) {
    showToast(`Viewing ticket ${ticketId}`, 'info');
    // In production, open modal or navigate to ticket details
}

// Change Trend Period
function changeTrendPeriod(period) {
    const days = parseInt(period);
    const labels = days === 7 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : 
                   Array.from({length: days}, (_, i) => `Day ${i+1}`);
    const data = days === 7 ? trendData['7'] : trendData['30'].slice(0, days);
    
    trendChart.data.labels = labels;
    trendChart.data.datasets[0].data = data;
    trendChart.update();
}

// Refresh Activity Feed
function refreshActivityFeed() {
    const feed = document.getElementById('activityFeed');
    const newActivity = {
        time: 'Just now',
        text: 'Manual refresh - Dashboard updated',
        type: 'update'
    };
    
    const newItem = document.createElement('div');
    newItem.className = 'activity-item';
    newItem.innerHTML = `
        <span class="activity-time">${newActivity.time}</span>
        <span class="activity-text">${newActivity.text}</span>
        <span class="activity-badge update">Update</span>
    `;
    
    feed.insertBefore(newItem, feed.firstChild);
    if (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
    
    showToast('Activity feed refreshed', 'success');
}

// Setup Event Listeners
function setupEventListeners() {
    // Trend period change
    const periodSelect = document.getElementById('trendPeriod');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => changeTrendPeriod(e.target.value));
    }
    
    // Refresh activity button
    const refreshBtn = document.getElementById('refreshActivityBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshActivityFeed);
    }
    
    // View all tickets button
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'ticket-operations.html';
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                showToast(`Searching for: ${e.target.value}`, 'info');
            }
        });
    }
}

// Auto Refresh (every 30 seconds)
let refreshInterval;
function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        // Simulate new ticket arrival
        simulateNewTicket();
    }, 30000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// Simulate new ticket (for demo)
function simulateNewTicket() {
    const customers = ['Rajesh K', 'Sneha M', 'Amit P', 'Divya L', 'Karthik S'];
    const issues = ['Network issue', 'Billing error', 'Service outage', 'Slow speed', 'Connection drop'];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomIssue = issues[Math.floor(Math.random() * issues.length)];
    const newTicketId = `TKT-${Math.floor(Math.random() * 9000 + 1000)}`;
    
    // Add to activity feed
    const feed = document.getElementById('activityFeed');
    const newItem = document.createElement('div');
    newItem.className = 'activity-item';
    newItem.innerHTML = `
        <span class="activity-time">Just now</span>
        <span class="activity-text">New ticket #${newTicketId} created by ${randomCustomer} - ${randomIssue}</span>
        <span class="activity-badge new">New</span>
    `;
    
    feed.insertBefore(newItem, feed.firstChild);
    if (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
    
    // Show toast notification
    showToast(`New ticket #${newTicketId} received!`, 'info');
}

// Show Toast Message
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.classList.add('show');
    
    // Change toast color based on type
    toast.style.background = type === 'error' ? '#EF4444' : 
                            type === 'warning' ? '#F59E0B' : 
                            type === 'info' ? '#1F4FD8' : '#10B981';
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.style.background = '';
    }, 3000);
}

// Export functions for global use
window.viewTicket = viewTicket;
window.showToast = showToast;
window.changeTrendPeriod = changeTrendPeriod;