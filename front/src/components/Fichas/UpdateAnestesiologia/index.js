import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Step1Anestesiologia from "./PreAnestesia";
import Step2Anestesiologia from "./PosAnestesia";

import styles from "./index.module.css";
import Alert      from "@/components/Alert";
import ErrorAlert from "@/components/ErrorAlert";

import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";
import moment                   from "moment";
import { getCurrentUsuario }    from "../../../../services/userService";

export default function AnestesiologiaSteps() {
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  const [consultaId, setConsultaId] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);
  const router = useRouter();

  /* auth */
  const [loading, setLoading] = useState(true);
  const [roles,   setRoles]   = useState([]);
  const [token,   setToken]   = useState("");

  /* alerts */
  const [showOK,  setShowOK]  = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [errMsg,  setErrMsg]  = useState("");

  /* form */
  const [formData, setFormData] = useState({
    pre: { exames: [], mucosas: [] },     // todos os campos do PreAnestesia irão aqui
    pos: {},                 // depois preencha com os campos da página 2
  });

  /* ------------ handlers -------------- */
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
      const keys = path.split(".");
      const leaf = keys.pop();
      const ref  = keys.reduce((acc, k) => acc[k], clone);
      const arr  = ref[leaf] ?? [];
      ref[leaf]  = checked ? [...arr, value] : arr.filter((v) => v !== value);
      return clone;
    });
  };
  /* ------------------------------------ */


  // Obtém o ID da ficha da URL
  useEffect(() => {
    if (router.isReady) {
        const id = router.query.consultaId;
        const ficha = router.query.fichaId;
        if (id) {
          setConsultaId(id);
        }
        if (ficha) {
          setFichaId(ficha);
        }
    }
  }, [router.isReady, router.query.consultaId]);

    useEffect(() => {
    if (!fichaId) return;

    const fetchData = async () => {
        try {
            const formData = await getFichaById(fichaId);
            setFormData(JSON.parse(formData.conteudo));
            setData(formData.dataHora);
        } catch (error) {
            console.error('Erro ao buscar dados da ficha:', error);
        } finally {
            setLoading(false);
        }
    };

        fetchData();
    }, [fichaId]);
  

  /* auth */
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

  if (loading) return <p>Carregando…</p>;
  if (!token) return <p>Acesso negado – faça login.</p>;
  if (!roles.includes("medico")) return <p>Acesso negado – sem permissão.</p>;

  /* submit final */
  const handleSubmit = async () => {
    const fichaData = {
      nome: "Ficha Anestesiológica",
      conteudo: { ...formData },
      dataHora: moment(data).format("YYYY-MM-DDTHH:mm:ss")
    };

    try {
      await updateFicha(fichaData, fichaId);
      setShowAlert(true);
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message ?? "");
      setShowErr(true);
    }
  };


  /* render */
  return (
    <div className={styles.container}>
      {step === 1 && (
        <Step1Anestesiologia
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <Step2Anestesiologia
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />
      )}

      {/* ---------- paginação ---------- */}
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


   {showAlert && consultaId &&(
        <div className={styles.alert}>
          <Alert
            message="Ficha editada com sucesso!"
            show={showAlert}
            url={`/createConsulta/${consultaId}`}
          />
        </div>
      )}
      {showErrorAlert && (
        <div className={styles.alert}>
          <ErrorAlert
            message={errorMessage || "Erro ao editar ficha"}
            show={showErrorAlert}
          />
        </div>
      )}
    </div>
  );
  
}
