import React from 'react';
import styles from './components/white_button.module.css'

const text_white_button = {
    login: 'Login',
    adicionar_animal: 'Adicionar animal',
    cadastro: "Cadastre-se",
    voltar: "Voltar",
};

export function LoginWhiteButton() {
    return (
        <button className={styles.white_button}>
            {text_white_button.login}
        </button>
    );
}

export function AdicionarAnimalWhiteButton() {
    return (
        <button className={styles.white_button}>
            {text_white_button.adicionar_animal}
        </button>
    );
}

export function CadastrolWhiteButton() {
    return (
        <button className={styles.white_button}>
            {text_white_button.cadastro}
        </button>
    );
}

export function VoltarWhiteButton() {
    return (
        <button className={styles.white_button}>
            {text_white_button.voltar}
        </button>
    );
}
