import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { AdicionarAnimalWhiteButton } from "../WhiteButton";
import { getAllTutor } from '../../../services/tutorService';
import VoltarButton from '../VoltarButton';

function MeusAnimaisList() {
    const [tutores, setTutores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Pacientes</h1>
            <div className={styles.navbar}>
                <SearchBar
                    className={styles.pesquisa}
                    placeholder={"Buscar animal"}
                    onSearchChange={handleSearchChange}
                />
            </div>
            {tutores.length === 0 ? (
                <p>Não há tutores cadastrados.</p>
            ) : (
                <ul className={styles.lista}>
                    {tutores.map(tutor => (
                        <li key={tutor.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Tutor</h6>
                                <p>{tutor.nome}</p>
                            </div>
                            {tutor.animal.length === 0 ? (
                                <p>Não há animais cadastrados para este tutor.</p>
                            ) : (
                                tutor.animal.map(animal => (
                                    <div key={animal.id} className={styles.info_container}>
                                        <div className={styles.info}>
                                            <h6>Paciente</h6>
                                            <p>{animal.nome}</p>
                                        </div>
                                        <div className={styles.info}>
                                            <h6>Espécie</h6>
                                            <p>{animal.raca ? animal.raca.especie.nome : 'Não especificado'}</p>
                                        </div>
                                        <div className={styles.info}>
                                            <h6>Raça</h6>
                                            <p>{animal.raca ? animal.raca.nome : 'Não especificado'}</p>
                                        </div>
                                        <div>
                                            <button
                                                className={styles.acessar_button}
                                                onClick={() => router.push(`/getTutorByIdSecretario/${tutor.id}/${animal.id}`)}
                                            >
                                                Acessar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MeusAnimaisList;
