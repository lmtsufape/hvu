import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from '@/components/Lapa/VoltarButton';
import { getLaudoMicroscopiaById } from '../../../../../../services/laudoMicroscopiaService';
import { getToken, getRoles } from "../../../../../../services/userService";

function GetLaudoMicroscopiaById() {
    const router = useRouter();
    const { id } = router.query;
    const [laudo, setLaudo] = useState({});
    const [errors, setErrors] = useState({}); 
    const roles = getRoles();
    const token= getToken();

    if (!token) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Faça login para acessar esta página.
            </h3>
        </div>
        );
    }

    if (!roles.includes("patologista")) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Você não tem permissão para acessar esta página.
            </h3>
        </div>
        );
    }

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const laudoData = await getLaudoMicroscopiaById(id);
                    setLaudo(laudoData);
                } catch (error) {
                    console.error('Erro ao buscar laudo:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    // Se precisar de um handleSubmit, defina-o aqui
    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de submissão aqui
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>LAUDO DE MICROSCOPIA</h1>
            <form className={styles.form_box} onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col">
                        <label htmlFor="ficha" className="form-label">Ficha</label>
                        <input 
                            type="text"
                            className={`form-control ${errors.ficha ? "is-invalid" : ""}`}
                            name="ficha"
                            placeholder="Insira a ficha"
                            value={laudo.ficha || ''}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="campoMicroscopia" className="form-label">Campo de Microscopia</label>
                        <input
                            type="text"
                            className={`form-control ${errors.campoMicroscopia ? "is-invalid" : ""}`}
                            name="campoMicroscopia"
                            placeholder="Insira o campo de microscopia"
                            value={laudo.campoMicroscopia || ''}
                        />
                    </div>
                </div>

                <div className="row">
                    <h2>Conclusão</h2>
                    <div className="col">
                        <label htmlFor="conclusao" className="form-label">Conclusão</label>
                        <textarea
                            className={`form-control ${errors.conclusao ? "is-invalid" : ""}`}
                            name="conclusao"
                            placeholder="Insira a conclusão"
                            value={laudo.conclusao || ''}
                        />
                    </div>
                </div>

                <div className="row">
                    <h2>Outros Detalhes</h2>
                    <div className="col">
                        <label htmlFor="fichaSolicitacaoServico" className="form-label">Ficha de Solicitação de Serviço</label>
                        <input
                            type="text"
                            className={`form-control ${errors.fichaSolicitacaoServico ? "is-invalid" : ""}`}
                            name="fichaSolicitacaoServico"
                            placeholder="Insira a ficha de solicitação de serviço"
                            value={laudo.fichaSolicitacaoServico?.id || ''}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="estagiario" className="form-label">Estagiário</label>
                        <input
                            type="text"
                            className={`form-control ${errors.estagiario ? "is-invalid" : ""}`}
                            name="estagiario"
                            placeholder="Insira o nome do estagiário"
                            value={laudo.estagiario?.map(est => est.id).join(', ') || ''}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="foto" className="form-label">Foto</label>
                        <input
                            type="text"
                            className={`form-control ${errors.foto ? "is-invalid" : ""}`}
                            name="foto"
                            placeholder="Insira a foto"
                            value={laudo.foto?.map(f => f.id).join(', ') || ''}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
        </div>
    );
}

export default GetLaudoMicroscopiaById;
