import api from './api';

export const authService = {
  
  getCurrentUser: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          name: "Elaine Maua", 
          role: "Administrator",
          id: "user_123" 
        });
      }, 1000);
    });
    
  
  }
};