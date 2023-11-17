import api from '../common/http';

  // Função para criar
  export async function createTipoTurgorCutaneo(tipoTurgorCutaneoData) {
    try {
      const response = await api.post('/tipoTurgorCutaneo', tipoTurgorCutaneoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllTipoTurgorCutaneo() {
    try {
      const response = await api.get('/tipoTurgorCutaneo');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getTipoTurgorCutaneoById(tipoTurgorCutaneoId) {
    try {
      const response = await api.get(`/tipoTurgorCutaneo/${tipoTurgorCutaneoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateTipoTurgorCutaneo(tipoTurgorCutaneoId, tipoTurgorCutaneoData) {
    try {
      const response = await api.put(`/tipoTurgorCutaneo/${tipoTurgorCutaneoId}`, tipoTurgorCutaneoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteTipoTurgorCutaneo(tipoTurgorCutaneoId) {
    try {
      const response = await api.delete(`/tipoTurgorCutaneo/${tipoTurgorCutaneoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
