import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { AdicionarCronograma } from "../WhiteButton";
import { getAllCronograma, deleteCronograma } from '../../../services/cronogramaService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import ErrorAlert from "../ErrorAlert";

function GetAllCronograma() {
    const router = useRouter();
    const { id } = router.query;

    const [cronogramas, setCronogramas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

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
                const cronogramasData = await getAllCronograma();
                const cronogramasMedico = cronogramasData.filter(cronograma => cronograma.medico.id === parseInt(id));
                setCronogramas(cronogramasMedico);
            } catch (error) {
                console.error('Erro ao buscar agendas:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

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

    const filteredCronogramas = cronogramas.filter(cronograma =>
        cronograma.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteCronograma = async (cronogramaId) => {
        try {
            await deleteCronograma(cronogramaId);
            setCronogramas(cronogramas.filter(cronograma => cronograma.id !== cronogramaId))
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir a agenda: ', error);
            setShowErrorAlert(true);
        }
    }

    return (
        <div className={styles.container}>
            <VoltarButton />

            <h1>Listagem das agendas do&#40;a&#41; veterinário&#40;a&#41;</h1>

            <div className={styles.navbar}>
                <SearchBar
                    placeholder={"Buscar agenda"}
                    onSearchChange={handleSearchChange}
                />
                <AdicionarCronograma page={`createCronograma/${id}`}/>
            </div>

            {filteredCronogramas.length === 0 ? (
                <p className={styles.message}>Não há agendas cadastradas.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredCronogramas.map(cronograma => (
                        <li key={cronograma.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Nome</h6>
                                <p>{cronograma.nome}</p>
                            </div>
                            <div className={styles.info}>
                                <h6>Especialidade</h6>
                                <p>{cronograma.especialidade && cronograma.especialidade.nome}</p>
                            </div>
                            <div className={styles.button_box}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => router.push(`/getCronogramaById/${cronograma.id}`)} 
                                >
                                    Visualizar
                                </button>
                                <ExcluirButton itemId={cronograma.id} onDelete={handleDeleteCronograma} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Agenda excluída com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Erro ao excluir agenda, tente novamente" show={showErrorAlert} />}
            
        </div>
    );
}

export default GetAllCronograma;
