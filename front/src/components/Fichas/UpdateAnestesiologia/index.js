import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from "moment";

import Step1Anestesiologia from "./PreAnestesia";
import Step2Anestesiologia from "./PosAnestesia";
import AnestesiologiaPDF from './AnestesiologiaPDF';

import styles from "./index.module.css";
import Alert from "@/components/Alert";
import ErrorAlert from "@/components/ErrorAlert";

import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getCurrentUsuario } from "../../../../services/userService";
import { getAnimalById } from "../../../../services/animalService";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getMedicoById } from "../../../../services/medicoService";

const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), 
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas} style={{ width: 'auto', padding: '0 1.5rem' }}>
    <PDFLink 
      document={<AnestesiologiaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} 
      fileName={`FichaAnestesiologica_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`} 
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

export default function AnestesiologiaSteps() {
  const router = useRouter();
  const { modo } = router.query;

  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [tutor, setTutor] = useState({});
  const [medicoLogado, setMedicoLogado] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  const [consultaId, setConsultaId] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);
  const [agendamentoId, setAgendamentoId] = useState(null);

  /* auth */
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");

  /* form */
  const [formData, setFormData] = useState({
    pre: { exames: [], mucosas: [] },
    pos: {},
  });

  useEffect(() => {
    if (router.isReady) {
      if (router.query.animalId) setAnimalId(router.query.animalId);
      if (router.query.consultaId) setConsultaId(router.query.consultaId);
      if (router.query.agendamentoId) setAgendamentoId(router.query.agendamentoId);
      if (router.query.fichaId) setFichaId(router.query.fichaId);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    const fetchDataForPDF = async () => {
      if (!animalId) return;
      try {
        const [animalData, tutorData, userData] = await Promise.all([
          getAnimalById(animalId),
          getTutorByAnimal(animalId),
          getCurrentUsuario()
        ]);
        setAnimal(animalData || {});
        setTutor(tutorData || {});
        if (userData?.usuario?.id) {
          const medicoData = await getMedicoById(userData.usuario.id);
          setMedicoLogado(medicoData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados para o PDF:', error);
      }
    };
    fetchDataForPDF();
  }, [animalId]);

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
      const ref = keys.reduce((acc, k) => acc[k], clone);
      const arr = ref[leaf] ?? [];
      ref[leaf] = checked ? [...arr, value] : arr.filter((v) => v !== value);
      return clone;
    });
  };

  useEffect(() => {
    if (modo === "criar") {
      setLoading(false);
      return;
    }

    if (!fichaId) return;

    const fetchData = async () => {
      try {
        const formDataResponse = await getFichaById(fichaId);
        if (formDataResponse?.conteudo) {
          setFormData(typeof formDataResponse.conteudo === "string" 
            ? JSON.parse(formDataResponse.conteudo) 
            : formDataResponse.conteudo);
        }
        setData(formDataResponse?.dataHora);
      } catch (error) {
        console.error('Erro ao buscar dados da ficha:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fichaId, modo]);

  /* auth */
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
  if (!roles.includes("medico") && !roles.includes("patologista")) return <p>Acesso negado – sem permissão.</p>;

  /* submit final */
  const handleSubmit = async () => {
    const fichaData = {
      nome: "Ficha Anestesiológica",
      conteudo: { ...formData },
      dataHora: moment(data).isValid() ? moment(data).format("YYYY-MM-DDTHH:mm:ss") : moment().format("YYYY-MM-DDTHH:mm:ss"),
      agendamento: { id: Number(agendamentoId) }
    };

    try {
      if (modo === "criar") {
        await createFicha(fichaData);
      } else {
        await updateFicha(fichaData, fichaId);
      }
      localStorage.removeItem("posAnestesiaTabela");
      setShowAlert(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message ?? "Erro ao salvar ficha");
      setShowErrorAlert(true);
    }
  };

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

      <div className={styles.footerControls}>
        <div className={styles.footerControls}>
          {!loading && animal?.id && tutor?.id && medicoLogado && (
            <DownloadPdfStyledButton ficha={formData} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />
          )}
        </div>
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
      </div>

      {showAlert && (
        <div className={styles.alert}>
          <Alert
            message={modo === "criar" ? "Ficha criada com sucesso!" : "Ficha editada com sucesso!"}
            show={showAlert}
            url={animalId ? `/getAllConsultas/${animalId}` : `/getAllConsultas`}
          />
        </div>
      )}
      {showErrorAlert && (
        <div className={styles.alert}>
          <ErrorAlert
            message={errorMessage || (modo === "criar" ? "Erro ao criar ficha" : "Erro ao editar ficha")}
            show={showErrorAlert}
          />
        </div>
      )}
    </div>
  );
}