import api from '../common/http';

  // Função para criar
  export async function createPrescricao(prescricaoData) {
    try {
      const response = await api.post('/prescricao', prescricaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllPrescricao() {
    try {
      const response = await api.get('/prescricao');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getPrescricaoById(prescricaoId) {
    try {
      const response = await api.get(`/prescricao/${prescricaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updatePrescricao(prescricaoId, prescricaoData) {
    try {
      const response = await api.put(`/prescricao/${prescricaoId}`, prescricaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deletedeletePrescricao(prescricaoId) {
    try {
      const response = await api.delete(`/prescricao/${prescricaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
