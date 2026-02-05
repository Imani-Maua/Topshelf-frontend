import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

/**
 * Add token to all requests automatically
 */
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Handle 401 errors globally (token expired)
 */
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            // Only redirect if not already on login/set-password page
            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/set-password')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    /**
     * Login user
     */
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            return response.data.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Set password using invite token
     */
    setPassword: async (token, newPassword) => {
        try {
            const response = await axios.post(`${API_URL}/set-password`, {
                token,
                newPassword
            });
            return response.data.data;
        } catch (error) {
            console.error('Set password error:', error);
            throw error;
        }
    },

    /**
     * Get current logged-in user
     */
    getCurrentUser: async () => {
        try {
            const response = await axios.get(`${API_URL}/me`);
            return response.data.data;
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            const response = await axios.post(`${API_URL}/logout`);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user'); // Clear cached user data
            return response.data.data;
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            throw error;
        }
    },

    // ==================== ROLE-BASED ACCESS CONTROL ====================

    /**
     * Get current user from localStorage cache
     * @returns {Object|null} User object or null
     */
    getUserFromCache: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if current user has admin role (user management)
     * @returns {boolean}
     */
    isAdmin: () => {
        const user = authService.getUserFromCache();
        return user && user.role === 'admin';
    },

    /**
     * Check if current user has operations role (operational write access)
     * @returns {boolean}
     */
    isOperations: () => {
        const user = authService.getUserFromCache();
        return user && user.role === 'operations';
    },

    /**
     * Check if current user has finance role (read-only)
     * @returns {boolean}
     */
    isFinance: () => {
        const user = authService.getUserFromCache();
        return user && user.role === 'finance';
    },

    /**
     * Check if current user can perform operational tasks (write access)
     * Operations users can upload, calculate, modify data
     * @returns {boolean}
     */
    canPerformOperations: () => {
        const user = authService.getUserFromCache();
        return user && user.role === 'operations';
    },

    /**
     * Check if current user can manage users (admin only)
     * @returns {boolean}
     */
    canManageUsers: () => {
        const user = authService.getUserFromCache();
        return user && user.role === 'admin';
    },

    /**
     * Check if current user is read-only (admin or finance)
     * These roles can view operational data but not modify it
     * @returns {boolean}
     */
    isReadOnly: () => {
        const user = authService.getUserFromCache();
        return user && (user.role === 'admin' || user.role === 'finance');
    },

    // ==================== ADMIN USER MANAGEMENT ====================

    /**
     * Get all users (Admin only)
     */
    getAllUsers: async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            return response.data.data;
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    },

    /**
     * Create a new user (Admin only)
     */
    createUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/create-user`, userData);
            return response.data.data;
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    },

    /**
     * Send invite (Admin only)
     */
    sendInvite: async (userId) => {
        try {
            const response = await axios.post(`${API_URL}/send-invite`, { userId });
            return response.data.data;
        } catch (error) {
            console.error('Send invite error:', error);
            throw error;
        }
    },

    /**
     * Update user (Admin only)
     */
    updateUser: async (userId, userData) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, userData);
            return response.data.data;
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    },

    /**
     * Deactivate user (Admin only)
     */
    deactivateUser: async (userId) => {
        try {
            const response = await axios.patch(`${API_URL}/users/${userId}/deactivate`);
            return response.data.data;
        } catch (error) {
            console.error('Deactivate user error:', error);
            throw error;
        }
    },

    /**
     * Delete user (Admin only)
     */
    deleteUser: async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/users/${userId}`);
            return response.data.data;
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    }
};
