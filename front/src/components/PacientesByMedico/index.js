import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAgendamentoMedico } from '../../../services/agendamentoService';
import VoltarButton from '../VoltarButton';

function PacientesByMedico() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [animalIds, setAnimalIds] = useState(new Set()); // Conjunto para armazenar IDs de animais já listados

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
    }, [id]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const filteredAgendamentos = agendamentos.filter(agendamento =>
        agendamento.animal.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(agendamento => !animalIds.has(agendamento.animal.id)); // Filtrar animais que já foram listados

    const handleAnimalClick = (animalId) => {
        setAnimalIds(new Set(animalIds).add(animalId)); // Adicionar o ID do animal à lista de IDs listados
        router.push(`/getAnimalByIdByMedico/${animalId}`);
    };

    return (
        <div className={styles.container}>
            <VoltarButton />

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
                    {[...new Set(filteredAgendamentos.map(agendamento => agendamento.animal.id))].map(animalId => {
                        const agendamento = filteredAgendamentos.find(agendamento => agendamento.animal.id === animalId);
                        return (
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
                                        onClick={() => handleAnimalClick(agendamento.animal.id)}
                                    >
                                        Visualizar
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default PacientesByMedico;
