import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { AdicionarMedicoWhiteButton } from "../WhiteButton";
import { getAllMedico, deleteMedico } from '../../../services/medicoService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';
import ErrorAlert from "../ErrorAlert";

function GetAllMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [deletedMedicoId, setDeletedMedicoId] = useState(null); // Estado para controlar o ID do médico excluído recentemente

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const medicosData = await getAllMedico();
                setMedicos(medicosData);
            } catch (error) {
                console.error('Erro ao buscar médicos:', error);
            }
        };
        fetchData();
    }, [deletedMedicoId]); // Adicione deletedMedicoId como uma dependência

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const filteredMedicos = medicos.filter(medico =>
        medico.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteMedico = async (medicoId) => {
        try {
            await deleteMedico(medicoId);
            setMedicos(medicos.filter(medico => medico.id !== medicoId));
            setDeletedMedicoId(medicoId); // Atualiza o estado para acionar a recuperação da lista
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir o médico: ', error);
            setShowErrorAlert(true);
        }
    }

    return (
        <div className={styles.container}>
            < VoltarButton />

            <h1>Listagem de Veterinários&#40;as&#41;</h1>

            <div className={styles.navbar}>
                <SearchBar
                    className={styles.pesquisa}
                    placeholder={"Buscar veterinário(a)"}
                    onSearchChange={handleSearchChange}
                />
                <AdicionarMedicoWhiteButton/>
            </div>

            {filteredMedicos.length === 0 ? (
                <p className={styles.paragrafo}>Não há veterinários&#40;as&#41; cadastrados.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredMedicos.map(medico => (
                        <li key={medico.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Nome</h6>
                                <p>{medico.nome}</p>
                            </div>
                            <div className={styles.info}>
                                <h6>Especialidade</h6>
                                <p>
                                    {medico.especialidade.map((especialidade, index) => (
                                        <span key={especialidade.id}>
                                            {especialidade.nome}
                                            {index !== medico.especialidade.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                            </div>
                            <div className={styles.button_box}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => router.push(`/getMedicoById/${medico.id}`)} 
                                >
                                    Visualizar
                                </button>
                                < ExcluirButton itemId={medico.id} onDelete={handleDeleteMedico} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Veterinário(a) excluído(a) com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Erro ao excluir veterinário(a), tente novamente" show={showErrorAlert} />}
        </div>
    );
}

export default GetAllMedicos;
