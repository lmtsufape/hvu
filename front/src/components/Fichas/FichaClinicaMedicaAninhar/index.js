import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import moment from "moment";
import { getCurrentUsuario } from "../../../../services/userService";

function FichaClinicaMedicaAninhar({ formData, setFormData }) {
  const ALIMENTACAO_OPTS = ["RAÇÃO", "DIETA CASEIRA", "RAÇÃO + DIETA CASEIRA"];
  const POSTURAS = ["ESTAÇÃO", "DECÚBITO", "CAVALETE", "OUTRAS"];
  const CONCIENCIA = ["ALERTA", "Deprimido", "Excitado", "Ausente (COMA)"];
  const SCORE_CORPORAL = ["CAQUÉTICO", "MAGRO", "NORMAL", "SOBREPESO", "OBESO"];
  const HIDRATACAO_OPTS = ["NORMAL", "6 A 8%", "8 A 10%", "ACIMA DE 10%"];
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
    { value: "popliteoE", label: "Poplíteo E" },
  ];
  const caracteristicas = [
    { value: "sa", label: "S/A" },
    { value: "aumentado", label: "Aumentado" },
    { value: "doloroso", label: "Doloroso" },
    { value: "aderido", label: "Aderido" },
    { value: "naoAvaliado", label: "Não avaliado" },
  ];
  const FISICO_SISTEMA = [
    { key: "respiratorio", label: "Sistema respiratório (secreção, tosse, espirro, espirro reverso, cianose, dispneia, taquipnéia, respiração ruidosa)" },
    { key: "digestorio", label: "Sistema digestório (apetite, vômito, regurgitação, diarréia, sialorréia)" },
    { key: "cardiovascular", label: "Sistema cardiovascular (intolerância à atividade física, tosse, sopro, síncope, taquipnéia, dispneia, ortopnéia, cianose)" },
    { key: "nefrourinario", label: "Sistema nefrourinário (ingestão de água, aspecto, volume e frequência da urina, disúria, anúria, iscúria)" },
    { key: "pele", label: "Pele e anexos (higiene, ectoparasitas, lesões, prurido, hipotricose, alopecia, descamação, ressecamento, untuosidade)" },
    { key: "ouvidos", label: "Ouvidos (eritema, secreção, descamação, melanose, liquenificação, otalgia, meneios cefálicos, hiperplasia, estenose)" },
    { key: "neurologico", label: "Sistema neurológico (dor, tremores, marcha, convulsão, síncope, alteração comportamental)" },
    { key: "locomotor", label: "Sistema locomotor (claudicação, trauma, aumento de volume, impotência de membro)" },
    { key: "reprodutor", label: "Sistema reprodutor (secreção, cio, anticoncepcional, prenhez, mamas)" },
    { key: "olhos", label: "Olhos (secreção, olho vermelho, opacidades, blefaroespasmos, fotofobia, déficit visual)" },
    { key: "alteracoes", label: "Alterações clínicas diversas" },
    { key: "suspeita", label: "Suspeita(s) clínica(s)" },
  ];
  const DIAGNOSTICO = [
    { key: "diagnostico", label: "Diagnóstico(s)" },
    { key: "observacoes", label: "Observações" },
    { key: "prognostico", label: "Prognóstico" },
    { key: "peso", label: "Peso (kg)" },
  ];

  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") ?? "");
      setRoles(JSON.parse(localStorage.getItem("roles") ?? "[]"));
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await getCurrentUsuario();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) return <p>Carregando…</p>;
  if (!token) return <p>Acesso negado – faça login.</p>;
  if (!roles.includes("medico")) return <p>Acesso negado – sem permissão.</p>;

  const handleChange = ({ target: { name, value } }) => {
    const path = name.split(".");
    setFormData((prev) => {
      const clone = structuredClone(prev);
      let ref = clone.FichaClinicaMedica;
      for (let i = 0; i < path.length - 1; i++) {
        if (!ref[path[i]]) ref[path[i]] = {};
        ref = ref[path[i]];
      }
      ref[path.at(-1)] = value;
      return clone;
    });
  };

  const handleChangeAtualizaSelect = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      FichaClinicaMedica: {
        ...prev.FichaClinicaMedica,
        [name]: value,
      },
    }));
  };

  const handleLinfonodoChange = (e, linfonodo) => {
    const { checked } = e.target;
    setFormData((prev) => {
      const updatedLinfonodos = { ...prev.FichaClinicaMedica.linfonodos };
      if (checked) {
        updatedLinfonodos[linfonodo] = [];
      } else {
        delete updatedLinfonodos[linfonodo];
      }
      return {
        ...prev,
        FichaClinicaMedica: {
          ...prev.FichaClinicaMedica,
          linfonodos: updatedLinfonodos,
        },
      };
    });
  };

  const handleCaracteristicaChange = (e, linfonodo) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      FichaClinicaMedica: {
        ...prev.FichaClinicaMedica,
        linfonodos: {
          ...prev.FichaClinicaMedica.linfonodos,
          [linfonodo]: checked
            ? [...prev.FichaClinicaMedica.linfonodos[linfonodo], name]
            : prev.FichaClinicaMedica.linfonodos[linfonodo].filter((item) => item !== name),
        },
      },
    }));
  };

  const handleCheckboxChangeMucosas = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      FichaClinicaMedica: {
        ...prev.FichaClinicaMedica,
        option: {
          ...prev.FichaClinicaMedica.option,
          [name]: checked,
        },
      },
    }));
  };

  const handleCheckboxChangeVacinacao = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      FichaClinicaMedica: {
        ...prev.FichaClinicaMedica,
        opc: {
          ...prev.FichaClinicaMedica.opc,
          [name]: checked,
        },
      },
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      FichaClinicaMedica: {
        ...prev.FichaClinicaMedica,
        vacinacao: {
          ...prev.FichaClinicaMedica.vacinacao,
          [name]: value,
        },
      },
    }));
  };

  const handleMucosaLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      FichaClinicaMedica: {
        ...prev.FichaClinicaMedica,
        mucosas: {
          ...prev.FichaClinicaMedica.mucosas,
          [name]: value,
        },
      },
    }));
  };

  const handleChangeTratamentos = (index, campo, valor) => {
    setFormData((prev) => {
      const novosTratamentos = [...prev.FichaClinicaMedica.medicacoes];
      novosTratamentos[index][campo] = valor;
      return {
        ...prev,
        FichaClinicaMedica: {
          ...prev.FichaClinicaMedica,
          medicacoes: novosTratamentos,
        },
      };
    });
  };

  const adicionarLinhaTratamento = () => {
    setFormData((prev) => ({
      ...prev,
      FichaClinicaMedica: {
        ...prev.FichaClinicaMedica,
        medicacoes: [
          ...prev.FichaClinicaMedica.medicacoes,
          { medicacao: "", dose: "", frequencia: "", periodo: "" },
        ],
      },
    }));
  };

  const removerUltimaLinhaTratamento = () => {
    setFormData((prev) => {
      const tratamentos = prev.FichaClinicaMedica.medicacoes;
      if (tratamentos.length > 1) {
        return {
          ...prev,
          FichaClinicaMedica: {
            ...prev.FichaClinicaMedica,
            medicacoes: tratamentos.slice(0, -1),
          },
        };
      }
      return prev;
    });
  };

  // O restante do JSX permanece o mesmo, apenas certifique-se de usar `formData` (prop) em vez do estado local
  return (
    <div className={styles.form_box}>
      <h2>Anamnese</h2>
      <div className={styles.checkbox_container}>
        <div className="mb-3">
          <label className="form-label fw-medium">Queixa principal (evolução, tratamentos, resultados)</label>
          <textarea
            name="queixaPrincipal"
            value={formData.queixaPrincipal || ""}
            onChange={handleChange}
            rows={4}
            className="form-control"
            style={{ textAlign: "left", padding: "10px" }}
          />
        </div>
      </div>
      <div className={styles.column}>
        <div className="mb-3">
          <label className="form-label fw-medium">Histórico médico pregresso</label>
          <textarea
            name="HistoricoMedico.progresso"
            value={formData.HistoricoMedico?.progresso || ""}
            onChange={handleChange}
            rows={4}
            className="form-control"
            style={{ textAlign: "left", padding: "10px" }}
          />
        </div>
      </div>

      <div className="row fw-medium mb-2">
        <div className="col-3 mb-3 mt-4">Vacinação</div>
        <div className="col mt-4 mb-3">Produto e data de aplicação:</div>
        {(formData.opc && typeof formData.opc === "object" ? Object.keys(formData.opc) : []).map((opc) => (
          <div key={opc} className="row align-items-start mb-2">
            <div className="col-3">
              <label className="d-flex align-items-center">
                <input
                  type="checkbox"
                  name={opc}
                  checked={formData.opc[opc] || false}
                  onChange={handleCheckboxChangeVacinacao}
                  className="me-2"
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
            </div>
            <div className="col">
              <input
                type="text"
                name={opc}
                value={formData.vacinacao[opc] || ""}
                onChange={handleLocationChange}
                disabled={!formData.opc[opc]}
                className="form-control"
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.box}>
        <div className={styles.column}>
          <label className="form-label fw-medium">
            Controle de ectoparasitas:
            <select
              name="ectoparasitosDetalhes.ectoparasitos"
              value={formData.ectoparasitosDetalhes?.ectoparasitos || ""}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </label>
          {formData.ectoparasitosDetalhes?.ectoparasitos === "Sim" && (
            <div>
              <label className="form-label fw-medium">
                Produto:
                <input
                  type="text"
                  name="ectoparasitosDetalhes.produto"
                  value={formData.ectoparasitosDetalhes?.produto || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
              <label className="form-label fw-medium">
                Data:
                <input
                  type="date"
                  name="ectoparasitosDetalhes.data"
                  value={formData.ectoparasitosDetalhes?.data || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
            </div>
          )}
        </div>
        <div className={styles.column}>
          <label className="form-label fw-medium">
            Vermifugação:
            <select
              name="vermifugacaoDetalhes.vermifugacao"
              value={formData.vermifugacaoDetalhes?.vermifugacao || ""}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </label>
          {formData.vermifugacaoDetalhes?.vermifugacao === "Sim" && (
            <div>
              <label className="form-label fw-medium">
                Produto:
                <input
                  type="text"
                  name="vermifugacaoDetalhes.produto"
                  value={formData.vermifugacaoDetalhes?.produto || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
              <label className="form-label fw-medium">
                Data:
                <input
                  type="date"
                  name="vermifugacaoDetalhes.data"
                  value={formData.vermifugacaoDetalhes?.data || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </label>
            </div>
          )}
        </div>
      </div>
      <div className={styles.column}>
        <label className="form-label fw-medium">
          Observações:
          <input
            type="text"
            name="observacoes"
            value={formData.observacoes || ""}
            onChange={handleChange}
            className="form-control"
          />
        </label>
      </div>

      <h2>Exame físico geral</h2>
      <div className={styles.column}>
        <label className="form-label fw-medium">Alimentação</label>
        <div className={styles.checkbox_container}>
          {ALIMENTACAO_OPTS.map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="ExameFisico.alimentacao"
                value={opt}
                checked={formData.ExameFisico?.alimentacao === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <label className="form-label fw-medium">Postura</label>
        <div className={styles.checkbox_container}>
          {POSTURAS.map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="ExameFisico.postura"
                value={opt}
                checked={formData.ExameFisico?.postura === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <label className="form-label fw-medium">Nível de consciência</label>
        <div className={styles.checkbox_container}>
          {CONCIENCIA.map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="ExameFisico.nivelConsciencia"
                value={opt}
                checked={formData.ExameFisico?.nivelConsciencia === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <label className="form-label fw-medium">Score corporal</label>
        <div className={styles.checkbox_container}>
          {SCORE_CORPORAL.map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="ExameFisico.score"
                value={opt}
                checked={formData.ExameFisico?.score === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <label className="form-label fw-medium">Hidratação</label>
        <div className={styles.checkbox_container}>
          {HIDRATACAO_OPTS.map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="ExameFisico.hidratacao"
                value={opt}
                checked={formData.ExameFisico?.hidratacao === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <label className="form-label fw-medium">Temperatura (°C)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          name="ExameFisico.temperatura"
          value={formData.ExameFisico?.temperatura || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className={styles.box}>
        <div className={styles.column}>
          <label className="form-label fw-medium">Frequência cardíaca (BPM):</label>
          <input
            type="text"
            name="freqCardiaca"
            value={formData.freqCardiaca || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className={styles.column}>
          <label className="form-label fw-medium">Frequência Respiratória (RPM):</label>
          <input
            type="text"
            name="freqRespiratoria"
            value={formData.freqRespiratoria || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className={styles.column}>
          <label className="form-label fw-medium">Turgor Cutâneo:</label>
          <select
            name="turgorCutaneo"
            value={formData.turgorCutaneo || ""}
            onChange={handleChangeAtualizaSelect}
            className="form-control"
          >
            <option value="">Selecione</option>
            <option value="Normal">Normal</option>
            <option value="Reduzido">Reduzido</option>
          </select>
        </div>
        <div className={styles.column}>
          <label className="form-label fw-medium">TPC:</label>
          <select
            name="tpc"
            value={formData.tpc || ""}
            onChange={handleChangeAtualizaSelect}
            className="form-control"
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
        <div className="col mt-4 mb-3">Localização (oculopalpebral, nasal, bucal, vulvar, prepucial ou anal)</div>
        {(formData.option && typeof formData.option === "object" ? Object.keys(formData.option) : []).map((option) => (
          <div key={option} className="row align-items-start mb-2">
            <div className="col-3">
              <label className="d-flex align-items-center">
                <input
                  type="checkbox"
                  name={option}
                  checked={formData.option[option] || false}
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
                name={option}
                value={formData.mucosas[option] || ""}
                onChange={handleMucosaLocationChange}
                disabled={!formData.option[option]}
                className="form-control"
              />
            </div>
          </div>
        ))}
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
                  checked={linfonodo.value in (formData.linfonodos || {})}
                  onChange={(e) => handleLinfonodoChange(e, linfonodo.value)}
                />
                {linfonodo.label}
              </label>
              {formData.linfonodos && formData.linfonodos[linfonodo.value] && (
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

      <h2>Exame físico por sistema</h2>
      <div className="card-body">
        {FISICO_SISTEMA.map((sys) => (
          <div key={sys.key} className="mb-3">
            <label className="form-label fw-medium" htmlFor={sys.key}>
              {sys.label}
            </label>
            <textarea
              id={sys.key}
              name={`fisicogeral.${sys.key}`}
              rows={4}
              className="form-control"
              value={formData.fisicogeral?.[sys.key] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <h2>Diagnóstico e tratamento</h2>
      <div className="card-body">
        {DIAGNOSTICO.map((field) => (
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

      <div className={styles.column}>
        <h2>Tratamento</h2>
        <table className={styles.tabela_tratamento}>
          <thead>
            <tr>
              <th>Medicação</th>
              <th>Dose</th>
              <th>Frequência</th>
              <th>Período</th>
            </tr>
          </thead>
          <tbody>
            {formData.medicacoes.map((linha, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={linha.medicacao}
                    onChange={(e) => handleChangeTratamentos(index, "medicacao", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={linha.dose}
                    onChange={(e) => handleChangeTratamentos(index, "dose", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={linha.frequencia}
                    onChange={(e) => handleChangeTratamentos(index, "frequencia", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={linha.periodo}
                    onChange={(e) => handleChangeTratamentos(index, "periodo", e.target.value)}
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

      <div className={styles.column}>
        <label>Plantonista(s) discente(s):</label>
        <textarea
          name="plantonistas"
          value={formData.plantonistas || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className={styles.column}>
        <label>Médico(s) Veterinário(s) Responsável:</label>
        <textarea
          name="medicosResponsaveis"
          value={formData.medicosResponsaveis || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>
    </div>
  );
}

export default FichaClinicaMedicaAninhar;