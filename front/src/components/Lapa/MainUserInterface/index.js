import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function InterfaceUsuario() {

    const router = useRouter();

    const handleAtualizarDadosTutorClick = () => {
        router.push('/createTutor');
    };

    const handleMenuAnteriorClick = () => {
        router.push('/serviceSelection');
    };


    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Plataforma de Serviços de Patologia Animal</h1>
            </div>

            <div className={styles.box_button}>
                <button className={styles.button}>Solicitar Nova Necropsia</button>
                <button className={styles.button}>Laudos Disponíveis</button>
                <button 
                  type="button"
                  className={styles.button}
                  onClick={handleAtualizarDadosTutorClick}
                >Atualizar Dados Pessoais</button>
                <button className={styles.button}>Listar Animais Cadastrados</button>
                <button 
                  type="button"
                  className={styles.button}
                  onClick={handleMenuAnteriorClick}
                >Menu anterior</button>
            </div>

        </div>
    );
}

export default InterfaceUsuario;
