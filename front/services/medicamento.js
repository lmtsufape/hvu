import api from '../common/http-common-back';

  // Função para criar
  export async function createMedicamento(medicamentoData) {
    try {
      const response = await api.post('/medicamento', medicamentoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllMedicamento() {
    try {
      const response = await api.get('/medicamento');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getMedicamentoById(medicamentoId) {
    try {
      const response = await api.get(`/medicamento/${medicamentoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateMedicamento(medicamentoId, medicamentoData) {
    try {
      const response = await api.put(`/medicamento/${medicamentoId}`, medicamentoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteMedicamento(medicamentoId) {
    try {
      const response = await api.delete(`/medicamento/${medicamentoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
