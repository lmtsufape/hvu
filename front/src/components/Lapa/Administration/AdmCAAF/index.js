import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function GerenciaCaaf() {

    const router = useRouter();

    const handleMenuAnteriorClick = () => {
        router.push('/lapa/administrationPage/');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Gerenciamento de CAAF</h1>
            </div>

            <div className={styles.box_button}>

                <button className={styles.button}>Novo CAAF</button>

                <button className={styles.button}>Remover CAAF</button>

                <button className={styles.button}>Editar CAAF</button>

                <button className={styles.button}>Vizualizar CAAF</button>

                <button type="button" className={styles.button} onClick={handleMenuAnteriorClick}>Menu anterior</button>

            </div>

        </div>
    );
}

export default GerenciaCaaf; 
