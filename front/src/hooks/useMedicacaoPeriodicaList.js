import { useState, useEffect } from 'react';
import { getAllMedicacaoPeriodica } from '../../services/medicacaoPeriodicaService';

const MedicacaoPeriodicaList = () => {
    const [medicacaoPeriodica, setMedicacaoPeriodica] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMedicacaoPeriodica = async () => {
            try {
                const data = await getAllMedicacaoPeriodica();
                setMedicacaoPeriodica(data);
            } catch (err) {
                setError(err);
            }
        };

        getMedicacaoPeriodica();
    }, []);

    return { medicacaoPeriodica, error };
};

export default MedicacaoPeriodicaList;
