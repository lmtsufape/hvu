import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";
import { getAllCampoLaudoMicroscopia, deleteCampoLaudoMicroscopia } from '../../../../../../services/campoLaudoMicroscopiaService';

function GerenciarMicroscopia() {
    const [microscopias, setMicroscopias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedMicroscopiaId, setDeletedMicroscopiaId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const microscopiasData = await getAllCampoLaudoMicroscopia();
                setMicroscopias(microscopiasData);
            } catch (error) {
                console.error('Erro ao buscar Microscopia:', error);
            }
        };
        fetchData();
    }, [deletedMicroscopiaId]); // Atualiza a lista ao excluir um campo

    const handleDeleteMicroscopia = async (microscopiaId) => {
        try {
            await deleteCampoLaudoMicroscopia(microscopiaId);
            setMicroscopias(microscopias.filter(microscopia => microscopia.id !== microscopiaId));
            setDeletedMicroscopiaId(microscopiaId);
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir Microscopia:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredMicroscopias = microscopias.filter(microscopia => {
        return microscopia.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Microscopias</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por microscopia`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/lapa/createMicroscopia`)}>
                    Adicionar Microscopia
                </button>
            </div>

            {filteredMicroscopias.length === 0 ? (
                <p className={styles.paragrafo}> Microscopia não existe.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredMicroscopias.map(microscopia => (
                        <li key={microscopia.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Descrição</h6>
                                <p>{microscopia.descricao}</p>
                                <h6>Processamento</h6>
                                <p>{microscopia.processamento}</p>
                                <h6>Órgão</h6>
                                <p>{microscopia.orgao.id}</p>
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/updateMicroscopia/${microscopia.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={microscopia.id} onDelete={handleDeleteMicroscopia} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Microscopia excluída com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Esta Microscopia não pode ser excluída por estar associada a um Laudo." show={showErrorAlert} />}
        </div>
    );
}

export default GerenciarMicroscopia;
