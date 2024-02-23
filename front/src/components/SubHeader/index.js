import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";

//Sem botão de relatório
export function SubHeader01 () {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAgendamentos")}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAnimais")}>Meus animais</button>
        </div>
    );
}

//Com botão de relatório
export function SubHeader02 () {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/agendamentosSemana")}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/pacientes")}>Pacientes</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration}>Relatórios</button>
        </div>
    );
}

