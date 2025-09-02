import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { getAllEstagiario, deleteEstagiario } from '../../../../../../services/estagiarioService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function GerenciarEstagiarios() {
    const [estagiarios, setEstagiarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedEstagiarioId, setDeletedEstagiarioId] = useState(null);
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
                const estagiariosData = await getAllEstagiario();
                setEstagiarios(estagiariosData);
            } catch (error) {
                console.error('Erro ao buscar estagiários:', error);
            }
        };
        fetchData();
    }, [deletedEstagiarioId]);

    const handleDeleteEstagiario = async (estagiarioId) => {
        try {
            await deleteEstagiario(estagiarioId);
            setEstagiarios(estagiarios.filter(estagiario => estagiario.id !== estagiarioId));
            setDeletedEstagiarioId(estagiarioId);
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir estagiário:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredEstagiarios = estagiarios.filter(estagiario => {
        return estagiario.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Estagiários</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por nome`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/lapa/createEstagiario`)}>
                    Adicionar Estagiário
                </button>
            </div>
 
            {filteredEstagiarios.length === 0 ? (
                <p className={styles.paragrafo}> Estagiário não encontrado.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredEstagiarios.map(estagiario => (
                        <li key={estagiario.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Nome</h6>
                                <p>{estagiario.nome}</p>
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/updateEstagiario/${estagiario.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={estagiario.id} onDelete={handleDeleteEstagiario} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Estagiário excluído com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Este estagiário não pode ser excluído." show={showErrorAlert} />}
        </div>
    );
}

export default GerenciarEstagiarios;
