// Main Application Controller
class AfyaTrackApp {
    constructor() {
        this.currentPage = 'landing';
        this.selectedRole = null;
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Handle navigation
            if (e.target.matches('[data-nav]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-nav');
                this.navigateTo(page);
            }

            // Handle logout
            if (e.target.matches('[data-logout]')) {
                this.handleLogout();
            }

            // Handle role selection on landing page
            if (e.target.matches('[data-role-select]')) {
                const role = e.target.getAttribute('data-role-select');
                this.showAuthModal(role);
            }

            // Handle get started button
            if (e.target.matches('[data-get-started]')) {
                this.showRoleSelection();
            }

            // Handle learn more button
            if (e.target.matches('[data-learn-more]')) {
                e.preventDefault();
                this.showLearnMore();
            }

            // Handle modal close
            if (e.target.matches('[data-close-modal]')) {
                this.hideAuthModal();
                this.hideAdminActionModal();
            }

            // Handle auth tab switching (only for supervisor and CHV)
            if (e.target.matches('[data-auth-tab]')) {
                const tab = e.target.getAttribute('data-auth-tab');
                this.switchAuthTab(tab);
            }

            // Handle admin actions
            if (e.target.matches('[data-admin-action]')) {
                const action = e.target.getAttribute('data-admin-action');
                const userId = e.target.getAttribute('data-user-id');
                this.handleAdminAction(action, userId);
            }
        });

        // Handle back to top button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#back-to-top')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Add form submission listeners
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form-admin') {
                e.preventDefault();
                this.selectedRole = 'admin';
                this.handleLogin();
            }
            
            if (e.target.id === 'login-form-general') {
                e.preventDefault();
                this.handleLogin();
            }
            
            if (e.target.id === 'register-form-general') {
                e.preventDefault();
                this.handleRegistration();
            }

            // Handle add user form submission
            if (e.target.id === 'add-user-form') {
                e.preventDefault();
                this.processAddUserForm();
            }
        });
    }

    // Admin Action Methods
    handleAdminAction(action, userId = null) {
        console.log('Admin action:', action, 'User ID:', userId);
        
        switch(action) {
            case 'manage-users':
                this.showManageUsers();
                break;
            case 'add-user':
                this.showAddUserForm();
                break;
            case 'edit-user':
                this.showEditUserForm(userId);
                break;
            case 'delete-user':
                this.showDeleteUserConfirmation(userId);
                break;
            case 'all-households':
                this.showAllHouseholds();
                break;
            case 'all-visits':
                this.showAllVisits();
                break;
            case 'alerts':
                this.showAlerts();
                break;
            case 'system-settings':
                this.showSystemSettings();
                break;
            case 'view-reports':
                this.showReports();
                break;
            case 'security-logs':
                this.showSecurityLogs();
                break;
            case 'generate-report':
                this.generateReport();
                break;
            case 'export-users':
                this.exportUsers();
                break;
            default:
                console.log('Unknown admin action:', action);
        }
    }

    showAdminActionModal(title, subtitle, content) {
        const modal = document.getElementById('admin-action-modal');
        const modalTitle = document.getElementById('admin-modal-title');
        const modalSubtitle = document.getElementById('admin-modal-subtitle');
        const modalContent = document.getElementById('admin-modal-content');
        
        if (modal && modalTitle && modalSubtitle && modalContent) {
            modalTitle.textContent = title;
            modalSubtitle.textContent = subtitle;
            modalContent.innerHTML = content;
            modal.classList.remove('hidden');
        }
    }

    hideAdminActionModal() {
        const modal = document.getElementById('admin-action-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Admin Action Implementations
    showManageUsers() {
        const users = auth.getAllUsers();
        const content = `
            <div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">User Management</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Manage all system users and their permissions.</p>
                
                <div style="display: grid; gap: 1rem;">
                    <button class="btn btn-primary w-full" data-admin-action="add-user">
                        👤 Add New User
                    </button>
                    <button class="btn btn-outline w-full" data-admin-action="export-users">
                        📥 Export User List
                    </button>
                </div>
                
                <div style="margin-top: 2rem;">
                    <h4 style="margin-bottom: 1rem; color: var(--text-dark);">User Statistics</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div style="text-align: center; padding: 1rem; background: var(--bg-light); border-radius: var(--radius-md);">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-teal);">${users.length}</div>
                            <div style="font-size: 0.875rem; color: var(--text-light);">Total Users</div>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: var(--bg-light); border-radius: var(--radius-md);">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-gold);">${users.filter(u => u.role === 'chv').length}</div>
                            <div style="font-size: 0.875rem; color: var(--text-light);">CHVs</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.showAdminActionModal('User Management', 'Manage system users and permissions', content);
    }

    showAddUserForm() {
        const content = `
            <form id="add-user-form">
                <div class="form-group">
                    <label for="new-user-name" class="form-label">Full Name</label>
                    <input type="text" id="new-user-name" class="form-input" placeholder="Enter full name" required>
                </div>
                
                <div class="form-group">
                    <label for="new-user-email" class="form-label">Email Address</label>
                    <input type="email" id="new-user-email" class="form-input" placeholder="Enter email address" required>
                </div>
                
                <div class="form-group">
                    <label for="new-user-role" class="form-label">Role</label>
                    <select id="new-user-role" class="form-select" required>
                        <option value="">Select role</option>
                        <option value="chv">Community Health Volunteer</option>
                        <option value="supervisor">Health Supervisor</option>
                        <option value="admin">System Administrator</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="new-user-location" class="form-label">Location</label>
                    <input type="text" id="new-user-location" class="form-input" placeholder="Enter location" required>
                </div>
                
                <div class="form-group">
                    <label for="new-user-password" class="form-label">Temporary Password</label>
                    <input type="password" id="new-user-password" class="form-input" placeholder="Set temporary password" required>
                    <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem;">
                        User will be prompted to change password on first login
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn btn-outline w-full" data-close-modal>
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary w-full">
                        Create User
                    </button>
                </div>
            </form>
        `;
        this.showAdminActionModal('Add New User', 'Create a new system user account', content);
    }

    processAddUserForm() {
        const name = document.getElementById('new-user-name').value;
        const email = document.getElementById('new-user-email').value;
        const role = document.getElementById('new-user-role').value;
        const location = document.getElementById('new-user-location').value;
        const password = document.getElementById('new-user-password').value;

        // Basic validation
        if (!name || !email || !role || !location || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            // Create user using auth system
            auth.register({
                name,
                email,
                password,
                role,
                location
            });

            // Show success message and close modal
            alert('User created successfully!');
            this.hideAdminActionModal();
            
            // Refresh the admin dashboard to show new user
            if (auth.getCurrentUser().role === 'admin') {
                this.render();
            }
        } catch (error) {
            alert('Error creating user: ' + error.message);
        }
    }

    showEditUserForm(userId) {
        const user = auth.getAllUsers().find(u => u.id === userId);
        if (!user) {
            alert('User not found');
            return;
        }

        const content = `
            <form id="edit-user-form">
                <div class="form-group">
                    <label for="edit-user-name" class="form-label">Full Name</label>
                    <input type="text" id="edit-user-name" class="form-input" value="${user.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-user-email" class="form-label">Email Address</label>
                    <input type="email" id="edit-user-email" class="form-input" value="${user.email}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-user-role" class="form-label">Role</label>
                    <select id="edit-user-role" class="form-select" required>
                        <option value="chv" ${user.role === 'chv' ? 'selected' : ''}>Community Health Volunteer</option>
                        <option value="supervisor" ${user.role === 'supervisor' ? 'selected' : ''}>Health Supervisor</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>System Administrator</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-user-location" class="form-label">Location</label>
                    <input type="text" id="edit-user-location" class="form-input" value="${user.location}" required>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn btn-outline w-full" data-close-modal>
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary w-full">
                        Update User
                    </button>
                </div>
            </form>
        `;
        this.showAdminActionModal('Edit User', 'Update user information', content);
    }

    showDeleteUserConfirmation(userId) {
        const user = auth.getAllUsers().find(u => u.id === userId);
        if (!user) {
            alert('User not found');
            return;
        }

        const content = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Delete User</h3>
                <p style="color: var(--text-light); margin-bottom: 2rem;">
                    Are you sure you want to delete <strong>${user.name}</strong> (${user.email})? 
                    This action cannot be undone.
                </p>
                
                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-outline w-full" data-close-modal>
                        Cancel
                    </button>
                    <button class="btn btn-danger w-full" id="confirm-delete-user">
                        Delete User
                    </button>
                </div>
            </div>
        `;
        this.showAdminActionModal('Confirm Deletion', 'Permanently remove user from system', content);

        // Add event listener for confirmation
        setTimeout(() => {
            const confirmBtn = document.getElementById('confirm-delete-user');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    this.deleteUser(userId);
                });
            }
        }, 100);
    }

    deleteUser(userId) {
        try {
            // This would typically call an auth method to delete users
            // For now, we'll just show a message
            alert('User deletion functionality would be implemented here');
            this.hideAdminActionModal();
            
            // Refresh the view
            if (auth.getCurrentUser().role === 'admin') {
                this.render();
            }
        } catch (error) {
            alert('Error deleting user: ' + error.message);
        }
    }

    showAllHouseholds() {
        const content = `
            <div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">All Households</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">View and manage all registered households in the system.</p>
                
                <div style="background: var(--bg-light); padding: 2rem; border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🏠</div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Household Management</h4>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">This feature is currently under development.</p>
                    <p style="color: var(--text-light); font-size: 0.875rem;">
                        Total Households: <strong>2,847</strong><br>
                        Active CHV Assignments: <strong>1,234</strong>
                    </p>
                </div>
            </div>
        `;
        this.showAdminActionModal('All Households', 'Manage registered households', content);
    }

    showAllVisits() {
        const content = `
            <div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">All Visits</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">View and analyze all household visits recorded in the system.</p>
                
                <div style="background: var(--bg-light); padding: 2rem; border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Visit Analytics</h4>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">This feature is currently under development.</p>
                    <p style="color: var(--text-light); font-size: 0.875rem;">
                        Total Visits: <strong>12,459</strong><br>
                        This Week: <strong>347</strong><br>
                        Completion Rate: <strong>89%</strong>
                    </p>
                </div>
            </div>
        `;
        this.showAdminActionModal('All Visits', 'View visit records and analytics', content);
    }

    showAlerts() {
        const content = `
            <div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">System Alerts</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Monitor and manage system-wide alerts and notifications.</p>
                
                <div style="background: var(--bg-light); padding: 2rem; border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Alert Management</h4>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">This feature is currently under development.</p>
                </div>
            </div>
        `;
        this.showAdminActionModal('System Alerts', 'Monitor alerts and notifications', content);
    }

    showSystemSettings() {
        const content = `
            <div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">System Settings</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Configure system-wide settings and preferences.</p>
                
                <div style="background: var(--bg-light); padding: 2rem; border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚙️</div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">System Configuration</h4>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">This feature is currently under development.</p>
                </div>
            </div>
        `;
        this.showAdminActionModal('System Settings', 'Configure platform settings', content);
    }

    showReports() {
        const content = `
            <div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Reports & Analytics</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Generate and view system reports and analytics.</p>
                
                <div style="background: var(--bg-light); padding: 2rem; border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Report Generation</h4>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">This feature is currently under development.</p>
                </div>
            </div>
        `;
        this.showAdminActionModal('Reports & Analytics', 'Generate system reports', content);
    }

    showSecurityLogs() {
        const content = `
            <div>
                <h3 style="margin-bottom: 1rem; color: var(--text-dark);">Security Logs</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Monitor system security and access logs.</p>
                
                <div style="background: var(--bg-light); padding: 2rem; border-radius: var(--radius-md); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Security Monitoring</h4>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">This feature is currently under development.</p>
                </div>
            </div>
        `;
        this.showAdminActionModal('Security Logs', 'Monitor system security', content);
    }

    generateReport() {
        alert('Report generation functionality would be implemented here');
    }

    exportUsers() {
        alert('User export functionality would be implemented here');
    }

    navigateTo(page) {
        this.currentPage = page;
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        if (auth.isLoggedIn()) {
            this.renderMainLayout(app);
        } else if (this.currentPage === 'landing') {
            this.renderLandingPage(app);
        } else {
            this.renderLoginPage(app);
        }
    }

    renderLandingPage(container) {
        container.innerHTML = `
            <div class="landing-page">
                <header class="landing-header">
                    <nav class="landing-nav">
                        <a href="#" class="landing-logo">
                            <div class="landing-logo-icon">A</div>
                            <span>AfyaTrack</span>
                        </a>
                        <div class="hero-buttons">
                            <button class="btn btn-primary" data-get-started>
                                Get Started
                            </button>
                            <button class="btn btn-outline" style="background: rgba(255,255,255,0.1); color: white; border-color: white;" data-learn-more>
                                Learn More
                            </button>
                        </div>
                    </nav>
                </header>

                <section class="landing-hero">
                    <h1 class="hero-title">Transforming Community Healthcare in Kenya</h1>
                    <p class="hero-subtitle">
                        AfyaTrack is a comprehensive platform that empowers community health volunteers, 
                        supervisors, and health authorities to work together in real-time for better 
                        health outcomes and early disease detection.
                    </p>
                    <div class="hero-buttons">
                        <button class="btn btn-primary" data-get-started>
                            Start Using AfyaTrack
                        </button>
                        <button class="btn btn-outline" style="background: rgba(255,255,255,0.1); color: white; border-color: white;" data-learn-more>
                            Learn More
                        </button>
                    </div>
                </section>

                <!-- Learn More Section (initially hidden) -->
                <section class="learn-more-section" id="learn-more-section">
                    <div class="learn-more-content">
                        <h2 class="section-title">The Impact of AfyaTrack</h2>
                        <p class="section-subtitle">
                            Discover how our platform is revolutionizing community healthcare across Kenya
                        </p>
                        
                        <div class="impact-grid">
                            <div class="impact-card">
                                <div class="impact-number">70%</div>
                                <h3 class="impact-title">Faster Response Times</h3>
                                <p class="impact-description">
                                    Real-time alerts enable health officers to respond to outbreaks and 
                                    emergencies significantly faster than traditional reporting methods.
                                </p>
                            </div>
                            
                            <div class="impact-card">
                                <div class="impact-number">45%</div>
                                <h3 class="impact-title">Reduced Paperwork</h3>
                                <p class="impact-description">
                                    Digital reporting eliminates manual paperwork, allowing CHVs to 
                                    focus more on patient care and less on administrative tasks.
                                </p>
                            </div>
                            
                            <div class="impact-card">
                                <div class="impact-number">12+</div>
                                <h3 class="impact-title">Counties Served</h3>
                                <p class="impact-description">
                                    Currently operational in 12 counties across Kenya, with plans to 
                                    expand nationwide to support Universal Health Coverage.
                                </p>
                            </div>
                        </div>

                        <div class="testimonials">
                            <h2 class="section-title">Success Stories</h2>
                            <p class="section-subtitle">Hear from those making a difference with AfyaTrack</p>
                            
                            <div class="testimonial-grid">
                                <div class="testimonial-card">
                                    <p class="testimonial-text">
                                        "AfyaTrack helped us detect a cholera outbreak in Kibera 3 days earlier 
                                        than traditional methods. We were able to contain it before it spread 
                                        to neighboring communities."
                                    </p>
                                    <div class="testimonial-author">
                                        <div class="author-avatar">D</div>
                                        <div class="author-info">
                                            <div class="author-name">Dr. Wanjiku Mwangi</div>
                                            <div class="author-role">County Health Officer, Nairobi</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="testimonial-card">
                                    <p class="testimonial-text">
                                        "As a CHV, I used to spend hours on paperwork. Now with AfyaTrack, 
                                        I can record visits instantly and focus on providing better care 
                                        to my community members."
                                    </p>
                                    <div class="testimonial-author">
                                        <div class="author-avatar">S</div>
                                        <div class="author-info">
                                            <div class="author-name">Sarah Otieno</div>
                                            <div class="author-role">Community Health Volunteer, Kisumu</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="testimonial-card">
                                    <p class="testimonial-text">
                                        "The data analytics from AfyaTrack have transformed how we allocate 
                                        resources. We can now identify high-risk areas and deploy 
                                        interventions proactively."
                                    </p>
                                    <div class="testimonial-author">
                                        <div class="author-avatar">J</div>
                                        <div class="author-info">
                                            <div class="author-name">James Kariuki</div>
                                            <div class="author-role">Public Health Director, Mombasa</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="uco-section">
                            <h2 class="uco-title">Supporting Kenya's Universal Health Coverage</h2>
                            <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.9;">
                                AfyaTrack aligns with Kenya's UHC goals by making quality healthcare 
                                accessible to all communities through technology and innovation.
                            </p>
                            
                            <div class="uco-points">
                                <div class="uco-point">
                                    <div class="uco-icon">🏥</div>
                                    <div class="uco-text">Accessible Healthcare</div>
                                </div>
                                <div class="uco-point">
                                    <div class="uco-icon">📱</div>
                                    <div class="uco-text">Digital Innovation</div>
                                </div>
                                <div class="uco-point">
                                    <div class="uco-icon">👥</div>
                                    <div class="uco-text">Community Empowerment</div>
                                </div>
                                <div class="uco-point">
                                    <div class="uco-icon">📊</div>
                                    <div class="uco-text">Data-Driven Decisions</div>
                                </div>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 3rem;">
                            <h2 style="margin-bottom: 1rem; color: var(--text-dark);">Ready to Make a Difference?</h2>
                            <p style="color: var(--text-light); margin-bottom: 2rem;">
                                Join the growing network of healthcare professionals using AfyaTrack
                            </p>
                            <button class="btn btn-primary" data-get-started>
                                Get Started Today
                            </button>
                        </div>
                    </div>
                </section>

                <section class="roles-section">
                    <h2 class="section-title">Join the Network</h2>
                    <p class="section-subtitle">
                        Select your role to access the platform
                    </p>
                    
                    <div class="roles-grid">
                        <div class="role-card admin" data-role-select="admin">
                            <div class="role-icon">👑</div>
                            <h3 class="role-title">System Administrator</h3>
                            <p class="role-description">
                                Full system oversight, user management, and comprehensive analytics
                            </p>
                            <div class="btn btn-outline">System Admin Login</div>
                        </div>
                        
                        <div class="role-card supervisor" data-role-select="supervisor">
                            <div class="role-icon">👨‍💼</div>
                            <h3 class="role-title">Health Supervisor</h3>
                            <p class="role-description">
                                Manage CHV assignments, monitor community health data, and coordinate responses
                            </p>
                            <div class="btn btn-outline">Supervisor Access</div>
                        </div>
                        
                        <div class="role-card chv" data-role-select="chv">
                            <div class="role-icon">👩‍⚕️</div>
                            <h3 class="role-title">Community Health Volunteer</h3>
                            <p class="role-description">
                                Record household visits, report symptoms, and provide community health services
                            </p>
                            <div class="btn btn-outline">CHV Access</div>
                        </div>
                    </div>
                </section>

                <footer class="landing-footer">
                    <div class="footer-content">
                        <p>&copy; 2024 AfyaTrack. Supporting Kenya's Universal Health Coverage Goals.</p>
                    </div>
                </footer>

                <!-- Back to Top Button -->
                <a href="#" class="back-to-top" id="back-to-top" style="display: none;">↑</a>
            </div>

            <!-- Auth Modal for System Admin (Login Only) -->
            <div class="auth-modal hidden" id="auth-modal-admin">
                <div class="modal-content">
                    <button class="modal-close" data-close-modal>&times;</button>
                    
                    <div class="card-header text-center">
                        <div class="logo" style="justify-content: center; margin-bottom: 1rem;">
                            <div class="logo-icon">A</div>
                            <span>AfyaTrack</span>
                        </div>
                        <h2 style="color: var(--text-dark); margin-bottom: 0.5rem;">System Administrator</h2>
                        <p style="color: var(--text-light);">Access the administrative dashboard</p>
                    </div>
                    
                    <form id="login-form-admin">
                        <div class="form-group">
                            <label for="login-email-admin" class="form-label">Email Address</label>
                            <input type="email" id="login-email-admin" class="form-input" placeholder="Enter admin email" required value="admin@afyatrack.com">
                            <div class="form-error" id="login-email-error-admin"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="login-password-admin" class="form-label">Password</label>
                            <input type="password" id="login-password-admin" class="form-input" placeholder="Enter admin password" required>
                            <div class="form-error" id="login-password-error-admin"></div>
                        </div>

                        <div class="alert alert-danger hidden" id="login-error-admin">
                            Invalid admin credentials
                        </div>

                        <div style="background: #f0fdf4; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; border-left: 4px solid var(--primary-teal);">
                            <p style="color: var(--text-dark); font-size: 0.875rem; margin: 0;">
                                <strong>Predefined Admin Account:</strong><br>
                                Email: admin@afyatrack.com<br>
                                Password: Admin@2024
                            </p>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full" id="login-btn-admin">
                            Sign In as System Admin
                        </button>
                    </form>
                </div>
            </div>

            <!-- Auth Modal for Supervisor & CHV (Login + Registration) -->
            <div class="auth-modal hidden" id="auth-modal-general">
                <div class="modal-content">
                    <button class="modal-close" data-close-modal>&times;</button>
                    
                    <div class="card-header text-center">
                        <div class="logo" style="justify-content: center; margin-bottom: 1rem;">
                            <div class="logo-icon">A</div>
                            <span>AfyaTrack</span>
                        </div>
                        <h2 style="color: var(--text-dark); margin-bottom: 0.5rem;" id="modal-title-general">Welcome</h2>
                        <p style="color: var(--text-light);" id="modal-subtitle-general">Access your account</p>
                    </div>
                    
                    <div class="auth-tabs" id="auth-tabs-general">
                        <button class="auth-tab active" data-auth-tab="login">Sign In</button>
                        <button class="auth-tab" data-auth-tab="register">Register</button>
                    </div>

                    <!-- Login Form -->
                    <form id="login-form-general" class="auth-form active">
                        <div class="form-group">
                            <label for="login-email-general" class="form-label">Email Address</label>
                            <input type="email" id="login-email-general" class="form-input" placeholder="Enter your email" required>
                            <div class="form-error" id="login-email-error-general"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="login-password-general" class="form-label">Password</label>
                            <input type="password" id="login-password-general" class="form-input" placeholder="Enter your password" required>
                            <div class="form-error" id="login-password-error-general"></div>
                        </div>

                        <div class="alert alert-danger hidden" id="login-error-general">
                            Invalid email or password
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full" id="login-btn-general">
                            Sign In
                        </button>

                        <div style="text-align: center; margin-top: 1rem;">
                            <p style="color: var(--text-light); font-size: 0.875rem;">
                                Don't have an account? <a href="#" style="color: var(--primary-teal); text-decoration: none; font-weight: 500;" onclick="document.querySelector('[data-auth-tab=\\'register\\']').click()">Register here</a>
                            </p>
                        </div>
                    </form>

                    <!-- Registration Form -->
                    <form id="register-form-general" class="auth-form">
                        <div class="form-group">
                            <label for="register-name-general" class="form-label">Full Name</label>
                            <input type="text" id="register-name-general" class="form-input" placeholder="Enter your full name" required>
                            <div class="form-error" id="register-name-error-general"></div>
                        </div>

                        <div class="form-group">
                            <label for="register-email-general" class="form-label">Email Address</label>
                            <input type="email" id="register-email-general" class="form-input" placeholder="Enter your email" required>
                            <div class="form-error" id="register-email-error-general"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="register-password-general" class="form-label">Password</label>
                            <input type="password" id="register-password-general" class="form-input" placeholder="Create a password (min. 6 characters)" required>
                            <div class="form-error" id="register-password-error-general"></div>
                        </div>

                        <div class="form-group">
                            <label for="register-location-general" class="form-label">Location</label>
                            <input type="text" id="register-location-general" class="form-input" placeholder="Enter your location (e.g., Nairobi County)" required>
                            <div class="form-error" id="register-location-error-general"></div>
                        </div>

                        <div class="alert alert-danger hidden" id="register-error-general"></div>
                        <div class="alert alert-success hidden" id="register-success-general">
                            Registration successful! You are now being logged in...
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full" id="register-btn-general">
                            Create Account
                        </button>

                        <div style="text-align: center; margin-top: 1rem;">
                            <p style="color: var(--text-light); font-size: 0.875rem;">
                                Already have an account? <a href="#" style="color: var(--primary-teal); text-decoration: none; font-weight: 500;" onclick="document.querySelector('[data-auth-tab=\\'login\\']').click()">Sign in here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Initialize the learn more section as hidden
        const learnMoreSection = document.getElementById('learn-more-section');
        if (learnMoreSection) {
            learnMoreSection.classList.remove('visible');
        }

        // Add scroll event listener for back to top button
        this.setupScrollEffects();
    }

    setupScrollEffects() {
        // Back to top button functionality
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    showLearnMore() {
        const learnMoreSection = document.getElementById('learn-more-section');
        if (learnMoreSection) {
            // Show the section
            learnMoreSection.classList.add('visible');
            
            // Scroll to the section smoothly
            learnMoreSection.scrollIntoView({ behavior: 'smooth' });
            
            // Add entrance animation
            setTimeout(() => {
                learnMoreSection.style.opacity = '1';
                learnMoreSection.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    showRoleSelection() {
        // Scroll to roles section
        const rolesSection = document.querySelector('.roles-section');
        if (rolesSection) {
            rolesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showAuthModal(role) {
        this.selectedRole = role;
        
        if (role === 'admin') {
            this.showAdminModal();
        } else {
            this.showGeneralModal(role);
        }
    }

    showAdminModal() {
        const modal = document.getElementById('auth-modal-admin');
        if (modal) {
            modal.classList.remove('hidden');
            this.clearFormErrors('admin');
        }
    }

    showGeneralModal(role) {
        const modal = document.getElementById('auth-modal-general');
        const modalTitle = document.getElementById('modal-title-general');
        const modalSubtitle = document.getElementById('modal-subtitle-general');

        if (modal && modalTitle && modalSubtitle) {
            const roleTitles = {
                'supervisor': 'Health Supervisor',
                'chv': 'Community Health Volunteer'
            };

            modalTitle.textContent = roleTitles[role];
            modalSubtitle.textContent = `Access the ${roleTitles[role]} platform`;
            
            modal.classList.remove('hidden');
            this.switchAuthTab('login');
            this.clearFormErrors('general');
        }
    }

    hideAuthModal() {
        // Hide both modals
        document.getElementById('auth-modal-admin').classList.add('hidden');
        document.getElementById('auth-modal-general').classList.add('hidden');
    }

    switchAuthTab(tab) {
        // Update tabs
        document.querySelectorAll('#auth-tabs-general .auth-tab').forEach(tabElement => {
            tabElement.classList.remove('active');
        });
        document.querySelector(`#auth-tabs-general [data-auth-tab="${tab}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('#auth-modal-general .auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tab}-form-general`).classList.add('active');

        // Clear errors
        this.clearFormErrors('general');
    }

    clearFormErrors(type = 'general') {
        const suffix = type === 'admin' ? '-admin' : '-general';
        
        // Clear all error messages
        document.querySelectorAll(`.form-error`).forEach(error => {
            if (error.id.includes(suffix)) {
                error.classList.remove('show');
                error.textContent = '';
            }
        });
        
        // Hide alert messages
        document.querySelectorAll('.alert').forEach(alert => {
            if (alert.id.includes(suffix)) {
                alert.classList.add('hidden');
            }
        });
    }

    showFormError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    async handleLogin() {
        const isAdmin = this.selectedRole === 'admin';
        const suffix = isAdmin ? '-admin' : '-general';
        
        const email = document.getElementById(`login-email${suffix}`).value;
        const password = document.getElementById(`login-password${suffix}`).value;
        const loginBtn = document.getElementById(`login-btn${suffix}`);
        const loginError = document.getElementById(`login-error${suffix}`);
        
        // Clear previous errors
        this.clearFormErrors(isAdmin ? 'admin' : 'general');

        // Basic validation
        if (!email) {
            this.showFormError(`login-email-error${suffix}`, 'Email is required');
            return;
        }

        if (!password) {
            this.showFormError(`login-password-error${suffix}`, 'Password is required');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';

        try {
            await auth.login(email, password);
            this.hideAuthModal();
            this.render();
        } catch (error) {
            loginError.textContent = error.message;
            loginError.classList.remove('hidden');
            loginBtn.disabled = false;
            loginBtn.textContent = isAdmin ? 'Sign In as System Admin' : 'Sign In';
        }
    }

    async handleRegistration() {
        const name = document.getElementById('register-name-general').value;
        const email = document.getElementById('register-email-general').value;
        const password = document.getElementById('register-password-general').value;
        const location = document.getElementById('register-location-general').value;
        const registerBtn = document.getElementById('register-btn-general');
        const registerError = document.getElementById('register-error-general');
        const registerSuccess = document.getElementById('register-success-general');
        
        // Clear previous errors
        this.clearFormErrors('general');

        // Validation
        let hasErrors = false;

        if (!name) {
            this.showFormError('register-name-error-general', 'Full name is required');
            hasErrors = true;
        }

        if (!email) {
            this.showFormError('register-email-error-general', 'Email is required');
            hasErrors = true;
        }

        if (!password) {
            this.showFormError('register-password-error-general', 'Password is required');
            hasErrors = true;
        } else if (password.length < 6) {
            this.showFormError('register-password-error-general', 'Password must be at least 6 characters long');
            hasErrors = true;
        }

        if (!location) {
            this.showFormError('register-location-error-general', 'Location is required');
            hasErrors = true;
        }

        if (hasErrors) return;

        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating Account...';

        try {
            await auth.register({
                name,
                email,
                password,
                role: this.selectedRole,
                location
            });

            // Show success message
            registerSuccess.classList.remove('hidden');
            
            // Wait a moment then redirect
            setTimeout(() => {
                this.hideAuthModal();
                this.render();
            }, 2000);

        } catch (error) {
            registerError.textContent = error.message;
            registerError.classList.remove('hidden');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        }
    }

    renderMainLayout(container) {
        const user = auth.getCurrentUser();
        const isAdmin = user.role === 'admin';
        
        container.innerHTML = `
            <div class="app-container">
                ${this.renderSidebar(isAdmin)}
                <div class="main-content">
                    ${this.renderHeader(user)}
                    <main id="main-content">
                        ${this.renderCurrentPage()}
                    </main>
                </div>
            </div>
        `;
    }

    renderSidebar(isAdmin) {
        const adminNav = `
            <a href="#" class="nav-item active" data-nav="admin-dashboard">
                <div class="nav-icon">📊</div>
                <span class="nav-text">Admin Dashboard</span>
            </a>
            <a href="#" class="nav-item" data-nav="manage-users">
                <div class="nav-icon">👥</div>
                <span class="nav-text">User Management</span>
            </a>
            <a href="#" class="nav-item" data-nav="system-analytics">
                <div class="nav-icon">📈</div>
                <span class="nav-text">System Analytics</span>
            </a>
            <a href="#" class="nav-item" data-nav="all-households">
                <div class="nav-icon">🏠</div>
                <span class="nav-text">All Households</span>
            </a>
            <a href="#" class="nav-item" data-nav="all-visits">
                <div class="nav-icon">📝</div>
                <span class="nav-text">All Visits</span>
            </a>
        `;

        const supervisorNav = `
            <a href="#" class="nav-item active" data-nav="supervisor-dashboard">
                <div class="nav-icon">📊</div>
                <span class="nav-text">Dashboard</span>
            </a>
            <a href="#" class="nav-item" data-nav="assign-chv">
                <div class="nav-icon">👥</div>
                <span class="nav-text">Assign CHV</span>
            </a>
            <a href="#" class="nav-item" data-nav="register-household">
                <div class="nav-icon">🏠</div>
                <span class="nav-text">Register Household</span>
            </a>
            <a href="#" class="nav-item" data-nav="register-patient">
                <div class="nav-icon">👤</div>
                <span class="nav-text">Register Patient</span>
            </a>
            <a href="#" class="nav-item" data-nav="view-assignments">
                <div class="nav-icon">📋</div>
                <span class="nav-text">View Assignments</span>
            </a>
        `;

        const chvNav = `
            <a href="#" class="nav-item active" data-nav="chv-dashboard">
                <div class="nav-icon">📊</div>
                <span class="nav-text">Dashboard</span>
            </a>
            <a href="#" class="nav-item" data-nav="chv-visits">
                <div class="nav-icon">📝</div>
                <span class="nav-text">Record Visit</span>
            </a>
            <a href="#" class="nav-item" data-nav="chv-households">
                <div class="nav-icon">🏠</div>
                <span class="nav-text">My Households</span>
            </a>
        `;

        const navContent = isAdmin ? adminNav : (auth.getCurrentUser().role === 'supervisor' ? supervisorNav : chvNav);

        return `
            <aside class="sidebar">
                <div class="sidebar-nav">
                    <div class="nav-section">
                        <div class="nav-title">Main Menu</div>
                        ${navContent}
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-title">System</div>
                        <a href="#" class="nav-item" data-nav="alerts">
                            <div class="nav-icon">⚠️</div>
                            <span class="nav-text">Alerts</span>
                        </a>
                        <a href="#" class="nav-item" data-nav="reports">
                            <div class="nav-icon">📈</div>
                            <span class="nav-text">Reports</span>
                        </a>
                        ${isAdmin ? `
                        <a href="#" class="nav-item" data-nav="system-settings">
                            <div class="nav-icon">⚙️</div>
                            <span class="nav-text">System Settings</span>
                        </a>
                        ` : ''}
                    </div>
                </div>
            </aside>
        `;
    }

    renderHeader(user) {
        return `
            <header class="header">
                <div class="header-content">
                    <div class="logo">
                        <div class="logo-icon">A</div>
                        <span>AfyaTrack</span>
                    </div>
                    
                    <div class="user-menu">
                        <div class="user-info">
                            <div class="user-avatar">
                                ${user.name.charAt(0)}
                            </div>
                            <div>
                                <div style="font-weight: 500; font-size: 0.875rem;">${user.name}</div>
                                <div style="font-size: 0.75rem; color: var(--text-light);">${user.role} • ${user.location}</div>
                            </div>
                        </div>
                        <button class="btn btn-outline btn-sm" data-logout>Logout</button>
                    </div>
                </div>
            </header>
        `;
    }

    renderCurrentPage() {
        const user = auth.getCurrentUser();
        
        switch(user.role) {
            case 'admin':
                return this.renderAdminDashboard();
            case 'supervisor':
                return this.renderSupervisorPage();
            case 'chv':
                return this.renderCHVPage();
            default:
                return '<h1>Welcome to AfyaTrack</h1>';
        }
    }

    renderAdminDashboard() {
        const users = auth.getAllUsers();
        const predefinedUsers = users.filter(user => user.isPredefined);
        const registeredUsers = users.filter(user => !user.isPredefined);
        
        // Mock data for dashboard stats
        const dashboardStats = {
            totalUsers: users.length,
            totalHouseholds: 2847,
            totalVisits: 12459,
            activeAlerts: 47,
            chvCount: users.filter(u => u.role === 'chv').length,
            supervisorCount: users.filter(u => u.role === 'supervisor').length,
            adminCount: users.filter(u => u.role === 'admin').length,
            recentActivities: [
                {
                    type: 'user_registration',
                    description: 'New CHV registered - Jane Muthoni',
                    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                    user: 'Jane Muthoni'
                },
                {
                    type: 'alert_raised',
                    description: 'High fever outbreak reported in Kibera',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    user: 'System'
                },
                {
                    type: 'user_login',
                    description: 'Health Supervisor logged in',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    user: 'Dr. Kamau'
                }
            ],
            systemHealth: {
                uptime: '99.8%',
                responseTime: '120ms',
                activeSessions: users.length,
                databaseSize: '2.4 GB'
            }
        };

        return `
            <div class="dashboard">
                <!-- Header Section -->
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                        <h1 style="font-size: 1.875rem; font-weight: 700; color: var(--text-dark);">Admin Dashboard</h1>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-outline btn-sm" data-admin-action="generate-report">
                                📊 Generate Report
                            </button>
                            <button class="btn btn-primary btn-sm" data-admin-action="system-settings">
                                ⚙️ System Settings
                            </button>
                        </div>
                    </div>
                    <p style="color: var(--text-light);">Complete system overview and management console</p>
                </div>

                <!-- Main Stats Grid -->
                <div class="stats-grid">
                    <div class="stat-card" data-admin-action="manage-users" style="cursor: pointer;">
                        <div class="stat-icon teal">👥</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardStats.totalUsers}</div>
                            <div class="stat-label">Total Users</div>
                            <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                                <span style="font-size: 0.75rem; color: var(--text-light);">CHV: ${dashboardStats.chvCount}</span>
                                <span style="font-size: 0.75rem; color: var(--text-light);">Supervisor: ${dashboardStats.supervisorCount}</span>
                                <span style="font-size: 0.75rem; color: var(--text-light);">Admin: ${dashboardStats.adminCount}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card" data-admin-action="all-households" style="cursor: pointer;">
                        <div class="stat-icon teal">🏠</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardStats.totalHouseholds.toLocaleString()}</div>
                            <div class="stat-label">Households</div>
                            <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.5rem;">
                                📈 12% increase this month
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card" data-admin-action="all-visits" style="cursor: pointer;">
                        <div class="stat-icon gold">📝</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardStats.totalVisits.toLocaleString()}</div>
                            <div class="stat-label">Total Visits</div>
                            <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.5rem;">
                                🎯 89% completion rate
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card" data-admin-action="alerts" style="cursor: pointer;">
                        <div class="stat-icon teal">⚠️</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardStats.activeAlerts}</div>
                            <div class="stat-label">Active Alerts</div>
                            <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.5rem;">
                                🔴 3 critical • 🟡 12 medium
                            </div>
                        </div>
                    </div>
                </div>

                <!-- System Overview Section -->
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <!-- Users Management -->
                    <div class="card">
                        <div class="card-header" style="display: flex; justify-content: between; align-items: center;">
                            <h2 class="card-title">User Management</h2>
                            <button class="btn btn-primary btn-sm" data-admin-action="manage-users">
                                👥 Manage Users
                            </button>
                        </div>
                        <div class="card-body">
                            <div style="margin-bottom: 1.5rem;">
                                <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-dark);">
                                    User Distribution
                                </h3>
                                <div style="display: grid; gap: 0.75rem;">
                                    <div style="display: flex; justify-content: between; align-items: center; padding: 0.75rem; background: var(--bg-light); border-radius: var(--radius-md);">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <div style="width: 12px; height: 12px; background: var(--primary-teal); border-radius: 50%;"></div>
                                            <span>Community Health Volunteers</span>
                                        </div>
                                        <strong>${dashboardStats.chvCount}</strong>
                                    </div>
                                    <div style="display: flex; justify-content: between; align-items: center; padding: 0.75rem; background: var(--bg-light); border-radius: var(--radius-md);">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <div style="width: 12px; height: 12px; background: var(--accent-gold); border-radius: 50%;"></div>
                                            <span>Health Supervisors</span>
                                        </div>
                                        <strong>${dashboardStats.supervisorCount}</strong>
                                    </div>
                                    <div style="display: flex; justify-content: between; align-items: center; padding: 0.75rem; background: var(--bg-light); border-radius: var(--radius-md);">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <div style="width: 12px; height: 12px; background: #8b5cf6; border-radius: 50%;"></div>
                                            <span>System Administrators</span>
                                        </div>
                                        <strong>${dashboardStats.adminCount}</strong>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-dark);">
                                    Recent Registrations
                                </h3>
                                <div style="display: grid; gap: 0.75rem;">
                                    ${registeredUsers.slice(0, 3).map(user => `
                                        <div style="display: flex; justify-content: between; align-items: center; padding: 0.75rem; background: var(--bg-light); border-radius: var(--radius-md);">
                                            <div>
                                                <div style="font-weight: 500;">${user.name}</div>
                                                <div style="font-size: 0.875rem; color: var(--text-light);">${user.email}</div>
                                            </div>
                                            <div style="text-align: right;">
                                                <div style="font-size: 0.875rem; color: var(--text-light);">${user.role}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-light);">${new Date(user.registeredAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                    ${registeredUsers.length === 0 ? `
                                        <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
                                            <p>No registered users yet</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Health -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">System Health</h2>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 1rem;">
                                <div style="display: flex; justify-content: between; align-items: center; padding: 1rem; background: #f0fdf4; border-radius: var(--radius-md); border-left: 4px solid var(--primary-teal);">
                                    <div>
                                        <div style="font-weight: 500; color: var(--primary-teal);">System Uptime</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">Last 30 days</div>
                                    </div>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-teal);">${dashboardStats.systemHealth.uptime}</div>
                                </div>
                                
                                <div style="display: flex; justify-content: between; align-items: center; padding: 1rem; background: #fffbeb; border-radius: var(--radius-md); border-left: 4px solid var(--accent-gold);">
                                    <div>
                                        <div style="font-weight: 500; color: var(--accent-gold);">Avg Response Time</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">API calls</div>
                                    </div>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-gold);">${dashboardStats.systemHealth.responseTime}</div>
                                </div>
                                
                                <div style="display: flex; justify-content: between; align-items: center; padding: 1rem; background: #e0e7ff; border-radius: var(--radius-md); border-left: 4px solid #4f46e5;">
                                    <div>
                                        <div style="font-weight: 500; color: #4f46e5;">Active Sessions</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">Current users</div>
                                    </div>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: #4f46e5;">${dashboardStats.systemHealth.activeSessions}</div>
                                </div>
                                
                                <div style="display: flex; justify-content: between; align-items: center; padding: 1rem; background: #f3e8ff; border-radius: var(--radius-md); border-left: 4px solid #8b5cf6;">
                                    <div>
                                        <div style="font-weight: 500; color: #8b5cf6;">Database Size</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">Total storage</div>
                                    </div>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: #8b5cf6;">${dashboardStats.systemHealth.databaseSize}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities & Quick Actions -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <!-- Recent Activities -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Recent Activities</h2>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 1rem;">
                                ${dashboardStats.recentActivities.map(activity => `
                                    <div style="display: flex; gap: 1rem; padding: 1rem; background: var(--bg-light); border-radius: var(--radius-md);">
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-teal); display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem;">
                                            ${activity.type === 'user_registration' ? '👤' : 
                                              activity.type === 'alert_raised' ? '⚠️' : 
                                              '🔐'}
                                        </div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 500; margin-bottom: 0.25rem;">${activity.description}</div>
                                            <div style="font-size: 0.875rem; color: var(--text-light);">
                                                ${new Date(activity.timestamp).toLocaleString()} • By ${activity.user}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Quick Actions</h2>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 1rem;">
                                <button class="btn btn-outline w-full" style="justify-content: start; padding: 1rem;" data-admin-action="manage-users">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; color: var(--primary-teal); margin-right: 1rem;">
                                        👥
                                    </div>
                                    <div style="text-align: left;">
                                        <div style="font-weight: 500;">Manage Users</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">Add, edit, or remove users</div>
                                    </div>
                                </button>
                                
                                <button class="btn btn-outline w-full" style="justify-content: start; padding: 1rem;" data-admin-action="view-reports">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #fffbeb; display: flex; align-items: center; justify-content: center; color: var(--accent-gold); margin-right: 1rem;">
                                        📊
                                    </div>
                                    <div style="text-align: left;">
                                        <div style="font-weight: 500;">View Reports</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">Generate system analytics</div>
                                    </div>
                                </button>
                                
                                <button class="btn btn-outline w-full" style="justify-content: start; padding: 1rem;" data-admin-action="system-settings">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; color: var(--primary-teal); margin-right: 1rem;">
                                        ⚙️
                                    </div>
                                    <div style="text-align: left;">
                                        <div style="font-weight: 500;">System Settings</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">Configure platform settings</div>
                                    </div>
                                </button>
                                
                                <button class="btn btn-outline w-full" style="justify-content: start; padding: 1rem;" data-admin-action="security-logs">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #dc2626; margin-right: 1rem;">
                                        🛡️
                                    </div>
                                    <div style="text-align: left;">
                                        <div style="font-weight: 500;">Security Logs</div>
                                        <div style="font-size: 0.875rem; color: var(--text-light);">Monitor system security</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- All Users Table -->
                <div class="card">
                    <div class="card-header" style="display: flex; justify-content: between; align-items: center;">
                        <h2 class="card-title">All Registered Users</h2>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline btn-sm" data-admin-action="export-users">
                                📥 Export
                            </button>
                            <button class="btn btn-primary btn-sm" data-admin-action="add-user">
                                👤 Add User
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table">
                            <table style="width: 100%;">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Registered</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${users.map(user => `
                                        <tr>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: ${user.role === 'admin' ? '#fef3c7' : user.role === 'supervisor' ? '#dcfce7' : '#e0e7ff'}; display: flex; align-items: center; justify-content: center; color: ${user.role === 'admin' ? '#d97706' : user.role === 'supervisor' ? '#059669' : '#4f46e5'}; font-weight: 500; font-size: 0.75rem;">
                                                        ${user.name.charAt(0)}
                                                    </div>
                                                    ${user.name}
                                                    ${user.isPredefined ? '<span style="background: #fef3c7; color: #d97706; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin-left: 0.5rem;">Predefined</span>' : ''}
                                                </div>
                                            </td>
                                            <td>${user.email}</td>
                                            <td>
                                                <span style="padding: 0.25rem 0.75rem; background: ${user.role === 'admin' ? '#fef3c7' : user.role === 'supervisor' ? '#dcfce7' : '#e0e7ff'}; color: ${user.role === 'admin' ? '#d97706' : user.role === 'supervisor' ? '#059669' : '#4f46e5'}; border-radius: 1rem; font-size: 0.75rem; font-weight: 500;">
                                                    ${user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>${user.location}</td>
                                            <td>
                                                <span style="padding: 0.25rem 0.75rem; background: #dcfce7; color: #059669; border-radius: 1rem; font-size: 0.75rem; font-weight: 500;">
                                                    Active
                                                </span>
                                            </td>
                                            <td>${new Date(user.registeredAt).toLocaleDateString()}</td>
                                            <td>
                                                <div style="display: flex; gap: 0.5rem;">
                                                    <button class="btn btn-outline btn-sm" style="padding: 0.25rem 0.5rem;" data-admin-action="edit-user" data-user-id="${user.id}">
                                                        ✏️
                                                    </button>
                                                    ${!user.isPredefined ? `
                                                        <button class="btn btn-outline btn-sm" style="padding: 0.25rem 0.5rem; color: #dc2626;" data-admin-action="delete-user" data-user-id="${user.id}">
                                                            🗑️
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        
                        ${users.length === 0 ? `
                            <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                                <h3 style="margin-bottom: 0.5rem; color: var(--text-dark);">No Users Found</h3>
                                <p>There are no users registered in the system yet.</p>
                                <button class="btn btn-primary" style="margin-top: 1rem;" data-admin-action="add-user">
                                    👤 Add First User
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- System Information Footer -->
                <div style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                        <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">System Version</h4>
                            <p style="color: var(--text-light); font-size: 0.875rem;">AfyaTrack v2.1.0</p>
                        </div>
                        <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Last Backup</h4>
                            <p style="color: var(--text-light); font-size: 0.875rem;">${new Date().toLocaleDateString()} 02:00 AM</p>
                        </div>
                        <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Support</h4>
                            <p style="color: var(--text-light); font-size: 0.875rem;">support@afyatrack.com</p>
                        </div>
                        <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Server Status</h4>
                            <p style="color: var(--text-light); font-size: 0.875rem;">
                                <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 0.5rem;"></span>
                                All Systems Operational
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Admin Action Modal -->
                <div class="auth-modal hidden" id="admin-action-modal">
                    <div class="modal-content">
                        <button class="modal-close" data-close-modal>&times;</button>
                        <div class="card-header text-center">
                            <h2 style="color: var(--text-dark); margin-bottom: 0.5rem;" id="admin-modal-title">Admin Action</h2>
                            <p style="color: var(--text-light);" id="admin-modal-subtitle">Processing your request</p>
                        </div>
                        <div class="card-body">
                            <div id="admin-modal-content">
                                <!-- Content will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSupervisorPage() {
        const user = auth.getCurrentUser();
        
        // Mock data for supervisor dashboard
        const dashboardData = {
            assignedCHVs: [
                { id: 1, name: 'Sarah Otieno', households: 24, visitsThisWeek: 18, status: 'active', location: 'Kibera' },
                { id: 2, name: 'John Kamau', households: 18, visitsThisWeek: 12, status: 'active', location: 'Mathare' },
                { id: 3, name: 'Grace Mwende', households: 22, visitsThisWeek: 15, status: 'inactive', location: 'Kawangware' },
                { id: 4, name: 'Michael Ochieng', households: 16, visitsThisWeek: 10, status: 'active', location: 'Dandora' }
            ],
            recentAlerts: [
                { id: 1, type: 'high_fever', severity: 'high', chv: 'Sarah Otieno', location: 'Kibera', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'pending' },
                { id: 2, type: 'malaria_suspected', severity: 'medium', chv: 'John Kamau', location: 'Mathare', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'investigating' },
                { id: 3, type: 'diarrhea_outbreak', severity: 'high', chv: 'Grace Mwende', location: 'Kawangware', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), status: 'resolved' }
            ],
            householdStats: {
                total: 2847,
                visitedThisWeek: 347,
                pendingVisits: 89,
                highRisk: 23
            },
            performanceMetrics: {
                visitCompletion: 89,
                alertResponseTime: '2.3h',
                dataAccuracy: 94,
                chvSatisfaction: 87
            },
            upcomingTasks: [
                { id: 1, task: 'Review monthly reports', due: 'Today', priority: 'high' },
                { id: 2, task: 'Assign new households', due: 'Tomorrow', priority: 'medium' },
                { id: 3, task: 'Team meeting', due: 'Dec 15', priority: 'low' },
                { id: 4, task: 'Training session', due: 'Dec 18', priority: 'medium' }
            ]
        };

        return `
            <div class="dashboard supervisor-dashboard">
                <!-- Header Section -->
                <div class="dashboard-header">
                    <div class="header-content">
                        <div>
                            <h1 class="dashboard-title">Supervisor Dashboard</h1>
                            <p class="dashboard-subtitle">Welcome back, ${user.name}! Here's your community health overview.</p>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-outline btn-sm" data-nav="assign-chv">
                                👥 Assign CHV
                            </button>
                            <button class="btn btn-primary btn-sm" data-nav="register-household">
                                🏠 Register Household
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon teal">👥</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardData.assignedCHVs.length}</div>
                            <div class="stat-label">Assigned CHVs</div>
                            <div class="stat-trend">
                                <span class="trend-positive">+2 this month</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon gold">🏠</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardData.householdStats.total.toLocaleString()}</div>
                            <div class="stat-label">Total Households</div>
                            <div class="stat-trend">
                                <span class="trend-positive">${dashboardData.householdStats.visitedThisWeek} visited this week</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon teal">📝</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardData.householdStats.visitedThisWeek}</div>
                            <div class="stat-label">Weekly Visits</div>
                            <div class="stat-trend">
                                <span class="trend-positive">${dashboardData.performanceMetrics.visitCompletion}% completion</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon gold">⚠️</div>
                        <div class="stat-content">
                            <div class="stat-value">${dashboardData.recentAlerts.filter(a => a.status !== 'resolved').length}</div>
                            <div class="stat-label">Active Alerts</div>
                            <div class="stat-trend">
                                <span class="trend-warning">${dashboardData.householdStats.highRisk} high risk</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="dashboard-grid">
                    <!-- CHV Performance -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">CHV Performance</h2>
                            <button class="btn btn-outline btn-sm" data-nav="view-assignments">
                                View All
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="chv-performance-list">
                                ${dashboardData.assignedCHVs.map(chv => `
                                    <div class="chv-performance-item">
                                        <div class="chv-info">
                                            <div class="chv-avatar ${chv.status}">
                                                ${chv.name.charAt(0)}
                                            </div>
                                            <div class="chv-details">
                                                <div class="chv-name">${chv.name}</div>
                                                <div class="chv-location">${chv.location}</div>
                                            </div>
                                        </div>
                                        <div class="chv-stats">
                                            <div class="chv-stat">
                                                <div class="stat-number">${chv.households}</div>
                                                <div class="stat-label">Households</div>
                                            </div>
                                            <div class="chv-stat">
                                                <div class="stat-number">${chv.visitsThisWeek}</div>
                                                <div class="stat-label">Visits</div>
                                            </div>
                                        </div>
                                        <div class="chv-status">
                                            <span class="status-badge ${chv.status}">
                                                ${chv.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Recent Alerts -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Recent Alerts</h2>
                            <button class="btn btn-outline btn-sm" data-nav="alerts">
                                View All
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="alerts-list">
                                ${dashboardData.recentAlerts.map(alert => `
                                    <div class="alert-item ${alert.severity}">
                                        <div class="alert-icon">
                                            ${alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🔵'}
                                        </div>
                                        <div class="alert-content">
                                            <div class="alert-title">
                                                ${alert.type.replace('_', ' ').toUpperCase()}
                                            </div>
                                            <div class="alert-details">
                                                Reported by ${alert.chv} • ${alert.location}
                                            </div>
                                            <div class="alert-time">
                                                ${this.formatTimeAgo(alert.timestamp)}
                                            </div>
                                        </div>
                                        <div class="alert-status">
                                            <span class="status-badge ${alert.status}">
                                                ${alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Performance Metrics -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Performance Metrics</h2>
                        </div>
                        <div class="card-body">
                            <div class="metrics-grid">
                                <div class="metric-item">
                                    <div class="metric-value">${dashboardData.performanceMetrics.visitCompletion}%</div>
                                    <div class="metric-label">Visit Completion</div>
                                    <div class="metric-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${dashboardData.performanceMetrics.visitCompletion}%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">${dashboardData.performanceMetrics.alertResponseTime}</div>
                                    <div class="metric-label">Avg Response Time</div>
                                    <div class="metric-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 85%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">${dashboardData.performanceMetrics.dataAccuracy}%</div>
                                    <div class="metric-label">Data Accuracy</div>
                                    <div class="metric-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${dashboardData.performanceMetrics.dataAccuracy}%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">${dashboardData.performanceMetrics.chvSatisfaction}%</div>
                                    <div class="metric-label">CHV Satisfaction</div>
                                    <div class="metric-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${dashboardData.performanceMetrics.chvSatisfaction}%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Tasks -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Upcoming Tasks</h2>
                        </div>
                        <div class="card-body">
                            <div class="tasks-list">
                                ${dashboardData.upcomingTasks.map(task => `
                                    <div class="task-item ${task.priority}">
                                        <div class="task-checkbox">
                                            <input type="checkbox" id="task-${task.id}">
                                        </div>
                                        <div class="task-content">
                                            <div class="task-title">${task.task}</div>
                                            <div class="task-due">Due: ${task.due}</div>
                                        </div>
                                        <div class="task-priority">
                                            <span class="priority-badge ${task.priority}">
                                                ${task.priority.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Quick Actions</h2>
                        </div>
                        <div class="card-body">
                            <div class="quick-actions-grid">
                                <button class="quick-action-btn" data-nav="assign-chv">
                                    <div class="action-icon">👥</div>
                                    <div class="action-text">Assign CHV</div>
                                </button>
                                <button class="quick-action-btn" data-nav="register-household">
                                    <div class="action-icon">🏠</div>
                                    <div class="action-text">Register Household</div>
                                </button>
                                <button class="quick-action-btn" data-nav="register-patient">
                                    <div class="action-icon">👤</div>
                                    <div class="action-text">Register Patient</div>
                                </button>
                                <button class="quick-action-btn" data-nav="reports">
                                    <div class="action-icon">📊</div>
                                    <div class="action-text">Generate Report</div>
                                </button>
                                <button class="quick-action-btn" data-nav="alerts">
                                    <div class="action-icon">⚠️</div>
                                    <div class="action-text">View Alerts</div>
                                </button>
                                <button class="quick-action-btn" data-nav="view-assignments">
                                    <div class="action-icon">📋</div>
                                    <div class="action-text">Assignments</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Recent Activity</h2>
                        </div>
                        <div class="card-body">
                            <div class="activity-list">
                                <div class="activity-item">
                                    <div class="activity-icon">📝</div>
                                    <div class="activity-content">
                                        <div class="activity-text">Sarah Otieno completed household visit</div>
                                        <div class="activity-time">2 hours ago</div>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">⚠️</div>
                                    <div class="activity-content">
                                        <div class="activity-text">High fever alert reported in Kibera</div>
                                        <div class="activity-time">5 hours ago</div>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">👥</div>
                                    <div class="activity-content">
                                        <div class="activity-text">New CHV assigned to Dandora area</div>
                                        <div class="activity-time">1 day ago</div>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">🏠</div>
                                    <div class="activity-content">
                                        <div class="activity-text">15 new households registered</div>
                                        <div class="activity-time">2 days ago</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .supervisor-dashboard {
                    padding: 1rem;
                }

                .dashboard-header {
                    margin-bottom: 2rem;
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .dashboard-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: var(--text-dark);
                    margin-bottom: 0.5rem;
                }

                .dashboard-subtitle {
                    color: var(--text-light);
                    margin: 0;
                }

                .header-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                /* CHV Performance Styles */
                .chv-performance-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .chv-performance-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-light);
                    border-radius: var(--radius-md);
                    transition: background-color 0.2s;
                }

                .chv-performance-item:hover {
                    background: var(--bg-lighter);
                }

                .chv-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }

                .chv-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    color: white;
                    font-size: 0.875rem;
                }

                .chv-avatar.active {
                    background: var(--primary-teal);
                }

                .chv-avatar.inactive {
                    background: var(--text-light);
                }

                .chv-details {
                    flex: 1;
                }

                .chv-name {
                    font-weight: 500;
                    color: var(--text-dark);
                    margin-bottom: 0.25rem;
                }

                .chv-location {
                    font-size: 0.875rem;
                    color: var(--text-light);
                }

                .chv-stats {
                    display: flex;
                    gap: 1.5rem;
                }

                .chv-stat {
                    text-align: center;
                }

                .stat-number {
                    font-weight: 600;
                    color: var(--text-dark);
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-light);
                }

                .chv-status {
                    min-width: 80px;
                }

                /* Alerts Styles */
                .alerts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .alert-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-light);
                    border-radius: var(--radius-md);
                    border-left: 4px solid;
                }

                .alert-item.high {
                    border-left-color: #dc2626;
                }

                .alert-item.medium {
                    border-left-color: #d97706;
                }

                .alert-item.low {
                    border-left-color: #059669;
                }

                .alert-icon {
                    font-size: 1.25rem;
                }

                .alert-content {
                    flex: 1;
                }

                .alert-title {
                    font-weight: 600;
                    color: var(--text-dark);
                    margin-bottom: 0.25rem;
                }

                .alert-details {
                    font-size: 0.875rem;
                    color: var(--text-light);
                    margin-bottom: 0.25rem;
                }

                .alert-time {
                    font-size: 0.75rem;
                    color: var(--text-light);
                }

                /* Metrics Styles */
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1.5rem;
                }

                .metric-item {
                    text-align: center;
                }

                .metric-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-teal);
                    margin-bottom: 0.5rem;
                }

                .metric-label {
                    font-size: 0.875rem;
                    color: var(--text-light);
                    margin-bottom: 0.75rem;
                }

                .metric-progress {
                    width: 100%;
                }

                .progress-bar {
                    width: 100%;
                    height: 6px;
                    background: var(--border-color);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--primary-teal);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }

                /* Tasks Styles */
                .tasks-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .task-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-light);
                    border-radius: var(--radius-md);
                }

                .task-checkbox {
                    display: flex;
                    align-items: center;
                }

                .task-checkbox input {
                    width: 18px;
                    height: 18px;
                    border-radius: 4px;
                    border: 2px solid var(--border-color);
                    cursor: pointer;
                }

                .task-content {
                    flex: 1;
                }

                .task-title {
                    font-weight: 500;
                    color: var(--text-dark);
                    margin-bottom: 0.25rem;
                }

                .task-due {
                    font-size: 0.875rem;
                    color: var(--text-light);
                }

                .task-priority {
                    min-width: 70px;
                }

                .priority-badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .priority-badge.high {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .priority-badge.medium {
                    background: #fffbeb;
                    color: #d97706;
                }

                .priority-badge.low {
                    background: #f0fdf4;
                    color: #059669;
                }

                /* Quick Actions */
                .quick-actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                }

                .quick-action-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1.5rem 1rem;
                    background: var(--bg-light);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }

                .quick-action-btn:hover {
                    background: var(--bg-lighter);
                    border-color: var(--primary-teal);
                    transform: translateY(-2px);
                }

                .action-icon {
                    font-size: 1.5rem;
                }

                .action-text {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-dark);
                }

                /* Activity Styles */
                .activity-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .activity-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 0.75rem;
                }

                .activity-icon {
                    font-size: 1.25rem;
                    margin-top: 0.125rem;
                }

                .activity-content {
                    flex: 1;
                }

                .activity-text {
                    font-weight: 500;
                    color: var(--text-dark);
                    margin-bottom: 0.25rem;
                }

                .activity-time {
                    font-size: 0.875rem;
                    color: var(--text-light);
                }

                /* Status Badges */
                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .status-badge.active,
                .status-badge.resolved {
                    background: #dcfce7;
                    color: #059669;
                }

                .status-badge.inactive,
                .status-badge.pending {
                    background: #fef3c7;
                    color: #d97706;
                }

                .status-badge.investigating {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                /* Trend Indicators */
                .stat-trend {
                    margin-top: 0.5rem;
                }

                .trend-positive {
                    font-size: 0.75rem;
                    color: #059669;
                }

                .trend-warning {
                    font-size: 0.75rem;
                    color: #d97706;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .supervisor-dashboard {
                        padding: 0.5rem;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .header-actions {
                        justify-content: center;
                    }

                    .dashboard-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .chv-performance-item {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                    }

                    .chv-info {
                        justify-content: center;
                        margin-bottom: 1rem;
                    }

                    .chv-stats {
                        justify-content: center;
                        margin-bottom: 1rem;
                    }

                    .metrics-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }

                    .quick-actions-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .alert-item,
                    .task-item {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                        gap: 0.75rem;
                    }

                    .alert-content,
                    .task-content {
                        text-align: center;
                    }
                }

                @media (max-width: 480px) {
                    .metrics-grid {
                        grid-template-columns: 1fr;
                    }

                    .quick-actions-grid {
                        grid-template-columns: 1fr;
                    }

                    .chv-stats {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .header-actions {
                        flex-direction: column;
                    }

                    .header-actions .btn {
                        width: 100%;
                    }
                }
            </style>
        `;
    }

    // Helper method to format time ago
    formatTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    renderCHVPage() {
        return `
            <div class="dashboard">
                <div style="margin-bottom: 2rem;">
                    <h1 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 0.5rem;">CHV Dashboard</h1>
                    <p style="color: var(--text-light);">Welcome back! Here's your community health overview.</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon teal">🏠</div>
                        <div class="stat-content">
                            <div class="stat-value">24</div>
                            <div class="stat-label">Assigned Households</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon gold">📝</div>
                        <div class="stat-content">
                            <div class="stat-value">18</div>
                            <div class="stat-label">Visits This Week</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon teal">⚠️</div>
                        <div class="stat-content">
                            <div class="stat-value">3</div>
                            <div class="stat-label">Pending Alerts</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Recent Activities</h2>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; gap: 1rem;">
                            <div style="display: flex; justify-content: space-between; padding: 1rem; background: var(--bg-light); border-radius: var(--radius-md);">
                                <div>
                                    <div style="font-weight: 500;">Household Visit - Mwangi Family</div>
                                    <div style="font-size: 0.875rem; color: var(--text-light);">Recorded vitals for 4 members</div>
                                </div>
                                <div style="font-size: 0.875rem; color: var(--text-light);">2 hours ago</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 1rem; background: var(--bg-light); border-radius: var(--radius-md);">
                                <div>
                                    <div style="font-weight: 500;">Alert Reported</div>
                                    <div style="font-size: 0.875rem; color: var(--text-light);">High fever case in Otieno household</div>
                                </div>
                                <div style="font-size: 0.875rem; color: var(--text-light);">5 hours ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    handleLogout() {
        auth.logout();
        this.currentPage = 'landing';
        this.render();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AfyaTrackApp();
});