import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './listaAnimaisSecretario.module.css';
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import FiltrarWhiteButton from '../WhiteButton/filtrar_button';

function ListarAnimais() {
    const [animal, setAnimal] = useState([]);
    const [especie, setEspecie] = useState([]);
    const [tutor, setTutor] = useState([]);
    const [raca, setRaca] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:8081/api/v1/especie'),
            axios.get('http://localhost:8081/api/v1/tutor'),
            axios.get('http://localhost:8081/api/v1/animal'),
            axios.get('http://localhost:8081/api/v1/raca')
        ])
        .then(([especieResponse, tutorResponse, animalResponse, racaResponse]) => {
            setEspecie(especieResponse.data);
            setTutor(tutorResponse.data);
            setAnimal(animalResponse.data);
            setRaca(racaResponse.data);
        })
        .catch(error => {
            console.error('Erro ao puxar dados da API:', error);
        });
    }, []);

    const router = useRouter();

    const handleAcessarClick = (animalId) => {
        router.push(`/perfilanimaletutor/${animalId}`);
    };

    function getTutorName(tutorId) {
        const tutorEncontrado = tutor.find(tutor => tutor.id === tutorId);
        return tutorEncontrado ? tutorEncontrado.nome : '';
    }

    function getEspecieName(especieId) {
        const especieEncontrada = especie.find(especie => especie.id === especieId);
        return especieEncontrada ? especieEncontrada.nome : '';
    }

    function getRacaName(racaId) {
        const racaEncontrada = raca.find(raca => raca.id === racaId);
        return racaEncontrada ? racaEncontrada.nome : '';
    }

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
                {animal.map(animalItem => (
                    <li key={animalItem.id} className={styles.info_box}>
                        <div className={styles.info}>
                            <div>{getTutorName(animalItem.tutorId)}</div>
                            <div>{animalItem.nome}</div>
                            <div>{getEspecieName(animalItem.especieId)}</div>
                            <div>{getRacaName(animalItem.racaId)}</div>
                            <div>
                                <button
                                    className={styles.acessar_button}
                                    onClick={() => handleAcessarClick(animalItem.id)}
                                >
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

export default ListarAnimais;
