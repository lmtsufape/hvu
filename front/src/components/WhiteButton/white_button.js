import React from 'react';
import { useRouter } from 'next/router';
import styles from './white_button.module.css'

const text_white_button = {
    login: 'Login',
    adicionar_animal: 'Adicionar animal',
    cadastro: "Cadastre-se",
    voltar: "Voltar",
    editar: "Editar"
};

export function LoginWhiteButton() {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/');
    };

    return (
            <button className={styles.white_button} onClick={handleLoginClick}>
                {text_white_button.login}
            </button>
    );
}

export function AdicionarAnimalWhiteButton() {
    const router = useRouter();

    const handlAdicionarClick = () => {
        router.push('/cadastroanimal');
    };

    return (
            <button className={styles.white_button} onClick={handlAdicionarClick}>
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
    const router = useRouter();

    const handlVoltarClick = () => {
        router.back();
    };

    return (
        <button className={styles.white_button} onClick={handlVoltarClick}>
            {text_white_button.voltar}
        </button>
    );
}

export function EditarWhiteButton() {
    const router = useRouter();

    const handlEditarClick = () => {
        router.push('/editarperfil');
    };

    return (
            <button className={styles.white_button} onClick={handlEditarClick}>
                {text_white_button.editar}
            </button>
    );
}
