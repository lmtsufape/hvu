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

    const handleTutorClick = () => {
        router.push('/lapa/administrationPage/tutor');
    };

    const handleAnimaisClick = () => {
        router.push('/lapa/administrationPage/animal');
    };

    const handleVeterinarioClick = () => {
        router.push('/lapa/administrationPage/veterinario');
    };

    const handlePatologistasClick = () => {
        router.push('/lapa/administrationPage/patologista');
    };

    const handleNecropsiastasClick = () => {
        router.push('/lapa/administrationPage/necropsia');
    };

    const handleHistopatologicaClick = () => {
        router.push('/lapa/administrationPage/histopatologica');
    }; 

    const handleCaafClick = () => {
        router.push('/lapa/administrationPage/caaf');
    };

    const handleLaudosClick = () => {
        router.push('/lapa/administrationPage/laudo');
    };

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleHomeLaudosClick}>Home</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleTutorClick}>Tutor</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleAnimaisClick}>Animal</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleVeterinarioClick}>Veterinário</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handlePatologistasClick}>Patologista</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleNecropsiastasClick}>Necropsia</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleHistopatologicaClick}>Histopatologia</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleCaafClick}>CAAF</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={handleLaudosClick}>Laudo</button>
           
            
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

 
