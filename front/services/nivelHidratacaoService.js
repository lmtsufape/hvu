import api from '../common/http';

  // Função para criar
  export async function createNivelHidratacao(nivelHidratacaoData) {
    try {
      const response = await api.post('/nivelHidratacao', nivelHidratacaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllNivelHidratacao() {
    try {
      const response = await api.get('/nivelHidratacao');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getNivelHidratacaoById(nivelHidratacaoId) {
    try {
      const response = await api.get(`/nivelHidratacao/${nivelHidratacaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateNivelHidratacao(nivelHidratacaoId, nivelHidratacaoData) {
    try {
      const response = await api.put(`/nivelHidratacao/${nivelHidratacaoId}`, nivelHidratacaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteNivelHidratacao(nivelHidratacaoId) {
    try {
      const response = await api.delete(`/nivelHidratacao/${nivelHidratacaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
