import React from 'react';
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/router";


function TelaHomeLaudos() {

    const router = useRouter();

    const handleNewRequestClick = () => {
        router.push('/lapa/telaprincipallaudos/novaSolicitacao');
    };
    const handleLaudosEmAndamentoClick = () => {
        router.push('/lapa/telaprincipallaudos/laudosEmAndamento');
    };

    return (
        <div className={styles.container}>

            <div className={styles.box_button}>
                <button 
                type="button"
                className={styles.button}
                onClick={handleNewRequestClick}>
                    <h6>Criar Nova Solicitação de Laudo</h6>
                </button>
                <button
                type="button"
                className={styles.button} 
                onClick={handleLaudosEmAndamentoClick}>
                    <h6>Novas Solicitações de Laudo</h6>
                </button>
                <button className={styles.button} disabled>
                    <h6>Necropsias e Histopatologias em andamento</h6>
                </button>
                <button className={styles.button} disabled>
                    <h6>Necropsias e Histopatologias Finalizadas</h6>
                </button>            
            </div>
        </div>
    );
}

export default TelaHomeLaudos;