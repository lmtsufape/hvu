import { useState, useEffect } from 'react';
import { getAllCampoLaudo } from '../../services/campoLaudoService';

const CampoLaudoList = () => {
    const [composLaudos, setComposLaudos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getComposLaudos = async () => {
            try {
                const data = await getAllCampoLaudo();
                setComposLaudos(data);
            } catch (err) {
                setError(err);
            }
        };

        getComposLaudos();
    }, []);

    return { composLaudos, error };
};

export default CampoLaudoList;
