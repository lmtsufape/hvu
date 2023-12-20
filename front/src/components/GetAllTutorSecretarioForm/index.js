import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import CampoPesquisa from '../SearchBar';
import FiltrarWhiteButton from '../WhiteButton/filtrar_button';
import { getAllTutor } from '../../../services/tutorService';

function GetAllTutorSecretarioForm() {
    const [tutores, setTutores] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tutoresData = await getAllTutor();
                setTutores(tutoresData);
            } catch (error) {
                console.error('Erro ao buscar pacientes:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <h1>Pacientes</h1>

            <div className={styles.navbar}>
                <CampoPesquisa className={styles.pesquisa} />
                <FiltrarWhiteButton items={tutores} />
            </div>

            {tutores.length === 0 ? (
                <p>Não há pacientes cadastrados.</p>
            ) : (
                <ul className={styles.lista}>
                    <div className={styles.line}>
                        <div>Tutor</div>
                        <div>Animal</div>
                        <div>Espécie</div>
                        <div>Raça</div>
                        <div>Ação</div>
                    </div>
                    
                    {tutores.map(tutor => (
                        <li key={tutor.id} className={styles.info}>
                            <div>{tutor.nome}</div>
                            <div>{tutor.animal.nome}</div>
                            <div>{tutor.animal.raca.especie.nome}</div>
                            <div>{tutor.animal.raca.nome}</div>

                            <div>
                                <button
                                className={styles.acessar_button}
                                onClick={() => router.push(`/getAnimalByIdSecretario/${tutor.id}`)}
                                >
                                    Acessar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GetAllTutorSecretarioForm;
