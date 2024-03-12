import api from '../common/http-common-back';

  // Função para criar um novo tutor
  export async function createTutor(tutorData) {
    try {
      const response = await api.post('/tutor', tutorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todos os tutores
  export async function getAllTutor() {
    try {
      const response = await api.get('/tutor');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um tutor por ID
  export async function getTutorById(tutorId) {
    try {
      const response = await api.get(`/tutor/${tutorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um tutor
  export async function updateTutor(tutorId, tutorData) {
    try {
      const response = await api.patch(`/usuario/${tutorId}`, tutorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um tutor por ID
  export async function deleteTutor(usuarioId) {
    try {
      const response = await api.delete(`/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
