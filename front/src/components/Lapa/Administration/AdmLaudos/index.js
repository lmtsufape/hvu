import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function GerenciaLaudo() {

    const router = useRouter();

    const handleMenuAnteriorClick = () => {
        router.push('/lapa/administrationPage/');
    };

    const handleNovoLaudoClick = () => {
        router.push('/lapa/administrationPage/laudo/novoLaudo');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Gerenciamento de Laudos</h1>
            </div>

            <div className={styles.box_button}>

                <button type="button" className={styles.button} onClick={handleNovoLaudoClick}>Novo Laudo</button>

                <button className={styles.button}>Remover Laudo</button>

                <button className={styles.button}>Editar Laudo</button>

                <button className={styles.button}>Vizualizar Laudo</button>

                <button type="button" className={styles.button} onClick={handleMenuAnteriorClick}>Menu anterior</button>

            </div>

        </div>
    );
}

export default GerenciaLaudo;
