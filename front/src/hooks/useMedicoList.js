import { useState, useEffect } from 'react';
import { getAllMedico } from '../../services/medicoService';

const MedicoList = () => {
    const [medicos, setMedicos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMedicos = async () => {
            try {
                const data = await getAllMedico();
                setMedicos(data);
            } catch (err) {
                setError(err);
            }
        };

        getMedicos();
    }, []);

    return { medicos, error };
};

export default MedicoList;
