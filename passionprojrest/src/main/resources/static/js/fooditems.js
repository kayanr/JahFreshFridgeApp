// Modal instances
const foodItemModal = new bootstrap.Modal(document.getElementById('foodItemModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

// Track which item is pending deletion
let deleteTargetId = null;

// Status badge colours and display labels
const STATUS_BADGE = {
    FRESH:          'bg-success',
    EXPIRING_SOON:  'bg-warning text-dark',
    EXPIRED:        'bg-danger',
    CONSUMED:       'bg-secondary',
    DISCARDED:      'bg-dark'
};

const STATUS_LABEL = {
    FRESH:          'Fresh',
    EXPIRING_SOON:  'Expiring Soon',
    EXPIRED:        'Expired',
    CONSUMED:       'Consumed',
    DISCARDED:      'Discarded'
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

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

// ── Table rendering ────────────────────────────────────────────────────────

function renderTable(items) {
    const tbody = document.getElementById('fooditems-table-body');

    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    No food items yet. Add one!
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description || '—'}</td>
            <td>${formatDate(item.expiryDate)}</td>
            <td>${item.quantity}</td>
            <td>
                <span class="badge ${STATUS_BADGE[item.status] || 'bg-secondary'}">
                    ${STATUS_LABEL[item.status] || item.status}
                </span>
            </td>
            <td>${formatDate(item.createdDate)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1"
                        onclick="openEditModal(${item.id})">Edit</button>
                <button class="btn btn-sm btn-outline-danger"
                        onclick="openDeleteModal(${item.id}, '${item.name.replace(/'/g, "\\'")}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// ── Data loading ───────────────────────────────────────────────────────────

async function loadFoodItems() {
    const tbody = document.getElementById('fooditems-table-body');
    try {
        const items = await getAllFoodItems();
        renderTable(items);
    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger py-4">
                    Failed to load items. Is the server running?
                </td>
            </tr>`;
    }
}

// ── Add modal ──────────────────────────────────────────────────────────────

function openAddModal() {
    document.getElementById('foodItemModalLabel').textContent = 'Add Food Item';
    document.getElementById('form-id').value = '';
    document.getElementById('fooditem-form').reset();
    document.getElementById('fooditem-form').classList.remove('was-validated');
    foodItemModal.show();
}

// ── Edit modal ─────────────────────────────────────────────────────────────

async function openEditModal(id) {
    try {
        const item = await getFoodItem(id);
        document.getElementById('foodItemModalLabel').textContent = 'Edit Food Item';
        document.getElementById('form-id').value           = item.id;
        document.getElementById('form-name').value         = item.name;
        document.getElementById('form-description').value  = item.description || '';
        document.getElementById('form-expiry-date').value  = item.expiryDate;
        document.getElementById('form-quantity').value     = item.quantity;
        document.getElementById('form-status').value       = item.status;
        document.getElementById('fooditem-form').classList.remove('was-validated');
        foodItemModal.show();
    } catch (error) {
        showAlert('Could not load item for editing.', 'danger');
    }
}

// ── Save (create or update) ────────────────────────────────────────────────

async function saveItem() {
    const form = document.getElementById('fooditem-form');
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    const id = document.getElementById('form-id').value;
    const data = {
        name:        document.getElementById('form-name').value.trim(),
        description: document.getElementById('form-description').value.trim(),
        expiryDate:  document.getElementById('form-expiry-date').value,
        quantity:    parseInt(document.getElementById('form-quantity').value, 10),
        status:      document.getElementById('form-status').value
    };

    try {
        if (id) {
            await updateFoodItem(id, data);
            showAlert('Item updated successfully.');
        } else {
            await createFoodItem(data);
            showAlert('Item added successfully.');
        }
        foodItemModal.hide();
        await loadFoodItems();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

// ── Delete modal ───────────────────────────────────────────────────────────

function openDeleteModal(id, name) {
    deleteTargetId = id;
    document.getElementById('delete-item-name').textContent = name;
    deleteModal.show();
}

async function confirmDelete() {
    try {
        await deleteFoodItem(deleteTargetId);
        deleteModal.hide();
        showAlert('Item deleted.');
        await loadFoodItems();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

// ── Event listeners ────────────────────────────────────────────────────────

document.getElementById('btn-add-item').addEventListener('click', openAddModal);
document.getElementById('btn-save-item').addEventListener('click', saveItem);
document.getElementById('btn-confirm-delete').addEventListener('click', confirmDelete);
document.getElementById('btn-refresh-statuses').addEventListener('click', async () => {
    try {
        await refreshStatuses();
        showAlert('Statuses refreshed successfully.');
        await loadFoodItems();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});

// ── Init ───────────────────────────────────────────────────────────────────

loadFoodItems();
