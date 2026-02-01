import axios from 'axios';

const API_URL = 'http://localhost:3000/api/participants';

export const participantService = {
    /**
     * Fetch all participants
     */
    getParticipants: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data; // Expected { success: true, data: [], count: 0 }
        } catch (error) {
            console.error('Error fetching participants:', error);
            throw error;
        }
    },

    /**
     * Fetch a single participant with full details (receipts, bonuses)
     */
    getParticipantById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching participant details:', error);
            throw error;
        }
    },

    /**
     * Create a new participant
     */
    createParticipant: async (participantData) => {
        try {
            const response = await axios.post(API_URL, participantData);
            return response.data;
        } catch (error) {
            console.error('Error creating participant:', error);
            throw error;
        }
    },

    /**
     * Update an existing participant
     */
    updateParticipant: async (id, participantData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, participantData);
            return response.data;
        } catch (error) {
            console.error('Error updating participant:', error);
            throw error;
        }
    },

    /**
     * Delete a participant
     */
    deleteParticipant: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting participant:', error);
            throw error;
        }
    }
};
