import api from '../common/http-common-back';

  // Função para criar um novo medico
  export async function createMedico(medicoData) {
    try {
      const response = await api.post('/medico', medicoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todos os medicos
  export async function getAllMedico() {
    try {
      const response = await api.get('/medico');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um medico por ID
  export async function getMedicoById(medicoId) {
    try {
      const response = await api.get(`/medico/${medicoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um medico
  export async function updateMedico(medicoId, medicoData) {
    try {
      const response = await api.patch(`/medico/${medicoId}`, medicoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um medico por ID
  export async function deleteUsuario(medicoId) {
    try {
      const response = await api.delete(`/medico/${medicoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
