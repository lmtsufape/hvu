import api from '../common/http-common-back';

  // Função para criar
  export async function createParecer(parecerData) {
    try {
      const response = await api.post('/parecer', parecerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllParecer() {
    try {
      const response = await api.get('/parecer');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getParecerById(parecerId) {
    try {
      const response = await api.get(`/parecer/${parecerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateParecer(parecerId, parecerData) {
    try {
      const response = await api.patch(`/parecer/${parecerId}`, parecerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteParecer(parecerId) {
    try {
      const response = await api.delete(`/parecer/${parecerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
