import React, { useState, useEffect } from 'react';
import styles from "./index.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import VoltarButton from "../VoltarButton";
import SearchBar from "../SearchBar"; // Importe o componente SearchBar
import { getAgendamento, deleteAgendamento } from "../../../services/agendamentoService";
import { format } from 'date-fns'; 
import { CriarAgendamentoWhiteButton } from '../WhiteButton';

export default function MeusAgendamentos() {
    const router = useRouter();

    const [agendamentos, setAgendamentos] = useState([]);
    const [cancelarModalId, setCancelarModalId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o termo de pesquisa

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
            setCancelarModalId(null);
            alert("Agendamento cancelado!");
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
            setCancelarModalId(null);
        }
    };

    // Função para filtrar os agendamentos com base no nome do animal
    const filteredAgendamentos = agendamentos.filter(agendamento =>
        agendamento.animal && agendamento.animal.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const compareDates = (a, b) => {
        const dateA = new Date(a.dataVaga);
        const dateB = new Date(b.dataVaga);
        return dateB - dateA;
    };
    
    // Ordena os agendamentos com base nas datas
    const sortedAgendamentos = filteredAgendamentos.sort(compareDates);

    return (
        <div>
            <div className={styles.voltar}>
                <VoltarButton />
            </div>
            <div className={styles.titleMeusAgendamentos}>
                <h1>Meus Agendamentos</h1>
            </div>
            <div className={styles.navbar}>
                <SearchBar
                    placeholder="Buscar agendamento através do nome do animal" 
                    onSearchChange={setSearchTerm} 
                />
                < CriarAgendamentoWhiteButton /> 
            </div>

            {sortedAgendamentos.length === 0 ? (
                <div className={styles.message}>Não há consultas marcadas.</div>
            ) : (
                <ul className={styles.list}>
                    {sortedAgendamentos.map(agendamento => (
                        <li key={agendamento.id} className={styles.info_container}>
                            <div className={styles.agendamentos}>
                                <div className={styles.agendamentoBox}>
                                    <div>
                                        <h1>Consulta Clínica</h1>
                                        <h2>{format(new Date(agendamento.dataVaga), 'dd/MM \'às\' HH:mm')}</h2>
                                    </div>
                                    <div>
                                        <h1>Paciente</h1>
                                        <h2>{agendamento.animal && agendamento.animal.nome}</h2>
                                    </div>
                                    <div>
                                        <button className={styles.agendamento_button} onClick={() => setCancelarModalId(agendamento.id)}>
                                            <h1>Cancelar</h1>
                                        </button>
                                        {cancelarModalId === agendamento.id && (
                                            <div className={styles.modal}>
                                                <div className={styles.box1}>
                                                    <div>Deseja realmente cancelar?</div>
                                                    <button onClick={() => setCancelarModalId(null)} className={styles.button_close_modal}>X</button>
                                                </div>
                                                <div className={styles.box2}>
                                                    <button className={styles.cancelar_button} onClick={() => setCancelarModalId(null)}>Voltar</button>
                                                    <button className={styles.excluir_button2}  onClick={() => handleDeleteAgendamento(agendamento.id)}>Cancelar</button>
                                                </div>
                                            </div>
                                        )}
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
