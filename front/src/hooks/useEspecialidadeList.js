import { useState, useEffect } from 'react';
import { getAllEspecialidade } from '../../services/especialidadeService';

const EspecialidadeList = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEspecialidades = async () => {
            try {
                const data = await getAllEspecialidade();
                setEspecialidades(data);
            } catch (err) {
                setError(err);
            }
        };

        getEspecialidades();
    }, []);

    return { especialidades, error };
};

export default EspecialidadeList;
