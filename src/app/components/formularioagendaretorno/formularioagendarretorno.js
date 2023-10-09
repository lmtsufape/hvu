import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./formularioagendarretorno.module.css"
import { FinalizarGreenButton } from "../greenbutton/green_button";
import { VoltarWhiteButton } from "../whitebutton/white_button";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

function AgendarConsulta(){
    const [agendarConsulta, setAgendarConsulta] = useState({
      data: "",
      horario: "",
      especialidade: "",
      paciente:"",
        
    });

    const [escolherData, setEscolherData] = useState(null);

  function handleInputChange(event){
    const { name, value } = event.target;
    setAgendarConsulta({...agendarConsulta, [name]: value})
  };
  function handleDateChange(date){
    setEscolherData(date);
  }

  function handleSubmit(event) {
  event.preventDefault();
  if (escolherData) {
    const dataSemHorario = escolherData.toLocaleDateString("pt-BR");
    setAgendarConsulta({ ...agendarConsulta, data: dataSemHorario });
    console.log({ ...agendarConsulta, data: dataSemHorario });
  }
}

    return (
        <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <label htmlFor="data" className="form-label">Data</label>
              <DatePicker
        
        dateFormat="dd/MM/yyyy"
        className="form-control"
        placeholderText="Ex: 13/07/2023"
        locale={ptBR}
        selected={escolherData}
        onChange={handleDateChange}
      />
                  
            </div>
            <div className="col">
            <label htmlFor="horario" className="form-label">Horário</label>
              <select className="form-select" 
                name="horario"
                aria-label="Selecione o horário" 
                value={agendarConsulta.horario}
                onChange={handleInputChange}
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
                value={agendarConsulta.especialidade}
                onChange={handleInputChange}
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