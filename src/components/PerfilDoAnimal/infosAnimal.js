import React, { useState, useEffect } from 'react';
import styles from "./perfilAnimal.module.css";
import { EditarWhiteButton } from "../WhiteButton/white_button";

function InfosDoAnimal() {
    const [animal, setAnimal] = useState([]);

    return(
        <container className={styles.container}>
            <h1>Perfil do Animal</h1>
            <ul>
                {animal.map(animal =>  (
                    <li key={animal.id} className={styles.infos_box}>
                    <div className={styles.identificacao}>
                        <div className={styles.nome_animal}>{animal.nome}</div>
                        <div className={styles.especie_animal}>{animal.especie}</div>
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
                                        <p>{animal.raca}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Porte</h6>
                                        <p>{animal.porte}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Data de nascimento</h6>
                                        <p>{animal.datanasc}</p>
                                    </div>
                                </div>
                            </div>                   
                            <div  className={styles.botao}>
                                < EditarWhiteButton />
                            </div>
                        </div>
                    </li>
                    ))}

                </ul>
        </container>
    );
}

export default InfosDoAnimal
