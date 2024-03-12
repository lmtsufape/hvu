import api from '../common/http-common-back';

  // Função para criar
  export async function createAvaliacaoFisicoEspecial(avaliacaoFisicoEspecialData) {
    try {
      const response = await api.post('/avaliacaoFisicoEspecial', avaliacaoFisicoEspecialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllAvaliacaoFisicoEspecial() {
    try {
      const response = await api.get('/avaliacaoFisicoEspecial');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getAvaliacaoFisicoEspecialById(avaliacaoFisicoEspecialId) {
    try {
      const response = await api.get(`/avaliacaoFisicoEspecial/${avaliacaoFisicoEspecialId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateAvaliacaoFisicoEspecial(avaliacaoFisicoEspecialId, avaliacaoFisicoEspecialData) {
    try {
      const response = await api.patch(`/avaliacaoFisicoEspecial/${avaliacaoFisicoEspecialId}`, avaliacaoFisicoEspecialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteAvaliacaoFisicoEspecial(avaliacaoFisicoEspecialId) {
    try {
      const response = await api.delete(`/avaliacaoFisicoEspecial/${avaliacaoFisicoEspecialId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
