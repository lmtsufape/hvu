import { useState, useEffect } from 'react';
import { getAllTipoConsulta } from '../../services/tipoConsultaService'; 

const TipoConsultaList = () => {
    const [tiposConsulta, setTiposConsulta] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTiposConsulta = async () => {
            try {
                const data = await getAllTipoConsulta();
                setTiposConsulta(data);
            } catch (err) {
                setError(err);
            }
        };

        getTiposConsulta();
    }, []);

    return { tiposConsulta, error };
};

export default TipoConsultaList;
