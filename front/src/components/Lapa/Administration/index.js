import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function TelaAdministracao() {

    const router = useRouter();

    const handlePatologistasClick = () => {
      router.push('/lapa/administrationPage/patologista');
    };

    const handleAnimaisClick = () => {
        router.push('/lapa/administrationPage/animal');
    };

    const handleLaudosClick = () => {
      router.push('/lapa/administrationPage/laudo');
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

    const handleVeterinarioClick = () => {
        router.push('/lapa/administrationPage/veterinario');
    };

    const handleTutorClick = () => {
        router.push('/lapa/administrationPage/tutor');
    };

    return (
        <div className={styles.container}>

            <div className={styles.text_box}>
            <h1 className={styles.titulo}>Administração</h1>
            </div>

            <div className={styles.box_button}>

                <button type="button" className={styles.button} onClick={handlePatologistasClick}>
                    <h6>Seção dos patologistas</h6>
                </button>

                <button type="button" className={styles.button} onClick={handleAnimaisClick}>
                    <h6>Seção dos Animais</h6>
                </button>

                <button type="button" className={styles.button} onClick={handleLaudosClick}>
                    <h6>Seção dos Laudos</h6>
                </button>

                <button type="button" className={styles.button}onClick={handleNecropsiastasClick}>
                    <h6>Seção das Necropsias</h6>
                </button>

            </div>

            <div className={styles.box_button2}>

                <button type="button" className={styles.button} onClick={handleHistopatologicaClick}>
                    <h6>Seção das Histopatologias</h6>
                </button>

                <button type="button" className={styles.button} onClick={handleCaafClick}>
                    <h6>Seção do CAAF</h6>
                </button>

                <button type="button" className={styles.button} onClick={handleVeterinarioClick}>
                    <h6>Seção dos Veterinários</h6>
                </button>

                <button type="button" className={styles.button} onClick={handleTutorClick}>
                    <h6>Seção dos Tutores</h6>
                </button>
            </div>
            
        </div>
    );
}

export default TelaAdministracao; 


