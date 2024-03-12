import api from '../common/http-common-back';

  // Função para criar
  export async function createCronograma(cronogramaData) {
    try {
      const response = await api.post('/cronograma', cronogramaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllCronograma() {
    try {
      const response = await api.get('/cronograma');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getCronogramaById(cronogramaId) {
    try {
      const response = await api.get(`/cronograma/${cronogramaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateCronograma(cronogramaId, cronogramaData) {
    try {
      const response = await api.patch(`/cronograma/${cronogramaId}`, cronogramaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteCronograma(cronogramaId) {
    try {
      const response = await api.delete(`/cronograma/${cronogramaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
