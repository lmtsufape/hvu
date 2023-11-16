import api from '../common/http';

  // Função para criar
  export async function createTipoPrognostico(tipoPrognosticoData) {
    try {
      const response = await api.post('/tipoPrognostico', tipoPrognosticoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllTipoPrognostico() {
    try {
      const response = await api.get('/tipoPrognostico');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getTipoPrognosticoById(tipoPrognosticoId) {
    try {
      const response = await api.get(`/tipoPrognostico/${tipoPrognosticoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateTipoPrognostico(tipoPrognosticoId, tipoPrognosticoData) {
    try {
      const response = await api.put(`/tipoPrognostico/${tipoPrognosticoId}`, tipoPrognosticoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteTipoPrognostico(tipoPrognosticoId) {
    try {
      const response = await api.delete(`/tipoPrognostico/${tipoPrognosticoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
