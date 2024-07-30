import api from '../common/http-common-back';

  // Função para criar
  export async function createArea(areaData) {
    try {
      const response = await api.post('/area', areaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
   
  // Função para buscar todas 
  export async function getAllArea() {
    try {
      const response = await api.get('/area');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getAreaById(areaId) {
    try {
      const response = await api.get(`/area/${areaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateArea(areaId, areaData) {
    try {
      const response = await api.patch(`/area/${areaId}`, areaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteArea(areaId) {
    try {
      const response = await api.delete(`/area/${areaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
