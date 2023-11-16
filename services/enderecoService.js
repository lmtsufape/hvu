import api from '../common/http';

  // Função para criar um novo endereco
  export async function createEndereco(enderecoData) {
    try {
      const response = await api.post('/endereco', enderecoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar todos os enderecos
  export async function getAllEndereco() {
    try {
      const response = await api.get('/endereco');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para buscar um endereco por ID
  export async function getEnderecoById(enderecoId) {
    try {
      const response = await api.get(`/endereco/${enderecoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para atualizar um endereco
  export async function updateEndereco(enderecoId, enderecoData) {
    try {
      const response = await api.put(`/endereco/${enderecoId}`, enderecoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  // Função para excluir um endereco por ID
  export async function deleteEndereco(enderecoId) {
    try {
      const response = await api.delete(`/endereco/${enderecoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
