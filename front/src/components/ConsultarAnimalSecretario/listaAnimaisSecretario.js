import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './listaAnimaisSecretario.module.css';
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import FiltrarWhiteButton from '../WhiteButton/filtrar_button';
import { getAllAnimal } from '../../../services/animalService';
import { getAllEspecie } from '../../../services/especieService';
import { getAllRaca } from '../../../services/racaService';
import { getAllTutor } from '../../../services/tutorService';

function ListarAnimais() {
    const [animal, setAnimal] = useState([]);
    const [especie, setEspecie] = useState([]);
    const [tutor, setTutor] = useState([]);
    const [raca, setRaca] = useState([]);

    async function fetchAllAnimal() {
        try {
            const response = await getAllAnimal();
        } catch (error) {
            console.error('Erro ao buscar todos os animais:', error);
            throw error;
        }
    }
    
    async function fetchAllEspecie() {
        try {
            const response = await getAllEspecie();
        } catch (error) {
            console.error('Erro ao buscar todas as espécies:', error);
            throw error;
        }
    }

    async function fetchAllRaca() {
        try {
            const response = await getAllRaca();
        } catch (error) {
            console.error('Erro ao buscar todas as espécies:', error);
            throw error;
        }
    }

    async function fetchAllTutor() {
        try {
            const response = await getAllTutor();
        } catch (error) {
            console.error('Erro ao buscar todas as espécies:', error);
            throw error;
        }
    }
    
    useEffect(() => {
        async function fetchData() {
            try {
                const [especie, animal, raca, tutor] = await Promise.all([
                    fetchAllEspecie(),
                    fetchAllAnimal(),
                    fetchAllRaca(),
                    fetchAllTutor()
                ]);

                setEspecie(especie);
                setAnimal(animal);
                setRaca(raca);
                setTutor(tutor);
            } catch (error) {
                console.error('Erro ao puxar dados da API:', error);
            }
        }
        fetchData();
    }, []);

    const router = useRouter();

    // const handleAcessarClick = (animalId) => {
    //     router.push(`/perfilanimaletutor/${animalId}`);
    // };

    return (
        <div className={styles.container}>
            <h1>Pacientes</h1>

            <div className={styles.navbar}>
                <CampoPesquisa className={styles.pesquisa} />
                <FiltrarWhiteButton items={animal} />
            </div>

            <ul className={styles.lista}>
                <div className={styles.line}>
                    <div>Tutor</div>
                    <div>Animal</div>
                    <div>Espécie</div>
                    <div>Raça</div>
                    <div>Ação</div>
                </div>
                
                {animal.map((animalItem, index) => (
                    <div key={index} className={styles.info}>
                        <div>{tutor[index].nome}</div>
                        <div>{animalItem.nome}</div>
                        <div>{especie[index].nome}</div>
                        <div>{raca[index].nome}</div>

                        <div>
                            <button
                                className={styles.acessar_button}
                                onClick={() => handleAcessarClick(animalItem.id)}
                            >
                                Acessar
                            </button>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default ListarAnimais;
