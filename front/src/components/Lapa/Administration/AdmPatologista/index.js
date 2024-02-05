import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function GerenciaPatologista() {

    const router = useRouter();

    const handleMenuAnteriorClick = () => {
        router.push('/lapa/administrationPage/');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Gerenciamento de Patologistas</h1>
            </div>

            <div className={styles.box_button}>

                <button className={styles.button}>Novo Patologista</button>

                <button className={styles.button}>Remover Patologista</button>

                <button className={styles.button}>Editar Patologista</button>

                <button className={styles.button}>Vizualizar Patologista</button>

                <button type="button" className={styles.button} onClick={handleMenuAnteriorClick}>Menu anterior</button>

            </div>

        </div>
    );
}

export default GerenciaPatologista;
 
