import api from '../common/http-common-back';

  // Função para criar vaga especial
  export async function createVagaEspecial(vagaData) {
    try {
      const response = await api.post('/vaga', vagaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

    // Função para criar vaga normal
    export async function createVagaNormal(vagaData) {
      try {
        const response = await api.post('/gestao-vagas/criar', vagaData);
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  
  // Função para buscar todas 
  export async function getAllVaga() {
    try {
      const response = await api.get('/vaga');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getVagaById(vagaId) {
    try {
      const response = await api.get(`/vaga/${vagaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  export async function getVagaMedico(medicoId, data) {
    try {
      const response = await api.get(`/vaga/medico/${medicoId}/${data}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateVaga(vagaId, vagaData) {
    try {
      const response = await api.patch(`/vaga/${vagaId}`, vagaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteVaga(vagaId) {
    try {
      const response = await api.delete(`/vaga/${vagaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
