import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router"; 

//Administração Geral 
export function SubHeaderGeral () {
    const router = useRouter();

    const handleHomeLaudosClick = () => {
        router.push('/lapa/telaprincipallaudos');
    };
    const handleGeralClick = () => {
        router.push('/lapa/cadastrosGerais');
    };
 
    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleHomeLaudosClick}>Home</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleGeralClick}>Cadastros Gerais </button>
            
        </div>
    );
}

//Administração de Animais
export function SubHeaderAnimal () {
    const router = useRouter();

    const handleAgendamentosClick = () => {
        router.push('/');
    };

    const handleAnimaisClick = () => {
        router.push('/');
    };

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAgendamentosClick}>Cadastrar</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAnimaisClick}>Remover</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAnimaisClick}>Editar</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAnimaisClick}>Vizualizar</button>
        </div>
    );
}

 
