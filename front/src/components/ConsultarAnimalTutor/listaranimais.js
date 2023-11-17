import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./consultar_animal_tutor.module.css";
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import { AdicionarAnimalWhiteButton } from "../WhiteButton/white_button";

function ListarAnimais() {
    const [animal, setAnimal] = useState([]);
    const [especie, setEspecie] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:8081/api/v1/especie'),
            axios.get('http://localhost:8081/api/v1/animal'),
        ])
        .then(([especieResponse, animalResponse]) => {
            setEspecie(especieResponse.data);
            setAnimal(animalResponse.data);
        })
        .catch(error => {
            console.error('Erro ao puxar dados da API:', error);
        });
    }, []);

    function getEspecieName(especieId) {
        const especieEncontrada = especie.find(especie => especie.id === especieId);
        return especieEncontrada ? especieEncontrada.nome : '';
    }
    
    return (
        <div className={styles.container}>
            <h1>Animais</h1>

            <div className={styles.navbar}>
                <CampoPesquisa className={styles.pesquisa} />
                <AdicionarAnimalWhiteButton />
            </div>

            <ul className={styles.lista}>
                {animal.map(animalItem => (
                    <li key={animalItem.id} className={styles.info_box}>
                        <div className={styles.info}>
                            <h6>Paciente</h6>
                            <p>{animalItem.nome}</p>
                        </div>
                        <div className={styles.info}>
                            <h6>Espécie</h6>
                            <p>{getEspecieName(animalItem.especieId)}</p>
                        </div>
                        <div className={styles.botao}>
                            <button className={styles.acessar_button} onClick={() => handleAcessarClick(animal.id)}>
                                Acessar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListarAnimais
