import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

function ServiceSelection() {
  const router = useRouter();

    const handlePatologiaClick = () => {
        router.push('/lapa/userInterface');
    };

  return (
    <div className={styles.container}>
      <div className={styles.text_box}>
            <h1 className={styles.titulo}>Escolha de Serviço Especializado</h1>
            <p className={styles.paragrafo}>Olá! Agradecemos por escolher nossos serviços para cuidar do seu animal. 
            Antes de prosseguir, por favor, selecione a opção desejada:</p>
        </div>

      <div className={styles.box_button}>
        <button className={styles.button}>
            <img src="./images/hvulogo.svg" alt="Hospital Veterinário Universitário" />
            <p className={styles.text}>Se o seu animal de estimação precisa de cuidados médicos 
              imediatos ou exames diagnósticos, escolha esta opção.</p>
        </button>
        
        <button 
          type="button"
          className={`btn btn-link ${styles.button}`}
          onClick={handlePatologiaClick}
        >
          <img src="./images/logoLAPA.svg" alt="Patologia" />
          <p className={styles.text}>Se, infelizmente, o seu animal faleceu e você deseja realizar 
            uma necropsia para entender melhor as circunstâncias, escolha esta opção.</p>
        </button>
      </div>

    </div>
  );
}

export default ServiceSelection;
