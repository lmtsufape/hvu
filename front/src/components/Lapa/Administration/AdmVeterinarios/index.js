import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function GerenciaVeterinario() {

    const router = useRouter();

    const handleMenuAnteriorClick = () => {
        router.push('/lapa/administrationPage/');
    };

    const handleCriarVeterinarioClick = () => {
        router.push('/createMedico');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Gerenciamento de Veterinários</h1>
            </div>

            <div className={styles.box_button}>

                <button type="button" className={styles.button} onClick={handleCriarVeterinarioClick}>Novo Veterinário</button>

                <button className={styles.button}>Remover Veterinário</button>

                <button className={styles.button}>Editar Veterinário</button>

                <button className={styles.button}>Vizualizar Veterinário</button>

                <button type="button" className={styles.button} onClick={handleMenuAnteriorClick}>Menu anterior</button>

            </div>

        </div>
    );
}

export default GerenciaVeterinario; 
