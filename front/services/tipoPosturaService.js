import api from '../common/http-common-back';

  // Função para criar
  export async function createTipoPostura(tipoPosturaData) {
    try {
      const response = await api.post('/tipoPostura', tipoPosturaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllTipoPostura() {
    try {
      const response = await api.get('/tipoPostura');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getTipoPosturaById(tipoPosturaId) {
    try {
      const response = await api.get(`/tipoPostura/${tipoPosturaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateTipoPostura(tipoPosturaId, tipoPosturaData) {
    try {
      const response = await api.put(`/tipoPostura/${tipoPosturaId}`, tipoPosturaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteTipoPostura(tipoPosturaId) {
    try {
      const response = await api.delete(`/tipoPostura/${tipoPosturaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
