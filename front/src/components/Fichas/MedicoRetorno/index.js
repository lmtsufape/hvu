import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from "../../../../services/userService";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from "moment";
import { createFicha } from "../../../../services/fichaService";
import FinalizarFichaModal from "../FinalizarFichaModal";
import SolicitacaoDeExameAninhar from "../SolicitacaoDeExameAninhar";

function FichaMedicaRetorno() {
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [mostrarExames, setMostrarExames] = useState(false);

  const [formData, setFormData] = useState({
    peso: "",
    anamneseHistoricoClinico: "",
    exameClinico: "",
    condutaTerapeutica: "",
    ExamesComplementares: [],
    plantonista: "",
    MedicoResponsavel: "",
    SolicitacaoDeExame: {
      hematologiaDiagnostica: [],
      urinalise: [],
      parasitologico: [],
      bioquimicaClinica: [],
      citologiaHistopatologia: [],
      imunologicos: [],
      imaginologia: [],
      cardiologia: [],
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRoles = JSON.parse(localStorage.getItem("roles"));
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUsuario();
        setUserId(userData.usuario.id);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!roles.includes("medico")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Você não tem permissão para acessar esta página.
        </h3>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Faça login para acessar esta página.
        </h3>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event?.preventDefault(); // Usa encadeamento opcional para evitar erro
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
    const fichaData = {
      nome: "Ficha clínico médica de retorno",
      conteudo: {
        peso: formData.peso,
        anamneseHistoricoClinico: formData.anamneseHistoricoClinico,
        exameClinico: formData.exameClinico,
        condutaTerapeutica: formData.condutaTerapeutica,
        ExamesComplementares: formData.ExamesComplementares,
        plantonista: formData.plantonista,
        MedicoResponsavel: formData.MedicoResponsavel,
        SolicitacaoDeExame: formData.SolicitacaoDeExame,
      },
      dataHora: dataFormatada,
    };

    try {
      console.log(fichaData);
      await createFicha(fichaData);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
      if (error.response && error.response.data && error.response.data.code) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erro ao criar ficha");
      }
      setShowErrorAlert(true);
    }
  };

  const handleFinalizar = async () => {
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
    const fichaData = {
      nome: "Ficha clínico médica de retorno",
      conteudo: {
        peso: formData.peso,
        anamneseHistoricoClinico:formData.anamneseHistoricoClinico,
        exameClinico: formData.exameClinico,
        condutaTerapeutica: formData.condutaTerapeutica,
        ExamesComplementares: formData.ExamesComplementares,
        plantonista: formData.plantonista,
        MedicoResponsavel: formData.MedicoResponsavel,
        SolicitacaoDeExame: formData.SolicitacaoDeExame,
      },
      dataHora: dataFormatada,
    };

    try {
      console.log(fichaData);
      await createFicha(fichaData);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
      if (error.response && error.response.data && error.response.data.code) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erro ao criar ficha");
      }
      setShowErrorAlert(true);
    }
  };

  const handleCheckboxChange = (event, field) => {
    const { value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const toggleMostrarExames = () => {
    setMostrarExames((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha clínica médica de retorno</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
        
            <h2>Anamnese</h2>
            <div className={styles.column}>
            <label>Peso:</label>
            <input
              type="text"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              style={{
                width: "100px", // Define uma largura menor
              }}
            />
          </div>
          
          <div className={styles.column}>
            <label>
             Anamnese/Histórico clínico: <br />
              <textarea
                name="anamneseHistoricoClinico"
                value={formData.anamneseHistoricoClinico}
                onChange={handleChange}
                rows="4"
                cols="50"
              />
            </label>
          </div>
          <div className={styles.column}>
            <label>
              Exame clínico: <br />
              <textarea
                name="exameClinico"
                value={formData.exameClinico}
                onChange={handleChange}
                rows="4"
                cols="50"
              />
            </label>
          </div>
          <div className={styles.column}>
            <label>
              Conduta terapêutica: <br />
              <textarea
                name="condutaTerapeutica"
                value={formData.condutaTerapeutica}
                onChange={handleChange}
                rows="4"
                cols="50"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={toggleMostrarExames}
            className={`${styles.toggleButton} ${
              mostrarExames ? styles.minimize : styles.expand
            }`}
          >
            {mostrarExames ? "Ocultar Exames" : "Solicitar Exame"}
          </button>
          {mostrarExames && (
            <SolicitacaoDeExameAninhar
              formData={formData.SolicitacaoDeExame}
              setFormData={setFormData}
            />
          )}

          <h1 className={styles.title}>Exames complementares</h1>
          <div className={styles.checkbox_container}>
            {[
              "Hemograma",
              "Alt/Tgp",
              "Ast/Tgo",
              "Creatinina",
              "Uréia",
              "Proteínas Totais",
              "Albumina",
              "Globulina",
              "Fa",
              "Ggt",
              "Glicose",
              "Triglicérides",
              "Colesterol Total",
              "Urinálise",
              "Bilirrubina Total e Frações",
              "Tricograma",
              "Citologia Cutânea",
              "Raspado Cutâneo",
              "Citologia Oncológica",
              "Histopatológico",
              "Teste Rápido Cinomose",
              "Teste Rápido Erliquiose",
              "Citologia Otológica",
              "Teste Rápido Parvovirose",
              "Teste Rápido Leishmaniose",
              "Fiv/Felv",
            ].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  onChange={(e) => handleCheckboxChange(e, "ExamesComplementares")}
                />{" "}
                {item.replace(/([A-Z])/g, " $1").trim()}
              </label>
            ))}
          </div>

          <div className={styles.column}>
            <label>Médico(s) Veterinário(s) Responsável:</label>
            <input
              type="text"
              name="MedicoResponsavel"
              value={formData.MedicoResponsavel}
              onChange={handleChange}
            />
          </div>

          <div className={styles.column}>
            <label>Plantonista(s) discente(s):</label>
            <input
              type="text"
              name="plantonista"
              value={formData.plantonista}
              onChange={handleChange}
            />
          </div>

          <div className={styles.button_box}>
            <CancelarWhiteButton />
            <FinalizarFichaModal onConfirm={handleFinalizar} />
          </div>
        </form>
        {showAlert && (
          <Alert
            message="Ficha criada com sucesso!"
            show={showAlert}
            url={`/fichaMedicaRetorno`}
          />
        )}
        {showErrorAlert && (
          <ErrorAlert message={errorMessage} show={showErrorAlert} />
        )}
      </div>
    </div>
  );
}

export default FichaMedicaRetorno;