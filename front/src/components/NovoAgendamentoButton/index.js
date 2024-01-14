import React from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';

function NovoAgendamentoButton () {
    const router = useRouter();

    const handlClick = () => {
        router.push('agendarconsulta');
    };

    return (
            <button className={styles.button} onClick={handlClick}>
                Novo Agendamento  +
            </button>
    );
}

export default NovoAgendamentoButton
