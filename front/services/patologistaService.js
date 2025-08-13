import api from '../common/http-common-back';

  // Função para criar um novo patologista
  export async function createPatologista(patologistaData) {
    try {
      const response = await api.post('/patologista', patologistaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todos os patologistas
  export async function getAllPatologista() {
    try {
      const response = await api.get('/patologista');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um patologista por ID
  export async function getPatologistaById(patologistaId) {
    try {
      const response = await api.get(`/patologista/${patologistaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um patologista
  export async function updatePatologista(patologistaId, patologistaData) {
    try {
      const response = await api.patch(`/patologista/${patologistaId}`, patologistaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um patologista por ID
  export async function deletePatologista(patologistaId) {
    try {
      const response = await api.delete(`/patologista/${patologistaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
