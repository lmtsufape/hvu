import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import styles from "../components/formulariocadastrotutor.module.css";
import { ContinuarGreenButton } from "../green_button";

function FormularioCadastroTutor(){
    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
            <div class="mb-3">
                 <label for="name" class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" id="nameRegister" placeholder="Insira o nome completo"></input>
            </div>
            <div class="mb-3">
                <label for="e-mail" class="form-label">E-mail</label>
                    <input type="email" class="form-control" id="emailRegister" placeholder="Insira o seu e-mail"></input>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="passwordRegister" placeholder="Insira uma senha"></input>
                    <div class="row">
            <div class="col">
                <label for="CPF" class="form-label">CPF</label>
                    <input type="text" class="form-control" placeholder="Ex:123.456.789-00" aria-label="First name"></input>
            </div>
            <div class="col">
                <label for="RG" class="form-label">RG</label>
                    <input type="text" class="form-control" placeholder="Insira o RG" aria-label="Last name"></input>
            </div>
            <div class="mb-3">
                 <label for="phone" class="form-label">Telefone para contato</label>
                    <input type="tel" class="form-control" id="phoneRegister" placeholder="(xx) xxxxx-xxxx"></input>
            </div>
            <div className={styles.continuarbotao}>
                <ContinuarGreenButton/>
            </div>
                </div>
            </div>
        </div>
    )
}
export default FormularioCadastroTutor