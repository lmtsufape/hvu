import { useState, useEffect } from 'react';
import { getAllFotos } from '../../services/fotoService';

const FotoList = () => {
    const [fotos, setFotos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFotos = async () => {
            try {
                const data = await getAllFotos();
                setFotos(data);
            } catch (err) {
                setError(err);
            }
        };

        getFotos();
    }, []);

    return { fotos, error };
};

export default FotoList;
