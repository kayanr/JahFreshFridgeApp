// Modal instances
const foodItemModal = new bootstrap.Modal(document.getElementById('foodItemModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

// Track which item is pending deletion
let deleteTargetId = null;

// In-memory store of all loaded items — used for filtering without extra API calls
let allItems = [];

// Sort state
let sortColumn = null;
let sortAsc = true;

// Pagination state
let currentPage = 0;
let totalPages = 0;

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

const CATEGORY_LABEL = {
    DAIRY:      'Dairy',
    PRODUCE:    'Produce',
    MEAT:       'Meat',
    LEFTOVERS:  'Leftovers',
    DRINKS:     'Drinks',
    OTHER:      'Other'
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
        const isFiltering = document.getElementById('search-input').value ||
                            document.getElementById('filter-status').value ||
                            document.getElementById('filter-category').value;
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted py-4">
                    ${isFiltering ? 'No items match your search.' : 'No food items yet. Add one!'}
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.id}</td>
            <td><a href="https://www.google.com/search?q=recipes+with+${encodeURIComponent(item.name)}" target="_blank" class="text-decoration-none">${item.name}</a></td>
            <td>${item.notes || '—'}</td>
            <td>${formatDate(item.expiryDate)}</td>
            <td>${item.quantity}</td>
            <td>
                <span class="badge ${STATUS_BADGE[item.status] || 'bg-secondary'}">
                    ${STATUS_LABEL[item.status] || item.status}
                </span>
            </td>
            <td>${CATEGORY_LABEL[item.category] || item.category || '—'}</td>
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

async function loadFoodItems(page = 0) {
    const tbody = document.getElementById('fooditems-table-body');
    try {
        const data = await getAllFoodItems(page);
        allItems = data.content;
        currentPage = data.number;
        totalPages = data.totalPages;
        applyFilters();
        updatePaginationControls(data);
    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger py-4">
                    Failed to load items. Is the server running?
                </td>
            </tr>`;
    }
}

function updatePaginationControls(data) {
    document.getElementById('pagination-info').textContent =
        `Page ${data.number + 1} of ${data.totalPages} (${data.totalElements} items)`;
    document.getElementById('btn-prev-page').disabled = data.first;
    document.getElementById('btn-next-page').disabled = data.last;
}

// ── Search & Filter ─────────────────────────────────────────────────────────

function applyFilters() {
    const search = document.getElementById('search-input').value.toLowerCase().trim();
    const status = document.getElementById('filter-status').value;
    const category = document.getElementById('filter-category').value;

    let filtered = allItems.filter(item => {
        const matchesSearch = !search || item.name.toLowerCase().includes(search);
        const matchesStatus = !status || item.status === status;
        const matchesCategory = !category || item.category === category;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortColumn) {
        filtered = [...filtered].sort((a, b) => {
            let valA = a[sortColumn] ?? '';
            let valB = b[sortColumn] ?? '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });
    }

    renderTable(filtered);
    updateSortIndicators();
}

function updateSortIndicators() {
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.sort === sortColumn) {
            th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');
        }
    });
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
        document.getElementById('form-notes').value  = item.notes || '';
        document.getElementById('form-expiry-date').value  = item.expiryDate;
        document.getElementById('form-quantity').value     = item.quantity;
        document.getElementById('form-status').value       = item.status;
        document.getElementById('form-category').value     = item.category || '';
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
        notes: document.getElementById('form-notes').value.trim(),
        expiryDate:  document.getElementById('form-expiry-date').value,
        quantity:    parseInt(document.getElementById('form-quantity').value, 10),
        status:      document.getElementById('form-status').value,
        category:    document.getElementById('form-category').value
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
        await loadFoodItems(currentPage);
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
        await loadFoodItems(currentPage);
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

// ── Event listeners ────────────────────────────────────────────────────────

document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        if (sortColumn === th.dataset.sort) {
            sortAsc = !sortAsc;
        } else {
            sortColumn = th.dataset.sort;
            sortAsc = true;
        }
        applyFilters();
    });
});

document.getElementById('btn-prev-page').addEventListener('click', () => loadFoodItems(currentPage - 1));
document.getElementById('btn-next-page').addEventListener('click', () => loadFoodItems(currentPage + 1));

document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('filter-status').addEventListener('change', applyFilters);
document.getElementById('filter-category').addEventListener('change', applyFilters);
document.getElementById('btn-clear-filters').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-category').value = '';
    applyFilters();
});

document.getElementById('btn-add-item').addEventListener('click', openAddModal);
document.getElementById('btn-save-item').addEventListener('click', saveItem);
document.getElementById('btn-confirm-delete').addEventListener('click', confirmDelete);
document.getElementById('btn-refresh-statuses').addEventListener('click', async () => {
    try {
        await refreshStatuses();
        showAlert('Statuses refreshed successfully.');
        await loadFoodItems(currentPage);
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});

// ── Expiring soon banner ────────────────────────────────────────────────────

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

// ── Init ───────────────────────────────────────────────────────────────────

async function loadCategories() {
    try {
        const categories = await getCategories();
        const formSelect = document.getElementById('form-category');
        const filterSelect = document.getElementById('filter-category');
        categories.forEach(cat => {
            const label = CATEGORY_LABEL[cat] || cat;
            formSelect.innerHTML += `<option value="${cat}">${label}</option>`;
            filterSelect.innerHTML += `<option value="${cat}">${label}</option>`;
        });
    } catch (error) {
        // Silently fail — categories will just be empty
    }
}

const params = new URLSearchParams(window.location.search);
const filterParam = params.get('filter');
if (filterParam) {
    document.getElementById('filter-status').value = filterParam;
}

loadCategories();
loadFoodItems();
loadExpiringSoonBanner();
