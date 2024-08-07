import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { getAllOrgao, deleteOrgao } from '../../../../../../services/orgaoService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";

function GerenciarOrgaos() {
    const [orgaos, setOrgaos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedOrgaoId, setDeletedOrgaoId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orgaosData = await getAllOrgao();
                setOrgaos(orgaosData);
            } catch (error) {
                console.error('Erro ao buscar órgãos:', error);
            }
        };
        fetchData();
    }, [deletedOrgaoId]);

    const handleDeleteOrgao = async (orgaoId) => {
        try {
            await deleteOrgao(orgaoId);
            setOrgaos(orgaos.filter(orgao => orgao.id !== orgaoId));
            setDeletedOrgaoId(orgaoId);
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir órgão:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredOrgaos = orgaos.filter(orgao => {
        return orgao.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Órgãos</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por nome`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/lapa/createOrgao`)}>
                    Adicionar Órgão
                </button>
            </div>
 
            {filteredOrgaos.length === 0 ? (
                <p className={styles.paragrafo}> Órgão não encontrado.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredOrgaos.map(orgao => (
                        <li key={orgao.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Nome</h6>
                                <p>{orgao.nome}</p>
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/updateOrgao/${orgao.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={orgao.id} onDelete={handleDeleteOrgao} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Órgão excluído com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Este órgão não pode ser excluído." show={showErrorAlert} />}
        </div>
    );
}

export default GerenciarOrgaos;
