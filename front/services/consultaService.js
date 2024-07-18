import api from '../common/http-common-back';

// Função para criar uma nova consulta
export async function createConsulta(consultaData) {
  try {
    const response = await api.post('/consulta', consultaData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para buscar todas as consultas
export async function getAllConsulta() {
  try {
    const response = await api.get('/consulta');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para buscar uma consulta por ID
export async function getConsultaById(consultaId) {
  try {
    const response = await api.get(`/consulta/${consultaId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getConsultaByAnimal(animalId) {
  try {
    const response = await api.get(`/consulta/animalid/${animalId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para atualizar uma consulta
export async function updateConsulta(consultaId, consultaData) {
  try {
    const response = await api.patch(`/consulta/${consultaId}`, consultaData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Função para excluir uma consulta por ID
export async function deleteConsulta(consultaId) {
  try {
    const response = await api.delete(`/consulta/${consultaId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Endpoint para cancelar agendamento pelo id
export async function cancelarAgendamento(cancelamentoData) {
  try {
    const response = await api.post(`/cancelamento/agendamento`, cancelamentoData);
  } catch (error) {
    throw error;
  }
}
