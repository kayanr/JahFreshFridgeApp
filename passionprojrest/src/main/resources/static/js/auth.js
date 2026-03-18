// Page guard — call at the top of every protected page
function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }
}

// Clears the token and returns to login
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}
