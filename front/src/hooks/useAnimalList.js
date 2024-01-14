import { useState, useEffect } from 'react';
import { getAllAnimal } from '../../services/animalService';

const AnimalList = () => {
    const [animais, setAnimais] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAnimais = async () => {
            try {
                const data = await getAllAnimal();
                setAnimais(data);
            } catch (err) {
                setError(err);
            }
        };

        getAnimais();
    }, []);

    return { animais, error };
};

export default AnimalList;
