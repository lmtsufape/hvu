import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";

const DIAGNOSTICO = [
    { key: "diagnostico",  label: "Diagnóstico(s)" },
    { key: "observacoes",  label: "Observações"    },
    { key: "prognostico",  label: "Prognóstico"    },
    { key: "peso",         label: "Peso (kg)"      }
];

function AtendimentoCardiologico({
    formData, 
    handleChange, 
    prevStep, 
    handleSubmit,
    removerUltimaLinhaTratamento,
      adicionarLinhaTratamento,
      handleChangeTratamentos,
      medicacoes,
}) {
    medicacoes = medicacoes || [{ medicacao: "", dose: "", frequencia: "", periodo: "" }];

    return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha clínico médica de retorno</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
          <h2>Exames Complementares</h2>
          
          <div className={styles.column}>
            <label className="form-label fw-medium">Exames anteriores solicitados</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="ExamesComplementares.examesAnteriores"
              value={formData?.ExamesComplementares?.examesAnteriores || ""}
              onChange={handleChange}
              className="form-control"/>
          </div>
          {/* ================= DIAGNÓSTICO & TRATAMENTO ================= */}
           <div className={styles.column}>
           <div className="card-body">
             <h2>Diagnóstico e tratamento</h2>
   
             {DIAGNOSTICO.map(field => (
               <div key={field.key} className="mb-3">
                 <label className="form-label fw-medium" htmlFor={field.key}>
                   {field.label}
                 </label>
   
                 {field.key === "peso" ? (
                   <input
                     id={field.key}
                     type="number"
                     min="0"
                     step="0.01"
                     name={`diagnostico.${field.key}`}
                     className="form-control"
                     placeholder="Informe o peso em kg"
                     value={formData.diagnostico?.[field.key] || ""}
                     onChange={handleChange}
                   />
                 ) : (
                   <textarea
                     id={field.key}
                     rows={4}
                     name={`diagnostico.${field.key}`}
                     className="form-control"
                     value={formData.diagnostico?.[field.key] || ""}
                     onChange={handleChange}
                   />
                 )}
               </div>
             ))}
            </div>
   
            {/* ================= TABELA DE MEDICAÇÕES ================= */}
             
            <div className={styles.column}>
              <h2>Tratamento</h2>
                  <table className={styles.tabela_tratamento}>
                      <thead>
                          <tr>
                              <th id="medicacao"> Medicação</th>
                              <th>Dose</th>
                              <th>Frequência</th>
                              <th>Período</th>
                          </tr>
                      </thead>
                      <tbody>
                          {medicacoes.map((linha, index) => (
                              <tr key={index}>
                                  <td>
                                      <input
                                      type="text"
                                      value={linha.medicacao}
                                      onChange={(e) => handleChangeTratamentos(index, "medicacao", e.target.value)}
                                      className="form-control"
                                      />
                                  </td>
                                  <td>
                                      <input
                                      type="text"
                                      value={linha.dose}
                                      onChange={(e) => handleChangeTratamentos(index, "dose", e.target.value)}
                                      className="form-control"
                                      />
                                  </td>
                                  <td>
                                      <input
                                      type="text"
                                      value={linha.frequencia}
                                      onChange={(e) => handleChangeTratamentos(index, "frequencia", e.target.value)}
                                      className="form-control"
                                      />
                                  </td>
                                  <td>
                                      <input
                                      type="text"
                                      value={linha.periodo}
                                      onChange={(e) => handleChangeTratamentos(index, "periodo", e.target.value)}
                                      className="form-control"
                                      />
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <div className={styles.bolha_container}>
                      <div className={styles.bolha} onClick={adicionarLinhaTratamento}>
                          +
                      </div>
                      <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaLinhaTratamento}>
                          -
                      </div>
                  </div>
              </div>
            </div>
            <div className={styles.column}>
                <label>Plantonista(s) discente(s): </label>
                <textarea name="plantonistas" value={formData.plantonistas} onChange={handleChange}
                className="form-control"/>
                
            </div>
            <div className={styles.column}>
                <label>Médico(s) Veterinário(s) Responsável:</label>
                <textarea name="medicosResponsaveis" value={formData.medicosResponsaveis} onChange={handleChange} 
                className="form-control"/>
            </div>
           
          
          <div className={styles.button_box}>
            < VoltarWhiteButton onClick={prevStep}/>
            < FinalizarFichaModal onConfirm={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AtendimentoCardiologico;

