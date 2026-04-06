const BASE_URL = '/api/fooditems';
const REPORTS_URL = '/api/reports';

// ── Shared UI helpers ──────────────────────────────────────────────────────

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

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

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

// Reads the JWT from localStorage and returns it as an Authorization header
function authHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('token');
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        ...extraHeaders
    };
}

// Central fetch wrapper — redirects to login on 401 (expired or missing token)
async function fetchWithAuth(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: authHeaders(options.headers || {})
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
        return;
    }

    return response;
}

async function getAllFoodItems(page = 0, size = 5) {
    const response = await fetchWithAuth(`${BASE_URL}?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to load food items');
    return response.json();
}

async function getFoodItem(id) {
    const response = await fetchWithAuth(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Food item ${id} not found`);
    return response.json();
}

async function createFoodItem(data) {
    const response = await fetchWithAuth(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create food item');
    return response.json();
}

async function updateFoodItem(id, data) {
    const response = await fetchWithAuth(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update food item');
    return response.json();
}

async function deleteFoodItem(id) {
    const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete food item');
}

async function refreshStatuses() {
    const response = await fetchWithAuth(`${BASE_URL}/refresh-statuses`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to refresh statuses');
}

async function getStats() {
    const response = await fetchWithAuth(`${BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to load stats');
    return response.json();
}

async function getExpiringSoon() {
    const response = await fetchWithAuth(`${BASE_URL}/expiring-soon`);
    if (!response.ok) throw new Error('Failed to load expiring soon items');
    return response.json();
}

async function getCategories() {
    const response = await fetchWithAuth(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to load categories');
    return response.json();
}

async function getExpirationSummary() {
    const response = await fetchWithAuth(`${REPORTS_URL}/expiration-summary`);
    if (!response.ok) throw new Error('Failed to load expiration summary');
    return response.json();
}

async function getWasteSummary() {
    const response = await fetchWithAuth(`${REPORTS_URL}/waste-summary`);
    if (!response.ok) throw new Error('Failed to load waste summary');
    return response.json();
}

async function getCategorySummary() {
    const response = await fetchWithAuth(`${REPORTS_URL}/category-summary`);
    if (!response.ok) throw new Error('Failed to load category summary');
    return response.json();
}

async function getMonthlyActivity() {
    const response = await fetchWithAuth(`${REPORTS_URL}/monthly-activity`);
    if (!response.ok) throw new Error('Failed to load monthly activity');
    return response.json();
}
