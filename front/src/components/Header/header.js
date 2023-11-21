import React from 'react';
import Image from "next/image";
import styles from "./header.module.css";
import {LoginGreenButton} from '../GreenButton/green_button';
import {CadastrolWhiteButton} from '../WhiteButton/white_button';
import LogoHVU from '../LogoHVU/logo_hvu';

//Header com botão de login e cadastro
export function Header01() {
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                < LogoHVU />
            </div>

            <div className={styles.box_buttons} >
            <button type="button" className="btn btn-outline-success" id={styles.white_button}>Cadastre-se</button>
            <button type="button" className="btn btn-outline-success" id={styles.green_button}>Login</button>
            </div>
                
        </header>
    );    
  }

  //Header com botão de Home e Sistema
  export function Header02() {
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                < LogoHVU />
            </div>

            <div className={styles.box_buttons} >
                <button type="button" className="btn btn-link" id={styles.black_button_decoration}>Home</button>
                <button type="button" className="btn btn-link" id={styles.black_button_decoration}>Sistema</button>
            </div>
                
        </header>
    );    
  }

  //Header com ícone de perfil
  export function Header03() {
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                < LogoHVU />
            </div>

            <div className={styles.box_buttons} >
                <button type="button" class="btn btn-link">
                    <img src='./images/icone_perfil.svg'/>
                </button>
            </div>
                
        </header>
    );    
  }

  //Header botão de login
  export function Header04() {
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                < LogoHVU />
            </div>

            <div className={styles.box_buttons} >
                <button type="button" class="btn btn-outline-success" id={styles.white_button}>Login</button>
            </div>
                
        </header>
    );    
  }
