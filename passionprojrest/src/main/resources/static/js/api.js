const BASE_URL = '/api/fooditems';
const REPORTS_URL = '/api/reports';

// Reads the JWT from localStorage and returns it as an Authorization header
function authHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('token');
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        ...extraHeaders
    };
}

async function getAllFoodItems(page = 0, size = 5) {
    const response = await fetch(`${BASE_URL}?page=${page}&size=${size}`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load food items');
    return response.json();
}

async function getFoodItem(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error(`Food item ${id} not found`);
    return response.json();
}

async function createFoodItem(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create food item');
    return response.json();
}

async function updateFoodItem(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update food item');
    return response.json();
}

async function deleteFoodItem(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete food item');
}

async function refreshStatuses() {
    const response = await fetch(`${BASE_URL}/refresh-statuses`, {
        method: 'POST',
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to refresh statuses');
}

async function getStats() {
    const response = await fetch(`${BASE_URL}/stats`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load stats');
    return response.json();
}

async function getExpiringSoon() {
    const response = await fetch(`${BASE_URL}/expiring-soon`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load expiring soon items');
    return response.json();
}

async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load categories');
    return response.json();
}

async function getExpirationSummary() {
    const response = await fetch(`${REPORTS_URL}/expiration-summary`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load expiration summary');
    return response.json();
}

async function getWasteSummary() {
    const response = await fetch(`${REPORTS_URL}/waste-summary`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load waste summary');
    return response.json();
}

async function getCategorySummary() {
    const response = await fetch(`${REPORTS_URL}/category-summary`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load category summary');
    return response.json();
}

async function getMonthlyActivity() {
    const response = await fetch(`${REPORTS_URL}/monthly-activity`, {
        headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to load monthly activity');
    return response.json();
}
