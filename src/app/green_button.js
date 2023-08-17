import React from 'react';
import styles from './components/cadastro_button.module.css'

const text_button = {
    cadastro: 'Cadastre-se',
    login: 'Login',
};

export function CadastroGreenButton() {
    return (
        <button className={styles.green_button}>
            {text_button.cadastro}
        </button>
    );
}

export function LoginGreenButton() {
    return (
        <button className={styles.green_button}>
            {text_button.login}
        </button>
    );
}