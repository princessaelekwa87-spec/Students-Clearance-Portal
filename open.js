// ============================================================
// DASHBOARD.JS - Complete Navigation System
// ============================================================

// Get current user from session
function getUser() {
    try {
        const data = sessionStorage.getItem('user_data');
        if (data) {
            return JSON.parse(data);
        }
        // Try localStorage as fallback
        const localData = localStorage.getItem('user_data');
        if (localData) {
            return JSON.parse(localData);
        }
        return null;
    } catch (e) {
        return null;
    }
}

// Save user to session
function saveUser(userData) {
    try {
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (e) {
        console.warn('Could not save user data:', e);
    }
}

// Remove user from session (logout)
function removeUser() {
    sessionStorage.removeItem('user_data');
    localStorage.removeItem('user_data');
}

// Get dashboard URL based on role
function getDashboardUrl(role) {
    const dashboards = {
        'admin': 'dashboard_admin.html',
        'student': 'dashboard_student.html',
        'lecturer': 'dashboard_officer.html',
        'librarian': 'dashboard_officer.html',
        'finance': 'dashboard_officer.html',
        'hostel': 'dashboard_officer.html'
    };
    return dashboards[role] || 'dashboard_student.html';
}

// Check if user is logged in and redirect appropriately
function checkAuth(requiredRole = null) {
    const user = getUser();
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['index.html', 'login.html', 'register.html', 'forgot_password.html', 'reset_password.html', ''];
    
    // If no user and on protected page, redirect to login
    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return null;
    }
    
    // If user exists and on public page, redirect to dashboard
    if (user && publicPages.includes(currentPage)) {
        window.location.href = getDashboardUrl(user.role);
        return user;
    }
    
    // If specific role is required, check it
    if (requiredRole && user && user.role !== requiredRole) {
        window.location.href = getDashboardUrl(user.role);
        return null;
    }
    
    return user;
}

// Logout function
function logoutUser() {
    removeUser();
    window.location.href = 'login.html?logout=true';
}

// Show alert message
function showAlert(message, type = 'error', duration = 5000) {
    const alertBox = document.getElementById('alert-box');
    if (!alertBox) {
        console.warn('No alert box found');
        return;
    }
    
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    
    if (type === 'success' && duration > 0) {
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, duration);
    }
}

// Hide alert
function hideAlert() {
    const alertBox = document.getElementById('alert-box');
    if (alertBox) {
        alertBox.style.display = 'none';
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '—';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// ============================================================
// MOCK DATA FOR DEMONSTRATION
// ============================================================

// Mock users database
const MOCK_USERS = {
    'alice@portal.test': { 
        id: 1, 
        full_name: 'Alice Johnson', 
        email: 'alice@portal.test', 
        role: 'student',
        password: 'Password123',
        department: 'Computer Science',
        program: 'BSc Computer Science'
    },
    'admin@portal.test': { 
        id: 2, 
        full_name: 'Administrator', 
        email: 'admin@portal.test', 
        role: 'admin',
        password: 'Password123'
    },
    'librarian@portal.test': { 
        id: 3, 
        full_name: 'Librarian User', 
        email: 'librarian@portal.test', 
        role: 'librarian',
        password: 'Password123'
    },
    'finance@portal.test': { 
        id: 4, 
        full_name: 'Finance Officer', 
        email: 'finance@portal.test', 
        role: 'finance',
        password: 'Password123'
    },
    'hostel@portal.test': { 
        id: 5, 
        full_name: 'Hostel Officer', 
        email: 'hostel@portal.test', 
        role: 'hostel',
        password: 'Password123'
    },
    'lecturer@portal.test': { 
        id: 6, 
        full_name: 'Lecturer User', 
        email: 'lecturer@portal.test', 
        role: 'lecturer',
        password: 'Password123'
    }
};

// Login function
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
            const user = MOCK_USERS[email];
            
            if (!user) {
                reject({ error: 'User not found. Please check your email.' });
                return;
            }
            
            if (user.password !== password) {
                reject({ error: 'Invalid password. Please try again.' });
                return;
            }
            
            // Remove password before saving
            const userData = {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                department: user.department || '',
                program: user.program || ''
            };
            
            saveUser(userData);
            resolve(userData);
        }, 500);
    });
}

// Initialize dashboard
function initDashboard(role = null) {
    const user = checkAuth(role);
    if (!user) return;
    
    // Update user info on page
    const nameElements = document.querySelectorAll('[data-user-name]');
    nameElements.forEach(el => {
        el.textContent = user.full_name;
    });
    
    const emailElements = document.querySelectorAll('[data-user-email]');
    emailElements.forEach(el => {
        el.textContent = user.email;
    });
    
    const roleElements = document.querySelectorAll('[data-user-role]');
    roleElements.forEach(el => {
        el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    });
    
    // Update display name in top bar
    const displayElements = document.querySelectorAll('[data-user-display]');
    displayElements.forEach(el => {
        el.textContent = `👋 ${user.full_name}`;
    });
    
    console.log(`✅ Dashboard loaded for: ${user.email} (${user.role})`);
    return user;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUser,
        saveUser,
        removeUser,
        getDashboardUrl,
        checkAuth,
        logoutUser,
        showAlert,
        hideAlert,
        formatDate,
        generateId,
        MOCK_USERS,
        loginUser,
        initDashboard
    };
}

console.log('✅ dashboard.js loaded successfully');