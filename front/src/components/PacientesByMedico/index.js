import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import SearchBar from '../SearchBar';
import { AdicionarAnimalWhiteButton } from "../WhiteButton";
import { getAllAnimal, deleteAnimal } from '../../../services/animalService';
import { getAllVaga } from '../../../services/vagaService';
import VoltarButton from '../VoltarButton';
import ExcluirButton from '../ExcluirButton';

function MeusAnimaisList() {
    const [vagas, setVagas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vagasData = await getAllVaga();
                setVagas(vagasData);
            } catch (error) {
                console.error('Erro ao buscar vagas:', error);
            }
        };
        fetchData();
    }, []);
    console.log("vagas:", vagas);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

  /*  const filteredVagas = vagas.filter(animal =>
        animal.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ); */

    return (
        <div className={styles.container}>
            < VoltarButton />

            <h1>Pacientes</h1>

            <div className={styles.navbar}>
                <SearchBar
                    placeholder={"Buscar paciente"}
                    onSearchChange={handleSearchChange}
                />
            </div>

            {vagas.length === 0 ? (
                <p>Não há animais cadastrados.</p>
            ) : (
                <ul className={styles.lista}>
                    {vagas.map(vaga => (
                        <li key={vaga.id} className={styles.info_box}>
                            <div className={styles.info}>
                                <h6>Paciente</h6>
                                <p></p>
                            </div>
                            <div className={styles.info}>
                                <h6>Espécie</h6>
                                <p></p>
                            </div>
                            <div className={styles.button_box}>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => router.push(`/getAnimalById/${vaga.agendamento.animal.id}`)}
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

export default MeusAnimaisList;