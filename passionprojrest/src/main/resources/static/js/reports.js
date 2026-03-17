let statusChart = null;

document.addEventListener('DOMContentLoaded', () => {
    loadReport();
    document.getElementById('btn-refresh-report').addEventListener('click', loadReport);
});

async function loadReport() {
    const btn = document.getElementById('btn-refresh-report');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span>Loading...`;

    try {
        const report = await getExpirationSummary();
        renderSummaryCards(report);
        renderStatusChart(report);
        renderTopExpiringTable(report.topExpiringItems);
        checkExpiredWarning(report);
    } catch (error) {
        showAlert('Failed to load report. Please try again.', 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Refresh';
    }
}

function checkExpiredWarning(report) {
    const container = document.getElementById('alert-container');
    if (report.totalActive > 0 && (report.expiredCount / report.totalActive) > 0.3) {
        container.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                ⚠️ <strong>${report.expiredCount} of your ${report.totalActive} active items are expired.</strong>
                Consider reviewing your fridge and discarding or consuming them.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
    } else {
        container.innerHTML = '';
    }
}

function renderSummaryCards(report) {
    document.getElementById('report-total-active').textContent = report.totalActive;
    document.getElementById('report-fresh').textContent = report.freshCount;
    document.getElementById('report-expiring-soon').textContent = report.expiringSoonCount;
    document.getElementById('report-expired').textContent = report.expiredCount;
}

function renderTopExpiringTable(items) {
    const tbody = document.getElementById('report-table-body');

    if (!items || items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No active items found.</td></tr>`;
        return;
    }

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>
                <a href="https://www.google.com/search?q=recipes+with+${encodeURIComponent(item.name)}"
                   target="_blank" class="text-decoration-none">${item.name}</a>
            </td>
            <td>${formatCategory(item.category)}</td>
            <td>${formatDate(item.expiryDate)}</td>
            <td>${formatDaysRemaining(item.expiryDate)}</td>
            <td>${item.quantity}</td>
            <td>${formatStatusBadge(item.status)}</td>
        </tr>
    `).join('');
}

function renderStatusChart(report) {
    const ctx = document.getElementById('status-chart').getContext('2d');

    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fresh', 'Expiring Soon', 'Expired'],
            datasets: [{
                data: [report.freshCount, report.expiringSoonCount, report.expiredCount],
                backgroundColor: ['#198754', '#ffc107', '#dc3545'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function formatCategory(category) {
    if (!category) return '—';
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

function formatDaysRemaining(dateStr) {
    if (!dateStr) return '—';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr + 'T00:00:00');
    const days = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

    if (days === 0) return `<span class="badge bg-warning text-dark">Today</span>`;
    if (days > 0) return `<span class="badge bg-success">${days} day${days === 1 ? '' : 's'}</span>`;
    return `<span class="badge bg-danger">${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago</span>`;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function formatStatusBadge(status) {
    const badges = {
        FRESH: 'bg-success',
        EXPIRING_SOON: 'bg-warning text-dark',
        EXPIRED: 'bg-danger',
        CONSUMED: 'bg-secondary',
        DISCARDED: 'bg-dark'
    };
    const cls = badges[status] || 'bg-secondary';
    return `<span class="badge ${cls}">${status.replace('_', ' ')}</span>`;
}

function showAlert(message, type) {
    const container = document.getElementById('alert-container');
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}
