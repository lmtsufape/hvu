import "bootstrap/dist/css/bootstrap.min.css";
import styles from './components/campo_pesquisa.module.css';
import Image from "next/image";

export function CampoPesquisa() {
    return (
        <form class={styles.busca}>
            <input type="search" class={styles.texto_busca} placeholder="Buscar animal"/>
            <button class={styles.button_busca}>
                <img src='./layouts/icone_busca.svg' alt="Lupa de busca"/> 
            </button>
        </form>
    );
}
