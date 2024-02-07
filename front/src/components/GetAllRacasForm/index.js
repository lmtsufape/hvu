import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllRaca } from '../../../services/racaService';
import VoltarButton from '../VoltarButton';

function GetAllRacasForm() {
    const [racas, setRacas] = useState([]);
    
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const racasData = await getAllRaca();
                setRacas(racasData);
            } catch (error) {
                console.error('Erro ao buscar racas:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            < VoltarButton />
            <h1>Gerenciar raças</h1>

            <div className={styles.navbar_container}>
                <SearchBar className={styles.search} />
                <button className={styles.adicionar_raca_button} onClick={() => router.push(`/createRaca`)}>
                    Adicionar nova raça
                </button>
            </div>

            {racas.length === 0 ? (
                <p>Não há raças cadastradas.</p>
            ) : (
                <ul className={styles.list}>
                    {racas.map(raca => (
                        <li key={raca.id} className={styles.info_container}>
                            <div className={styles.info_box}>
                                <h6>Espécie</h6>
                                <p>{raca.especie && raca.especie.nome}</p>
                            </div>
                            <div className={styles.info_box}>
                                <h6>Raça</h6>
                                <p>{raca.nome}</p>
                            </div>
                            <div  className={styles.button_container}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => router.push(`/getRacaById/${raca.id}`)}
                                >
                                    Acessar
                                </button>
                                <button className={styles.excluir_button}>Excluir</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GetAllRacasForm;
