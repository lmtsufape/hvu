import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

const POSTURAS          = [" ESTAÇÃO", " DECÚBITO", " CAVALETE", " OUTRAS"];
const CONCIENCIA        = [" ALERTA", " Deprimido", " Excitado", " Ausente (COMA)"];
const SCORE_CORPORAL    = [" CAQUÉTICO", " MAGRO", " NORMAL", " SOBREPESO", " OBESO"];
const HIDRATACAO_OPTS   = [" NORMAL", " 6 A 8%", " 8 A 10%", " ACIMA DE 10%"];

function AtendimentoCardiologico({
    formData, 
    handleChange, 
    nextStep, 
    handleCheckboxChangeMucosas,
    handleLinfonodoChange,
    handleCaracteristicaChange,
    handleChangeAtualizaSelect,
    handleMucosaLocationChange,
    cleanLocalStorage
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
    const handleSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha clínico médica de retorno</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
          <h2>Anamnese</h2>
          
          <div className={styles.column}>
            <label className="form-label fw-medium">Postura</label>
          </div>
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

          <div className={styles.column}>
            <label className="form-label fw-medium">Nível de consciência</label>
          </div>
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

          <div className={styles.column}>
            <label className="form-label fw-medium">Score corporal</label>
          </div>
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

          <div className={styles.column}>
            <label className="form-label fw-medium">Temperatura (°C)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="ExameFisico.temperatura"
              value={formData.ExameFisico.temperatura || ""}
              onChange={handleChange}
              className="form-control"/>
          </div>

          <div className={styles.column}>
            <label className="form-label fw-medium">Grau de Desidratação:</label>
          </div>
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
            
          <div className={styles.column}>
            <label className="form-label fw-medium">Narinas/Traqueia/Tireóide </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="ExameFisico.narinasEOutros"
              value={formData.ExameFisico.narinasEOutros || ""}
              onChange={handleChange}
              className="form-control"/>
          </div>
          <div className={styles.column}>
            <label className="form-label fw-medium">Abdomem </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="ExameFisico.abdomem"
              value={formData.ExameFisico.abdomem || ""}
              onChange={handleChange}
              className="form-control"/>
          </div>

          <div className={styles.box}>
            <div className={styles.column}>
                <label className="form-label fw-medium">ACP
                  <input type="text" name="acp" value={formData.ExameFisico.acp} onChange={handleChange} 
                    />
                </label>
            </div>
            <div className={styles.column}>
                <label className="form-label fw-medium">Pulso arterial
                  <input type="text" name="pulsoArterial" value={formData.ExameFisico.pulsoArterial} onChange={handleChange} 
                    />
                </label>
            </div>
            <div className={styles.column}>
                <label className="form-label fw-medium">Frequência cardíaca (BPM)
                  <input type="text" name="freqCardiaca" value={formData.ExameFisico.freqCardiaca} onChange={handleChange} 
                    />
                </label>
            </div>
            <div className={styles.column}>
                <label className="form-label fw-medium">Frequência Respiratória (RPM)
                  <input type="text" name="freqRespiratoria" value={formData.ExameFisico.freqRespiratoria} onChange={handleChange} 
                    />
                </label>
            </div>
            <div className={styles.column}>            
            <label htmlFor="turgorCutaneo" className="form-label fw-medium">turgor Cutâneo</label>
            <select
              id="turgorCutaneo"
              name="turgorCutaneo"
              value={formData.ExameFisico.turgorCutaneo}
              onChange={handleChangeAtualizaSelect}
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
                value={formData.ExameFisico.tpc}
                onChange={handleChangeAtualizaSelect}
            >
                <option value="">Selecione</option>
                <option value="2 segundos">2 segundos</option>
                <option value="2-4 segundos">2-4 segundos</option>
                <option value="> 5 segundos">menor que 5 segundos</option>
            </select>
            </div>
          </div>

          <div className="row fw-medium mb-2">
            <div className="col-3 mb-3 mt-4">Mucosas</div>
            <div className="col mt-4 mb-3">
              Localização (oculopalpebral, nasal, bucal, vulvar, prepucial ou anal)
            </div>
            
              <div >
                {Object.keys(formData.option).map((option) => (
                <div key={option} className="row align-items-start mb-2" >
                    <div className="col-3">
                      <label className="d-flex align-items-center">
                      <input
                          type="checkbox"
                          name={option}
                          checked={formData.option[option]}
                          onChange={handleCheckboxChangeMucosas}
                          className="me-2"
                      />
                      {option === "roseas" && "Róseas"}
                      {option === "roseasPalidas" && "Róseas-pálidas"}
                      {option === "porcelanicas" && "Porcelânicas"}
                      {option === "hiperemicas" && "Hiperêmicas"}
                      {option === "cianoticas" && "Cianóticas"}
                      {option === "ictaricas" && "Ictéricas"}
                      {option === "naoAvaliado" && "Não-avaliado"}
                      </label>
                    </div>
                    
                    <div className="col">
                      <input
                      type="text"
                      className="form-control"
                      name={option}
                      value={formData.mucosas[option]}
                      onChange={handleMucosaLocationChange}
                      disabled={!formData.option[option]}
                      />
                    </div>
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

          <div className={styles.button_box}>
            <CancelarWhiteButton onClick={cleanLocalStorage}/>
            <ContinuarFichasGreenButton type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AtendimentoCardiologico;
