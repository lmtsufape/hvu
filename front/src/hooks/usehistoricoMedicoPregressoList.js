import { useState, useEffect } from 'react';
import { getAllHistoricoMedicoPregresso } from '../../services/historicoMedicoPregressoService';

const HistoricoMedicoPregressoList = () => {
    const [historicoMedicoPregresso, setHistoricoMedicoPregresso] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getHistoricoMedicoPregresso = async () => {
            try {
                const data = await getAllHistoricoMedicoPregresso();
                setHistoricoMedicoPregresso(data);
            } catch (err) {
                setError(err);
            }
        };

        getHistoricoMedicoPregresso();
    }, []);

    return { historicoMedicoPregresso, error };
};

export default HistoricoMedicoPregressoList;
