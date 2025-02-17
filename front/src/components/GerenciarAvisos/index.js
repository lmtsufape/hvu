import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllAviso, deleteAviso } from '../../../services/avisoService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import ErrorAlert from "../ErrorAlert";

function GerenciarAvisos() {
    const [avisos, setAvisos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedAvisoId, setDeletedAvisoId] = useState(null); // Estado para controlar o ID da raça excluída recentemente
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
            try {
                const AvisosData = await getAllAviso();
                setAvisos(AvisosData);
            } catch (error) {
                console.error('Erro ao buscar avisos:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, [deletedAvisoId]); 

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

    const handleDeleteAviso = async (avisoId) => {
        try {
            await deleteAviso(avisoId);
            setAvisos(avisos.filter(aviso => aviso.id !== avisoId));
            setDeletedAvisoId(avisoId); // Atualiza o estado para acionar a recuperação da lista
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir aviso:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredAvisos = avisos.filter(Aviso => {
        return Aviso.texto.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de avisos</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por aviso`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/createAviso`)}>
                    Adicionar aviso
                </button>
            </div>

            {filteredAvisos.length === 0 ? (
                <p className={styles.paragrafo}> Não existem avisos.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredAvisos.map(aviso => (
                        <li key={aviso.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Aviso - {aviso.habilitado ? "habilitado" : "desabilitado"}</h6>
                                <div>{aviso.texto}</div>
                            </div>
                            <div  className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/updateAviso/${aviso.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={aviso.id} onDelete={handleDeleteAviso} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Aviso excluída com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Esta Aviso não pode ser excluída por estar associada a um animal." show={showErrorAlert} />}

        </div>
    );
}

export default GerenciarAvisos;
