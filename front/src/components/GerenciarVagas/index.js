import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";

function GerenciarVagas() {
    const router = useRouter();


    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Gerenciar vagas</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="especie" className="form-label">Espécie</label>
                            <select
                                className="form-select"
                                name="especie"
                                aria-label="Selecione uma espécie"
                            >
                            <option value="">Selecione a espécie</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="nome" className="form-label">Raça</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nome"
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="porte" className="form-label">Porte</label>
                            <input
                                type="text"
                                className="form-control"
                                name="porte"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button}>
                        Criar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default GerenciarVagas;
