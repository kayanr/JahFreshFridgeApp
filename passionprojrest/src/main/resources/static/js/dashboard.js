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
