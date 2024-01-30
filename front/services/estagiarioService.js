import api from '../common/http-common-back';

  // Função para criar um novo estagiario
  export async function createEstagiario(estagiarioData) {
    try {
      const response = await api.post('/estagiario', estagiarioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todos os estagiarios
  export async function getAllEstagiario() {
    try {
      const response = await api.get('/estagiario');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um estagiario por ID
  export async function getEstagiarioById(estagiarioId) {
    try {
      const response = await api.get(`/estagiario/${estagiarioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um estagiario
  export async function updateEstagiario(estagiarioId, estagiarioData) {
    try {
      const response = await api.put(`/estagiario/${estagiarioId}`, estagiarioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um estagiario por ID
  export async function deleteEstagiario(estagiarioId) {
    try {
      const response = await api.delete(`/estagiario/${estagiarioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
