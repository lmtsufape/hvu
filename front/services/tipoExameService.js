import api from '../common/http-common-back';

  // Função para criar
  export async function createTipoExame(tipoExameData) {
    try {
      const response = await api.post('/tipoExame', tipoExameData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllTipoExame() {
    try {
      const response = await api.get('/tipoExame');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getTipoExameById(tipoExameId) {
    try {
      const response = await api.get(`/tipoExame/${tipoExameId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateTipoExame(tipoExameId, tipoExameData) {
    try {
      const response = await api.put(`/tipoExame/${tipoExameId}`, tipoExameData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteTipoExame(tipoExameId) {
    try {
      const response = await api.delete(`/tipoExame/${tipoExameId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
