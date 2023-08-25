import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import styles from "../components/formulariocadastrotutor.module.css";
import { ContinuarGreenButton } from "../green_button";
import { VoltarWhiteButton } from "../white_button";

function FormularioCadastroEndereco(){
    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
            <div class="mb-3">
                 <label for="rua" class="form-label">Rua</label>
                    <input type="text" class="form-control" id="streetRegister" placeholder="Ex: Avenida Bom Pastor"></input>
            </div>
            <div class="mb-3">
                <label for="bairro" class="form-label">Bairro</label>
                    <input type="text" class="form-control" id="neighborhoodRegister" placeholder="Ex: Centro"></input>
            </div>
            <div class="mb-3">
                <label for="numero" class="form-label">Número</label>
                    <input type="text" class="form-control" id="numberRegister" placeholder="Ex: 123"></input>
            <div class="row">
            <div class="col">
                <label for="estado" class="form-label">Estado</label>
                    <input type="text" class="form-control" id="stateRegister" placeholder="Ex: Pernambuco" aria-label=""></input>
            </div>
            <div class="col">
                <label for="cidade" class="form-label">Cidade</label>
                    <input type="text" class="form-control" id="cityRegister" placeholder="Ex: Garanhuns" aria-label=""></input>
            </div>
            <div className={styles.continuarbotao}>
                <VoltarWhiteButton/>
                <ContinuarGreenButton/>
            </div>
                </div>
            </div>
        </div>
    )
}
export default FormularioCadastroEndereco