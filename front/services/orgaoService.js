import api from '../common/http-common-back';

  // Função para criar
  export async function createOrgao(orgaoData) {
    try {
      const response = await api.post('/orgao', orgaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
   
  // Função para buscar todas 
  export async function getAllOrgao() {
    try {
      const response = await api.get('/orgao');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getOrgaoById(orgaoId) {
    try {
      const response = await api.get(`/orgao/${orgaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Função para atualizar 
  export async function updateOrgao(laudoOrgaoId, laudoOrgaoData) {
    try {
      const response = await api.patch(`/orgao/${laudoOrgaoId}`, laudoOrgaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Função para excluir
  export async function deleteOrgao(orgaoId) {
    try {
      const response = await api.delete(`/orgao/${orgaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
 