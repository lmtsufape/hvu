import api from '../common/http-common-back';

  // Função para criar
  export async function createLaudoNecropsia(fotoData) {
    try {
      const response = await api.post('/laudoNecropsia', fotoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
   
  // Função para buscar todas 
  export async function getAllLaudoNecropsia() {
    try {
      const response = await api.get('/laudoNecropsia');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getLaudoNecropsiaById(laudoNecropsiaId) {
    try {
      const response = await api.get(`/laudoNecropsia/${laudoNecropsiaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateLaudoNecropsia(laudoNecropsiaId, laudoNecropsiaData) {
    try {
      const response = await api.patch(`/laudoNecropsia/${laudoNecropsiaId}`, laudoNecropsiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteLaudoNecropsia(laudoNecropsiaId) {
    try {
      const response = await api.delete(`/laudoNecropsia/${laudoNecropsiaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
