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
    const diasDaSemana = {
        MONDAY: "Segunda-feira",
        TUESDAY: "Terça-feira",
        WEDNESDAY: "Quarta-feira",
        THURSDAY: "Quinta-feira",
        FRIDAY: "Sexta-feira"
    };

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const cronogramaData = await getCronogramaById(id);
                    setCronograma(cronogramaData);

                    console.log("jsão crono", cronogramaData.horariosJson);
                } catch (error) {
                    console.error('Erro ao buscar agenda:', error);
                }
            };
            fetchData();
        }
    }, [id]);

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
        if (!horariosJson) return ''; // Verificar se horariosJson é indefinido
        const horarios = traduzir(horariosJson);
        const dias = Object.keys(horarios);

        let formattedHorarios = '';
        dias.forEach((dia, index) => {
            const inicio = horarios[dia].inicio;
            const fim = horarios[dia].fim;
            const formattedDia = dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase();
            const formattedInicio = inicio.slice(0, 5);
            const formattedFim = fim.slice(0, 5);
            formattedHorarios += `${formattedDia}: ${formattedInicio} às ${formattedFim}`;
            if (index !== dias.length - 1) {
                formattedHorarios += '; ';
            }
        });
        console.log("hora: ", formattedHorarios);
        return formattedHorarios;
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
                                        <p>{cronograma.tempoAtendimento}</p>
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
                                        <p>{formatHorarios(cronograma.horariosJson)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.botao}>
                                {/*  <EditarWhiteButton page={"updateCronograma"} id={cronograma.id}/> */}

                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default GetCronogramaById;
