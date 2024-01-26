import api from '../common/http-common-back';

  // Função para criar
  export async function createTipoLinfonodos(tipoLinfonodosData) {
    try {
      const response = await api.post('/tipoLinfonodos', tipoLinfonodosData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllTipoLinfonodos() {
    try {
      const response = await api.get('/tipoLinfonodos');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getTipoLinfonodosById(tipoLinfonodosId) {
    try {
      const response = await api.get(`/tipoLinfonodos/${tipoLinfonodosId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateTipoLinfonodos(tipoLinfonodosId, tipoLinfonodosData) {
    try {
      const response = await api.put(`/tipoLinfonodos/${tipoLinfonodosId}`, tipoLinfonodosData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteTipoLinfonodos(tipoLinfonodosId) {
    try {
      const response = await api.delete(`/tipoLinfonodos/${tipoLinfonodosId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
