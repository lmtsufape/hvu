import React from 'react';
import Image from "next/image";

import styles from "./components/header.module.css";

function LogoHVU() {
    return (
        <>
        <img src='./layouts/hvulogo.jpg' alt='teste'/>
        
        </>

    );
}

function BotaoCadastro() {
    return (
        <button className={styles.botaocadastro}>
            Cadastre-se
        </button>
    );
}

function BotaoLogin() {
    return (
        <button className={styles.botaologin}>
            <div>
            Login
            </div>
        </button>
    );
}

export default function Header() {
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                <LogoHVU />
            </div>

            <div className={styles.box_buttons} >
                <BotaoCadastro />
                <BotaoLogin />
            </div>
                
        </header>
    );    
  }
