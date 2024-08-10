import api from '../common/http-common-back';

  // Função para criar Campo Laudo
  export async function createCampoLaudoMicroscopia(campoLaudoMicroscopiaData) {
    try {
      const response = await api.post('/campoLaudoMicroscopia', campoLaudoMicroscopiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas os Campo Laudo
  export async function getAllCampoLaudoMicroscopia() {
    try {
      const response = await api.get('/campoLaudoMicroscopia');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um Campo Laudo por ID
  export async function getCampoLaudoMicroscopiaById(campoLaudoMicroscopiaId) {
    try {
      const response = await api.get(`/campoLaudoMicroscopia/${campoLaudoMicroscopiaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um Campo Laudo
  export async function updateCampoLaudoMicroscopia(campoLaudoMicroscopiaId, campoLaudoMicroscopiaData) {
    try {
      const response = await api.patch(`/campoLaudoMicroscopia/${campoLaudoMicroscopiaId}`, campoLaudoMicroscopiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um Campo Laudo por ID
  export async function deleteCampoLaudoMicroscopia(campoLaudoMicroscopiaId) {
    try {
      const response = await api.delete(`/campoLaudoMicroscopia/${campoLaudoMicroscopiaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
