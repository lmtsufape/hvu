import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { deleteAnimal, getAllAnimal } from '../../../../../../services/animalService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";

function GerenciarAnimais() {
    const [animais, setAnimais] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedAnimalId, setDeletedAnimalId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const animaisData = await getAllAnimal();
                setAnimais(animaisData);
            } catch (error) {
                console.error('Erro ao buscar animais:', error);
            }
        };
        fetchData();
    }, [deletedAnimalId]);

    const handleDeleteAnimal = async (animalId) => {
        try {
            await deleteAnimal(animalId);
            setAnimais(animais.filter(animal => animal.id !== animalId));
            setDeletedAnimalId(animalId);
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir animal:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredAnimais = animais.filter(animal => {
        return animal.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleAddAnimalClick = () => {
        setIsModalOpen(true); // Abre o modal
    };

    const confirmRedirect = () => {
        setIsModalOpen(false);
        router.push('/lapa/createTutor'); // Atualize o caminho conforme necessário
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Animais</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por nome`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_tutor_button} onClick={handleAddAnimalClick}>
                    Adicionar Animal
                </button>
            </div>

            {filteredAnimais.length === 0 ? (
                <p className={styles.paragrafo}>Animal não encontrado.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredAnimais.map(animal => (
                        <li key={animal.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Nome</h6>
                                <p>{animal.nome}</p>
                                <h6>Nome do Tutor</h6>
                                <p>{animal.tutor ? animal.tutor.nome : 'Tutor não disponível'}</p>
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/getAnimalById/${animal.id}`)}
                                >
                                    Visualizar
                                </button>
                                <ExcluirButton itemId={animal.id} onDelete={handleDeleteAnimal} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Animal excluído com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Este animal não pode ser excluído." show={showErrorAlert} />}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Você será redirecionado para a área de criação de Tutor.</h2>
                        <p></p>
                        <p>Crie um tutor e depois o animal (que será associado a ele) e depois volte para área de "Cadastros gerais" para continuar.</p>
                        <p></p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.modalButton} onClick={confirmRedirect}>Confirmar</button>
                            <button className={styles.modalButton} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GerenciarAnimais;
