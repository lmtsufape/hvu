import React from 'react';
import Image from "next/image";
import styles from "./components/header.module.css";

function LogoHVU() {
    return (
        <img src="/home/rafaela/Documentos/projeto-hvu-front/public/layouts/hvulogo.jpg" alt="Logo do HVU">
            
        </img>
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
        <div className={styles.header}>
            <p>
                <LogoHVU />
                <BotaoCadastro />
                <BotaoLogin />
            </p>
        </div>
    );    
  }
