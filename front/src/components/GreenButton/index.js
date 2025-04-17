import React from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css'

const text_green_button = {
    login: 'Login',
    continuar: 'Continuar',
    continuarFichas: 'Continuar',
    finalizarFichas: 'Finalizar',
    finalizar: 'Finalizar',
    entrar: 'Entrar',
    agendar: 'Agendar',
    acessar: 'Acessar',
};

export function LoginGreenButton() {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/');
    };

    return (
        <button className={styles.green_button} onClick={handleLoginClick}>
            {text_green_button.login}
        </button>
    );
}

export function ContinuarGreenButton() {
    return (
        <button className={styles.green_button}>
            {text_green_button.continuar}
        </button>
    );
}

export function ContinuarFichasGreenButton() {
    return (
        <button className={styles.green_buttonFichas}>
            {text_green_button.continuarFichas}
        </button>
    );
}

export function FinalizarFichasGreenButton({type = "submit"}) {
    return (
        <button className={styles.green_buttonFichas} type={type}>
            {text_green_button.finalizarFichas}
        </button>
    );
}

export function FinalizarGreenButton() {
    const handleAcessarClick = (animalId) => {
        router.push(`/perfildoanimal/${animalId}`);
    };

    return (
        <button className={styles.green_button} onClick={() => handleAcessarClick(animal.id)}>
            {text_green_button.finalizar}
        </button>
    );
}

export function EntrarGreenButton() {
    return (
        <button className={styles.green_button}>
            {text_green_button.entrar}
        </button>
    );
}

export function AgendarGreenButton() {
    return (
        <button className={styles.green_button}>
            {text_green_button.agendar}
        </button>
    );
}

export function AcessarGreenButton() {
    // const router = useRouter();

    // const handleAcessarClick = () => {
    //     router.push(`/perfildoanimal/${animal.id}`);
    // };

    return (
        <button className={styles.green_button} /*onClick={handleAcessarClick}*/>
            {text_green_button.acessar}
        </button>
    );
}
