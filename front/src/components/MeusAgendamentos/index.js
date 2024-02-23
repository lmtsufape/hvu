import React, { useState, useEffect } from 'react';
import styles from "./index.module.css";
import { useRouter } from "next/router";
import Image from "next/image";;
import VoltarButton from "../VoltarButton";
import SearchBar from "../SearchBar";
import { getAgendamento, deleteAgendamento } from "../../../services/agendamentoService";

export default function MeusAgendamentos() {
    const router = useRouter();

    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const agendamentosData = await getAgendamento();
                setAgendamentos(agendamentosData);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };
        fetchData();
    }, []);

    const handleDeleteAgendamento = async (agendamentoId) => {
        try {
            await deleteAgendamento(agendamentoId);
            setAgendamentos(agendamentos.filter(agendamento => agendamento.id !== agendamentoId));
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
        }
    };

    return (
        <div>
            <div className={styles.voltar}>
                <VoltarButton />
            </div>
            <div className={styles.titleMeusAgendamentos}>
                <h1>Meus Agendamentos</h1>
            </div>
            <div className={styles.pesquisaBotao}>
                <input />
                <div>
                    <Image src="/images/icone_busca_grey.svg" alt="Pesquisar" width={20} height={17} />
                </div>
                <button onClick={(e) => router.push("/agendarConsulta")}><h1>Criar agendamento</h1></button>
            </div>

            {agendamentos.length === 0 ? (
                <div className={styles.message}>Não há consultas marcadas.</div>
            ) : (
                    <ul className={styles.list}>
                        {agendamentos.map(agendamento => (
                            <li key={agendamento.id} className={styles.info_container}>
                                <div className={styles.agendamentos}>
                                    <div className={styles.agendamentoBox}>
                                        <div>
                                            <h1>Consulta Clínica</h1>
                                            {/* Ver como listar os horários para alterar abaixo*/}
                                            <h2>29/07 às 08:00</h2>
                                        </div>
                                        <div>
                                            <h1>Paciente</h1>
                                            <h2>{agendamento.animal && agendamento.animal.nome}</h2>
                                        </div>
                                        <div>
                                            <button onClick={() => handleDeleteAgendamento(agendamento.id)}>
                                                <h1>Cancelar</h1>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    )
}
