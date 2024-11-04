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
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const router = useRouter();

    const { id } = router.query;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            if (!storedToken || !storedRoles) {
                throw new Error("Erro ao carregar token ou roles do usuário");
            }
            setToken(storedToken);
            setRoles(storedRoles);
        }
    }, []);

    console.log("erro:", erro);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const agendamentosData = await getAgendamentoMedico(id);
                setAgendamentos(agendamentosData);
                setErro("");
            } catch (error) {
                if (error.response.status === 404) {
                    setErro("Página não encontrada (Erro 404)");
                } else if (error.response.status === 403) {
                    setErro("Acesso negado (Erro 403)");
                } else {
                    setErro("Erro ao buscar pacientes do médico");
                }
                console.error('Erro:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("medico") || erro) {
        return (
            <div className={styles.container}>
                <h3 className={styles.mensagem}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
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
