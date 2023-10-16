import React from 'react';
import Link from 'next/link';
import styles from './white_button.module.css'

const text_white_button = {
    login: 'Login',
    adicionar_animal: 'Adicionar animal',
    cadastro: "Cadastre-se",
    voltar: "Voltar",
};

export function LoginWhiteButton() {
    return (
        <Link href="/login">
            <button className={styles.white_button}>
                {text_white_button.login}
            </button>
        </Link>

    );
}

export function AdicionarAnimalWhiteButton() {
    return (
        <Link href="/cadastroanimal">
            <button className={styles.white_button}>
                {text_white_button.adicionar_animal}
            </button>
        </Link>

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
