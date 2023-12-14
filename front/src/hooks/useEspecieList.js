import { useState, useEffect } from 'react';
import { getAllEspecie } from '../../services/especieService';

const EspeciesList = () => {
    const [especies, setEspecies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getEspecies = async () => {
            try {
                const data = await getAllEspecie();
                setEspecies(data);
            } catch (err) {
                setError(err);
            }
        };

        getEspecies();
    }, []);

    return { especies, error };
};

export default EspeciesList;
