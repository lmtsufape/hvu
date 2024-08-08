import { useState, useEffect } from 'react';
import { getAllEstagiario } from '../../services/estagiarioService';

const EstagiarioList = () => {
    const [estagiarios, setEstagiarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEstagiarios = async () => {
            try {
                const data = await getAllEstagiario();
                setEstagiarios(data);
            } catch (err) {
                setError(err);
            }
        };

        getEstagiarios();
    }, []);

    return { estagiarios, error };
};

export default EstagiarioList;
