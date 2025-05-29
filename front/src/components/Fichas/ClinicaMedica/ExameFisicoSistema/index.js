/* components/Fichas/ClinicaMedica/Step2ExamesEtc.jsx
   ────────────────────────────────────────────────── */
   import "bootstrap/dist/css/bootstrap.min.css";
   import styles from "./index.module.css";
   import VoltarButton from "../../../VoltarButton";
   import { VoltarWhiteButton } from "../../../WhiteButton";
   import FinalizarFichaModal from "../../FinalizarFichaModal";
   
   /* ---------- listas estáticas ---------- */
   const FISICO_SISTEMA = [
     { key: "respiratorio",   label: "Sistema respiratório (secreção, tosse, espirro, espirro reverso, cianose, dispneia, taquipnéia, respiração ruidosa)" },
     { key: "digestorio",     label: "Sistema digestório (apetite, vômito, regurgitação, diarréia, sialorréia)" },
     { key: "cardiovascular", label: "Sistema cardiovascular (intolerância à atividade física, tosse, sopro, síncope, taquipnéia, dispneia, ortopnéia, cianose)" },
     { key: "nefrourinario",  label: "Sistema nefrourinário (ingestão de água, aspecto, volume e frequência da urina, disúria, anúria, iscúria)" },
     { key: "pele",           label: "Pele e anexos (higiene, ectoparasitas, lesões, prurido, hipotricose, alopecia, descamação, ressecamento, untuosidade)" },
     { key: "ouvidos",        label: "Ouvidos (eritema, secreção, descamação, melanose, liquenificação, otalgia, meneios cefálicos, hiperplasia, estenose)" },
     { key: "neurologico",    label: "Sistema neurológico (dor, tremores, marcha, convulsão, síncope, alteração comportamental)" },
     { key: "locomotor",      label: "Sistema locomotor (claudicação, trauma, aumento de volume, impotência de membro)" },
     { key: "reprodutor",     label: "Sistema reprodutor (secreção, cio, anticoncepcional, prenhez, mamas)" },
     { key: "olhos",          label: "Olhos (secreção, olho vermelho, opacidades, blefaroespasmos, fotofobia, déficit visual)" },
     { key: "alteracoes",     label: "Alterações clínicas diversas" },
     { key: "suspeita",       label: "Suspeita(s) clínica(s)" }
   ];
   
   const DIAGNOSTICO = [
     { key: "diagnostico",  label: "Diagnóstico(s)" },
     { key: "observacoes",  label: "Observações"    },
     { key: "prognostico",  label: "Prognóstico"    },
     { key: "peso",         label: "Peso (kg)"      }
   ];
   
   export default function Step2ClinicaMedica({
     formData,
     setFormData,
     handleChange,
     prevStep,
     back,
     submit,
     handleSubmit,
     removerUltimaLinhaTratamento,
      adicionarLinhaTratamento,
      handleChangeTratamentos,
      medicacoes,

   }) {
     return (
       <div className={styles.container}>
         <VoltarButton onClick={prevStep}/>
         <h1>Ficha Clínica Médica</h1>
   
         <div className={styles.form_box}>
          <form onSubmit={handleSubmit} >
           {/* ================= EXAME FÍSICO POR SISTEMA ================= */}
           
           <div className={styles.column}>
            <h2>Exame físico por sistema</h2>
           <div className="card-body">
             {FISICO_SISTEMA.map(sys => (
               <div key={sys.key} className="mb-3">
                 <label className="form-label fw-medium" htmlFor={sys.key}>
                   {sys.label}
                 </label>
                 <textarea
                   id={sys.key}
                   name={`fisicogeral.${sys.key}`}               /* dot-notation */
                   rows={4}
                   className="form-control"
                   value={formData.fisicogeral?.[sys.key] || ""}
                   onChange={handleChange}
                 />
               </div>
             ))}
           </div>
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
           
   
           {/* ================= BOTÕES FINAIS ================= */}
           <div className={styles.button_box}>
                        <VoltarWhiteButton onClick={prevStep} />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
            </div>
          </form>
         </div>
       </div>
     );
   }
   