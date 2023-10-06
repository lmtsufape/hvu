"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../components/formulariocadastrotutor.module.css";
import { ContinuarGreenButton } from "../greenbutton/green_button";
import { VoltarWhiteButton } from "../whitebutton/white_button";
import axios from "axios";
import { useRouter } from "next/router";


function FormularioCadastroEndereco(){
    const [formularioEndereco, setFormularioEndereco] = useState({
        rua: "",
        bairro: "",
        numero: "",
        estado: "",
        cidade: "",
    });

    const router = useRouter();

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormularioEndereco({...formularioEndereco, [name]: value });
    };

    function handleSubmit(event){
        event.preventDefault();
        
        axios.post("http://localhost:3000/tutor", formularioEndereco) //link para o back
        .then(response =>{
            console.log(response.data);

            router.push('../pages/cadastroanimal');
        })

        .catch(error => {
            console.log('Erro ao enviar os dados para o servidor:', error);
        });
    };

    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
            <form onSubmit={handleSubmit}>
            <div class="mb-3">
                 <label for="rua" class="form-label">Rua</label>
                    <input type="text" 
                    class="form-control" 
                    name="rua"
                    placeholder="Ex: Avenida Bom Pastor"
                    value={formularioEndereco.rua}
                   onChange={handleInputChange}>
                   </input>

            </div>
            <div class="mb-3">
                <label for="bairro" class="form-label">Bairro</label>
                    <input type="text" 
                    class="form-control" 
                    name="bairro" 
                    placeholder="Ex: Centro"
                    value={formularioEndereco.bairro}
                   onChange={handleInputChange}>

                    </input>
            </div>
            <div class="mb-3">
                <label for="numero" class="form-label">Número</label>
                    <input type="text" 
                    class="form-control" 
                    name="numero"
                    placeholder="Ex: 123"
                    value={formularioEndereco.numero}
                   onChange={handleInputChange}>

                   </input>
            
            <div className={styles.espacodosforms}>
            <div class="row">
            <div class="col ">
                <label for="estado" class="form-label">Estado</label>
                    <input type="text" 
                    class="form-control" 
                    name="estado"
                    placeholder="Ex: Pernambuco" 
                    value={formularioEndereco.estado}
                   onChange={handleInputChange}>

                    </input>
            </div>
            <div class="col">
                <label for="cidade" class="form-label">Cidade</label>
                    <input type="text" 
                    class="form-control" 
                    name="cidade"
                    placeholder="Ex: Garanhuns" 
                    value={formularioEndereco.cidade}
                   onChange={handleInputChange}>
                    </input>
            </div>
            </div>
            <div className={styles.continuarbotao}>
                <VoltarWhiteButton/>
                <ContinuarGreenButton/>
            </div>
                </div>
            </div>
            </form>
        </div>
    )
}
export default FormularioCadastroEndereco