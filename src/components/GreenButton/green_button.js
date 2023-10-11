import React from 'react';
import styles from './green_button.module.css'

const text_green_button = {
    login: 'Login',
    continuar: 'Continuar',
    finalizar: 'Finalizar',
    entrar: 'Entrar',
    agendar: 'Agendar',
    acessar: 'Acessar',
};

export function LoginGreenButton() {
    return (
        <button className={styles.green_button}>
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

export function FinalizarGreenButton() {
    return (
        <button className={styles.green_button}>
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
    return (
        <button className={styles.green_button}>
            {text_green_button.acessar}
        </button>
    );
}
