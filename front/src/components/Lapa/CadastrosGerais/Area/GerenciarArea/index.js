import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { getAllArea, deleteArea } from '../../../../../../services/areaService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function GerenciarAreaList() {
    const [area, setAreas] = useState([]);
    const [filtro, setFiltro] = useState('especie');
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedAreaId, setDeletedAreaId] = useState(null); 
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
                const areasData = await getAllArea();
                console.log(areasData); 
                setAreas(areasData);
            } catch (error) {
                console.error('Erro ao buscar áreas:', error);
            }
        };
        fetchData();
    }, [deletedAreaId]); 

    const handleDeleteArea = async (areaId) => {
        try {
            await deleteArea(areaId);
            setAreas(area.filter(area => area.id !== areaId));
            setDeletedAreaId(areaId); 
            setShowAlert(true); 
        } catch (error) {
            console.error('Erro ao excluir a área:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const handleFilterChange = (event) => {
        setFiltro(event.target.value);
    };

    const filteredAreas = area.filter(area => {
        return area.tituloArea.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Áreas</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por ${filtro === 'especie' ? 'Espécie' : 'Raça'}`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/lapa/createArea`)}>
                    Adicionar Área
                </button>
            </div>

            {filteredAreas.length === 0 ? (
                <p className={styles.paragrafo}>Item pesquisado não existe no sistema.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredAreas.map(area => (
                        <li key={area.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Espécie</h6>
                                {/* Verifique se a propriedade 'especie' existe e se não é um array vazio */}
                                <p>{area.especie.length > 0 ? area.especie[0].nome : 'N/A'}</p>
                            </div>
                            <div className={styles.info_box}>
                                <h6>Área</h6>
                                <p>{area.tituloArea}</p>
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/updateArea/${area.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={area.id} onDelete={handleDeleteArea} /> 
                            </div>
                        </li>
                    ))}

                </ul>
            )}
            {showAlert && <ErrorAlert message="Área excluída com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Esta área não pode ser excluída por estar associada a um laudo." show={showErrorAlert} />}

        </div>
    );
}

export default GerenciarAreaList;
