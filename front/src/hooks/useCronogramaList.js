import { useState, useEffect } from 'react';
import { getAllCronograma } from '../../services/cronogramaService'; 

const CronogramaList = () => {
    const [cronogramas, setCronogramas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCronogramas = async () => {
            try {
                const data = await getAllCronograma();
                setCronogramas(data);
            } catch (err) {
                setError(err);
            }
        };

        getCronogramas();
    }, []);

    return { cronogramas, error };
};

export default CronogramaList;
