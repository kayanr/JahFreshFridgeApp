// ── Helpers ────────────────────────────────────────────────────────────────

function showAlert(message, type = 'success') {
    const container = document.getElementById('alert-container');
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) bootstrap.Alert.getOrCreateInstance(alert).close();
    }, 4000);
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderStats(stats) {
    document.getElementById('stat-total').textContent          = stats.total;
    document.getElementById('stat-fresh').textContent          = stats.FRESH;
    document.getElementById('stat-expiring-soon').textContent  = stats.EXPIRING_SOON;
    document.getElementById('stat-expired').textContent        = stats.EXPIRED;
    document.getElementById('stat-consumed').textContent       = stats.CONSUMED;
    document.getElementById('stat-discarded').textContent      = stats.DISCARDED;
}

// ── Load ───────────────────────────────────────────────────────────────────

async function loadExpiringSoonBanner() {
    try {
        const items = await getExpiringSoon();
        const banner = document.getElementById('expiring-soon-banner');
        const message = document.getElementById('expiring-soon-message');
        if (items.length > 0) {
            message.textContent = `${items.length} item${items.length > 1 ? 's are' : ' is'} expiring within 3 days.`;
            banner.classList.remove('d-none');
        } else {
            banner.classList.add('d-none');
        }
    } catch (error) {
        // Silently fail — banner is non-critical
    }
}

async function loadStats() {
    try {
        const stats = await getStats();
        renderStats(stats);
    } catch (error) {
        showAlert('Failed to load dashboard stats. Is the server running?', 'danger');
    }
}

// ── Event listeners ────────────────────────────────────────────────────────

document.getElementById('btn-refresh-dashboard').addEventListener('click', async () => {
    try {
        await loadStats();
        showAlert('Dashboard refreshed.');
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});

// ── Init ───────────────────────────────────────────────────────────────────

loadStats();
loadExpiringSoonBanner();
