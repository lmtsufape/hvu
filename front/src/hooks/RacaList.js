import { useState, useEffect } from 'react';
import { getAllRaca } from '../../services/racaService';

const RacasList = () => {
    const [racas, setRacas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRacas = async () => {
            try {
                const data = await getAllRaca();
                setRacas(data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };
        getRacas();
    }, []);

    return { racas, isLoading, error };
};

export default RacasList;
