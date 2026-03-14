const BASE_URL = '/api/fooditems';

async function getAllFoodItems() {
    const response = await fetch(BASE_URL);
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
