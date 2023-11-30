import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Don't forget to import useRouter
import styles from "./consultar_animal_tutor.module.css";
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import { AdicionarAnimalWhiteButton } from "../WhiteButton/white_button";
import { getTutorById } from '../../../services/tutorService';

function ListarAnimais() {
    const [animal, setAnimal] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const { tutorId } = router.query;
      
        const fetchTutorById = async () => {
            try {
                const response = await getTutorById(tutorId);
                setAnimal(response); 
            } catch (error) {
                console.error('Erro ao buscar o tutor pelo ID:', error);
                // Handle error as needed
            }
        };

        if (tutorId) {
            fetchTutorById();
        }
    }, [router.query]);
      

    const handleAcessarClick = (animalId) => {
        router.push(`/perfildoanimal/${animalId}`);
    };
    
    return (
        <div className={styles.container}>
            <h1>Animais</h1>

            <div className={styles.navbar}>
                <CampoPesquisa className={styles.pesquisa} />
                <AdicionarAnimalWhiteButton />
            </div>

            <ul className={styles.lista}>
                {animal.map((tutor) => (
                    <li key={tutor.id} className={styles.info_box}>
                        <div className={styles.info}>
                            <h6>Paciente</h6>
                            <p>{tutor.animal.nome}</p>
                        </div>
                        <div className={styles.info}>
                            <h6>Espécie</h6>
                            <p>{tutor.animal.especie.nome}</p>
                        </div>
                        <div className={styles.botao}>
                            <button
                                className={styles.acessar_button}
                                onClick={() => handleAcessarClick(tutor.animal.id)}
                            >
                                Acessar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListarAnimais;
