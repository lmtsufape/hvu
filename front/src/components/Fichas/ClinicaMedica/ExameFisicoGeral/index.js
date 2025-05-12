import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";

import VoltarButton                    from "@/components/VoltarButton";
import { CancelarWhiteButton }         from "@/components/WhiteButton";
import { ContinuarFichasGreenButton }  from "@/components/GreenButton";

/* listas de opções ----------------------------- */
const VACINAS = [
  "ANTI-RÁBICA", "GIARDIA", "LEISHMANIOSE",
  "POLIVALENTE", "TOSSE DOS CANIS", "POLIVALENTE FELINA"
];
const ALIMENTACAO_OPTS  = ["RAÇÃO", "DIETA CASEIRA", "RAÇÃO + DIETA CASEIRA"];
const POSTURAS          = ["ESTAÇÃO", "DECÚBITO", "CAVALETE", "OUTRAS"];
const SCORE_CORPORAL    = ["CAQUÉTICO", "MAGRO", "NORMAL", "SOBREPESO", "OBESO"];
const HIDRATACAO_OPTS   = ["NORMAL", "6 A 8%", "8 A 10%", "ACIMA DE 10%"];
const MUCOSAS_OPTS      = ["RÓSEAS", "RÓSEAS PÁLIDAS", "PORCELANAS",
                           "HIPERÊMICAS", "CIANÓTICAS", "ICTÉRICAS"];
const LINF_GERAIS       = ["S/A", "AUMENTADO", "DOLOROSO", "ADERIDO"];
const LINF_LOCAIS       = [
  "MANDIBULAR D","PRÉ-ESCAPULAR D","AXILAR D","INGUINAL D","POPLÍTEO D",
  "MANDIBULAR E","PRÉ-ESCAPULAR E","AXILAR E","INGUINAL E","POPLÍTEO E"
];

export default function Step1ClinicaMedica({
  formData,
  handleChange,
  handleCheckboxChange,
  nextStep       /* mesmo nome do cardiológico */
}) {

  /* apenas avança para o step 2 */
  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1 className="text-center mb-4">Ficha Clínica Médica – Anamnese</h1>

      <form onSubmit={handleSubmit} className="mb-5">

        {/* QUEIXA PRINCIPAL ------------------------------------------------- */}
        <div className="mb-3">
          <label className="form-label fw-medium">
            Queixa principal (evolução, tratamentos, resultados)
          </label>
          <input
            name="queixaPrincipal"
            value={formData.queixaPrincipal}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* HISTÓRICO MÉDICO PREGRESSO -------------------------------------- */}
        <h4 className="mt-4">Histórico médico pregresso</h4>

        {/* Vacinação */}
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

        {/* Vermifugação */}
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

        {/* Controle de ectoparasitas */}
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
        </fieldset>

        {/* EXAME FÍSICO GERAL --------------------------------------------- */}
        <h4 className="mt-4">Exame físico geral</h4>

        {/* Alimentação */}
        <div className="mb-3">
          <label className="form-label fw-medium">Alimentação</label><br/>
          {ALIMENTACAO_OPTS.map(opt => (
            <label key={opt} className="me-4">
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

        {/* Postura */}
        <div className="mb-3">
          <label className="form-label fw-medium">Postura</label><br/>
          {POSTURAS.map(opt => (
            <label key={opt} className="me-4">
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

        {/* Temperatura */}
        <div className="mb-3">
          <label className="form-label fw-medium">Temperatura (°C)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            className="form-control"
            name="ExameFisico.temperatura"
            value={formData.ExameFisico.temperatura || ""}
            onChange={handleChange}
          />
        </div>

        {/* Score corporal */}
        <div className="mb-3">
          <label className="form-label fw-medium">Score corporal</label><br/>
          {SCORE_CORPORAL.map(opt => (
            <label key={opt} className="me-4">
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

        {/* FC & FR */}
        <div className="row mb-3">
          <div className="col">
            <label>FC (BPM)
              <input
                type="number"
                className="form-control"
                name="ExameFisico.freqCardiaca"
                value={formData.ExameFisico.freqCardiaca || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="col">
            <label>FR (RPM)
              <input
                type="number"
                className="form-control"
                name="ExameFisico.freqRespiratoria"
                value={formData.ExameFisico.freqRespiratoria || ""}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {/* Hidratação + TPC */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label fw-medium">Hidratação</label><br/>
            {HIDRATACAO_OPTS.map(opt => (
              <label key={opt} className="me-3">
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
          <div className="col">
            <label>TPC (s)
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                name="ExameFisico.tpc"
                value={formData.ExameFisico.tpc || ""}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {/* Turgor */}
        <div className="mb-3">
          <label className="form-label fw-medium">Turgor cutâneo</label><br/>
          {["NORMAL","REDUZIDO"].map(opt => (
            <label key={opt} className="me-4">
              <input
                type="radio"
                name="ExameFisico.turgor"
                value={opt}
                checked={formData.ExameFisico.turgor === opt}
                onChange={handleChange}
              /> {opt}
            </label>
          ))}
        </div>

        {/* Mucosas */}
        <div className="mb-3">
          <label className="form-label fw-medium">Mucosas</label><br/>
          {MUCOSAS_OPTS.map(opt => (
            <label key={opt} className="me-3">
              <input
                type="radio"
                name="ExameFisico.mucosas"
                value={opt}
                checked={formData.ExameFisico.mucosas === opt}
                onChange={handleChange}
              /> {opt}
            </label>
          ))}
        </div>

        {/* Linfonodos */}
        <fieldset className="border p-3 mb-3">
          <legend className="w-auto px-2">Linfonodos</legend>

          {/* Geral */}
          <div className="mb-2">
            {LINF_GERAIS.map(opt => (
              <label key={opt} className="me-3">
                <input
                  type="radio"
                  name="ExameFisico.linfonodosGeral"
                  value={opt}
                  checked={formData.ExameFisico.linfonodosGeral === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>

          {/* Locais */}
          <div className="d-flex flex-wrap gap-3">
            {LINF_LOCAIS.map(loc => (
              <label key={loc}>
                <input
                  type="checkbox"
                  value={loc}
                  checked={formData.ExameFisico.linfonodosLocal.includes(loc)}
                  onChange={(e) =>
                    handleCheckboxChange(e,"ExameFisico.linfonodosLocal")
                  }
                /> {loc}
              </label>
            ))}
          </div>
        </fieldset>

        {/* BOTÕES ---------------------------------------------------------- */}
        <div className={styles.button_box}>
          <CancelarWhiteButton />
          <ContinuarFichasGreenButton type="submit" />
        </div>

      </form>
    </div>
  );
}
