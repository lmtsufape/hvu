import api from '../common/http-common-back';

  // Função para criar Campo Laudo
  export async function createCampoLaudo(campoLaudoData) {
    try {
      const response = await api.post('/campoLaudo', campoLaudoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas os Campo Laudo
  export async function getAllCampoLaudo() {
    try {
      const response = await api.get('/campoLaudo');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um Campo Laudo por ID
  export async function getCampoLaudoById(campoLaudoId) {
    try {
      const response = await api.get(`/campoLaudo/${campoLaudoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um Campo Laudo
  export async function updateCampoLaudo(campoLaudoId, campoLaudoData) {
    try {
      const response = await api.patch(`/campoLaudo/${campoLaudoId}`, campoLaudoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um Campo Laudo por ID
  export async function deleteCampoLaudo(campoLaudoId) {
    try {
      const response = await api.delete(`/campoLaudo/${campoLaudoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
