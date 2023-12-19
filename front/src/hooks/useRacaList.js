import { useState, useEffect } from 'react';
import { getAllRaca } from '../../services/racaService';

const RacasList = () => {
    const [racas, setRacas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRacas = async () => {
            try {
                const data = await getAllRaca();
                setRacas(data);
            } catch (err) {
                setError(err);
            }
        };
        getRacas();
    }, []);

    return { racas, error };
};

export default RacasList;
