<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        /* All your existing styles */
        .admin-section { display: none; }
        .admin-section.active { display: block; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .badge-cleared { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-rejected { background: #fee2e2; color: #991b1b; }
        .badge-in_progress { background: #dbeafe; color: #1e40af; }
        .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; }
        .modal.active { display: flex; }
        .modal-content { background: white; border-radius: 12px; padding: 32px; max-width: 560px; width: 90%; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
        .btn-full { width: 100%; margin-top: 8px; }
        .btn-secondary { background: #e2e8f0; color: #1e293b; }
        .btn-sm { padding: 4px 12px; font-size: 0.85rem; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; color: #1e293b; }
        .field input, .field select { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 1rem; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        table th { text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; font-weight: 600; }
        table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .text-muted { color: #64748b; }
        .center { text-align: center; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat .num { font-size: 2rem; font-weight: 700; color: #4f46e5; }
        .stat .label { color: #64748b; font-size: 0.9rem; }
        .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; display: none; }
        .alert-success { background: #dcfce7; color: #166534; border: 1px solid #86efac; display: flex; align-items: center; }
        .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; display: flex; align-items: center; }
        .alert-warning { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; display: flex; align-items: center; }
        .alert-info { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; display: flex; align-items: center; }
    </style>
</head>
<body>
    <!-- Topbar -->
    <div class="topbar">
        <div class="topbar-inner">
            <a href="index.html" class="brand"><span>🎓</span> School Clearance Portal</a>
            <div class="nav">
                <span data-user-display style="margin-right:16px; color:#4f46e5; font-weight:600;">👋 Admin</span>
                <button onclick="logoutUser()" class="btn btn-secondary btn-sm">Logout</button>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <ul>
                    <li><a href="#dashboard">📊 Dashboard</a></li>
                    <li><a href="#users">👥 Users</a></li>
                    <li><a href="#departments">🏫 Departments</a></li>
                    <li><a href="#reports">📊 Reports</a></li>
                    <li><a href="#audit">🔐 Audit Trail</a></li>
                    <li><a href="#settings">⚙️ Settings</a></li>
                    <li><a href="#" onclick="logoutUser()">🚪 Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div id="alert-box" class="alert"></div>

                <!-- Dashboard Section -->
                <section id="sect-dashboard" class="admin-section active">
                    <h1 style="margin-bottom:24px;">Admin Control Center</h1>
                    <div class="grid-4" id="stats-grid">
                        <div class="card stat"><div class="num" id="stat-users">—</div><div class="label">Total Accounts</div></div>
                        <div class="card stat"><div class="num" id="stat-apps">—</div><div class="label">Total Applications</div></div>
                        <div class="card stat"><div class="num" id="stat-cleared">—</div><div class="label">Fully Cleared</div></div>
                        <div class="card stat"><div class="num" id="stat-pending">—</div><div class="label">Pending Review</div></div>
                    </div>
                    <div class="card" style="margin-top:24px;">
                        <h2>Digital Clearance System Overview</h2>
                        <p class="text-muted">Welcome to the School Clearance Portal Administration dashboard. Use the sidebar menu to manage users, departments, applications, and system settings.</p>
                    </div>
                </section>

                <!-- Users Section -->
                <section id="sect-users" class="admin-section">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h1>User Accounts Administration</h1>
                        <button class="btn" onclick="openUserModal()">+ Add New User</button>
                    </div>
                    <div class="card">
                        <div class="table-wrap">
                            <table>
                                <thead>
                                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Reg/Staff No</th><th>Department</th><th>Status</th><th style="text-align:right;">Action</th></tr>
                                </thead>
                                <tbody id="users-list"><tr><td colspan="7" class="text-muted center">Loading...</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- Departments Section -->
                <section id="sect-departments" class="admin-section">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h1>Academic Departments</h1>
                        <button class="btn" onclick="openDeptModal()">+ Add Department</button>
                    </div>
                    <div class="card">
                        <div class="table-wrap">
                            <table>
                                <thead><tr><th>ID</th><th>Department Name</th><th>Code</th><th>Created At</th></tr></thead>
                                <tbody id="depts-list"><tr><td colspan="4" class="text-muted center">Loading...</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- Reports Section -->
                <section id="sect-reports" class="admin-section">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h1>Clearance Progress Reports</h1>
                        <button class="btn btn-secondary" onclick="alert('CSV export would work with a backend')">📥 Export to CSV</button>
                    </div>
                    <div class="card">
                        <div class="table-wrap">
                            <table>
                                <thead><tr><th>App ID</th><th>Student</th><th>Reg No</th><th>AY</th><th>Status</th><th>Certificate No</th><th>Submitted</th></tr></thead>
                                <tbody id="reports-list"><tr><td colspan="7" class="text-muted center">Loading...</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- Audit Section -->
                <section id="sect-audit" class="admin-section">
                    <h1 style="margin-bottom:24px;">Security Audit Trail</h1>
                    <div class="card">
                        <div class="table-wrap">
                            <table>
                                <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th><th>IP Address</th></tr></thead>
                                <tbody id="audit-list"><tr><td colspan="5" class="text-muted center">Loading...</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- Settings Section -->
                <section id="sect-settings" class="admin-section">
                    <h1 style="margin-bottom:24px;">Global System Settings</h1>
                    <div class="card" style="max-width:600px;">
                        <form id="settings-form">
                            <div class="field">
                                <label for="setting-institution">Institution Name</label>
                                <input type="text" id="setting-institution" required>
                            </div>
                            <div class="field">
                                <label for="setting-ay">Current Academic Year</label>
                                <input type="text" id="setting-ay" required placeholder="e.g. 2025/2026">
                            </div>
                            <div class="field">
                                <label for="setting-sms">SMS Gateway Provider</label>
                                <select id="setting-sms">
                                    <option value="africas_talking">Africa's Talking</option>
                                    <option value="twilio">Twilio</option>
                                    <option value="mock">Simulated Gateway</option>
                                </select>
                            </div>
                            <div class="field">
                                <label for="setting-email">System "From" Email</label>
                                <input type="email" id="setting-email" required>
                            </div>
                            <button type="submit" class="btn btn-full">Save Configuration</button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <!-- User Modal -->
    <div class="modal" id="user-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="user-modal-title">Add User Account</h3>
                <button class="modal-close" onclick="closeUserModal()">&times;</button>
            </div>
            <form id="user-form">
                <input type="hidden" id="user-id">
                <div class="field"><label for="user-name">Full Name</label><input id="user-name" required></div>
                <div class="field"><label for="user-email">Email Address</label><input type="email" id="user-email" required></div>
                <div class="field"><label for="user-phone">Phone Number</label><input id="user-phone"></div>
                <div class="field">
                    <label for="user-role">Role</label>
                    <select id="user-role" required>
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="librarian">Librarian</option>
                        <option value="finance">Finance Officer</option>
                        <option value="hostel">Hostel Officer</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <div class="field"><label for="user-identifier">Identifier (Reg/Staff No)</label><input id="user-identifier"></div>
                <div class="field">
                    <label for="user-dept">Department</label>
                    <select id="user-dept"><option value="">— Not Applicable —</option></select>
                </div>
                <div class="field">
                    <label for="user-status">Account Status</label>
                    <select id="user-status" required>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div class="field">
                    <label for="user-pass" id="user-pass-label">Password</label>
                    <input type="password" id="user-pass" placeholder="Min 8 characters">
                </div>
                <button type="submit" class="btn btn-full">Save Account Details</button>
            </form>
        </div>
    </div>

    <!-- Department Modal -->
    <div class="modal" id="dept-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Department</h3>
                <button class="modal-close" onclick="closeDeptModal()">&times;</button>
            </div>
            <form id="dept-form">
                <div class="field"><label for="dept-name">Department Name</label><input id="dept-name" required placeholder="e.g. Computer Science"></div>
                <div class="field"><label for="dept-code">Department Code</label><input id="dept-code" required placeholder="e.g. CSC"></div>
                <button type="submit" class="btn btn-full">Create Department</button>
            </form>
        </div>
    </div>

    <div class="footer">&copy; 2026 School Clearance Portal. All rights reserved.</div>

    <!-- Scripts -->
    <script src="dashboard.js"></script>
    <script src="admin.js"></script>
</body>
</html>