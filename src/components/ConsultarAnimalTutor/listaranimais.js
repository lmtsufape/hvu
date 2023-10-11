import React from 'react';
import styles from "./consultar_animal_tutor.module.css";
import CampoPesquisa from '../CampoPesquisa/campo_pesquisa';
import { AdicionarAnimalWhiteButton } from "../WhiteButton/white_button";
import { AcessarGreenButton } from "../GreenButton/green_button";

function ListarAnimais() {
    return (
        <container className={styles.container}>
            <h1> Animais </h1>

            <div className={styles.navbar}>
                < CampoPesquisa className={styles.pesquisa}/>
                < AdicionarAnimalWhiteButton />
            </div>

            <div className={styles.lista}>
                <div className={styles.info_box}>
                    <div className={styles.info}>
                        <h6>Paciente</h6>
                        <p>Theodore</p>
                    </div >
                    <div className={styles.info}>
                        <h6>Espécie</h6>
                        <p>Canino</p>
                    </div>
                    <div className={styles.botao_box}>
                        < AcessarGreenButton className={styles.botao}/>
                    </div>
                </div>
            </div>


        </container>
    );
}

export default ListarAnimais