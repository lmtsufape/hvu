import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { getAnimalById } from '../../../services/animalService';

function GetAnimalByIdTutorForm() {
    const router = useRouter();
    const { id } = router.query;
    const [animal, setAnimal] = useState({});

    useEffect(() => {
        // Verifica se o ID é válido
        if (id) {
            const fetchData = async () => {
                try {
                    const animalData = await getAnimalById(id);
                    setAnimal(animalData);
                } catch (error) {
                    console.error('Erro ao buscar animal:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    //const handleEditarClick = (animalId) => {
   //     router.push(`/editarperfilanimal/${animalId}`);
    //};

    return (
        <div className={styles.container}>
            <h1>Perfil do Animal</h1>
            <ul>
                {animal && ( // Certifique-se de que o animal existe antes de renderizar
                    <li key={animal.id} className={styles.infos_box}>
                        <div className={styles.identificacao}>
                            <div className={styles.nome_animal}>{animal.nome}</div>
                            <div className={styles.especie_animal}>{animal.especie.nome}</div>
                        </div>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Nome</h6>
                                        <p>{animal.nome}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Sexo</h6>
                                        <p>{animal.sexo}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Peso</h6>
                                        <p>{animal.peso}</p>
                                    </div>
                                </div>

                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Raça</h6>
                                        <p>{animal.raca.nome}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Porte</h6>
                                        <p>{animal.raca.porte}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Data de nascimento</h6>
                                        <p>{animal.datanasc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.botao}>
                                <button className={styles.editar_button} /*onClick={() => handleEditarClick(animal.id)}*/>
                                    Editar
                                </button>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default GetAnimalByIdTutorForm;
