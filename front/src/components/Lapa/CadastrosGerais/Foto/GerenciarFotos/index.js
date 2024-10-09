import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { getAllFoto, deleteFoto } from '../../../../../../services/fotoService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";

function GerenciarFotos() {
    const [fotos, setFotos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedFotoId, setDeletedFotoId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fotosData = await getAllFoto();
                setFotos(fotosData);
            } catch (error) {
                console.error('Erro ao buscar fotos:', error);
            }
        };
        fetchData();
    }, [deletedFotoId]);

    const handleDeleteFoto = async (fotoId) => {
        try {
            await deleteFoto(fotoId);
            setFotos(fotos.filter(foto => foto.id !== fotoId));
            setDeletedFotoId(fotoId);
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir foto:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredFotos = fotos.filter(foto => {
        return foto.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Fotos</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por título`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/lapa/createFoto`)}>
                    Adicionar Foto
                </button>
            </div>
 
            {filteredFotos.length === 0 ? (
                <p className={styles.paragrafo}> Foto não encontrada.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredFotos.map(foto => (
                        <li key={foto.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Título</h6>
                                <p>{foto.titulo}</p>
                                <img src={foto.foto_path} alt={foto.titulo} className={styles.foto_imagem} />
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/updateFoto/${foto.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={foto.id} onDelete={handleDeleteFoto} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Foto excluída com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Esta foto não pode ser excluída." show={showErrorAlert} />}
        </div>
    );
}

export default GerenciarFotos;
