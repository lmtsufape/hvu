import { useState, useEffect } from 'react';
import { getAllFichaSolicitacao } from '../../services/fichaSolicitacaoService'; 

const FichaSolicitacaoServicoList = () => {
    const [fichas, setFichas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFichas = async () => {
            try {
                const data = await getAllFichaSolicitacao();
                const list = Array.isArray(data) ? data : data.content || [];
                setFichas(list);
            } catch (err) {
                setError(err);
            }
        };

        getFichas();
    }, []);

    return { fichas, error };
};

export default FichaSolicitacaoServicoList;
