import api from './api';

export const participantService = {
    getAll: async ()=> {
        const response = await api.get('/participants');
        return response.data.data;
    },


    getById: async (id) => {
        const response = await api.get(`/participants/${id}`);
        return response.data.data;
    },
    
    create: async(participantData) => {
        const response = await api.post('/participants', participantData);
        return response.data.data;
    },
    update: async(id, participantData) => {
        const response = await api.put(`/participants/${id}`, participantData);
        return response.data.data;
    },
    delete: async(id) => {
        const response = await api.delete(`/participants/${id}`);
        return response.data;
    }
}