import React from 'react';
import Image from "next/image";
import styles from './components/login_page.module.css'
import {Text} from './texto_login_page';

export default function LoginPage() {
    return (
        <header className={styles.login_page}>
            <div className={styles.texto}>
                <Text />
            </div>
            <div className={styles.login_formulario}>

            </div>
        </header>
    
    );
}