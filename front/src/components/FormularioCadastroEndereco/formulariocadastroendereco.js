"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../FormularioCadastroEndereco/formulariocadastroendereco.module.css";
import { ContinuarGreenButton } from "../GreenButton/green_button";
import { VoltarWhiteButton } from "../WhiteButton/white_button";
import axios from "axios";
import { useRouter } from "next/router";


function FormularioCadastroEndereco(){
    const [formularioEndereco, setFormularioEndereco] = useState({
        email: "",
        cpf: "",
        senha: "",
        telefone: "",
        nome: "",
        endereco: {
          cep: "",
          rua: "",
          municipio: "",
          cidade: "",
          numero: 0,
          bairro: ""
        },
        rg: "",
        animal: {
          nome: "",
          sexo: "",
          alergias: "",
          dataNascimento: "",
          imagem: "", // Pode ser alterado para peso, conforme sua necessidade
          raca: {
            nome: "",
            porte: "",
            descricao: "",
            especie: {
              nome: "",
              descricao: ""
            }
          },
          historicoMedicoPregresso: {
            produto: "",
            observacoes: "",
            data: "",
            medicacaoPeriodica: [
              {
                nome: "",
                tipo: ""
              }
            ]
          }
        }
      });

    const router = useRouter();

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormularioEndereco({...formularioEndereco, [name]: value });
    };

    const instance = axios.create({
        baseURL: 'http://localhost:8081/api/v1',
    });

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await instance.post("/tutor", formularioEndereco);
            console.log("Endereço cadastrado com sucesso!", response.data);
            
            router.push("/cadastroanimal");
        } catch (error) {
            console.error("Erro ao cadastrar o endereço", error);
        }
    }

    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
            <form onSubmit={handleSubmit}>
            <div class="mb-3">
                 <label for="rua" class="form-label">Rua</label>
                    <input type="text" 
                    class="form-control" 
                    name="rua"
                    placeholder="Ex: Avenida Bom Pastor"
                    value={formularioEndereco.endereco.rua}
                   onChange={handleInputChange}>
                   </input>

            </div>
            <div class="mb-3">
                <label for="bairro" class="form-label">Bairro</label>
                    <input type="text" 
                    class="form-control" 
                    name="bairro" 
                    placeholder="Ex: Centro"
                    value={formularioEndereco.endereco.bairro}
                   onChange={handleInputChange}>

                    </input>
            </div>
            <div class="mb-3">
                <label for="numero" class="form-label">Número</label>
                    <input type="text" 
                    class="form-control" 
                    name="numero"
                    placeholder="Ex: 123"
                    value={formularioEndereco.endereco.numero}
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
                    value={formularioEndereco.endereco.estado}
                   onChange={handleInputChange}>

                    </input>
            </div>
            <div class="col">
                <label for="cidade" class="form-label">Cidade</label>
                    <input type="text" 
                    class="form-control" 
                    name="cidade"
                    placeholder="Ex: Garanhuns" 
                    value={formularioEndereco.endereco.cidade}
                   onChange={handleInputChange}>
                    </input>
            </div>
            </div>
            <div className={styles.continuarbotao}>
                <VoltarWhiteButton/>
                <button type="submit" className={styles.green_button}>
                    Continuar
                </button>
            </div>
                </div>
            </div>
            </form>
        </div>
    )
}
export default FormularioCadastroEndereco
