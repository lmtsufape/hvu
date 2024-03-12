import api from '../common/http-common-back';

  // Função para criar
  export async function createHistoricoMedicoPregresso(historicoMedicoPregressoData) {
    try {
      const response = await api.post('/historicoMedicoPregresso', historicoMedicoPregressoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllHistoricoMedicoPregresso() {
    try {
      const response = await api.get('/historicoMedicoPregresso');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getHistoricoMedicoPregressoById(historicoMedicoPregressoId) {
    try {
      const response = await api.get(`/historicoMedicoPregresso/${historicoMedicoPregressoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateHistoricoMedicoPregresso(historicoMedicoPregressoId, historicoMedicoPregressoData) {
    try {
      const response = await api.patch(`/historicoMedicoPregresso/${historicoMedicoPregressoId}`, historicoMedicoPregressoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteHistoricoMedicoPregresso(historicoMedicoPregressoId) {
    try {
      const response = await api.delete(`/historicoMedicoPregresso/${historicoMedicoPregressoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
