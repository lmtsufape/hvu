import api from '../common/http-common-back';

  // Função para criar
  export async function createDiretor(diretorData) {
    try {
      const response = await api.post('/diretor', diretorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllDiretor() {
    try {
      const response = await api.get('/diretor');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getDiretorById(diretorId) {
    try {
      const response = await api.get(`/diretor/${diretorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateDiretor(diretorId, diretorData) {
    try {
      const response = await api.patch(`/diretor/${diretorId}`, diretorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteDiretor(diretorId) {
    try {
      const response = await api.delete(`/diretor/${diretorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
