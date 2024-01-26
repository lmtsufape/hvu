import api from '../common/http-common-back';

  // Função para criar uma nova raca
  export async function createRaca(racaData) {
    try {
      const response = await api.post('/raca', racaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas as racas
  export async function getAllRaca() {
    try {
      const response = await api.get('/raca');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar uma raca por ID
  export async function getRacaById(racaId) {
    try {
      const response = await api.get(`/raca/${racaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar uma raca
  export async function updateRaca(racaId, racaData) {
    try {
      const response = await api.put(`/raca/${racaId}`, racaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir uma raca por ID
  export async function deleteRaca(racaId) {
    try {
      const response = await api.delete(`/raca/${racaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
