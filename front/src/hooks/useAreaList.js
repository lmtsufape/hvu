import { useState, useEffect } from 'react';
import { getAllArea } from '../../services/areaService';

const AreaList = () => {
    const [areas, setAreas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAreas = async () => {
            try {
                const data = await getAllArea();
                setAreas(data);
            } catch (err) {
                setError(err);
            }
        };

        getAreas();
    }, []);

    return { areas, error };
};

export default AreaList;
