import { useState, useEffect } from 'react';
import { getAllAnimalTutor } from '../../services/animalService';

const AnimalByTutorList = () => {
    const [animais, setAnimais] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAnimaisByTutor = async () => {
            try {
                const data = await getAllAnimalTutor();
                setAnimais(data);
            } catch (err) {
                setError(err);
            }
        };

        getAnimaisByTutor();
    }, []);

    return { animais, error };
};

export default AnimalByTutorList;
