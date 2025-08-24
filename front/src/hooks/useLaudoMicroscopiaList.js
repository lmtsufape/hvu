import { useState, useEffect } from 'react';
import { getAllLaudoMicroscopia } from '../../services/laudoMicroscopiaService';

const LaudoMicroscopiaList = () => {
    const [campoMicroscopiaOptions, setCampoMicroscopiaOptions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMicroscopias = async () => {
            try {
                const data = await getAllLaudoMicroscopia();
                setCampoMicroscopiaOptions(data);
            } catch (err) {
                setError(err);
            }
        };

        getMicroscopias();
    }, []);

    return { campoMicroscopiaOptions, error };
};

export default LaudoMicroscopiaList;
