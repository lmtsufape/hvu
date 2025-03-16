import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllRaca, deleteRaca } from '../../../services/racaService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import FilterEspecieRaca from '../FilterEspecieRaca';
import ErrorAlert from "../ErrorAlert";

function GerenciarRacasList() {
    const [racas, setRacas] = useState([]);
    const [filtro, setFiltro] = useState('especie');
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedRacaId, setDeletedRacaId] = useState(null); // Estado para controlar o ID da raça excluída recentemente
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true); 
    const [accessDenied, setAccessDenied] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const racasData = await getAllRaca();
                setRacas(racasData);
            } catch (error) {
                console.error('Erro ao buscar racas:', error);
                if (error.response && error.response.status === 403) {
                    setAccessDenied(true); // Define o estado de acesso negado
                }
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, [deletedRacaId]); // Adicione deletedRacaId como uma dependência

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão ou se o acesso for negado 
    if (!roles.includes("secretario") || accessDenied) {
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

    const handleDeleteRaca = async (racaId) => {
        try {
            await deleteRaca(racaId);
            setRacas(racas.filter(raca => raca.id !== racaId));
            setDeletedRacaId(racaId); // Atualiza o estado para acionar a recuperação da lista
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir a raça:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const handleFilterChange = (event) => {
        setFiltro(event.target.value);
    };

    // Função para filtrar as raças com base na opção selecionada
    const filteredRacas = racas.filter(raca => {
        if (filtro === 'especie') {
            return raca.especie && raca.especie.nome.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filtro === 'raca') {
            return raca.nome.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de raças</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por ${filtro === 'especie' ? 'Espécie' : 'Raça'}`} onSearchChange={setSearchTerm} />
                <div className={styles.navbar_sub}>
                    <FilterEspecieRaca onChange={handleFilterChange} />
                    <button className={styles.adicionar_raca_button} onClick={() => router.push(`/createRaca`)}>
                        Adicionar raça
                    </button>
                </div>
            </div>

            {filteredRacas.length === 0 ? (
                <p className={styles.paragrafo}>Item pesquisado não existe no sistema.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredRacas.map(raca => (
                        <li key={raca.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Espécie</h6>
                                <p>{raca.especie && raca.especie.nome}</p>
                            </div>
                            <div className={styles.info_box}>
                                <h6>Raça</h6>
                                <p>{raca.nome}</p>
                            </div>
                            <div  className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/updateRaca/${raca.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={raca.id} onDelete={handleDeleteRaca} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Raça excluída com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Esta raça não pode ser excluída por estar associada a um animal." show={showErrorAlert} />}

        </div>
    );
}

export default GerenciarRacasList;
