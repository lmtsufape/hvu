import api from '../common/http-common-back';

export async function ForgotPassword(email) {
    localStorage.clear(); 
    try {
      const response = await api.post('/auth/forgot-password', { email });
        // Retorna a mensagem de sucesso diretamente
        return { success: true, message: response.data };
    } catch (error) {

        const errorMessage = error.response?.data;
        return { success: false, message: errorMessage };
    }
  }