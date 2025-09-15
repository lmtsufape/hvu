import { useState, useEffect } from 'react';
import { getAllCampoLaudo } from '../../services/campoLaudoService';

const CampoLaudoList = () => {
    const [campoLaudo, setCampoLaudo] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCampoLaudo = async () => {
            try {
                const data = await getAllCampoLaudo();
                setCampoLaudo(data);
            } catch (err) {
                setError(err);
            }
        };

        getCampoLaudo();
    }, []);

    return { campoLaudo, error };
};

export default CampoLaudoList;
