import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import styles from "../components/formulariocadastrotutor.module.css";
import { FinalizarGreenButton } from "../green_button";
import { VoltarWhiteButton } from "../white_button";

function FormularioCadastroAnimal(){
    const [nome, setNome] = useState('');
    const [nascimento, setNascimento] = useState('');
    const [especie, setEspecie] = useState('');
    const [raca, setRaca] = useState('');
    const [peso, setPeso] = useState('');
    const [porte, setPorte] = useState('');
    const [sexo, setSexo] = useState('');

    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
            <div class="row">

  <div class="col">
  <label for="nome" class="form-label">Nome</label>
    <input 
    type="text" 
    class="form-control" 
    placeholder="Insira o nome do animal" 
    aria-label="First name">
      </input>
  </div>
  <div class="col">
  <label for="nascimento" class="form-label">Data de Nascimento</label>
    <input type="text" class="form-control" placeholder="Ex: 12/12/2012" aria-label=""></input>
  </div>
</div>

<div className={styles.espacodosforms}>
<div class="row">
  <div class="col">
  <label for="especie" class="form-label">Espécie</label>
    <input type="text" class="form-control" placeholder="Insira a espécie do animal" aria-label=""></input>
  </div>
  <div class="col">
  <label for="raca" class="form-label">Raça</label>
    <input type="text" class="form-control" placeholder="Insira a raça do animal" aria-label=""></input>
  </div>
</div>
</div>

<div className={styles.espacodosforms}></div>
<div class="row">
  <div class="col">
  <label for="peso" class="form-label">Peso</label>
    <input type="text" class="form-control" placeholder="Digite o peso" aria-label="Digite o peso"></input>
  </div>
  <div class="col">
  <label for="porte" class="form-label">Porte</label>
  <select class="form-select" aria-label="Selecione o porte do animal" placeholder="Selecione o porte do animal">
  <option selected>Selecione o porte do animal</option>
  <option value="1">Pequeno</option>
  <option value="2">Médio</option>
  <option value="3">Grande</option>
  <option value="4">Gigante</option>
</select>
  </div>
  <div class="col">
  <label for="sexo" class="form-label">Sexo</label>
  <select class="form-select" aria-label="Selecione o sexo do animal">
  <option selected>Selecione o sexo do animal</option>
  <option value="1">Macho</option>
  <option value="2">Fêmea</option>
</select>
  </div>
</div>

            

            <div className={styles.continuarbotao}>
                <VoltarWhiteButton/>
                <FinalizarGreenButton/>
            </div>
        </div>
            
    )
}
export default FormularioCadastroAnimal