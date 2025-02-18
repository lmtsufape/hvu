import api from '../common/http-common-back';

  // Função para criar
  export async function createAviso(avisoData) {
    try {
      const response = await api.post('/aviso', avisoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllAviso() {
    try {
      const response = await api.get('/aviso');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getAvisoById(avisoId) {
    try {
      const response = await api.get(`/aviso/${avisoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateAviso(avisoId, avisoData) {
    try {
      const response = await api.patch(`/aviso/${avisoId}`, avisoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteAviso(avisoId) {
    try {
      const response = await api.delete(`/aviso/${avisoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
