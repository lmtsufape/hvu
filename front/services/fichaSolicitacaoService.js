import api from '../common/http-common-back';

  // Função para criar uma ficha de solicitação
  export async function createFichaSolicitacao(fichaSolicitacaoData) {
    try {
      const response = await api.post('/fichaSolicitacaoServico', fichaSolicitacaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas as ficha de solicitação
  export async function getAllFichaSolicitacao() {
    try {
      const response = await api.get('/fichaSolicitacaoServico');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar uma ficha de solicitação por ID
  export async function getFichaSolicitacaoById(fichaSolicitacaoId) {
    try {
      const response = await api.get(`/fichaSolicitacaoServico/${fichaSolicitacaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar uma ficha de solicitação
  export async function updateFichaSolicitacao(fichaSolicitacaoId, fichaSolicitacaoData) {
    try {
      const response = await api.patch(`/fichaSolicitacaoServico/${fichaSolicitacaoId}`, fichaSolicitacaoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir uma ficha de solicitação por ID
  export async function deleteFichaSolicitacao(fichaSolicitacaoId) {
    try {
      const response = await api.delete(`/fichaSolicitacaoServico/${fichaSolicitacaoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
