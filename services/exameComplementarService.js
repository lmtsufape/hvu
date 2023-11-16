import api from '../common/http';

  // Função para criar
  export async function createExameComplementar(exameComplementarData) {
    try {
      const response = await api.post('/exameComplementar', exameComplementarData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllExameComplementar() {
    try {
      const response = await api.get('/exameComplementar');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getExameComplementarById(exameComplementarId) {
    try {
      const response = await api.get(`/exameComplementar/${exameComplementarId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateExameComplementar(exameComplementarId, exameComplementarData) {
    try {
      const response = await api.put(`/exameComplementar/${exameComplementarId}`, exameComplementarData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteExameComplementar(exameComplementarId) {
    try {
      const response = await api.delete(`/exameComplementar/${exameComplementarId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
