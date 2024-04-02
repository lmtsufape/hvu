import React from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css'

const text_white_button = {
    login: 'Login',
    adicionar_animal: 'Adicionar animal',
    adicionar_medico: 'Adicionar médico',
    cadastro: "Cadastre-se",
    cancelar: "Cancelar",
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
        router.push('/createAnimal');
    };

    return (
            <button className={styles.white_button} onClick={handlAdicionarClick}>
                {text_white_button.adicionar_animal}
            </button>
    );
}

export function AdicionarMedicoWhiteButton() {
    const router = useRouter();

    const handlAdicionarClick = () => {
        router.push('/createMedico');
    };

    return (
            <button className={styles.white_button} onClick={handlAdicionarClick}>
                {text_white_button.adicionar_medico}
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

export function CancelarWhiteButton() {
    const router = useRouter();

    const handlCancelarClick = () => {
        router.back();
    };

    return (
        <button className={styles.white_button} onClick={handlCancelarClick}>
            {text_white_button.cancelar}
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
