import React from "react";
import styles from "../FormularioEditarPerfil/formularioeditarperfil.module.css"
import { FinalizarGreenButton } from "../GreenButton/green_button";
import { VoltarWhiteButton } from "../WhiteButton/white_button";

function FormularioEditarPerfil (){
    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
      <form >
        <div className="row">
          <div className="col">
            <label htmlFor="nome" className="form-label">Nome</label>
                <input 
                   type="text" 
                   className="form-control" 
                   name="nome"
                   placeholder="Insira o nome do animal" 
                   
                   >
                </input>
          </div>
          <div className="col">
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
                <input type="text" 
                  className="form-control" 
                  name="nascimento"
                  placeholder="Ex: 12/12/2012"
                  
                  >
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
              
              >

            </input>
          </div>
        <div className="col">
          <label htmlFor="raca" className="form-label">Raça</label>
            <input type="text" 
              className="form-control" 
              name="raca"
              placeholder="Insira a raça do animal" 
              
              >
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
              
              >
            </input>
          </div>

        <div className="col">
          <label htmlFor="porte" className="form-label">Porte</label>
            <select className="form-select" 
              name="porte"
              aria-label="Selecione o porte do animal" 
              
              >
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
              
              >
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

export default FormularioEditarPerfil;