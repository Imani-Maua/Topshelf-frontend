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
            return response.data.data;
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('accessToken');
            throw error;
        }
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
     * Get all users (Admin only)
     */
    getAllUsers: async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            return response.data.data;
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    }
};
