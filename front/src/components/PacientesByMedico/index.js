import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAnimaisPorOrigem } from '../../../services/animalService'; // Ajuste o caminho se necessário
import VoltarButton from '../VoltarButton';

function PacientesByMedico() {
    const [animais, setAnimais] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));

            if (!storedToken || !storedRoles) {
                setErro("Erro ao carregar permissões do usuário");
            } else {
                setToken(storedToken);
                setRoles(storedRoles);
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Envia a enum 'HVU' como parâmetro de origem
                const animaisData = await getAnimaisPorOrigem("HVU");
                setAnimais(animaisData || []);
                setErro("");
            } catch (error) {
                if (error.response?.status === 404) {
                    setErro("Página não encontrada (Erro 404)");
                } else if (error.response?.status === 403) {
                    setErro("Acesso negado (Erro 403)");
                } else {
                    setErro("Erro ao buscar animais do HVU");
                }
                console.error('Erro ao carregar animais:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className={styles.message}>Carregando dados...</div>;
    }

    const temPermissao = roles.includes("medico") || roles.includes("secretario") || roles.includes("ROLE_MEDICO") || roles.includes("ROLE_SECRETARIO");

    if (!temPermissao || erro) {
        return (
            <div className={styles.container}>
                <h3 className={styles.mensagem}>
                    {erro || "Acesso negado: Você não tem permissão para acessar esta página."}
                </h3>
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

    // Filtra diretamente pelas propriedades simples do record (nome)
    const filteredAnimais = animais.filter((item) =>
        item.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAnimalClick = (animalId) => {
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

            {filteredAnimais.length === 0 ? (
                <p className={styles.message}>Não há pacientes.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredAnimais.map((item) => (
                        <li key={item.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Paciente</h6>
                                <p>{item.nome}</p>
                            </div>
                            <div className={styles.info}>
                                <h6>Raça</h6>
                                <p>{item.raca}</p>
                            </div>
                            <div className={styles.button_box}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => handleAnimalClick(item.id)}
                                >
                                    Visualizar
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