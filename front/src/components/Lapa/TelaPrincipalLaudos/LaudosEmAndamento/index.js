import React, { useState, useEffect } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import SearchBar from '../../../SearchBar';
import VoltarButton from '../../VoltarButton';
import ExcluirButton from '@/components/ExcluirButton';
import ErrorAlert from '@/components/ErrorAlert';
import { getAllFichaSolicitacao, deleteFichaSolicitacao } from "../../../../../services/fichaSolicitacaoService";
import { EditarWhiteButton } from '@/components/WhiteButton';
import { getToken, getRoles } from "../../../../../services/userService";

function LaudosEmAndamento() {
    const [fichas, setFichas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [deletedFichaId, setDeletedFichaId] = useState(null);
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
                const fichasData = await getAllFichaSolicitacao();
                console.log('Dados das fichas:', fichasData); // Log dos dados recebidos
                setFichas(fichasData);
            } catch (error) {
                console.error('Erro ao buscar fichas de solicitação de serviço:', error);
            }
        };
        fetchData();
    }, [deletedFichaId]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const filteredFichas = fichas.filter(ficha =>
        ficha.codigoPatologia  && ficha.codigoPatologia .toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log('Fichas filtradas:', filteredFichas); // Log das fichas filtradas

    const handleDeleteFicha = async (fichaId) => {
        try {
            await deleteFichaSolicitacao(fichaId);
            setFichas(fichas.filter(ficha => ficha.id !== fichaId));
            setDeletedFichaId(fichaId); // Atualiza o estado para acionar a recuperação da lista
            setShowAlert(true);
        } catch (error) {
            console.error('Erro ao excluir a ficha: ', error);
            setShowErrorAlert(true);
        }
    }

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Listagem das Fichas de Solicitação de Serviço em Andamento</h1>

            <div className={styles.navbar}>
                <SearchBar
                    className={styles.pesquisa}
                    placeholder={"Buscar ficha de solicitação de serviço"}
                    onSearchChange={handleSearchChange}
                />
            </div>

            {filteredFichas.length === 0 ? (
                <p className={styles.paragrafo}>Não há Fichas cadastradas.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredFichas.map(ficha => (
                        <li key={ficha.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Ficha de Solicitação</h6>
                                <p>{ficha.codigoPatologia}</p>
                            </div>
                            <div className={styles.info}>
                                <h6>Responsável</h6>
                                <p>{ficha.tutor.nome}</p>
                            </div>
                            <div className={styles.info}>
                                <h6>Animal</h6>
                                <p>{ficha.animal.nome}</p>
                            </div>
                            <div className={styles.button_box}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => router.push(`/lapa/getFichaById/${ficha.id}`)} 
                                >
                                    Visualizar
                                </button>
                                <ExcluirButton itemId={ficha.id} onDelete={handleDeleteFicha} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showAlert && <div>Ficha excluída com sucesso!</div>}
            {showErrorAlert && <ErrorAlert message="Erro ao excluir a ficha" />}
        </div>
    );
}

export default LaudosEmAndamento;
