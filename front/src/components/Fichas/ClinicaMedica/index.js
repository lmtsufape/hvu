import { useState, useEffect } from "react";
import Step1ClinicaMedica from "./ExameFisicoGeral";    
import Step2ClinicaMedica from "./ExameFisicoSistema";

import styles from "./index.module.css";
import Alert       from "@/components/Alert";
import ErrorAlert  from "@/components/ErrorAlert";

import moment                 from "moment";
import { createFicha } from '../../../../services/fichaService';
import { getCurrentUsuario }  from "../../../../services/userService";

/* ─────────────────────────────────────────────────────────────── */

function ClinicaMedicaSteps() {
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

  /* dados do formulário (pág. 1 + pág. 2) */
  const [formData, setFormData] = useState({
    /* ------------- passo 1 ------------- */
    queixaPrincipal: "",
    HistoricoMedico: {
      vacinação: "",
      vacinasSelecionadas: [],
      vermifugação: "",
      produtoVermifugação: "",
      dataVacinação: "",
      dataVermifugação: "",
      ectoparasitas: "",
      produtoEctoparasitas: "",
      dataEctoparasitas: ""
    },
    ExameFisico: {
      alimentacao: "",
      postura: "",
      temperatura: "",
      score: "",
      freqCardiaca: "",
      freqRespiratoria: "",
      hidratacao: "",
      tpc: "",
      turgor: "",
      mucosas: "",
      linfonodosGeral: "",
      linfonodosLocal: []
    },
    /* ------------- passo 2 ------------- */
    fisicogeral: {},
    diagnostico: {},
    medicacoes: [{ medicacao: "", dose: "", frequencia: "", periodo: "" }]
  });

  /* ─────────────── handlers genéricos ─────────────── */
  const handleChange = ({ target: { name, value } }) => {
    const path = name.split(".");
    setFormData((prev) => {
      const clone = structuredClone(prev);
      let ref = clone;
      for (let i = 0; i < path.length - 1; i++) {
        if (!ref[path[i]]) ref[path[i]] = {};
        ref = ref[path[i]];
      }
      ref[path.at(-1)] = value;
      return clone;
    });
  };

  const handleCheckboxChange = ({ target: { value, checked } }, path) => {
    setFormData((prev) => {
      const clone = structuredClone(prev);
      const keys  = path.split(".");
      const leaf  = keys.pop();
      const ref   = keys.reduce((acc, k) => acc[k], clone);

      const arr = ref[leaf] ?? [];
      ref[leaf] = checked ? [...arr, value] : arr.filter((v) => v !== value);
      return clone;
    });
  };
  /* ─────────────────────────────────────────────────── */

  /* carregar token/roles e verificar usuário */
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") ?? "");
      setRoles(JSON.parse(localStorage.getItem("roles") ?? "[]"));
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try { await getCurrentUsuario(); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadUser();
  }, []);

  if (loading)                     return <p>Carregando…</p>;
  if (!token)                      return <p>Acesso negado – faça login.</p>;
  if (!roles.includes("medico"))   return <p>Acesso negado – sem permissão.</p>;

  /* envio final */
  const handleSubmit = async () => {
    setShowErrorAlert(false);
    const fichaData = {
      nome: "Ficha Clínica Médica",
      conteudo: { ...formData },
      dataHora: moment().format("YYYY-MM-DDTHH:mm:ss")
    };

    try {
      await createFicha(fichaData);
      setShowAlert(true);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message ?? "");
      setShowErrorAlert(true);
    }
  };

  /* renderização de cada página */
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1ClinicaMedica
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Step2ClinicaMedica
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  /* UI */
  return (
    <div className={styles.container}>
      {renderStep()}

      <div className={styles.pagination}>
        {[1, 2].map((p) => (
          <button
            key={p}
            className={styles.pageButton}
            onClick={() => setStep(p)}
            disabled={p === step}
          >
            {p}
          </button>
        ))}
      </div>

      {showAlert && (
        <div className={styles.alert}>
          <Alert
            message="Ficha criada com sucesso!"
            show={showAlert}
            url="/fichaClinicaMedica"
          />
        </div>
      )}
      {showErrorAlert && (
        <div className={styles.alert}>
          <ErrorAlert
            message={errorMessage || "Erro ao criar ficha"}
            show={showErrorAlert}
          />
        </div>
      )}
    </div>
  );
}

export default ClinicaMedicaSteps;
