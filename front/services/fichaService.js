import api from '../common/http-common-back';

function resolveAnimalId(ficha) {
    if (ficha?.animal?.id != null) {
        return Number(ficha.animal.id);
    }

    if (ficha?.animalId != null) {
        return Number(ficha.animalId);
    }

    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryAnimalId = params.get('animalId');
        if (queryAnimalId) {
            return Number(queryAnimalId);
        }

        const storedAnimalId = localStorage.getItem('animalId');
        if (storedAnimalId) {
            return Number(storedAnimalId);
        }
    }

    return null;
}

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
        const normalizedFicha = { ...ficha };
        const animalId = resolveAnimalId(normalizedFicha);

        if (animalId && !normalizedFicha.animal?.id) {
            normalizedFicha.animal = { id: animalId };
        }

        const response = await api.post('/ficha', normalizedFicha);
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