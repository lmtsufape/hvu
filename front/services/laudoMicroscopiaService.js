import api from '../common/http-common-back';

  // Função para criar
  export async function createLaudoMicroscopia(laudoMicroscopiaData) {
    try {
      const response = await api.post('/laudoMicroscopia', laudoMicroscopiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
   
  // Função para buscar todas 
  export async function getAllLaudoMicroscopia() {
    try {
      const response = await api.get('/laudoMicroscopia');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getLaudoMicroscopiaById(laudoMicroscopiaId) {
    try {
      const response = await api.get(`/laudoMicroscopia/${laudoMicroscopiaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateLaudoMicroscopia(laudoMicroscopiaId, laudoMicroscopiaData) {
    try {
      const response = await api.patch(`/laudoMicroscopia/${laudoMicroscopiaId}`, laudoMicroscopiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteLaudoMicroscopia(laudoMicroscopiaId) {
    try {
      const response = await api.delete(`/laudoMicroscopia/${laudoMicroscopiaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
