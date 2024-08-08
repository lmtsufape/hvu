import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import styles from "./index.module.css";
import {LoginGreenButton} from '../../GreenButton';
import { LoginWhiteButton } from '../../WhiteButton';
import {CadastrolWhiteButton} from '../../WhiteButton';
import LogoLAPA from '../LogoLAPA/logo_lapa';

//Header com botão de login e cadastro
export function Header01() {
    const router = useRouter();
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                < LogoLAPA />
            </div>

            <div className={styles.box_buttons} >
            <button type="button" className="btn btn-outline-success" id={styles.white_button}>Cadastre-se</button>
            < LoginGreenButton />
            </div>
                
        </header>
    );    
  }

  //Header com botão de Home e Sistema
  export function Header02() {
    const router = useRouter();
    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                < LogoLAPA />
            </div>

            <div className={styles.box_buttons} >
                <button type="button" className="btn btn-link" id={styles.black_button_decoration} onClick={(e) => router.push("/lapa")}>Home</button>
                <button type="button" className="btn btn-link" id={styles.black_button_decoration} onClick={(e) => router.push("/lapa/system")}>Sistema</button>
            </div>
                
        </header>
    );    
  }

  //Header com ícone de perfil
  export function Header03() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className={styles.header}>
            
            <div className={styles.boxlogo}>
                <div>
                    <Image src="/images/logoLAPA.svg" alt="Logo LAPA" width={150.94} height={72.54}/>
                </div>
                <div>
                    <Image src="/ufape_black_logo.svg" alt="Logo UFAPE" width={73.82} height={73.82}/>
                </div>
            </div>

            <div className={styles.box_buttons} ref={dropdownRef}>
                <button type="button" className="btn btn-link" onClick={toggleDropdown}>
                <Image src="/icone_perfil.svg" alt="Ícone de perfil" width={59.2} height={59.2}/>
                </button>
                {dropdownOpen && (
                    <div className={styles.dropdown_container}>
                            <div className={styles.dropdown}>
                                <button className={styles.button2} onClick={(e) => router.push("/lapa")}>
                                    <div><Image src="/left_icon.svg" alt="Ícone de perfil" width={17.88} height={17.88}/></div>
                                    <div>Sair</div>
                                </button>
                            </div>
                    </div>
                )}
            </div>
        </header>
    );    
}
