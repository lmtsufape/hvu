import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllCronograma, deleteCronograma } from '../../../services/cronogramaService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import ErrorAlert from "../ErrorAlert";

function GerenciarCronogramas() {
    const [cronogramas, setCronogramas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedCronogramaId, setDeletedCronogramaId] = useState(null); // Estado para controlar o ID da raça excluída recentemente
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cronogramasData = await getAllCronograma();
                setCronogramas(cronogramasData);
            } catch (error) {
                console.error('Erro ao buscar cronogramas:', error);
            }
        };
        fetchData();
    }, [deletedCronogramaId]); // Adicione deletedCronogramaId como uma dependência

    const handleDeleteCronograma = async (cronogramaId) => {
        try {
            await deleteCronograma(cronogramaId);
            setCronogramas(cronogramas.filter(cronograma => cronograma.id !== cronogramaId));
            setDeletedCronogramaId(cronogramaId); // Atualiza o estado para acionar a recuperação da lista
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir a raça:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    // Função para filtrar as raças com base na opção selecionada
    const filteredCronogramas = cronogramas.filter(cronograma => {
        return cronograma.medico && cronograma.medico.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de agendas</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por veterinário(a)`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/createCronograma/${null}`)}>
                    Adicionar agenda
                </button>
            </div>

            {filteredCronogramas.length === 0 ? (
                <p className={styles.paragrafo}> Veterinário&#40;a&#41; pesquisado&#40;a&#41; não possui agenda.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredCronogramas.map(cronograma => (
                        <li key={cronograma.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Veterinário&#40;a&#41;</h6>
                                <p>{cronograma.medico && cronograma.medico.nome}</p>
                            </div>
                            <div className={styles.info_box}>
                                <h6>Especialidade</h6>
                                <p>{cronograma.especialidade && cronograma.especialidade.nome}</p>
                            </div>
                            <div  className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
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
            {showErrorAlert && <ErrorAlert message="Esta agenda não pode ser excluída por estar associada a um agendamento." show={showErrorAlert} />}

        </div>
    );
}

export default GerenciarCronogramas;
