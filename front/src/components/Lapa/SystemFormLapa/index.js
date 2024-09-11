import React from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
function SystemForm() {
    return(
        <div className={styles.page}>
            < VoltarButton />
            <div className={styles.container}>
                <h1>Sistema</h1>
                <div>
                    <h6>Bem-vindo ao nosso site dedicado ao laboratório de Anatomnia e Patologia Animal (LAPA) da Universidade Federal do Agreste de 
                    Pernambuco (UFAPE).</h6> 

                    <h6>O Setor de Patologia Veterinária faz parte do Laboratório de Anatomia e Patologia Animal - LAPA da Universidade Federal do Agreste de Pernambuco. </h6>

                    <h6>Oferecemos serviços de diagnóstico por meio de técnicas de necropsia e histopatologia em animais domésticos e silvestres para a própria instituição, comunidade, clínicas veterinárias, hospitais e laboratórios de diagnóstico. </h6>

                    <h6>Além disso, o setor contribui com a pesquisa científica, prepara novos pesquisadores e disponibiliza resultados por meio de dissertações de mestrado e teses de doutorado, enriquecendo o desenvolvimento técnico e científico da região.</h6>
                </div>
            </div>
        </div>
    );
}

export default SystemForm;
