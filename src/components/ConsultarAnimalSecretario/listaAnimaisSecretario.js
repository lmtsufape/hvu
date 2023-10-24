import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from "./listaAnimaisSecretario.module.css";
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import FiltrarWhiteButton from "../WhiteButton/filtrar_button";

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
                tutor: 'Maria',
                raca: 'canino',
            },
            {
                id: 2,
                nome: 'Animal de Teste 2',
                especie: 'Gato',
                tutor: 'João',
                raca: 'felino',
            },
        ];
        setAnimal(dataDeTeste);
    }, []);

    const router = useRouter();

    const handleAcessarClick = (animalId) => {
        router.push(`/perfilanimaletutor/${animalId}`);
    };
    
    return (
        <div className={styles.container}>
            <h1>Pacientes</h1>

            <div className={styles.navbar}>
                <CampoPesquisa className={styles.pesquisa} />
                < FiltrarWhiteButton items={animal}/>
            </div>

            <ul className={styles.lista}>
                <div className={styles.line}>
                    <div>Tutor</div>
                    <div>Animal</div>
                    <div>Espécie</div>
                    <div>Raça</div>
                    <div>Ação</div>
                </div>
                {animal.map(animal => (
                    <li key={animal.id} className={styles.info_box}>
                        <div className={styles.info}>
                            <div>{animal.tutor}</div>
                            <div>{animal.nome}</div>
                            <div>{animal.especie}</div>
                            <div>{animal.raca}</div>
                            <div>
                            <button className={styles.acessar_button} onClick={() => handleAcessarClick(animal.id)}>
                                Acessar
                            </button>
                            </div>

                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListarAnimais
