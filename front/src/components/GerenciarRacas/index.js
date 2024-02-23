// GerenciarRacasList.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { getAllRaca, deleteRaca } from '../../../services/racaService'; // Importe deleteRaca aqui
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';

function GerenciarRacasList() {
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

    const handleDeleteRaca = async (racaId) => {
        try {
            await deleteRaca(racaId);
            setRacas(racas.filter(raca => raca.id !== racaId));
            window.location.reload();
        } catch (error) {
            console.error('Erro ao excluir a raça:', error);
        }
    };

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
                                    className={styles.editar_button}
                                    onClick={() => router.push(`/getRacaById/${raca.id}`)}
                                >
                                    Editar
                                </button>
                                <ExcluirButton itemId={raca.id} onDelete={handleDeleteRaca} /> 
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GerenciarRacasList;
