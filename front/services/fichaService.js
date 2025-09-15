import api from '../common/http-common-back';

export async function getAllFichas() {
    try {
        const response = await api.get('/ficha');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createFicha(ficha) {
    try {
        const response = await api.post('/ficha', ficha);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getFichaById(fichaId) {
    try {
        const response = await api.get(`/ficha/${fichaId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getFichasByAnimalId(animalId) {
    if (!animalId) {
        console.warn("getFichasByAnimalId chamado sem um animalId.");
        return [];
    }
    try {
        const response = await api.get(`/ficha/animal/${animalId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar fichas para o animal com id ${animalId}:`, error.response?.data || error.message);
        throw error;
    }
}

export async function updateFicha(formData, fichaId) {
    try {
        const response = await api.patch(`/ficha/${fichaId}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteFicha(fichaId) {
    try {
        const response = await api.delete(`/ficha/${fichaId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}