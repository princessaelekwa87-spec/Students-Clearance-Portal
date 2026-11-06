// ============================================================
// SHARED DASHBOARD LOGIC
// Include this on every dashboard_*.html page via:
//   <script src="dashboard.js"></script>
// Handles: session validation, role-based redirect, logout.
// ============================================================

function getDashboardUrlForRole(role) {
    const dashboards = {
        'admin': 'dashboard_admin.html',
        'student': 'dashboard_student.html',
        'lecturer': 'dashboard_officer.html',
        'librarian': 'dashboard_officer.html',
        'finance': 'dashboard_officer.html',
        'hostel': 'dashboard_officer.html'
    };
    return dashboards[role] || 'login.html';
}

function populateUserInfo(userData) {
    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = userData.full_name);
    document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = userData.email);
    document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = userData.role);
    document.querySelectorAll('[data-user-display]').forEach(el => el.textContent = `👋 ${userData.full_name}`);
}

/**
 * Call this on DOMContentLoaded for every dashboard page.
 * expectedRole: 'student' | 'admin' | 'officer' (officer covers
 * lecturer/librarian/finance/hostel, which all share one dashboard file)
 *
 * Returns the logged-in user object, or null (and redirects) if
 * there's no valid session for this dashboard.
 */
function initDashboard(expectedRole) {
    let userData = null;

    try {
        const raw = sessionStorage.getItem('user_data');
        if (raw) userData = JSON.parse(raw);
    } catch (e) {
        userData = null;
    }

    // Not logged in at all -> back to login
    if (!userData) {
        window.location.href = 'login.html';
        return null;
    }

    // Logged in, but this isn't the right dashboard for their role
    if (expectedRole) {
        const officerRoles = ['lecturer', 'librarian', 'finance', 'hostel'];
        const isOfficerGroup = expectedRole === 'officer' && officerRoles.includes(userData.role);
        const isDirectMatch = userData.role === expectedRole;

        if (!isDirectMatch && !isOfficerGroup) {
            window.location.href = getDashboardUrlForRole(userData.role);
            return null;
        }
    }

    populateUserInfo(userData);
    return userData;
}

/**
 * Clears the session and sends the user back to the login page.
 * login.html already watches for ?logout=true and wipes storage
 * on load, so this closes the loop cleanly.
 */
function logoutUser() {
    try {
        sessionStorage.removeItem('user_data');
    } catch (e) {
        // ignore
    }
    window.location.href = 'login.html?logout=true';
}

window.initDashboard = initDashboard;
window.logoutUser = logoutUser;
window.getDashboardUrlForRole = getDashboardUrlForRole;

console.log('✅ dashboard.js loaded');