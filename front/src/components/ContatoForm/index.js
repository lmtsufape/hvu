import React from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";

function ContatoForm() {
    return(
        <div className={styles.page}>
            < VoltarButton />
            <div className={styles.container}>
                <div className={styles.titulo}>
                    <h1> Contato</h1>
                </div>
                
                <div>
                    <h5>
                    Laboratório Multidisciplinar de Tecnologias Sociais (LMTS)
                    </h5>
                    <h6>
                        <span>Universidade Federal do Agreste de Pernambuco - UFAPE</span><br />
                        <span>Avenida Bom Pastor, s/n.º, Bairro Boa Vista - CEP: 55292-270 - Garanhuns - PE</span><br />
                        <span>Laboratório 16 B</span><br />
                        <span>E-mail: lmts@ufape.edu.br</span>
                    </h6>

                </div>
            </div>
        </div>
    );
}

export default ContatoForm;