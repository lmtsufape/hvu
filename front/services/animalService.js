import api from '../common/http-common-back';

  // Função para criar
  export async function createAnimal(animalData) {
    try {
      const response = await api.post('/animal', animalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todas 
  export async function getAllAnimal() {
    try {
      const response = await api.get('/animal');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar por ID
  export async function getAnimalById(animalId) {
    try {
      const response = await api.get(`/animal/${animalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar 
  export async function updateAnimal(animalId, animalData) {
    try {
      const response = await api.patch(`/animal/${animalId}`, animalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir
  export async function deleteAnimal(animalId) {
    try {
      const response = await api.delete(`/animal/${animalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
