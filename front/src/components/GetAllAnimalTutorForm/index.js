import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  
import styles from "./index.module.css";
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import { AdicionarAnimalWhiteButton } from "../WhiteButton";
import { getAllAnimal } from '../../../services/animalService';

function GetAllAnimalTutorForm() {
    const [animal, setAnimal] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const { tutorId } = router.query;
      
        const fetchTutorById = async () => {
            try {
                const response = await getAllAnimal();
                setAnimal(response); 
            } catch (error) {
                console.error('Erro ao buscar o tutor pelo ID:', error);
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
                    <li key={animal.id} className={styles.info_box}>
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
                                onClick={() => handleAcessarClick(animal.id)}
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

export default GetAllAnimalTutorForm;
