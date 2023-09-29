import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../components/formularioagendarretorno.module.css"
import { FinalizarGreenButton } from "../green_button";
import { VoltarWhiteButton } from "../white_button";
import Calendario from "./calendario";


function AgendarConsulta(){
    const [agendarConsulta, setAgendarConsulta] = useState({
        
    })

    return (
        <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form>
          <div className="row">
            <div className="col">
              <label htmlFor="data" className="form-label">Data</label>
                  <Calendario/>
                  
            </div>
            <div className="col">
            <label htmlFor="horario" className="form-label">Horário</label>
              <select className="form-select" 
                name="horario"
                aria-label="Selecione o horário" 
                
                >
                  <option value="">Selecione o horário</option>
                  <option value="08h00">08h00min</option>
                  <option value="09h00">09h00min</option>
                  <option value="10h00">10h00min</option>
                  <option value="11h00">11h00min</option>
                  <option value="13h00">13h00min</option>
                  <option value="14h00">14h00min</option>
                  <option value="15h00">15h00min</option>
                  <option value="16h00">16h00min</option>
              </select>
          </div>
            </div>
  
      <div className={styles.espacodosforms}>
        <div className="row">
        <div className="col">
            <label htmlFor="especialidade" className="form-label">Especialidade</label>
              <select className="form-select" 
                name="especialidade"
                aria-label="Selecione a especialidade" 
                
                >
                  <option value="">Selecione a especialidade</option>
                  <option value="acupuntura">Acupuntura</option>
                  <option value="avaliacao cirurgica">Avaliação Cirurgica</option>
                  <option value="cardiologia">Cardiologia</option>
                  <option value="dermatologia">Dermatologia</option>
                  <option value="fisioterapia">Fisioterapia</option>
                  <option value="ortopedia">Ortopedia</option>
                  

              </select>
          </div>
          <div className="col">
            <label htmlFor="paciente" className="form-label">Paciente</label>
              <input type="text" 
                className="form-control" 
                name="paciente"
                placeholder="" 
                >
              </input>
          </div>
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

export default AgendarConsulta;