import api from '../common/http';

  // Função para criar
  export async function createMedicacaoPeriodica(medicacaoPeriodicaData) {
    try {
      const response = await api.post('/medicacaoPeriodica', medicacaoPeriodicaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllMedicacaoPeriodica() {
    try {
      const response = await api.get('/medicacaoPeriodica');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getMedicacaoPeriodicaById(medicacaoPeriodicaId) {
    try {
      const response = await api.get(`/medicacaoPeriodica/${medicacaoPeriodicaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateMedicacaoPeriodica(medicacaoPeriodicaId, medicacaoPeriodicaData) {
    try {
      const response = await api.put(`/medicacaoPeriodica/${medicacaoPeriodicaId}`, medicacaoPeriodicaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteMedicacaoPeriodica(medicacaoPeriodicaId) {
    try {
      const response = await api.delete(`/medicacaoPeriodica/${medicacaoPeriodicaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
