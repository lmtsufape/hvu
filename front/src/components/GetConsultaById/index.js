import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { getConsultaById } from '../../../services/consultaService';
import VoltarButton from '../VoltarButton';
import { EditarWhiteButton } from '../WhiteButton';

function GetConsultaById() {
    const router = useRouter();
    const { id } = router.query;
    const [consulta, setConsulta] = useState({});
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const consultaData = await getConsultaById(id);
                    setConsulta(consultaData);
                } catch (error) {
                    console.error('Erro ao buscar consulta:', error);
                } finally {
                    setLoading(false); // Marcar como carregado após buscar os dados
                }
            };
            fetchData();
        }
    }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("medico")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className={styles.container}>
            < VoltarButton />
            <h1>Informações da consulta</h1>
            <ul>
                {consulta && ( 
                    <li key={consulta.id} className={styles.infos_box}>
                        <div className={styles.identificacao}>
                            <div className={styles.nome_animal}>{consulta.animal && consulta.animal.nome}</div>
                            <div className={styles.especie_animal}>Paciente</div>
                        </div>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Peso atual</h6>
                                        <p>{consulta.pesoAtual}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Queixa principal</h6>
                                        <p>{consulta.queixaPrincipal}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Suspeitas clínicas</h6>
                                        <p>{consulta.suspeitasClinicas}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Veterinário&#40;a&#41;</h6>
                                        <p>{consulta.medico && consulta.medico.nome}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Próxima consula</h6>
                                        <p>{consulta.proximaConsulta === true ? "Retorno" : "Atendimento clínico"}</p>
                                    </div>
                                </div>

                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Idade Atual</h6>
                                        <p>{consulta.idadeAtual}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Alterações clínicas diversas</h6>
                                        <p>{consulta.alteracoesClinicasDiversas}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Alimentação</h6>
                                        <p>{consulta.alimentacao}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Encaminhado&#40;a&#41; por:</h6>
                                        <p>{consulta.medico ? consulta.medico && consulta.medico.nome : "Não possui encaminhamento"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.botao}>
                                <EditarWhiteButton page={"updateConsulta"} id={consulta.id}/>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default GetConsultaById;
