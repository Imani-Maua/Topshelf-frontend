import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';

export const productService = {
    /**
     * Fetch all products (optionally filtered by category)
     */
    getProducts: async (categoryId = null) => {
        try {
            const url = categoryId ? `${API_URL}?categoryId=${categoryId}` : API_URL;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    /**
     * Fetch a single product by ID
     */
    getProductById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    /**
     * Create a new product
     */
    createProduct: async (productData) => {
        try {
            const response = await axios.post(API_URL, productData);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    /**
     * Update an existing product
     */
    updateProduct: async (id, productData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    /**
     * Delete a product
     */
    deleteProduct: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    /**
     * Upload CSV file with products
     */
    uploadCSV: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${API_URL}/upload-csv`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading CSV:', error);
            throw error;
        }
    }
};
