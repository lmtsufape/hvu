import React, { useState, useEffect } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import SearchBar from '../../../SearchBar';
import VoltarButton from "../../VoltarButton";
import {getAllFichaSolicitacao} from "../../../../../services/fichaSolicitacaoService";

function LaudosEmAndamento(){
    const [fichas, setFichas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fichasData = await getAllFichaSolicitacao();
                setFichas(fichasData);
            } catch (error) {
                console.error('Erro ao buscar fichas de solicitação de serviço:', error);
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const filteredFichas = fichas.filter(fichas =>
        fichas.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Laudos em Andamento</h1>

            <div className={styles.navbar}>
                <SearchBar
                    placeholder={"Buscar ficha de solicitação de serviço"}
                    onSearchChange={handleSearchChange}
                />
            </div>

            {filteredFichas.length === 0 ? (
                <p>Não há Fichas de solicitação de serviços.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredFichas.map(fichas => (
                        <li key={fichas.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Paciente</h6>
                                <p>{fichas.nome}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}


        </div>

        

    )

} 

export default LaudosEmAndamento;