import api from '../common/http-common-back';

  // Função para criar
  export async function createTipoConsulta(tipoConsultaData) {
    try {
      const response = await api.post('/tipoConsulta', tipoConsultaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllTipoConsulta() {
    try {
      const response = await api.get('/tipoConsulta');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getTipoConsultaById(tipoConsultaId) {
    try {
      const response = await api.get(`/tipoConsulta/${tipoConsultaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateTipoConsulta(tipoConsultaId, tipoConsultaData) {
    try {
      const response = await api.patch(`/tipoConsulta/${tipoConsultaId}`, tipoConsultaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteTipoConsulta(tipoConsultaId) {
    try {
      const response = await api.delete(`/tipoConsulta/${tipoConsultaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
