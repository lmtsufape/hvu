import {useState, useEffect, useRef} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";

export default function ClinicaMedicaRetornoStep2({
    formData,
    handleChange,
    handleCheckboxChange,
    nextStep
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha clínica médica de retorno</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
        
            <h2>Exame físico por sistema</h2>
            <div className={styles.column}>
            <label>Peso:</label>
            <input
              type="text"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              style={{
                width: "100px", // Define uma largura menor
              }}
            />
          </div>
          
          <div className={styles.column}>
            <label>
             Anamnese/Histórico clínico: <br />
              <textarea
                name="anamneseHistoricoClinico"
                value={formData.anamneseHistoricoClinico}
                onChange={handleChange}
                rows="4"
                cols="50"
              />
            </label>
          </div>
          <div className={styles.column}>
            <label>
              Exame clínico: <br />
              <textarea
                name="exameClinico"
                value={formData.exameClinico}
                onChange={handleChange}
                rows="4"
                cols="50"
              />
            </label>
          </div>
          <div className={styles.column}>
            <label>
              Conduta terapêutica: <br />
              <textarea
                name="condutaTerapeutica"
                value={formData.condutaTerapeutica}
                onChange={handleChange}
                rows="4"
                cols="50"
              />
            </label>
          </div>

          <button
            type="button"
            onClick=''
            
          >
            
          </button>
          

          <h1 className={styles.title}>Exames complementares</h1>
          <div className={styles.checkbox_container}>
            {[
              "Hemograma",
              "Alt/Tgp",
              "Ast/Tgo",
              "Creatinina",
              "Uréia",
              "Proteínas Totais",
              "Albumina",
              "Globulina",
              "Fa",
              "Ggt",
              "Glicose",
              "Triglicérides",
              "Colesterol Total",
              "Urinálise",
              "Bilirrubina Total e Frações",
              "Tricograma",
              "Citologia Cutânea",
              "Raspado Cutâneo",
              "Citologia Oncológica",
              "Histopatológico",
              "Teste Rápido Cinomose",
              "Teste Rápido Erliquiose",
              "Citologia Otológica",
              "Teste Rápido Parvovirose",
              "Teste Rápido Leishmaniose",
              "Fiv/Felv",
            ].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  onChange={(e) => handleCheckboxChange(e, "ExamesComplementares")}
                />{" "}
                {item.replace(/([A-Z])/g, " $1").trim()}
              </label>
            ))}
          </div>

          <div className={styles.column}>
            <label>Médico(s) Veterinário(s) Responsável:</label>
            <input
              type="text"
              name="MedicoResponsavel"
              value={formData.MedicoResponsavel}
              onChange={handleChange}
            />
          </div>

          <div className={styles.column}>
            <label>Plantonista(s) discente(s):</label>
            <input
              type="text"
              name="plantonista"
              value={formData.plantonista}
              onChange={handleChange}
            />
          </div>

          <div className={styles.button_box}>
            
          </div>
        </form>
        
      </div>
    </div>
  );
}