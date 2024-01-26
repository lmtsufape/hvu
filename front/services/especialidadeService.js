import api from '../common/http-common-back';

  // Função para criar
  export async function createEspecialidade(especialidadeData) {
    try {
      const response = await api.post('/especialidade', especialidadeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllEspecialidade() {
    try {
      const response = await api.get('/especialidade');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getEspecialidadeById(especialidadeId) {
    try {
      const response = await api.get(`/especialidade/${especialidadeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateEspecialidade(especialidadeId, especialidadeData) {
    try {
      const response = await api.put(`/especialidade/${especialidadeId}`, especialidadeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteEspecialidade(especialidadeId) {
    try {
      const response = await api.delete(`/especialidade/${especialidadeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
