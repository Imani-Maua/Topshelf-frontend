import axios from 'axios';

const API_URL = 'http://localhost:3000/api/categories';

export const categoryService = {
    /**
     * Fetch all categories with tier rules and products
     */
    getCategories: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    /**
     * Fetch a single category by ID
     */
    getCategoryById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    /**
     * Create a new category
     */
    createCategory: async (categoryData) => {
        try {
            const response = await axios.post(API_URL, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    /**
     * Update an existing category
     */
    updateCategory: async (id, categoryData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    /**
     * Delete a category
     */
    deleteCategory: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};
