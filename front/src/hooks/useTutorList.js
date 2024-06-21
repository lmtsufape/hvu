import { useState, useEffect } from 'react';
import { getAllTutor } from '../../services/tutorService';

const TutorList = () => {
    const [tutores, setTutores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTutores = async () => {
            try {
                const data = await getAllTutor();
                setTutores(data);
            } catch (err) {
                setError(err);
            }
        };

        getTutores();
    }, []);

    return { tutores, error };
};

export default TutorList;
