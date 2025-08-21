import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../../../SearchBar';
import { AdicionarPatologistaWhiteButton } from "../../../WhiteButton";
import { getAllPatologista, deletePatologista } from '../../../../../services/patologistaService';
import VoltarButton from '../../../VoltarButton';
import ExcluirButton from '../../../ExcluirButton';
import ErrorAlert from "../../../ErrorAlert";

function GetAllPatologista() {
    const [patologistas, setPatologistas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [deletedPatologistaId, setDeletedPatologistaId] = useState(null); 
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true); 

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patologistasData = await getAllPatologista();
                setPatologistas(patologistasData);
            } catch (error) {
                console.error('Erro ao buscar patologistas:', error);
            } finally {
                setLoading(false); 
            }
        };
        fetchData();
    }, [deletedPatologistaId]); 

    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("admin_lapa")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    if (!token) {
        return (
          <div className={styles.container}>
            <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
          </div>
        );
      }

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const filteredPatologistas = patologistas.filter(patologista =>
        patologista.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeletePatologista = async (patologistaId) => {
        try {
            await deletePatologista(patologistaId);
            setPatologistas(patologistas.filter(patologista => patologista.id !== patologistaId));
            setDeletedPatologistaId(patologistaId);
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir patologista: ', error);
            setShowErrorAlert(true);
        }
    }

    return (
        <div className={styles.container}>
            < VoltarButton />

            <h1>Listagem de Patologistas</h1>

            <div className={styles.navbar}>
                <SearchBar
                    className={styles.pesquisa}
                    placeholder={"Buscar patologista"}
                    onSearchChange={handleSearchChange}
                />
                <AdicionarPatologistaWhiteButton/>
            </div>

            {filteredPatologistas.length === 0 ? (
                <p className={styles.message}>Não há patologistas cadastrados.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredPatologistas.map(patologista => (
                        <li key={patologista.id} className={styles.info_box}>
                            <div className={styles.box}>
                                <div className={styles.info}>
                                    <h6>Nome</h6>
                                    <p>{patologista.nome}</p>
                                </div>
                                <div className={styles.info}>
                                    <h6>Especialidade</h6>
                                    <p>
                                        {patologista.especialidade.map((especialidade, index) => (
                                            <span key={especialidade.id}>
                                                {especialidade.nome}
                                                {index !== patologista.especialidade.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.button_box}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => router.push(`getPatologistaById/${patologista.id}`)} 
                                >
                                    Visualizar
                                </button>
                                < ExcluirButton itemId={patologista.id} onDelete={handleDeletePatologista} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <ErrorAlert message="Patologista excluído(a) com sucesso!" show={showAlert} />}
            {showErrorAlert && <ErrorAlert message="Erro ao excluir patologista, tente novamente" show={showErrorAlert} />}
        </div>
    );
}

export default GetAllPatologista;
