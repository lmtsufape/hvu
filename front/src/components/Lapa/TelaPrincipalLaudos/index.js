import React from 'react';
import styles from "./index.module.css";
import Image from "next/image";

function TelaHomeLaudos() {
    return (
        <div className={styles.container}>

            <div className={styles.box_button}>
                <button className={styles.button} disabled>
                    <h6>Novas Solicitações de Laudos</h6>
                </button>
                <button className={styles.button} disabled>
                    <h6>Laudos em Andamento</h6>
                </button>
                <button className={styles.button} disabled>
                    <h6>Laudos Finalizados no mês</h6>
                </button>            
            </div>
        </div>
    );
}

export default TelaHomeLaudos;