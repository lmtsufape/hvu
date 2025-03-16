import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { getCronogramaById } from '../../../services/cronogramaService';
import VoltarButton from '../VoltarButton';
import { EditarWhiteButton } from '../WhiteButton';

function GetCronogramaById() {
    const router = useRouter();
    const { id } = router.query;
    const [cronograma, setCronograma] = useState({});
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const diasDaSemana = {
        MONDAY: "Segunda-feira",
        TUESDAY: "Terça-feira",
        WEDNESDAY: "Quarta-feira",
        THURSDAY: "Quinta-feira",
        FRIDAY: "Sexta-feira"
    };

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
                    const cronogramaData = await getCronogramaById(id);
                    setCronograma(cronogramaData);

                    console.log("jsão crono", cronogramaData.horariosJson);
                } catch (error) {
                    console.error('Erro ao buscar agenda:', error);
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
    if (!roles.includes("secretario")) {
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

    const traduzir = (horariosJson) => {
        const dias = JSON.parse(horariosJson);
        const diasTraduzidos = {};
        for (const dia in dias) {
            const horarios = dias[dia];
            diasTraduzidos[diasDaSemana[dia]] = horarios;
        }
        return (diasTraduzidos);
    }

    const formatHorarios = (horariosJson) => {
        if (!horariosJson) return []; // Retorna um array vazio se não houver horários
        const horarios = traduzir(horariosJson);
        const dias = Object.keys(horarios);
    
        let horariosList = [];
        dias.forEach((dia) => {
            const inicio = horarios[dia].inicio;
            const fim = horarios[dia].fim;
            const formattedDia = dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();
            const formattedInicio = inicio.slice(0, 5);
            const formattedFim = fim.slice(0, 5);
            horariosList.push(`${formattedDia}: ${formattedInicio} às ${formattedFim}`);
        });
        return horariosList;
    };
  

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Detalhes da agenda</h1>
            <ul>
                {cronograma && (
                    <li key={cronograma.id} className={styles.infos_box}>
                        <div className={styles.identificacao}>
                            <div className={styles.nome_animal}>{cronograma.nome}</div>
                            <div className={styles.especie_animal}>Nome</div>
                        </div>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Tempo de atendimento</h6>
                                        <p>{cronograma.tempoAtendimento} minutos</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Especialidade</h6>
                                        <p>{cronograma.especialidade && cronograma.especialidade.nome}</p>
                                    </div>
                                </div>

                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Veterinário&#40;a&#41;</h6>
                                        <p>{cronograma.medico && cronograma.medico.nome}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Dias e horários de atendimento</h6>
                                        <ul>
                                            {formatHorarios(cronograma.horariosJson).map((horario, index) => (
                                                <li key={index}>{horario}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.botao}>
                                <EditarWhiteButton page={"updateCronograma"} id={cronograma.id}/>

                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default GetCronogramaById;
