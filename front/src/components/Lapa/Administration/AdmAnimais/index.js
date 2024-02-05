import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function GerenciaAnimal() {

    const router = useRouter();

    const handleNovoAnimalClick = () => {
      router.push('/createAnimal');
    };

    const handleMenuAnteriorClick = () => {
        router.push('/lapa/administrationPage/');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
              <h1 className={styles.titulo}>Gerenciamento de Animais</h1>
            </div>

            <div className={styles.box_button}>

              <button type="button" className={styles.button} onClick={handleNovoAnimalClick}>Novo Animal</button>

              <button className={styles.button}>Remover Animal</button>

              <button className={styles.button}>Editar Animal</button>

              <button className={styles.button}>Vizualizar Animal</button>

              <button type="button" className={styles.button} onClick={handleMenuAnteriorClick}>Menu anterior</button>

            </div>

        </div>
    );
}

export default GerenciaAnimal;
