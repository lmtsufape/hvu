import React from 'react';
import { useRouter } from 'next/router';
import styles from './novoAgendamentoButton.module.css';

function NovoAgendamentoButton () {
    const router = useRouter();

    const handlClick = () => {
        router.push('');
    };

    return (
            <button className={styles.button} onClick={handlClick}>
                Novo Agendamento +
            </button>
    );
}

export default NovoAgendamentoButton