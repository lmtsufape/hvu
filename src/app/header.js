import React from 'react';
import Image from "next/image";
import styles from "./components/header.module.css";
import {CadastroGreenButton} from './green_button';
import {LoginButton} from './login_button';
import {LogoHVU} from './logo_hvu';

export default function Header() {
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                <LogoHVU />
            </div>

            <div className={styles.box_buttons} >
                <CadastroGreenButton />
                <LoginButton />
            </div>
                
        </header>
    );    
  }
