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
     handleSubmit
   }) {
   
     /* helpers para array de medicações ---------------------- */
     const handleMedChange = (idx, field, value) => {
       setFormData(prev => {
         const meds = [...prev.medicacoes];
         meds[idx][field] = value;
         return { ...prev, medicacoes: meds };
       });
     };
   
     const addLine = () =>
       setFormData(prev => ({
         ...prev,
         medicacoes: [
           ...prev.medicacoes,
           { medicacao: "", dose: "", frequencia: "", periodo: "" }
         ]
       }));
   
     const removeLine = (idx) =>
       setFormData(prev => ({
         ...prev,
         medicacoes: prev.medicacoes.filter((_, i) => i !== idx)
       }));
   
     /* ------------------------------------------------------- */
     return (
       <div className={styles.container}>
         <VoltarButton onClick={prevStep}/>
         <h1 className="text-center mb-4">Ficha Clínica Médica</h1>
   
         <div className="card shadow-sm">
           {/* ================= EXAME FÍSICO POR SISTEMA ================= */}
           <div className="card-body">
             <h2>Exame físico por sistema</h2>
             {FISICO_SISTEMA.map(sys => (
               <div key={sys.key} className="mb-3">
                 <label className="form-label fw-medium" htmlFor={sys.key}>
                   {sys.label}
                 </label>
                 <textarea
                   id={sys.key}
                   name={`fisicogeral.${sys.key}`}               /* dot-notation */
                   rows={4}
                   className="form-control bg-light"
                   placeholder="Descreva aqui..."
                   value={formData.fisicogeral?.[sys.key] || ""}
                   onChange={handleChange}
                 />
               </div>
             ))}
           </div>
   
           {/* ================= DIAGNÓSTICO & TRATAMENTO ================= */}
           <div className="card-body">
             <h2>Diagnóstico</h2>
   
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
                     className="form-control bg-light"
                     placeholder="Informe o peso em kg"
                     value={formData.diagnostico?.[field.key] || ""}
                     onChange={handleChange}
                   />
                 ) : (
                   <textarea
                     id={field.key}
                     rows={4}
                     name={`diagnostico.${field.key}`}
                     className="form-control bg-light"
                     placeholder="Descreva aqui..."
                     value={formData.diagnostico?.[field.key] || ""}
                     onChange={handleChange}
                   />
                 )}
               </div>
             ))}
   
             {/* ================= TABELA DE MEDICAÇÕES ================= */}
             <h2>Tratamento – Medicações</h2>
             <table className="table table-bordered">
               <thead className="table-light">
                 <tr>
                   <th>Medicação</th>
                   <th>Dose</th>
                   <th>Frequência</th>
                   <th>Período</th>
                   <th style={{ width: "1%" }}></th>
                 </tr>
               </thead>
               <tbody>
                 {formData.medicacoes.map((row, idx) => (
                   <tr key={idx}>
                     {["medicacao","dose","frequencia","periodo"].map(col => (
                       <td key={col}>
                         <input
                           type="text"
                           className="form-control"
                           value={row[col]}
                           onChange={(e) => handleMedChange(idx, col, e.target.value)}
                         />
                       </td>
                     ))}
                     <td className="text-center">
                       <button
                         type="button"
                         className="btn btn-sm btn-outline-danger"
                         onClick={() => removeLine(idx)}
                         disabled={formData.medicacoes.length === 1}
                       >
                         &times;
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
   
             <button
               type="button"
               className="btn btn-sm btn-outline-primary mb-3"
               onClick={addLine}
             >
               + Adicionar linha
             </button>
           </div>
   
           {/* ================= BOTÕES FINAIS ================= */}
           <div className={styles.button_box}>
                        <VoltarWhiteButton onClick={prevStep} />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
            </div>
         </div>
       </div>
     );
   }
   