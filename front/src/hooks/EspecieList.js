import { useState, useEffect } from 'react';
import { getAllEspecie } from '../../services/especieService';

const EspeciesList = () => {
    const [especies, setEspecies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEspecies = async () => {
            try {
                const data = await getAllEspecie();
                setEspecies(data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        getEspecies();
    }, []);

    return { especies, isLoading, error };
};

export default EspeciesList;
