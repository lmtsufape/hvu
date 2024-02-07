import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function GerenciaNecropsia() {

    const router = useRouter();

    const handleMenuAnteriorClick = () => {
        router.push('/lapa/administrationPage/');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Gerenciamento de Necropsias</h1>
            </div>

            <div className={styles.box_button}>

                <button className={styles.button}>Novo Necropsia</button>

                <button className={styles.button}>Remover Necropsia</button>

                <button className={styles.button}>Editar Necropsia</button>

                <button className={styles.button}>Vizualizar Necropsia</button>

                <button type="button" className={styles.button} onClick={handleMenuAnteriorClick}>Menu anterior</button>

            </div>

        </div>
    );
}

export default GerenciaNecropsia;
