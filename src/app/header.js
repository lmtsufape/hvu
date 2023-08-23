import React from 'react';
import Image from "next/image";
import styles from "./components/header.module.css";
import {LoginGreenButton} from './green_button';
import {CadastrolWhiteButton} from './white_button';
import {LogoHVU} from './logo_hvu';

export default function Header() {
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                <LogoHVU />
            </div>

            <div className={styles.box_buttons} >
                <CadastrolWhiteButton />
                <LoginGreenButton />
            </div>
                
        </header>
    );    
  }
