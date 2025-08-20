import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { getAllCampoLaudo, deleteCampoLaudo } from '../../../../../../services/campoLaudoService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function GerenciarCampoLaudo() {
    const [campoLaudos, setCampoLaudos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedCampoLaudoId, setDeletedCampoLaudoId] = useState(null);
    const router = useRouter();
    const roles = getRoles();
    const token= getToken();

    if (!token) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Faça login para acessar esta página.
            </h3>
        </div>
        );
    }

    if (!roles.includes("patologista")) {
        return (
        <div className={styles.container}>
            <h3 className={styles.message}>
                Acesso negado: Você não tem permissão para acessar esta página.
            </h3>
        </div>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const campoLaudosData = await getAllCampoLaudo();
                setCampoLaudos(campoLaudosData);
            } catch (error) {
                console.error('Erro ao buscar Macroscopia:', error);
            }
        };
        fetchData();
    }, [deletedCampoLaudoId]); // Atualiza a lista ao excluir um campo

    const handleDeleteCampoLaudo = async (campoLaudoId) => {
        try {
            await deleteCampoLaudo(campoLaudoId);
            setCampoLaudos(campoLaudos.filter(campoLaudo => campoLaudo.id !== campoLaudoId));
            setDeletedCampoLaudoId(campoLaudoId);
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir Macroscopia:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredCampoLaudos = campoLaudos.filter(campoLaudo => {
        return campoLaudo.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Macroscopias</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por campo de laudo`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/lapa/createMacroscopia`)}>
                    Adicionar Macroscopia
                </button>
            </div>

            {filteredCampoLaudos.length === 0 ? (
                <p className={styles.paragrafo}> Macroscopia não existe.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredCampoLaudos.map(campoLaudo => (
                        <li key={campoLaudo.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Descrição</h6>
                                <p>{campoLaudo.descricao}</p>
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/updateMacroscopia/${campoLaudo.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={campoLaudo.id} onDelete={handleDeleteCampoLaudo} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Macroscopia excluída com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Esta Macroscopia não pode ser excluído por estar associado a um Laudo." show={showErrorAlert} />}
        </div>
    );
}

export default GerenciarCampoLaudo;
