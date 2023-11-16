import api from '../common/http';

  // Função para criar
  export async function createNivelConsciencia(nivelConscienciaData) {
    try {
      const response = await api.post('/nivelConsciencia', nivelConscienciaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllNivelConsciencia() {
    try {
      const response = await api.get('/nivelConsciencia');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getNivelConscienciaById(nivelConscienciaId) {
    try {
      const response = await api.get(`/nivelConsciencia/${nivelConscienciaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateNivelConsciencia(nivelConscienciaId, nivelConscienciaData) {
    try {
      const response = await api.put(`/nivelConsciencia/${nivelConscienciaId}`, nivelConscienciaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteNivelConsciencia(nivelConscienciaId) {
    try {
      const response = await api.delete(`/nivelConsciencia/${nivelConscienciaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
