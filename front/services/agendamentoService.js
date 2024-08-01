import api from '../common/http-common-back';

  // Função para criar um novo agendamento
  export async function createAgendamento(agendamentoData, idVaga) {
    try {
      const response = await api.post(`agendamento/vaga/${idVaga}`, agendamentoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  export async function createAgendamentoEspecial(agendamentoData) {
    try {
      const response = await api.post(`agendamento/especial`, agendamentoData);
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

  export async function getAgendamentoTutor() {
    try {
      const response = await api.get('/agendamento/tutor');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  export async function getAgendamentoMedico(medicoId) {
    try {
      const response = await api.get(`/agendamento/medico/${medicoId}`);
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
      const response = await api.patch(`/animal/${agendamentoId}`, agendamentoData);
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

  export async function getDatasNaoPodeAgendar(tutorId) {
    try {
      const response = await api.get(`/agendamento/datasnaopodeagendar/${tutorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
