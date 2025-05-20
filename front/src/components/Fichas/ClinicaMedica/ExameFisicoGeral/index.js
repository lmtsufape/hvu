import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";

import VoltarButton                    from "@/components/VoltarButton";
import { CancelarWhiteButton }         from "@/components/WhiteButton";
import { ContinuarFichasGreenButton }  from "@/components/GreenButton";

/* listas de opções ----------------------------- */

const ALIMENTACAO_OPTS  = [" RAÇÃO", " DIETA CASEIRA", " RAÇÃO + DIETA CASEIRA"];
const POSTURAS          = [" ESTAÇÃO", " DECÚBITO", " CAVALETE", " OUTRAS"];
const CONCIENCIA        = [" ALERTA", " Deprimido", " Excitado", " Ausente (COMA)"];
const SCORE_CORPORAL    = [" CAQUÉTICO", " MAGRO", " NORMAL", " SOBREPESO", " OBESO"];
const HIDRATACAO_OPTS   = [" NORMAL", " 6 A 8%", " 8 A 10%", " ACIMA DE 10%"];

export default function Step1ClinicaMedica({
  formData,
  handleChange,
  nextStep,       /* mesmo nome do cardiológico */
  handleCheckboxChangeVacinacao,
  handleCheckboxChangeMucosas, 
  handleLocationChange,
  handleLinfonodoChange,
  handleCaracteristicaChange,
  handleChangeSelect
  
}) {
   const linfonodos = [
    { value: "mandibularD", label: "Mandibular D" },
    { value: "mandibularE", label: "Mandibular E" },
    { value: "cervicalSuperiorD", label: "Cervical superior D" },
    { value: "cervicalSuperiorE", label: "Cervical superior E" },
    { value: "axilarD", label: "Axilar D" },
    { value: "axilarE", label: "Axilar E" },
    { value: "inguinalD", label: "Inguinal D" },
    { value: "inguinalE", label: "Inguinal E" },
    { value: "popliteoD", label: "Poplíteo D" },
    { value: "popliteoE", label: "Poplíteo E" }
  ];

  const caracteristicas = [
    { value: "sa", label: "S/A" },
    { value: "aumentado", label: "Aumentado" },
    { value: "doloroso", label: "Doloroso" },
    { value: "aderido", label: "Aderido" },
    { value: "naoAvaliado", label: "Não avaliado" }
  ];

  /* apenas avança para o step 2 */
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha Clínica Médica</h1>
      <div className={styles.form_box}>
      <form onSubmit={handleSubmit} >
        <h2>Anamnese</h2>

        {/* QUEIXA PRINCIPAL ------------------------------------------------- */}
        
          <div className={styles.column}>
            <div className="mb-3">
              <label className="form-label fw-medium">
                Queixa principal (evolução, tratamentos, resultados)
              </label>
              <textarea
                name="queixaPrincipal"
                value={formData.queixaPrincipal}
                onChange={handleChange}
                className="form-control bg-light"
                placeholder="Descreva aqui..."
                rows={4}
                style={{ 
                  textAlign: 'left', 
                  padding: '10px'
                }}
              />
            </div>
          </div>
            
          <div className={styles.column}>
            <div className="mb-3">
              <label className="form-label fw-medium">
                Histórico médico pregresso
              </label>
              <textarea
                name="HistoricoMedico.progresso"
                value={formData.HistoricoMedico.progresso}
                onChange={handleChange}
                className="form-control bg-light"
                placeholder="Descreva aqui..."
                rows={4}
                style={{ 
                  textAlign: 'left', 
                  padding: '10px'
                }}
              />
            </div>
          </div>
        {/* HISTÓRICO MÉDICO PREGRESSO -------------------------------------- 
        <h4 className="mt-4">Histórico médico pregresso</h4>

        
        <fieldset className="border p-3 mb-3">
          <legend className="w-auto px-2">Vacinação</legend>

          {["não","sim"].map(opt => (
            <label key={opt} className="me-4">
              <input
                type="radio"
                name="HistoricoMedico.vacinação"
                value={opt}
                checked={formData.HistoricoMedico.vacinação === opt}
                onChange={handleChange}
              /> {opt.toUpperCase()}
            </label>
          ))}

          {formData.HistoricoMedico.vacinação === "sim" && (
            <div className="d-flex flex-wrap gap-3 mt-2">
              {VACINAS.map(v => (
                <label key={v} className="form-check">
                  <input
                    type="checkbox"
                    value={v}
                    checked={formData.HistoricoMedico.vacinasSelecionadas.includes(v)}
                    onChange={(e) =>
                      handleCheckboxChange(e,"HistoricoMedico.vacinasSelecionadas")
                    }
                    className="form-check-input"
                  /> {v}
                </label>
              ))}
            </div>
          )}
        </fieldset>

       
        <fieldset className="border p-3 mb-3">
          <legend className="w-auto px-2">Vermifugação</legend>

          {["não","sim"].map(opt => (
            <label key={opt} className="me-4">
              <input
                type="radio"
                name="HistoricoMedico.vermifugação"
                value={opt}
                checked={formData.HistoricoMedico.vermifugação === opt}
                onChange={handleChange}
              /> {opt.toUpperCase()}
            </label>
          ))}

          {formData.HistoricoMedico.vermifugação === "sim" && (
            <>
              <div className="mt-3">
                <label>Produto
                  <input
                    className="form-control"
                    name="HistoricoMedico.produtoVermifugação"
                    value={formData.HistoricoMedico.produtoVermifugação}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="mt-3">
                <label>Data
                  <input
                    type="date"
                    className="form-control"
                    name="HistoricoMedico.dataVermifugação"
                    value={formData.HistoricoMedico.dataVermifugação || ""}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </>
          )}
        </fieldset>

        
        <fieldset className="border p-3 mb-3">
          <legend className="w-auto px-2">Controle de ectoparasitas</legend>

          {["não","sim"].map(opt => (
            <label key={opt} className="me-4">
              <input
                type="radio"
                name="HistoricoMedico.ectoparasitas"
                value={opt}
                checked={formData.HistoricoMedico.ectoparasitas === opt}
                onChange={handleChange}
              /> {opt.toUpperCase()}
            </label>
          ))}

          {formData.HistoricoMedico.ectoparasitas === "sim" && (
            <>
              <div className="mt-3">
                <label>Produto
                  <input
                    className="form-control"
                    name="HistoricoMedico.produtoEctoparasitas"
                    value={formData.HistoricoMedico.produtoEctoparasitas}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="mt-3">
                <label>Data
                  <input
                    type="date"
                    className="form-control"
                    name="HistoricoMedico.dataEctoparasitas"
                    value={formData.HistoricoMedico.dataEctoparasitas || ""}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </>
          )}
        </fieldset>*/}

        <div className={styles.column}>
            <label className={styles.column}>vacinação</label>
        </div>
          
          <p>Produto e data de aplicação:</p>
            <div className={styles.checkbox_container}>
              {Object.keys(formData.opc).map((opc) => (
              <div key={opc}>
                  <label>
                  <input
                      type="checkbox"
                      name={opc}
                      checked={formData.opc[opc]}
                      onChange={handleCheckboxChangeVacinacao}
                  />
                  {opc === "antiRabica" && "anti-Rábica"}
                  {opc === "giardia" && "Giardia"}
                  {opc === "leishmaniose" && "Leishmaniose"}
                  {opc === "tosseDosCanis" && "Tose dos Canis"}
                  {opc === "polivalenteCanina" && "Polivalente Canina"}
                  {opc === "polivalenteFelina" && "Polivalente Felina"}
                  {opc === "outros" && "Outros"}
                  {opc === "naoInformado" && "Não informados"}
                  {opc === "naoVacinado" && "Não vacinado"}

               
                  </label>
                  {formData.opc[opc] && (
                  <div className={styles.location_input}>
                      <input
                      type="text"
                      name={opc}
                      value={formData.vacinacao[opc]}
                      onChange={handleLocationChange}
                      placeholder="Digite os dados da aplicação"
                      />
                  </div>
                  )}
              </div>
              ))}
          </div>

          <div className={styles.box}>
            <div className={styles.column}>
              <label>Controle de ectoparasitos:
                <select name="ectoparasitosDetalhes.ectoparasitos" value={formData.ectoparasitosDetalhes.ectoparasitos} onChange={handleChange}>
                    <option value="">Selecione</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                    
                </select>
              </label>
              {formData.ectoparasitosDetalhes.ectoparasitos === 'Sim' && (
              <div>
                <label>
                  Produto:
                  <input
                    type="text"
                    name="ectoparasitosDetalhes.produto"
                    value={formData.ectoparasitosDetalhes.produto}
                    onChange={handleChange}
                    placeholder="Digite o nome do produto"
                  />
                </label>
              
                <label>
                  Data da Vermifugação:
                  <input
                    type="date"
                    name="ectoparasitosDetalhes.data"
                    value={formData.ectoparasitosDetalhes.data}
                    onChange={handleChange}
                  />
                </label>
              </div>
              )}
            </div>
            <div className={styles.column}>
              <label>Vermifugação:
                <select name="vermifugacaoDetalhes.vermifugacao" value={formData.vermifugacaoDetalhes.vermifugacao} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </label>
              {formData.vermifugacaoDetalhes.vermifugacao === 'Sim' && (
              <div>
                <label>
                  Produto:
                  <input
                    type="text"
                    name="vermifugacaoDetalhes.produto"
                    value={formData.vermifugacaoDetalhes.produto}
                    onChange={handleChange}
                    placeholder="Digite o nome do produto"
                  />
                </label>
                <label >
                  Data da Vermifugação:
                  <input
                    type="date"
                    name="vermifugacaoDetalhes.data"
                    value={formData.vermifugacaoDetalhes.data}
                    onChange={handleChange}
                  />
                </label>

                </div>
              )}
            </div>
          </div>
          <div className={styles.column}>
              <label>Observações:
                <input type="text" name="observacoes" value={formData.observacoes} onChange={handleChange} 
                  className="form-control bg-light"
                  placeholder="Descreva aqui..."/>
              </label>
          </div>

          {/* Alimentação */}
        
        
          <label>Alimentação</label>
          <div className={styles.checkbox_container}>
          {ALIMENTACAO_OPTS.map(opt => (
            <label key={opt} >
              <input
                type="radio"
                name="ExameFisico.alimentacao"
                value={opt}
                checked={formData.ExameFisico.alimentacao === opt}
                onChange={handleChange}
              /> {opt}
            </label>
          ))}
        
        </div>
         
          

        {/* EXAME FÍSICO GERAL --------------------------------------------- */}
        <h2>Exame físico geral</h2>

        

        {/* Postura */}
        
          <label>Postura</label><br/>
          <div className={styles.checkbox_container}>
            {POSTURAS.map(opt => (
              <label key={opt} >
                <input
                  type="radio"
                  name="ExameFisico.postura"
                  value={opt}
                  checked={formData.ExameFisico.postura === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>
        

         {/* Nivel de consciencia */}
        
          <label>Nível de consciência</label><br/>
          <div className={styles.checkbox_container}>
            {CONCIENCIA.map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name="ExameFisico.nivelConsciencia"
                  value={opt}
                  checked={formData.ExameFisico.nivelConsciencia === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>
        

        {/* Score corporal */}
        <label>Score corporal</label><br/>
          <div className={styles.checkbox_container}>
            {SCORE_CORPORAL.map(opt => (
              <label key={opt} >
                <input
                  type="radio"
                  name="ExameFisico.score"
                  value={opt}
                  checked={formData.ExameFisico.score === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
              
            ))}
          </div>
        

        {/* Hidratação + TPC */}
          
            <label>Hidratação</label><br/>
              <div className={styles.checkbox_container}>
              {HIDRATACAO_OPTS.map(opt => (
                <label key={opt} >
                  <input
                    type="radio"
                    name="ExameFisico.hidratacao"
                    value={opt}
                    checked={formData.ExameFisico.hidratacao === opt}
                    onChange={handleChange}
                  /> {opt}
                </label>
              ))}
            </div>
          
        {/* Temperatura */}
        
          <label>Temperatura (°C)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            className="form-control form-control bg-light"
            name="ExameFisico.temperatura"
            value={formData.ExameFisico.temperatura || ""}
            onChange={handleChange}
            placeholder="Descreva aqui..."
            style={{ 
              width: '200px'
            }}
          />
        
        <div className={styles.box}>
         <div className={styles.column}>
              <label>Frequência cardíaca (BPM):
                <input type="text" name="FreqCardiaca" value={formData.freqCardiaca} onChange={handleChange} 
                  className="form-control bg-light"
                  placeholder="Descreva aqui..."/>
              </label>
          </div>
           <div className={styles.column}>
              <label>Frequência Respiratória (RPM):
                <input type="text" name="freqRespiratoria" value={formData.freqRespiratoria} onChange={handleChange} 
                  className="form-control bg-light"
                  placeholder="Descreva aqui..."/>
              </label>
          </div>
         <div className={styles.column}>            
          <label htmlFor="turgorCutaneo">turgor Cutâneo:</label>
          <select
            id="turgorCutaneo"
            name="turgorCutaneo"
            value={formData.turgorCutaneo}
            onChange={handleChangeSelect}
            >
            <option value="">Selecione</option>
            <option value="Normal">Normal</option>
            <option value="Reduzido">Reduzido</option>
              
          </select>
          </div>
          <div className={styles.column}>
          <label htmlFor="tpc">TPC:</label>
          <select
              id="tpc"
              name="tpc"
              value={formData.tpc}
              onChange={handleChangeSelect}
          >
              <option value="">Selecione</option>
              <option value="2 segundos">2 segundos</option>
              <option value="2-4 segundos">2-4 segundos</option>
              <option value="> 5 segundos">menor que 5 segundos</option>
          </select>
          </div>
        </div>
        
         <div className={styles.column}>
            <label>Mucosas</label>
          </div>
          <div>
          <p>Localização (oculopalpebral, nasal, bucal, vulvar, prepúcial ou anal)</p>
            <div className={styles.checkbox_container}>
              {Object.keys(formData.options).map((option) => (
              <div key={option}>
                  <label>
                  <input
                      type="checkbox"
                      name={option}
                      checked={formData.options[option]}
                      onChange={handleCheckboxChangeMucosas}
                  />
                  {option === "roseas" && "Róseas"}
                  {option === "roseasPalidas" && "Róseas pálidas"}
                  {option === "porcelanicas" && "Porcelânicas"}
                  {option === "hiperemicas" && "Hiperêmicas"}
                  {option === "cianoticas" && "Cianóticas"}
                  {option === "ictaricas" && "Ictéricas"}
                  {option === "naoAvaliado" && "Não avaliado"}
                  </label>
                  {formData.options[option] && (
                  <div className={styles.location_input}>
                      <input
                      type="text"
                      name={option}
                      value={formData.mucosas[option]}
                      onChange={handleLocationChange}
                      placeholder="Digite a localização"
                      />
                  </div>
                  )}
              </div>
              ))}
          </div>
          </div>
          <div>
          <div className={styles.column}>
          <label>Linfonodos</label>
          </div>
          <div className={styles.checkbox_container}>
              {linfonodos.map((linfonodo) => (
              <div key={linfonodo.value}>
                  <label>
                  <input
                      type="checkbox"
                      name={linfonodo.value}
                      checked={linfonodo.value in formData.linfonodos}
                      onChange={(e) => handleLinfonodoChange(e, linfonodo.value)}
                  />
              
                  {linfonodo.label}
                  </label>
                  
                  {formData.linfonodos[linfonodo.value] && (
                  <div>
                      {caracteristicas.map((caracteristica) => (
                      <label key={caracteristica.value}>
                          <input
                          type="checkbox"
                          name={caracteristica.value}
                          checked={formData.linfonodos[linfonodo.value]?.includes(caracteristica.value) || false}
                          onChange={(e) => handleCaracteristicaChange(e, linfonodo.value)}
                          />
                          {caracteristica.label}
                      </label>
                      ))}
                  </div>
                  )}
              </div>
              ))}
          </div>
        </div>
        

        {/* BOTÕES ---------------------------------------------------------- */}
        <div className={styles.button_box}>
          <CancelarWhiteButton />
          <ContinuarFichasGreenButton type="submit" />
        </div>

      </form>
      </div>
    </div>
  );
}
