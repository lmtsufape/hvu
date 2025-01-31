import api from '../common/http-common-back';

export async function ForgotPassword(email) {
    localStorage.clear(); 
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || 'Erro ao tentar recuperar senha.'
        : 'Erro desconhecido. Verifique sua conexão.';
      throw new Error(errorMessage);
    }
  }