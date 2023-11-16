import api from '../common/http';

  // Função para criar
  export async function createAvaliacaoFisicoGeral(avaliacaoFisicoGeralData) {
    try {
      const response = await api.post('/avaliacaoFisicoGeral', avaliacaoFisicoGeralData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllAvaliacaoFisicoGeral() {
    try {
      const response = await api.get('/avaliacaoFisicoGeral');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getAvaliacaoFisicoGeralById(avaliacaoFisicoGeralId) {
    try {
      const response = await api.get(`/avaliacaoFisicoGeral/${avaliacaoFisicoGeralId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateAvaliacaoFisicoGeral(avaliacaoFisicoGeralId, avaliacaoFisicoGeralData) {
    try {
      const response = await api.put(`/avaliacaoFisicoGeral/${avaliacaoFisicoGeralId}`, avaliacaoFisicoGeralData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteAvaliacaoFisicoGeral(avaliacaoFisicoGeralId) {
    try {
      const response = await api.delete(`/avaliacaoFisicoGeral/${avaliacaoFisicoGeralId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
