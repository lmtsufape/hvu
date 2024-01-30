import api from '../common/http-common-back';

  // Função para criar
  export async function createTipoMucosa(tipoMucosaData) {
    try {
      const response = await api.post('/tipoMucosa', tipoMucosaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllTipoMucosa() {
    try {
      const response = await api.get('/tipoMucosa');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getTipoMucosaById(tipoMucosaId) {
    try {
      const response = await api.get(`/tipoMucosa/${tipoMucosaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateTipoMucosa(tipoMucosaId, tipoMucosaData) {
    try {
      const response = await api.put(`/tipoMucosa/${tipoMucosaId}`, tipoMucosaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteTipoMucosa(tipoMucosaId) {
    try {
      const response = await api.delete(`/tipoMucosa/${tipoMucosaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
