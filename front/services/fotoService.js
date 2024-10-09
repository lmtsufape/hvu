import api from '../common/http-common-back';

  // Função para criar
  export async function createFoto(fotoData) {
    try {
      const response = await api.post('/foto', fotoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
   
  // Função para buscar todas 
  export async function getAllFoto() {
    try {
      const response = await api.get('/foto');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getFotoById(fotoId) {
    try {
      const response = await api.get(`/foto/${fotoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateFoto(fotoId, fotoData) {
    try {
      const response = await api.patch(`/foto/${fotoId}`, fotoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteFoto(fotoId) {
    try {
      const response = await api.delete(`/foto/${fotoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
