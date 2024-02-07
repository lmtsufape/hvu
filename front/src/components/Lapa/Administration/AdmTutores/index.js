import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function GerenciaTutor() {

    const router = useRouter();

    const handleNovoTutorClick = () => {
        router.push('/createTutor');
    };

    const handleMenuAnteriorClick = () => {
        router.push('/lapa/administrationPage/');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Gerenciamento de Tutores</h1>
            </div>

            <div className={styles.box_button}>

            <button type="button" className={styles.button} onClick={handleNovoTutorClick}>Novo Tutor</button>

                <button className={styles.button}>Remover Tutor</button>

                <button className={styles.button}>Editar Tutor</button>

                <button className={styles.button}>Vizualizar Tutor</button>

                <button type="button" className={styles.button} onClick={handleMenuAnteriorClick}>Menu anterior</button>

            </div>

        </div>
    );
}

export default GerenciaTutor; 
