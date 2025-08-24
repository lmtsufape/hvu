import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { getFichaSolicitacaoById } from '../../../../services/fichaSolicitacaoService';
import { EditarWhiteButton } from '@/components/WhiteButton';
import App from '../PdfFichaDeSolicitacao';

function GetFichaSolicitacaoById() {
    const router = useRouter();
    const { id } = router.query;
    const [ficha, setFicha] = useState({});

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const fichaData = await getFichaSolicitacaoById(id);
                    setFicha(fichaData);
                } catch (error) {
                    console.error('Erro ao buscar fichas cadastradas:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    

    const capitalize = (text) => {
        if (text === null || text === undefined) return '';
        const str = String(text); 
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        }).format(date);
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Informações da Ficha de Solicitação de Serviço</h1> 
            
            <div className={styles.container_box}>
                <ul>
                    {ficha && (
                        <div className={styles.list_container}>
                            <li key={ficha.id} className={styles.list_box}>
                                <div className={styles.title_endereco}></div> 
                                <div className={styles.tutor}>
                                    <div className={styles.item_box}>
                                        <h6>Código da Ficha</h6>
                                        <h4 className={styles.medico_nome}>{ficha.codigoPatologia}</h4>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>Data e Hora do Obito</h6>
                                            <div>{formatDateTime(ficha.dataHoraObito)}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Estado de conservação</h6>
                                            <div>{capitalize(ficha.estadoConservacao)}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Eutanásia</h6>
                                            <div>{ficha.eutanasia ? capitalize(ficha.eutanasia) : 'Não realizada'}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}>                                     
                                        <div className={styles.item_box}>
                                            <h6>Histórico</h6>
                                            <div>{ficha.historico}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Características Adicionais</h6>
                                            <div>{ficha.caracteristicasAdicionais}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Ficha Clínica</h6>
                                            <div>{ficha.fichaClinica}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>Data de Recebimento</h6>
                                            <div>{formatDateTime(ficha.dataRecebimento)}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Acondicionamento</h6>
                                            <div>{capitalize(ficha.acondicionamento)}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Tipo de Serviço</h6>
                                            <div>{capitalize(ficha.tipoServico)}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>Identificação do Tutor</h6>
                                            <div>
                                                {ficha.tutor && (
                                                    <div className={styles.item_container}> 
                                                        <div className={styles.item_box}>
                                                            <h6>Nome</h6>
                                                            <div>{ficha.tutor.nome}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Identificação do Animal</h6>
                                            <div>
                                                {ficha.animal && (
                                                    <div className={styles.item_container}> 
                                                        <div className={styles.item_box}>
                                                            <h6>Nome</h6>
                                                            <div>{ficha.animal.nome}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Identificação do Veterinário</h6>
                                            <div>
                                                {ficha.medico && (
                                                    <div className={styles.item_container}> 
                                                        <div className={styles.item_box}>
                                                            <h6>Nome</h6>
                                                            <div>{ficha.medico.nome}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>                                
                                </div>
                            </li>
                        </div>
                    )}
                </ul>
                <div className={styles.button_container}>
                    <EditarWhiteButton page={"/lapa/updateFicha"} id={ficha.id}/>
                    <App ficha={ficha} />
                </div>
            </div>
        </div>
    );
}

export default GetFichaSolicitacaoById;
