import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from "./consultar_animal_tutor.module.css";
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import { AdicionarAnimalWhiteButton } from "../WhiteButton/white_button";
import { AcessarGreenButton } from "../GreenButton/green_button";

function ListarAnimais() {
    const [animal, setAnimal] = useState([]);

//Para quando for fazer a chamada da api
    // useEffect(() => {
    //     // Substitua 'sua_api_url' pela URL da sua API que lista os animais do tutor.
    //     fetch('http://localhost:3000/animal')
    //       .then(response => response.json())
    //       .then(data => {
    //         setAnimal(data);
    //       })
    //       .catch(error => {
    //         console.error('Erro ao listar os animais:', error);
    //       });
    //   }, []);

    //json de teste
    useEffect(() => {
        const dataDeTeste = [
            {
                id: 1,
                nome: 'Animal de Teste 1',
                especie: 'Cachorro',
            },
            {
                id: 2,
                nome: 'Animal de Teste 2',
                especie: 'Gato',
            },
        ];
        setAnimal(dataDeTeste);
    }, []);

    const router = useRouter();

    const handleAcessarClick = (animalId) => {
        router.push(`/perfildoanimal/${animalId}`);
    };
    
    return (
        <container className={styles.container}>
            <h1>Animais</h1>

            <div className={styles.navbar}>
                <CampoPesquisa className={styles.pesquisa} />
                <AdicionarAnimalWhiteButton />
            </div>

            <ul className={styles.lista}>
                {animal.map(animal => (
                    <li key={animal.id} className={styles.info_box}>
                        <div className={styles.info}>
                            <h6>Paciente</h6>
                            <p>{animal.nome}</p>
                        </div>
                        <div className={styles.info}>
                            <h6>Espécie</h6>
                            <p>{animal.especie}</p>
                        </div>
                        <div className={styles.botao}>
                            <button className={styles.acessar_button} onClick={() => handleAcessarClick(animal.id)}>
                                Acessar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </container>
    );
}

export default ListarAnimais
