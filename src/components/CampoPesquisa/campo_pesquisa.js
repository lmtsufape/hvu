import "bootstrap/dist/css/bootstrap.min.css";
import styles from './campo_pesquisa.module.css';
import Image from "next/image";

export function CampoPesquisa() {
    return (
        <form className={styles.busca}>
            <input type="search" className={styles.texto_busca} placeholder="Buscar animal"/>
            <button className={styles.button_busca}>
                <img src='./layouts/icone_busca.svg' alt="Lupa de busca"/> 
            </button>
        </form>
    );
}
