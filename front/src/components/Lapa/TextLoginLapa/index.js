import React from 'react';
import styles from './texto_login_lapa_page.module.css';
import Image from "next/image";

export default function Text() {
    return (
        <div className={styles.texto_box}>
            <Image src="/images/lapa_site_logo.png" alt="Logo LAPA" width={150.94} height={180.54} className={styles.imagem} />

            <h1 className={styles.titulo}>Laboratório de Anatomia e Patologia Animal</h1>
        
            <p className={styles.paragrafo}>Adiministração de Laudos</p>
        </div>
    );
}
