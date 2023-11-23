import React, { useState, useEffect } from 'react';
import styles from "./consultar_animal_tutor.module.css";
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import { AdicionarAnimalWhiteButton } from "../WhiteButton/white_button";
import { getAllAnimal } from '../../../services/animalService';
import { getAllEspecie } from '../../../services/especieService';

function ListarAnimais() {
    const [animal, setAnimal] = useState([]);
    const [especie, setEspecie] = useState([]);

    async function fetchAllAnimais() {
        try {
            const response = await getAllAnimal();
        } catch (error) {
            console.error('Erro ao buscar todos os animais:', error);
            throw error;
        }
    }
    
    async function fetchAllEspecies() {
        try {
            const response = await getAllEspecie();
        } catch (error) {
            console.error('Erro ao buscar todas as espécies:', error);
            throw error;
        }
    }
    
    useEffect(() => {
        async function fetchData() {
            try {
                const [especie, animal] = await Promise.all([
                    fetchAllEspecies(),
                    fetchAllAnimais()
                ]);
    
                setEspecie(especie);
                setAnimal(animal);
            } catch (error) {
                console.error('Erro ao puxar dados da API:', error);
            }
        }
        fetchData();
    }, []);

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
                {animal.map((animalItem, index) => (
                    <li key={animalItem.id} className={styles.info_box}>
                        <div className={styles.info}>
                            <h6>Paciente</h6>
                            <p>{animalItem.nome}</p>
                        </div>
                        <div className={styles.info}>
                            <h6>Espécie</h6>
                            <p>{especie[index].nome}</p>
                        </div>
                        <div className={styles.botao}>
                            <button className={styles.acessar_button} onClick={() => handleAcessarClick(animalItem.id)}>
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
