import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllTipoConsulta, deleteTipoConsulta } from '../../../services/tipoConsultaService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import ErrorAlert from "../ErrorAlert";

function GerenciarTiposConsulta() {
    const [tiposConsulta, setTiposConsulta] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedTipoConsultaId, setDeletedTipoConsultaId] = useState(null); // Estado para controlar o ID da raça excluída recentemente
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true); 
    
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setRoles(storedRoles || []);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tiposConsultaData = await getAllTipoConsulta();
                setTiposConsulta(tiposConsultaData);
            } catch (error) {
                console.error('Erro ao buscar tipos de consulta:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, [deletedTipoConsultaId]); // Adicione deletedTipoConsultaId como uma dependência

    // Verifica se os dados estão carregando
    if (loading) {
        return <div>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    const handleDeleteTipoConsulta = async (tipoConsultaId) => {
        try {
            await deleteTipoConsulta(tipoConsultaId);
            setTiposConsulta(tiposConsulta.filter(tipoConsulta => tipoConsulta.id !== tipoConsultaId));
            setDeletedTipoConsultaId(tipoConsultaId); // Atualiza o estado para acionar a recuperação da lista
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir tipos de consulta:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    // Função para filtrar as raças com base na opção selecionada
    const filteredTiposConsulta = tiposConsulta.filter(tipoConsulta => {
        return tipoConsulta.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de tipos de consulta</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por tipo de consulta`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/createTipoConsulta`)}>
                    Adicionar tipo de consulta
                </button>
            </div>

            {filteredTiposConsulta.length === 0 ? (
                <p className={styles.paragrafo}> Tipo de consulta não existe.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredTiposConsulta.map(tipoConsulta => (
                        <li key={tipoConsulta.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Tipo de consulta</h6>
                                <p>{tipoConsulta.tipo}</p>
                            </div>
                            <div className={styles.info_box}>
                                <h6></h6>
                                <p></p>
                            </div>
                            <div  className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/updateTipoConsulta/${tipoConsulta.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={tipoConsulta.id} onDelete={handleDeleteTipoConsulta} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Tipo de consulta excluído com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Este tipo de consulta não pode ser excluído por estar associado a um agendamento." show={showErrorAlert} />}

        </div>
    );
}

export default GerenciarTiposConsulta;
