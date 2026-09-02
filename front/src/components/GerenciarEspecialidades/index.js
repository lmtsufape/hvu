import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllEspecialidade, deleteEspecialidade } from '../../../services/especialidadeService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import ErrorAlert from "../ErrorAlert";

function GerenciarEspecialidades() {
    const [especialidades, setEspecialidades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [deletedEspecialidadeId, setDeletedEspecialidadeId] = useState(null); // Estado para controlar o ID da raça excluída recentemente
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true); 

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
            setShowErrorAlert(false);
        try {
                const especialidadesData = await getAllEspecialidade();
                setEspecialidades(especialidadesData);
            } catch (error) {
                console.error('Erro ao buscar especialidades:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, [deletedEspecialidadeId]); // Adicione deletedEspecialidadeId como uma dependência

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

    const handleDeleteEspecialidade = async (especialidadeId) => {
        setShowErrorAlert(false);
        try {
            await deleteEspecialidade(especialidadeId);
            setEspecialidades(especialidades.filter(especialidade => especialidade.id !== especialidadeId));
            setDeletedEspecialidadeId(especialidadeId); // Atualiza o estado para acionar a recuperação da lista
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir especialidade:', error);
            if (error) {
                
            const isDataIntegrityError = error?.response?.data?.error === "Erro de integridade de dados" || error?.response?.data?.message?.includes("violates foreign key constraint");
                if (error?.response?.data?.message && !isDataIntegrityError) {
                    setErrorMessage(error?.response?.data?.message);
                } else if (error?.response?.data?.error && !isDataIntegrityError) {
                    setErrorMessage(error?.response?.data?.error);
                } else {
                setErrorMessage("");
            }
            setShowErrorAlert(true);
            }
        }
    };

    // Função para filtrar as raças com base na opção selecionada
    const filteredEspecialidades = especialidades.filter(especialidade => {
        return especialidade.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de especialidades</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por especialidade`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/createEspecialidade`)}>
                    Adicionar especialidade
                </button>
            </div>

            {filteredEspecialidades.length === 0 ? (
                <p className={styles.paragrafo}> Especialidade não existe.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredEspecialidades.map(especialidade => (
                        <li key={especialidade.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Especialidade</h6>
                                <p>{especialidade.nome}</p>
                            </div>    
                            <div  className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/updateEspecialidade/${especialidade.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={especialidade.id} onDelete={handleDeleteEspecialidade} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message={errorMessage || "Especialidade excluída com sucesso!"} show={showAlert} />}
            {showErrorAlert && <ErrorAlert message={errorMessage || "Esta especialidade não pode ser excluída por estar associada a um(a) veterinário(a)."} show={showErrorAlert} />}

        </div>
    );
}

export default GerenciarEspecialidades;
