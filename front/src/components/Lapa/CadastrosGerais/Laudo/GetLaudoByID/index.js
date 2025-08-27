import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { getLaudoNecropsiaById } from '../../../../../../services/laudoNecropsiaService';
import { EditarWhiteButton } from '@/components/WhiteButton';
import { getToken, getRoles } from "../../../../../../services/userService";

function GetLaudoNecropsiaById() {
    const router = useRouter();
    const { id } = router.query;
    const [laudo, setLaudo] = useState({});

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
                    const laudoData = await getLaudoNecropsiaById(id);
                    console.log(laudoData)
                    setLaudo(laudoData || {});
                } catch (error) {
                    console.error('Erro ao buscar laudo:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Informações do Laudo</h1> 
            
            <div className={styles.container_box}>
                <ul>
                    {laudo && (
                        <div className={styles.list_container}>
                            <li key={laudo.id} className={styles.list_box}>
                                <div className={styles.title_endereco}></div> 
                                <div className={styles.tutor}>
                                    <div className={styles.item_box}>
                                        <h6>Código da Patologia</h6>
                                        <h4 className={styles.medico_nome}>{laudo.fichaSolicitacaoServico?.codigoPatologia}</h4>
                                    </div>

                                    <div className={styles.item_box}>
                                        <h6>Conclusão</h6>
                                        <div>{laudo.conclusao}</div>
                                    </div>

                                    <div className={styles.item_box}>
                                        <h6>Macroscopia</h6>
                                        {laudo.campoLaudo && laudo.campoLaudo.length > 0 ? (
                                            laudo.campoLaudo.map((campo) => (
                                                <div key={campo.id}>
                                                    <strong>Descrição:</strong> {campo.descricao} <br />
                                                    <strong>Órgão:</strong> {campo.orgao?.nome || '-'} <br />
                                                    {campo.orgao?.foto && (
                                                        <img 
                                                            src={`/uploads/${campo.orgao.foto.foto_path}`} 
                                                            alt={campo.orgao.foto.titulo} 
                                                            width={100} 
                                                        />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div>Não definido</div>
                                        )}
                                    </div>

                                    <div className={styles.item_box}>
                                        <h6>Microscopia</h6>
                                        {laudo.campoMicroscopia && laudo.campoMicroscopia.length > 0 ? (
                                            laudo.campoMicroscopia.map((campo) => (
                                                <div key={campo.id}>
                                                    <strong>Descrição:</strong> {campo.descricao} <br />
                                                    <strong>Processamento:</strong> {campo.processamento} <br />
                                                    <strong>Órgão:</strong> {campo.orgao?.nome || '-'} <br />
                                                    {campo.orgao?.foto && (
                                                        <img 
                                                            src={`/uploads/${campo.orgao.foto.foto_path}`} 
                                                            alt={campo.orgao.foto.titulo} 
                                                            width={100} 
                                                        />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div>Não definido</div>
                                        )}
                                    </div>

                                    <div className={styles.item_box}>
                                        <h6>Estagiário(a)</h6>
                                        {laudo.estagiario && laudo.estagiario.length > 0 ? (
                                            laudo.estagiario.map((est) => (
                                                <div key={est.id}>
                                                    {est.nome} - CPF: {est.cpf} - Período: {est.periodo}
                                                </div>
                                            ))
                                        ) : (
                                            <p>Nenhum estagiário selecionado</p>
                                        )}
                                    </div>

                                    <div className={styles.item_box}>
                                        <h6>Fotos</h6>
                                        {laudo.foto && laudo.foto.length > 0 ? (
                                            laudo.foto.map((f) => (
                                                <div key={f.id}>
                                                    <strong>{f.titulo}</strong> <br />
                                                    <img src={`/uploads/${f.foto_path}`} alt={f.titulo} width={100} />
                                                </div>
                                            ))
                                        ) : (
                                            <p>Nenhuma foto disponível</p>
                                        )}
                                    </div>
                                </div>
                            </li>
                        </div>
                    )}
                </ul>
                {/*<div className={styles.button_container}>
                    <EditarWhiteButton page={"/lapa/updateLaudo"} id={laudo.id}/>
                </div> */}
            </div>
        </div>
    );
}

export default GetLaudoNecropsiaById;
