import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { deleteTutor, getAllTutor } from '../../../../../../services/tutorService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function GerenciarTutores() {
    const [tutores, setTutores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedTutorId, setDeletedTutorId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                const tutoresData = await getAllTutor();
                setTutores(tutoresData);
            } catch (error) {
                console.error('Erro ao buscar tutores:', error);
            }
        };
        fetchData();
    }, [deletedTutorId]);

    const handleDeleteTutor = async (tutorId) => {
        try {
            await deleteTutor(tutorId);
            setTutores(tutores.filter(tutor => tutor.id !== tutorId));
            setDeletedTutorId(tutorId);
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir tutor:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredTutores = tutores.filter(tutor => {
        return tutor.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleAddTutorClick = () => {
        setIsModalOpen(true); // Abre o modal
    };

    const confirmRedirect = () => {
        setIsModalOpen(false);
        router.push('/lapa/createTutor');
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Tutores</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por nome`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_tutor_button} onClick={handleAddTutorClick}>
                    Adicionar Tutor
                </button>
            </div>

            {filteredTutores.length === 0 ? (
                <p className={styles.paragrafo}> Tutor não encontrado.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredTutores.map(tutor => (
                        <li key={tutor.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Nome</h6>
                                <p>{tutor.nome}</p>
                            </div>

                            <div className={styles.info_box}>
                                <h6>CPF</h6>
                                <p>{tutor.nome != "Anônimo" ? tutor.cpf : "Não informado"}</p>
                            </div>
                            
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/getTutorById/${tutor.id}`)}
                                >
                                    Visualizar
                                </button>
                                <ExcluirButton itemId={tutor.id} onDelete={handleDeleteTutor} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Tutor excluído com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Este tutor não pode ser excluído." show={showErrorAlert} />}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Você será redirecionado para área de criação de tutor.</h2>
                        <p></p>
                        <p>Crie uma conta e cadastre os animais desse tutor e após isso, faça o login na sua conta para continuar com a criação da Ficha de Solicitação de Serviços.</p>
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

export default GerenciarTutores;
