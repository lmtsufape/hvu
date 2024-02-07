import React from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";

function VoltarButton() {
    const router = useRouter();

    const handlVoltarClick = () => {
        router.back();
    };

    return(
        <div className={styles.voltar_button_box}>
            <button className={styles.voltar_button} onClick={handlVoltarClick}>
                <i className="material-icons">arrow_back_ios</i>
                <p>Voltar</p>
            </button>
        </div>
    );
}

export default VoltarButton;