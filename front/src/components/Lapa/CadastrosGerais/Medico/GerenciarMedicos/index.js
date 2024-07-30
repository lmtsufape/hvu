import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../../../../SearchBar';
import { deleteMedico, getAllMedico } from '../../../../../../services/medicoService'; // Verifique se o serviço está correto
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../../ExcluirButton';
import ErrorAlert from "../../../../ErrorAlert";

function GerenciarMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedMedicoId, setDeletedMedicoId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const medicosData = await getAllMedico(); // Verifique se a função é correta
                setMedicos(medicosData);
            } catch (error) {
                console.error('Erro ao buscar médicos:', error);
            }
        };
        fetchData();
    }, [deletedMedicoId]);

    const handleDeleteMedico = async (medicoId) => {
        try {
            await deleteMedico(medicoId); // Verifique se a função é correta
            setMedicos(medicos.filter(medico => medico.id !== medicoId));
            setDeletedMedicoId(medicoId);
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir médico:', error);
            if (error.response && error.response.status === 409) {
                setShowErrorAlert(true);
            }
        }
    };

    const filteredMedicos = medicos.filter(medico => {
        return medico.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleAddMedicoClick = () => {
        setIsModalOpen(true); // Abre o modal
    };

    const confirmRedirect = () => {
        setIsModalOpen(false);
        router.push('/lapa/createMedicoLapa'); // Verifique a rota correta
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem de Veterinários</h1>

            <div className={styles.navbar_container}>
                <SearchBar placeholder={`Buscar por nome`} onSearchChange={setSearchTerm} />
                <button className={styles.adicionar_tutor_button} onClick={handleAddMedicoClick}>
                    Adicionar Veterinário
                </button>
            </div>

            {filteredMedicos.length === 0 ? (
                <p className={styles.paragrafo}> Médico não encontrado.</p>
            ) : (
                <ul className={styles.list}>
                    {filteredMedicos.map(medico => (
                        <li key={medico.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Nome</h6>
                                <p>{medico.nome}</p>
                                <h6>CRMV</h6>
                                <p>{medico.crmv}</p>
                            </div>
                            <div className={styles.button_container}>
                                <button
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/lapa/getMedicoById/${medico.id}`)}
                                >
                                    Visualizar
                                </button>
                                <ExcluirButton itemId={medico.id} onDelete={handleDeleteMedico} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Médico excluído com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Este médico não pode ser excluído." show={showErrorAlert} />}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Você será redirecionado para a área de criação de médico.</h2>
                        <p></p>
                        <p>Crie uma conta e cadastre os detalhes desse médico e após isso, faça o login na sua conta para continuar com a criação de outros registros.</p>
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

export default GerenciarMedicos;
