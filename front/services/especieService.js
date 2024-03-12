import api from '../common/http-common-back';

  // Função para criar uma nova especie
  export async function createEspecie(especieData) {
    try {
      const response = await api.post('/especie', especieData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas as especies
  export async function getAllEspecie() {
    try {
      const response = await api.get('/especie');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar uma especie por ID
  export async function getEspecieById(especieId) {
    try {
      const response = await api.get(`/especie/${especieId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar uma especie
  export async function updateEspecie(especieId, especieData) {
    try {
      const response = await api.patch(`/especie/${especieId}`, especieData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir uma especie por ID
  export async function deleteEspecie(especieId) {
    try {
      const response = await api.delete(`/especie/${especieId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
