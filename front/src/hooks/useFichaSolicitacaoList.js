import { useState, useEffect } from 'react';
import { getAllFichaSolicitacao } from '../../services/fichaSolicitacaoService'; 

const FichaSolicitacaoServicoList = () => {
    const [fichaSolicitacaoServico, setFichaSolicitacaoServico] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFichaSolicitacaoServico = async () => {
            try {
                const data = await getAllFichaSolicitacao();
                setFichaSolicitacaoServico(data);
            } catch (err) {
                setError(err);
            }
        };

        getFichaSolicitacaoServico();
    }, []);

    return { fichaSolicitacaoServico, error };
};

export default FichaSolicitacaoServicoList;
