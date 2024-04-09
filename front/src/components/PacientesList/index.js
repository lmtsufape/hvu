import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
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

    // Função para filtrar os tutores com base no nome do animal
    const filteredTutores = tutores.filter(tutor => {
        // Verifica se algum animal do tutor corresponde ao termo de pesquisa
        return tutor.animal.some(animal => animal.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Pacientes</h1>
            <div className={styles.navbar}>
                <SearchBar
                    className={styles.pesquisa}
                    placeholder={"Buscar paciente"}
                    onSearchChange={handleSearchChange}
                />
            </div>
            {filteredTutores.length === 0 ? (
                <p className={styles.paragrafo}>Nenhum tutor encontrado com o animal buscado.</p>
            ) : (
                <ul className={styles.lista}>
                    {filteredTutores.map(tutor => (
                        <li key={tutor.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Tutor</h6>
                                <p>{tutor.nome}</p>
                            </div>
                            {tutor.animal.length === 0 ? (
                                <p className={styles.paragrafo}>Não há animais cadastrados para este tutor.</p>
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
