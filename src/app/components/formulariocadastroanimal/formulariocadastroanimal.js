"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import styles from "./formulariocadastrotutor.module.css";
import { FinalizarGreenButton } from "../greenbutton/green_button";
import { VoltarWhiteButton } from "../whitebutton/white_button";
import axios from "axios";
import { useRouter } from "next/router";


function FormularioCadastroAnimal(){
    const [formularioAnimal, setFormularioAnimal] = useState({
      nome: "",
      nascimento: "",
      especie: "",
      raca: "",
      peso: "",
      sexo: "",
      porte: "",
    });

    const router = useRouter();

    function handleInputChange(event) {
      const { name, value } = event.target;
      setFormularioAnimal({...formularioAnimal, [name]: value });
    };

    function handleSubmit(event) {
      event.preventDefault();
      
      axios.post("http://localhost:3000/tutor", formularioAnimal) //substituir o localhost pelo caminho corerto do back
        .then(response => {
            console.log(response.data);

            router.push('../pages/login');
        })

        .catch(error => {
            console.error('Erro ao enviar os dados para o servidor:', error);
        });
    };

 return (
    <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label htmlFor="nome" className="form-label">Nome</label>
                <input 
                   type="text" 
                   className="form-control" 
                   name="nome"
                   placeholder="Insira o nome do animal" 
                   value={formularioAnimal.nome}
                   onChange={handleInputChange}>
                </input>
          </div>
          <div className="col">
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
                <input type="text" 
                  className="form-control" 
                  name="nascimento"
                  placeholder="Ex: 12/12/2012"
                  value={formularioAnimal.nascimento}
                  onChange={handleInputChange}>
                </input>
            </div>
          </div>

    <div className={styles.espacodosforms}>
      <div className="row">
        <div className="col">
          <label htmlFor="especie" className="form-label">Espécie</label>
            <input type="text" 
              className="form-control" 
              name="especie"
              placeholder="Insira a espécie do animal" 
              value={formularioAnimal.especie}
              onChange={handleInputChange}>

            </input>
          </div>
        <div className="col">
          <label htmlFor="raca" className="form-label">Raça</label>
            <input type="text" 
              className="form-control" 
              name="raca"
              placeholder="Insira a raça do animal" 
              value={formularioAnimal.raca}
              onChange={handleInputChange}>
            </input>
        </div>
      </div>
    </div>

    <div className={styles.espacodosforms}></div>
      <div className="row">
        <div className="col">
          <label htmlFor="peso" className="form-label">Peso</label>
            <input type="text" 
              className="form-control" 
              name="peso"
              placeholder="Digite o peso" 
              value={formularioAnimal.peso}
              onChange={handleInputChange}>
            </input>
          </div>

        <div className="col">
          <label htmlFor="porte" className="form-label">Porte</label>
            <select className="form-select" 
              name="porte"
              aria-label="Selecione o porte do animal" 
              value={formularioAnimal.porte}
              onChange={handleInputChange}>
                <option value="">Selecione o porte do animal</option>
                <option value="pequeno">Pequeno</option>
                <option value="medio">Médio</option>
                <option value="grande">Grande</option>
                <option value="gigante">Gigante</option>
            </select>
        </div>
        <div className="col">
          <label htmlFor="sexo" className="form-label">Sexo</label>
            <select className="form-select" 
              name="sexo"
              aria-label="Selecione o sexo do animal"
              value={formularioAnimal.sexo}
              onChange={handleInputChange}>
                <option value="">Selecione o sexo do animal</option>
                <option value="macho">Macho</option>
                <option value="femea">Fêmea</option>
            </select>
        </div>
      </div>

            

      <div className={styles.continuarbotao}>
        <VoltarWhiteButton/>
          <FinalizarGreenButton/>
      </div>
    </form>
  </div>
            
    )
}
export default FormularioCadastroAnimal;
