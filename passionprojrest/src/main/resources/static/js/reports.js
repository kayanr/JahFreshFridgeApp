let statusChart = null;
let wasteChart = null;
let lastUpdatedTime = null;
let lastUpdatedInterval = null;
let lastFetchedItems = [];
let lastReport = null;
let lastWaste = null;
let lastCategories = null;
let lastMonthly = null;

document.addEventListener('DOMContentLoaded', () => {
    loadReport();
    document.getElementById('btn-refresh-report').addEventListener('click', loadReport);
    document.getElementById('btn-export-full').addEventListener('click', exportFullReport);
});

async function loadReport() {
    const btn = document.getElementById('btn-refresh-report');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span>Loading...`;

    try {
        const [report, waste, categories, monthly] = await Promise.all([
            getExpirationSummary(), getWasteSummary(), getCategorySummary(), getMonthlyActivity()
        ]);
        lastReport = report;
        lastWaste = waste;
        lastCategories = categories;
        lastMonthly = monthly;
        renderSummaryCards(report);
        renderStatusChart(report);
        renderTopExpiringTable(report.topExpiringItems);
        checkExpiredWarning(report);
        renderWasteCards(waste);
        renderWasteChart(waste);
        renderCategoryTable(categories);
        renderMonthlyActivity(monthly);
    } catch (error) {
        showAlert('Failed to load report. Please try again.', 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Refresh';
        document.getElementById('btn-export-full').disabled = !lastReport;
        setLastUpdated();
    }
}

function setLastUpdated() {
    lastUpdatedTime = new Date();
    if (lastUpdatedInterval) clearInterval(lastUpdatedInterval);
    updateLastUpdatedDisplay();
    lastUpdatedInterval = setInterval(updateLastUpdatedDisplay, 60000);
}

function updateLastUpdatedDisplay() {
    const el = document.getElementById('last-updated');
    if (!lastUpdatedTime) return;
    const mins = Math.floor((new Date() - lastUpdatedTime) / 60000);
    el.textContent = mins === 0 ? 'Last updated: just now' : `Last updated: ${mins} min${mins > 1 ? 's' : ''} ago`;
}

function checkExpiredWarning(report) {
    const container = document.getElementById('alert-container');
    if (report.totalActive > 0 && (report.expiredCount / report.totalActive) > 0.3) {
        const wasteRate = Math.round((report.expiredCount / report.totalActive) * 1000) / 10;
        container.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                ⚠️ <strong>${report.expiredCount} of your ${report.totalActive} active items are expired.</strong>
                Review your fridge and take action to reduce waste.<br>
                <small>Expired Inventory Rate: <strong>${wasteRate}%</strong> this period.</small>
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
    lastFetchedItems = items || [];

    if (lastFetchedItems.length === 0) {
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
        statusChart = null;
    }

    if (report.totalActive === 0) {
        statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No active items'],
                datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { callbacks: { label: () => 'Add items to see breakdown' } }
                }
            }
        });
        return;
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
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
                            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderWasteCards(waste) {
    document.getElementById('waste-consumed').textContent = waste.consumedCount;
    document.getElementById('waste-discarded').textContent = waste.discardedCount;
    document.getElementById('waste-rate').textContent = waste.totalProcessed > 0 ? `${waste.wasteRate}%` : '—';

    const trendEl = document.getElementById('waste-rate-trend');
    if (waste.wasteRateTrend === null || waste.wasteRateTrend === undefined) {
        trendEl.textContent = '';
    } else if (waste.wasteRateTrend < 0) {
        trendEl.innerHTML = `<span style="color:#a8f0c6;">↓ ${Math.abs(waste.wasteRateTrend)}% from last month</span>`;
    } else if (waste.wasteRateTrend > 0) {
        trendEl.innerHTML = `<span style="color:#f8d7da;">↑ ${waste.wasteRateTrend}% from last month</span>`;
    } else {
        trendEl.innerHTML = `<span style="color:#fff9c4;">→ Same as last month</span>`;
    }
    const categoryEl = document.getElementById('waste-most-category');
    if (waste.mostWastedCategory) {
        categoryEl.textContent = `${formatCategory(waste.mostWastedCategory)} (${waste.mostWastedCategoryCount} item${waste.mostWastedCategoryCount !== 1 ? 's' : ''})`;
    } else {
        categoryEl.textContent = '—';
    }
}

function renderWasteChart(waste) {
    const ctx = document.getElementById('waste-chart').getContext('2d');

    if (wasteChart) {
        wasteChart.destroy();
        wasteChart = null;
    }

    if (waste.totalProcessed === 0) {
        wasteChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No processed items'],
                datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { callbacks: { label: () => 'Mark items consumed or discarded to see breakdown' } }
                }
            }
        });
        return;
    }

    wasteChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumed', 'Discarded'],
            datasets: [{
                data: [waste.consumedCount, waste.discardedCount],
                backgroundColor: ['#198754', '#dc3545'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
                            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderCategoryTable(categories) {
    const tbody = document.getElementById('category-table-body');

    if (!categories || categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No categorised items found.</td></tr>`;
        return;
    }

    tbody.innerHTML = categories.map(cat => {
        const total = cat.total || 1;
        const freshPct = Math.round((cat.freshCount / total) * 100);
        const expiringSoonPct = Math.round((cat.expiringSoonCount / total) * 100);
        const expiredPct = Math.round((cat.expiredCount / total) * 100);

        return `
        <tr>
            <td class="fw-semibold">${formatCategory(cat.category)}</td>
            <td>${cat.total}</td>
            <td><span class="badge bg-success">${cat.freshCount}</span></td>
            <td><span class="badge bg-warning text-dark">${cat.expiringSoonCount}</span></td>
            <td><span class="badge bg-danger">${cat.expiredCount}</span></td>
            <td>
                <div class="progress" style="height: 16px;">
                    <div class="progress-bar bg-success" style="width: ${freshPct}%" title="Fresh"></div>
                    <div class="progress-bar bg-warning" style="width: ${expiringSoonPct}%" title="Expiring Soon"></div>
                    <div class="progress-bar bg-danger" style="width: ${expiredPct}%" title="Expired"></div>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function renderMonthlyActivity(monthly) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('monthly-period').textContent = `${monthNames[monthly.month - 1]} ${monthly.year}`;

    const addedEl = document.getElementById('monthly-added');
    addedEl.textContent = monthly.itemsAdded > 0 ? monthly.itemsAdded : '—';

    const consumedEl = document.getElementById('monthly-consumed');
    consumedEl.textContent = monthly.itemsConsumed > 0 ? monthly.itemsConsumed : '—';

    const expiredEl = document.getElementById('monthly-expired');
    if (monthly.itemsExpired === 0) {
        expiredEl.innerHTML = '<span style="font-size: 1rem;">🎉 None!</span>';
    } else {
        expiredEl.textContent = monthly.itemsExpired;
    }
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


function exportFullReport() {
    if (!lastReport) return;

    const today = new Date();
    const monthNames = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];
    const sections = [];

    // Header
    sections.push('JahFresh Fridge — Full Report');
    sections.push(`Export Date,${today.toISOString().slice(0, 10)}`);
    sections.push('');

    // Expiration Summary
    sections.push('=== EXPIRATION SUMMARY ===');
    sections.push(`Total Active,${lastReport.totalActive}`);
    sections.push(`Fresh,${lastReport.freshCount}`);
    sections.push(`Expiring Soon,${lastReport.expiringSoonCount}`);
    sections.push(`Expired,${lastReport.expiredCount}`);
    sections.push('');

    // Items Requiring Attention
    sections.push('Items Requiring Attention');
    sections.push('Name,Category,Expiry Date,Days Left,Quantity,Status');
    if (lastFetchedItems.length === 0) {
        sections.push('No active items');
    } else {
        lastFetchedItems.forEach(item => {
            const expiry = new Date(item.expiryDate + 'T00:00:00');
            const days = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
            const daysLabel = days === 0 ? 'Today' : days > 0 ? `${days} day(s)` : `${Math.abs(days)} day(s) ago`;
            sections.push([
                `"${item.name}"`,
                formatCategory(item.category),
                formatDate(item.expiryDate),
                daysLabel,
                item.quantity,
                item.status.replace('_', ' ')
            ].join(','));
        });
    }
    sections.push('');

    // Waste & Savings
    sections.push('=== WASTE & SAVINGS ===');
    if (lastWaste) {
        sections.push(`Consumed,${lastWaste.consumedCount}`);
        sections.push(`Discarded,${lastWaste.discardedCount}`);
        sections.push(`Waste Rate (Consumption),${lastWaste.totalProcessed > 0 ? lastWaste.wasteRate + '%' : '—'}`);
        sections.push(`Most Wasted Category,${lastWaste.mostWastedCategory ? formatCategory(lastWaste.mostWastedCategory) + ' (' + lastWaste.mostWastedCategoryCount + ' items)' : '—'}`);
    } else {
        sections.push('No data available');
    }
    sections.push('');

    // Category Breakdown
    sections.push('=== CATEGORY BREAKDOWN ===');
    sections.push('Category,Total,Fresh,Expiring Soon,Expired');
    if (lastCategories && lastCategories.length > 0) {
        lastCategories.forEach(cat => {
            sections.push([
                formatCategory(cat.category),
                cat.total,
                cat.freshCount,
                cat.expiringSoonCount,
                cat.expiredCount
            ].join(','));
        });
    } else {
        sections.push('No data available');
    }
    sections.push('');

    // Monthly Activity
    sections.push('=== MONTHLY ACTIVITY ===');
    if (lastMonthly) {
        sections.push(`Period,${monthNames[lastMonthly.month - 1]} ${lastMonthly.year}`);
        sections.push(`Items Added,${lastMonthly.itemsAdded}`);
        sections.push(`Items Consumed,${lastMonthly.itemsConsumed}`);
        sections.push(`Items Expired,${lastMonthly.itemsExpired}`);
    } else {
        sections.push('No data available');
    }

    triggerDownload(sections.join('\n'));
}

function triggerDownload(csv) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jahfreshfridge-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

