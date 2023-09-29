import React from 'react';
import styles from './components/texto_login_page.module.css'

export default function Text() {
    return (
        <div className={styles.texto_box}>
            <h1 className={styles.titulo}>Hospital Veterinário Universitário</h1>
            <p className={styles.paragrafo}>Aqui você pode agendar atendimentos 
            para o seu pet de forma simples e rápida. Crie uma conta  e marque a 
            próxima consulta com nossos veterinários.</p>
        </div>
        
    );
}