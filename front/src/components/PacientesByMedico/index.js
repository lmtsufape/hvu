import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAgendamentoMedico } from '../../../services/agendamentoService';
import VoltarButton from '../VoltarButton';

function PacientesByMedico() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    const { id } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const agendamentosData = await getAgendamentoMedico(id);
                setAgendamentos(agendamentosData);
            } catch (error) {
                console.error('Erro ao buscar agendamentos do médico:', error);
            }
        };
        fetchData();
    }, []);
    console.log("agendamentos:", agendamentos);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const filteredAgendamentos = agendamentos.filter(agendamento =>
        agendamento.animal.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ); 

    return (
        <div className={styles.container}>
            < VoltarButton />

            <h1>Pacientes</h1>

            <div className={styles.navbar}>
                <SearchBar
                    placeholder={"Buscar paciente"}
                    onSearchChange={handleSearchChange}
                />
            </div>

            {filteredAgendamentos.length === 0 ? (
                <p className={styles.message}>Não há pacientes.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredAgendamentos.map(agendamento => (
                        <li key={agendamento.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Paciente</h6>
                                <p>{agendamento.animal.nome}</p>
                            </div>
                            <div className={styles.info}>
                                <h6>Espécie</h6>
                                <p>{agendamento.animal.raca && agendamento.animal.raca.especie && agendamento.animal.raca.especie.nome}</p>
                            </div>
                            <div className={styles.button_box}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => router.push(`/getAnimalByIdByMedico/${agendamento.animal.id}`)}
                                >
                                    Acessar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PacientesByMedico;