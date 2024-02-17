import React, { useState } from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";

function CreateRaca() {


    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar raça</h1>
            <div className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="especie" className="form-label">Espécie</label>
                            <select 
                                className={"form-select"}
                                name="especie"
                                aria-label="Selecione uma espécie"
                            >
                                <option value="">Selecione a espécie</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="raca" className="form-label">Raça</label>
                            <input
                                type="text"
                                className={"form-control"}
                                name="raca"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button className={styles.criar_button}>
                        Criar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateRaca;
