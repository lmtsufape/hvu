import React from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import Image from 'next/image';

function VoltarButton({ onClick }) {
    const router = useRouter();

    const handlVoltarClick = () => {
        if (onClick) {
            onClick(); 
        } else {
            router.back(); 
        }
    };

    return(
        <div className={styles.voltar_button_box}>
            <button className={styles.voltar_button} onClick={handlVoltarClick}>
            <Image src="/images/IconMenorQue.svg" alt="Voltar" width={27} height={24}/>
                <p>Voltar</p>
            </button>
        </div>
    );
}

export default VoltarButton;