import React from "react";
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./another_header.module.css"

//Sem botão de relatório
export function SegundaHeader01 () {
    return (
        <div className={styles.button_box}>
            <Link href="/agendarconsulta"><button type="button" className="btn btn-link" id={styles.button_decoration}>Agendamentos</button></Link>
            <Link ref="/consultaranimaltutor"><button type="button" className="btn btn-link" id={styles.button_decoration}>Animais</button></Link>
        </div>
    );
}

//Com botão de relatório
export function SegundaHeader02 () {
    return (
        <div className={styles.button_box}>
            <Link href="/agendarconsulta"><button type="button" className="btn btn-link" id={styles.button_decoration}>Agendamentos</button></Link>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Animais</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Relatórios</button>
        </div>
    );
}

