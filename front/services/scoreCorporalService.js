import api from '../common/http-common-back';

  // Função para criar
  export async function createScoreCorporal(scoreCorporalData) {
    try {
      const response = await api.post('/scoreCorporal', scoreCorporalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllScoreCorporal() {
    try {
      const response = await api.get('/scoreCorporal');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getScoreCorporalById(scoreCorporalId) {
    try {
      const response = await api.get(`/scoreCorporal/${scoreCorporalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateScoreCorporal(scoreCorporalId, scoreCorporalData) {
    try {
      const response = await api.patch(`/scoreCorporal/${scoreCorporalId}`, scoreCorporalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteScoreCorporal(scoreCorporalId) {
    try {
      const response = await api.delete(`/scoreCorporal/${scoreCorporalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
