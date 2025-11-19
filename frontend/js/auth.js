// Auth Service with Registration
class AuthService {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userRole = null;
        this.users = this.loadUsersFromStorage();
        this.checkAuthStatus();
    }

    loadUsersFromStorage() {
        const users = localStorage.getItem('afyatrack_users');
        if (users) {
            return JSON.parse(users);
        }
        
        // Default users for demo - Only predefined System Admin
        return [
            {
                id: 1,
                name: 'System Administrator',
                email: 'admin@afyatrack.com',
                password: 'Admin@2024',
                role: 'admin',
                location: 'National Level',
                permissions: ['all'],
                registeredAt: new Date().toISOString(),
                isPredefined: true
            }
        ];
    }

    saveUsersToStorage() {
        localStorage.setItem('afyatrack_users', JSON.stringify(this.users));
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('afyatrack_user');
        const token = localStorage.getItem('afyatrack_token');
        
        if (userData && token) {
            try {
                this.currentUser = JSON.parse(userData);
                this.userRole = this.currentUser.role;
                this.isAuthenticated = true;
            } catch (error) {
                this.logout();
            }
        }
    }

    async register(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validate required fields
                if (!userData.name || !userData.email || !userData.password || !userData.role) {
                    reject(new Error('All fields are required'));
                    return;
                }

                // Check if email already exists
                const existingUser = this.users.find(user => user.email === userData.email);
                if (existingUser) {
                    reject(new Error('Email already registered'));
                    return;
                }

                // Validate password strength
                if (userData.password.length < 6) {
                    reject(new Error('Password must be at least 6 characters long'));
                    return;
                }

                // Create new user
                const newUser = {
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role,
                    location: userData.location || 'Not specified',
                    permissions: this.getDefaultPermissions(userData.role),
                    registeredAt: new Date().toISOString(),
                    isPredefined: false
                };

                this.users.push(newUser);
                this.saveUsersToStorage();

                // Auto-login after registration
                this.currentUser = { ...newUser };
                delete this.currentUser.password;
                this.userRole = newUser.role;
                this.isAuthenticated = true;
                
                localStorage.setItem('afyatrack_user', JSON.stringify(this.currentUser));
                localStorage.setItem('afyatrack_token', 'mock_jwt_token_' + Date.now());

                resolve(this.currentUser);
            }, 1000);
        });
    }

    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!email || !password) {
                    reject(new Error('Email and password are required'));
                    return;
                }

                // Find user by email
                const user = this.users.find(u => u.email === email);
                if (!user) {
                    reject(new Error('Invalid email or password'));
                    return;
                }

                // Check password
                if (user.password !== password) {
                    reject(new Error('Invalid email or password'));
                    return;
                }

                // Login successful
                this.currentUser = { ...user };
                delete this.currentUser.password;
                this.userRole = user.role;
                this.isAuthenticated = true;
                
                localStorage.setItem('afyatrack_user', JSON.stringify(this.currentUser));
                localStorage.setItem('afyatrack_token', 'mock_jwt_token_' + Date.now());

                resolve(this.currentUser);
            }, 1000);
        });
    }

    getDefaultPermissions(role) {
        switch(role) {
            case 'admin':
                return ['all'];
            case 'supervisor':
                return ['manage_chvs', 'view_reports', 'register_households'];
            case 'chv':
                return ['record_visits', 'view_households', 'report_symptoms'];
            default:
                return [];
        }
    }

    logout() {
        this.currentUser = null;
        this.userRole = null;
        this.isAuthenticated = false;
        localStorage.removeItem('afyatrack_user');
        localStorage.removeItem('afyatrack_token');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    getUserRole() {
        return this.userRole;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        if (this.userRole === 'admin') return true;
        return this.currentUser.permissions?.includes(permission) || false;
    }

    // For demo purposes - get all users (admin only)
    getAllUsers() {
        return this.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    // Check if registration is allowed for role
    isRegistrationAllowed(role) {
        return role !== 'admin'; // Only Supervisor and CHV can register
    }
}

// Create global auth instance
const auth = new AuthService();