const BASE_URL = '/api/fooditems';
const REPORTS_URL = '/api/reports';

async function getAllFoodItems(page = 0, size = 5) {
    const response = await fetch(`${BASE_URL}?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to load food items');
    return response.json();
}

async function getFoodItem(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Food item ${id} not found`);
    return response.json();
}

async function createFoodItem(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create food item');
    return response.json();
}

async function updateFoodItem(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update food item');
    return response.json();
}

async function deleteFoodItem(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete food item');
}

async function refreshStatuses() {
    const response = await fetch(`${BASE_URL}/refresh-statuses`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to refresh statuses');
}

async function getStats() {
    const response = await fetch(`${BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to load stats');
    return response.json();
}

async function getExpiringSoon() {
    const response = await fetch(`${BASE_URL}/expiring-soon`);
    if (!response.ok) throw new Error('Failed to load expiring soon items');
    return response.json();
}

async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to load categories');
    return response.json();
}

async function getExpirationSummary() {
    const response = await fetch(`${REPORTS_URL}/expiration-summary`);
    if (!response.ok) throw new Error('Failed to load expiration summary');
    return response.json();
}
