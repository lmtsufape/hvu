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

export async function updateFicha(fichaId) {
    try {
        const response = await api.patch(`/ficha/${fichaId}`);
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