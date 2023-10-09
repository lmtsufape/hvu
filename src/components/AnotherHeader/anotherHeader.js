import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./another_header.module.css"

//Sem botão de relatório
export function SegundaHeader01 () {
    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Animais</button>
        </div>
    );
}

//Com botão de relatório
export function SegundaHeader02 () {
    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Animais</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Relatórios</button>
        </div>
    );
}

