import { useState, useEffect } from 'react';
import { getAllLaudoMicroscopia } from '../../services/laudoMicroscopiaService';

const LaudoMicroscopiaList = () => {
    const [laudoMicroscopias, setLaudoMicroscopias] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLaudoMicroscopias = async () => {
            try {
                const data = await getAllLaudoMicroscopia();
                setLaudoMicroscopias(data);
            } catch (err) {
                setError(err);
            }
        };

        getLaudoMicroscopias();
    }, []);

    return { laudoMicroscopias, error };
};

export default LaudoMicroscopiaList;
