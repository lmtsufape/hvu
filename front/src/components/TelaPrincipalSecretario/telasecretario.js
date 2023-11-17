import React from 'react';
import styles from "./telaprincipalsecretario.module.css";

function TelaSecretario() {
    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button className={styles.button} disabled>
                    <h6>Novos pacientes do mês</h6>
                    <p>?</p>
                </button>
                <button className={styles.button} disabled>
                    <h6>Agendamentos do mês</h6>
                    <p>?</p>
                </button>
                <button className={styles.button} disabled>
                    <h6>Atendimentos do mês</h6>
                    <p>?</p>
                </button>
                <button className={styles.button} disabled>
                    <h6>Faltas do mês</h6>
                    <p>?</p>
                </button>
            </div>
        </div>
    );
}

export default TelaSecretario