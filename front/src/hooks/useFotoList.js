import { useState, useEffect } from 'react';
import { getAllFoto } from '../../services/fotoService';

const FotosList = () => {
    const [fotos, setFotos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFotos = async () => {
            try {
                const data = await getAllFoto();
                setFotos(data);
            } catch (err) {
                setError(err);
            }
        };

        getFotos();
    }, []);

    return { fotos, error };
};

export default FotosList;
