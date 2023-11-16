import api from '../common/http';

  // Função para criar um novo agendamento
  export async function createAgendamento(agendamentoData) {
    try {
      const response = await api.post('/agendamento', agendamentoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todos os agendamentos
  export async function getAgendamento() {
    try {
      const response = await api.get('/agendamento');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um agendamento por ID
  export async function getAgendamentoById(agendamentoId) {
    try {
      const response = await api.get(`/agendamento/${agendamentoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um agendamento
  export async function updateAgendamento(agendamentoId, agendamentoData) {
    try {
      const response = await api.put(`/animal/${agendamentoId}`, agendamentoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um agendamento por ID
  export async function deleteAgendamento(agendamentoId) {
    try {
      const response = await api.delete(`/agendamento/${agendamentoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
