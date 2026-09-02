import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import moment from "moment";

import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import FinalizarFichaModal from "../FinalizarFichaModal";
import FichaSolicitacaoExamePDF from './FichaSolicitacaoExamePDF';

import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from "../../../../services/animalService";
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getCurrentUsuario } from "../../../../services/userService";
import { getMedicoById } from "../../../../services/medicoService";

// Dynamic import fora do componente
const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado, className }) => (
  <button type="button" className={`${styles.green_buttonFichas} ${className || ''}`}>
    <PDFLink
      document={
        <FichaSolicitacaoExamePDF 
          ficha={ficha} 
          animal={animal} 
          tutor={tutor} 
          medicoLogado={medicoLogado} 
        />
      }
      fileName={`SolicitacaoExame_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`}
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function FichaSolicitacaoExame() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [consultaId, setConsultaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [tutor, setTutor] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [medicoLogado, setMedicoLogado] = useState(null);

  const [formData, setFormData] = useState({
    hematologiaDiagnostica: [],
    urinalise: [],
    parasitologico: [],
    bioquimicaClinica: [],
    citologiaHistopatologia: [],
    imunologicos: [],
    imaginologia: [],
    cardiologia: [],
    medicosResponsaveis: ""
  });

  const [otherValues, setOtherValues] = useState({
    hematologiaDiagnostica: "",
    urinalise: "",
    parasitologico: "",
    bioquimicaClinica: "",
    citologiaHistopatologia: "",
    imunologicos: "",
    imaginologia: "",
    cardiologia: "",
  });

  const [showOtherInputs, setShowOtherInputs] = useState({
    hematologiaDiagnostica: false,
    urinalise: false,
    parasitologico: false,
    bioquimicaClinica: false,
    citologiaHistopatologia: false,
    imunologicos: false,
    imaginologia: false,
    cardiologia: false,
  });

  const [histopatologicoExtra, setHistopatologicoExtra] = useState({
    aspecto: "",
    local: ""
  });

  const conteudoDaFichaParaPDF = () => {
    const finalFormData = { ...formData };
    Object.keys(finalFormData).forEach((field) => {
      if (Array.isArray(finalFormData[field]) && finalFormData[field].includes("Outros(s):") && otherValues[field]?.trim() !== "") {
        finalFormData[field] = finalFormData[field].filter((item) => item !== "Outros(s):");
        finalFormData[field].push(`Outros(s): ${otherValues[field].trim()}`);
      }
    });

    const citoArray = [...(finalFormData.citologiaHistopatologia || [])];
    const histopatologicoIndex = citoArray.indexOf("Histopatológico");
    if (histopatologicoIndex !== -1) {
      citoArray[histopatologicoIndex] = {
        nome: "Histopatológico",
        aspecto: histopatologicoExtra.aspecto.trim(),
        local: histopatologicoExtra.local.trim()
      };
    }

    return {
      HematologiaDiagnóstica: finalFormData.hematologiaDiagnostica,
      Urinálise: finalFormData.urinalise,
      Parasitologico: finalFormData.parasitologico,
      BioquímicaClínica: finalFormData.bioquimicaClinica,
      CitologiaHistopatologia: citoArray,
      Imunológicos: finalFormData.imunologicos,
      Imaginologia: finalFormData.imaginologia,
      Cardiologia: finalFormData.cardiologia,
      medicosResponsaveis: finalFormData.medicosResponsaveis
    };
  };

  useEffect(() => {
    if (modo === 'visualizar') {
      setIsReadOnly(true);
    }
  }, [modo]);

  useEffect(() => {
    if (router.isReady) {
      if (queryConsultaId) setConsultaId(queryConsultaId);
      if (queryAnimalId) setAnimalId(queryAnimalId);
      if (queryFichaId) setFichaId(queryFichaId);
      if (queryAgendamentoId) setAgendamentoId(queryAgendamentoId);
    }
  }, [router.isReady, queryConsultaId, queryAnimalId, queryFichaId, queryAgendamentoId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    const fetchMedicoData = async () => {
      try {
        const userData = await getCurrentUsuario();
        const medicoId = userData?.usuario?.id;
        if (medicoId) {
          const medicoCompletoData = await getMedicoById(medicoId);
          setMedicoLogado(medicoCompletoData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do médico logado:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicoData();
  }, []);

  useEffect(() => {
    if (!animalId) return;

    const fetchAnimalAndTutor = async () => {
      try {
        const [animalData, tutorData] = await Promise.all([
          getAnimalById(animalId),
          getTutorByAnimal(animalId)
        ]);
        setAnimal(animalData || {});
        setTutor(tutorData || {});
      } catch (error) {
        console.error('Erro ao buscar animal ou tutor:', error);
      }
    };

    fetchAnimalAndTutor();
  }, [animalId]);

  useEffect(() => {
    if (modo === "criar") {
      setLoading(false);
      return;
    }

    if (!fichaId) return;

    const fetchFichaData = async () => {
      try {
        const fichaDataFromApi = await getFichaById(fichaId);
        const conteudo = fichaDataFromApi.conteudo
          ? (typeof fichaDataFromApi.conteudo === 'string' ? JSON.parse(fichaDataFromApi.conteudo) : fichaDataFromApi.conteudo)
          : {};

        const newFormData = {};
        const newOtherValues = {};
        const newShowOtherInputs = {};

        const apiToStateMap = {
          'HematologiaDiagnóstica': 'hematologiaDiagnostica',
          'Urinálise': 'urinalise',
          'Parasitologico': 'parasitologico',
          'BioquímicaClínica': 'bioquimicaClinica',
          'CitologiaHistopatologia': 'citologiaHistopatologia',
          'Imunológicos': 'imunologicos',
          'Imaginologia': 'imaginologia',
          'Cardiologia': 'cardiologia',
        };

        const standardOptions = {
          hematologiaDiagnostica: ["Hemograma Parcial mais Proteínas Plasmáticas Totais", "Proteínas Plasmáticas Totais", "Hemograma Parcial", "Hematócrito/Volume Globular", "Outros(s):"],
          urinalise: ["Urinálise Completo", "Outros(s):"],
          parasitologico: ["Coproparasitológico", "Outros(s):"],
          bioquimicaClinica: ["Creatinina (CREA)", "Ureia (UR)", "ALT/TGP", "AST/TGO", "Fosfatase alcalina (FA)", "Gama - Glutamiltransferase (GGT)", "Bilirrubina total e frações (BT + BD + BI)", "Proteínas totais (PT)", "Albumina (ALB)", "Globulinas (GLOB)", "Triglicerides (TG)", "Colesterol Total (COL)", "Colesteróis HDL e LDL", "Glicose (GLI)", "Creatina quinase (CK/CPK)", "Outros(s):"],
          citologiaHistopatologia: ["Citologia cutânea", "Raspado cutâneo", "Citologia oncológica", "Histopatológico", "Outros(s):"],
          imunologicos: ["Teste rápido Cinomose", "Teste rápido Erliquiose", "Teste rápido Leishmaniose", "FIV/FELV", "Outros(s):"],
          imaginologia: ["Ultrassonografia", "Radiografia", "Mielografia", "Outros(s):"],
          cardiologia: ["Eletrocardiograma", "Ecocardiograma", "Outros(s):"],
        };

        for (const apiField in apiToStateMap) {
          const stateField = apiToStateMap[apiField];
          const itemsFromApi = conteudo[apiField] || [];

          let formDataForField = [];
          let otherValueForField = "";
          let showOtherInput = false;

          if (Array.isArray(itemsFromApi)) {
            const customValue = itemsFromApi.find(item =>
              typeof item === 'string' && !standardOptions[stateField].includes(item)
            );

            if (customValue) {
              otherValueForField = customValue;
              showOtherInput = true;
              formDataForField = itemsFromApi.filter(item => item !== customValue);
              if (!formDataForField.includes("Outros(s):")) {
                formDataForField.push("Outros(s):");
              }
            } else {
              formDataForField = itemsFromApi;
            }

            if (stateField === 'citologiaHistopatologia') {
              const histopatologicoObj = itemsFromApi.find(item => typeof item === 'object' && item?.nome === 'Histopatológico');
              if (histopatologicoObj) {
                setHistopatologicoExtra({
                  aspecto: histopatologicoObj.aspecto || "",
                  local: histopatologicoObj.local || ""
                });
                formDataForField = formDataForField.map(item => (typeof item === 'object' && item?.nome === 'Histopatológico') ? 'Histopatológico' : item);
              }
            }
          }

          newFormData[stateField] = formDataForField;
          newOtherValues[stateField] = otherValueForField;
          newShowOtherInputs[stateField] = showOtherInput;
        }

        setFormData(newFormData);
        setOtherValues(newOtherValues);
        setShowOtherInputs(newShowOtherInputs);
        setData(fichaDataFromApi.dataHora);
      } catch (error) {
        console.error("Erro ao buscar dados da ficha:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFichaData();
  }, [fichaId, modo]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  const handleCheckboxChange = (event, field) => {
    const { value, checked } = event.target;

    setShowOtherInputs((prev) => ({
      ...prev,
      [field]: value === "Outros(s):" ? checked : prev[field],
    }));

    if (value === "Outros(s):" && !checked) {
      setOtherValues((prev) => ({ ...prev, [field]: "" }));
    }

    if (value === "Histopatológico" && field === "citologiaHistopatologia" && !checked) {
      setHistopatologicoExtra({ aspecto: "", local: "" });
    }

    setFormData((prev) => {
      const updatedField = checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item) => item !== value);
      return { ...prev, [field]: updatedField };
    });
  };

  const handleOtherInputChange = (field, value) => {
    setOtherValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setShowErrorAlert(false);

    const currentModo = modo || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('modo'));
    const currentFichaId = fichaId || queryFichaId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fichaId'));
    const currentAgendamentoId = agendamentoId || queryAgendamentoId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('agendamentoId'));

    const dataFormatada = moment(data).isValid() 
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss") 
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    const finalFormData = { ...formData };
    Object.keys(finalFormData).forEach((field) => {
      if (Array.isArray(finalFormData[field]) && finalFormData[field].includes("Outros(s):") && otherValues[field]?.trim() !== "") {
        finalFormData[field] = finalFormData[field].filter((item) => item !== "Outros(s):");
        finalFormData[field].push(otherValues[field].trim());
      }
    });

    const citoArray = [...(finalFormData.citologiaHistopatologia || [])];
    const histopatologicoIndex = citoArray.indexOf("Histopatológico");

    if (histopatologicoIndex !== -1) {
      citoArray[histopatologicoIndex] = {
        nome: "Histopatológico",
        aspecto: histopatologicoExtra.aspecto.trim(),
        local: histopatologicoExtra.local.trim()
      };
    }

    const fichaData = {
      nome: "Ficha Solicitação de Exame",
      conteudo: {
        HematologiaDiagnóstica: finalFormData.hematologiaDiagnostica,
        Urinálise: finalFormData.urinalise,
        Parasitologico: finalFormData.parasitologico,
        BioquímicaClínica: finalFormData.bioquimicaClinica,
        CitologiaHistopatologia: citoArray,
        Imunológicos: finalFormData.imunologicos,
        Imaginologia: finalFormData.imaginologia,
        Cardiologia: finalFormData.cardiologia,
        medicosResponsaveis: formData.medicosResponsaveis
      },
      dataHora: dataFormatada,
      agendamento: {
        id: Number(currentAgendamentoId)
      }
    };

    try {
      if (currentModo === "criar" || !currentFichaId || currentFichaId === "null") {
        await createFicha(fichaData);
      } else {
        await updateFicha(fichaData, currentFichaId);
      }
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      setErrorMessage(error?.response?.data?.message || error?.response?.data?.error || (currentModo === "criar" || !currentFichaId ? "Erro ao criar ficha" : "Erro ao editar ficha"));
      setShowErrorAlert(true);
    }
  };

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    );
  }

  if (!roles.includes("medico") && !roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha de Solicitação de Exame</h1>

      <div className={styles.form_box}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.box_ficha_toggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
              onClick={() => setShowButtons((prev) => !prev)}
            >
              Dados do animal
            </button>
            {showButtons && (
              <div className={styles.container_toggle}>
                <ul>
                  {animal && (
                    <li key={animal.id} className={styles.infos_box}>
                      <div className={styles.identificacao}>
                        <div className={styles.nome_animal}>{animal.nome}</div>
                        <div className={styles.especie_animal}>Nome</div>
                      </div>
                      <div className={styles.form}>
                        <div className={styles["animal-data-box"]}>
                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Espécie</h6>
                              <p>{animal.raca?.especie?.nome}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Sexo</h6>
                              <p>{animal.sexo}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Peso</h6>
                              <p>{animal.peso === 0 || animal.peso === "" ? "Não definido" : animal.peso}</p>
                            </div>
                          </div>
                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Raça</h6>
                              <p>{animal.raca?.nome}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Porte</h6>
                              <p>{animal.raca?.porte || "Não definido"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Data de nascimento</h6>
                              <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : "Não definida"}</p>
                            </div>
                          </div>
                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Alergias</h6>
                              <p>{animal.alergias || "Não definidas"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Número da ficha</h6>
                              <p>{animal.numeroFicha || "Não definido"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Tutor</h6>
                              <p>{tutor.nome || "Não definido"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {[
            {
              title: "Hematologia Diagnóstica",
              field: "hematologiaDiagnostica",
              options: [
                "Hemograma Parcial mais Proteínas Plasmáticas Totais",
                "Proteínas Plasmáticas Totais",
                "Hemograma Parcial",
                "Hematócrito/Volume Globular",
                "Outros(s):",
              ],
            },
            {
              title: "Urinálise",
              field: "urinalise",
              options: ["Urinálise Completo", "Outros(s):"],
            },
            {
              title: "Parasitológico",
              field: "parasitologico",
              options: ["Coproparasitológico", "Outros(s):"],
            },
            {
              title: "Bioquímica Clínica",
              field: "bioquimicaClinica",
              options: [
                "Creatinina (CREA)",
                "Ureia (UR)",
                "ALT/TGP",
                "AST/TGO",
                "Fosfatase alcalina (FA)",
                "Gama - Glutamiltransferase (GGT)",
                "Bilirrubina total e frações (BT + BD + BI)",
                "Proteínas totais (PT)",
                "Albumina (ALB)",
                "Globulinas (GLOB)",
                "Triglicerides (TG)",
                "Colesterol Total (COL)",
                "Colesteróis HDL e LDL",
                "Glicose (GLI)",
                "Creatina quinase (CK/CPK)",
                "Outros(s):",
              ],
            },
            {
              title: "Citologia/Histopatologia",
              field: "citologiaHistopatologia",
              options: ["Citologia cutânea", "Raspado cutâneo", "Citologia oncológica", "Histopatológico", "Outros(s):"],
            },
            {
              title: "Imunológicos",
              field: "imunologicos",
              options: ["Teste rápido Cinomose", "Teste rápido Erliquiose", "Teste rápido Leishmaniose", "FIV/FELV", "Outros(s):"],
            },
            {
              title: "Imaginologia",
              field: "imaginologia",
              options: ["Ultrassonografia", "Radiografia", "Mielografia", "Outros(s):"],
            },
            {
              title: "Cardiologia",
              field: "cardiologia",
              options: ["Eletrocardiograma", "Ecocardiograma", "Outros(s):"],
            },
          ].map(({ title, field, options }) => (
            <div key={field}>
              <h2>{title}</h2>
              <div className={styles.checkbox_container}>
                {options.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      value={item}
                      checked={formData[field]?.includes(item) || false}
                      disabled={isReadOnly}
                      onChange={(e) => handleCheckboxChange(e, field)}
                      className="form-control"
                    />
                    {item}
                  </label>
                ))}

                {showOtherInputs[field] && (
                  <textarea
                    placeholder="Digite aqui..."
                    value={otherValues[field]}
                    disabled={isReadOnly}
                    onChange={(e) => handleOtherInputChange(field, e.target.value)}
                    className="form-control"
                    rows={5}
                  />
                )}

                {field === "citologiaHistopatologia" &&
                  formData.citologiaHistopatologia?.includes("Histopatológico") && (
                    <div className={styles.extraInputs}>
                      <div className={styles.extraInputGroup}>
                        <label className={styles.extraLabel}>Aspecto</label>
                        <input
                          type="text"
                          value={histopatologicoExtra.aspecto}
                          disabled={isReadOnly}
                          onChange={(e) =>
                            setHistopatologicoExtra((prev) => ({
                              ...prev,
                              aspecto: e.target.value,
                            }))
                          }
                          className="form-control"
                          placeholder="Descreva o aspecto"
                        />
                      </div>
                      <div className={styles.extraInputGroup}>
                        <label className={styles.extraLabel}>Local</label>
                        <input
                          type="text"
                          value={histopatologicoExtra.local}
                          disabled={isReadOnly}
                          onChange={(e) =>
                            setHistopatologicoExtra((prev) => ({
                              ...prev,
                              local: e.target.value,
                            }))
                          }
                          className="form-control"
                          placeholder="Informe o local"
                        />
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}

          <div className={styles.assinaturaSombreada}>
            {medicoLogado ? (
              <p style={{ margin: 0 }}>
                Assinado eletronicamente por <strong>Dr(a). {medicoLogado.nome}</strong>, CRMV {medicoLogado.crmv}
              </p>
            ) : (
              <p style={{ margin: 0 }}>Carregando dados do médico...</p>
            )}
          </div>

          <div className={styles.button_box}>
            {!loading && animal?.id && tutor?.id && medicoLogado && (
              <DownloadPdfStyledButton
                ficha={conteudoDaFichaParaPDF()}
                animal={animal}
                tutor={tutor}
                medicoLogado={medicoLogado}
              />
            )}

            {!isReadOnly && (
              <>
                <CancelarWhiteButton />
                <FinalizarFichaModal onConfirm={handleSubmit} />
              </>
            )}
          </div>
        </form>

        {showAlert && (
          <div className={styles.alert}>
            <Alert
              message={modo === "criar" ? "Ficha criada com sucesso!" : "Ficha editada com sucesso!"}
              show={showAlert}
              url={consultaId ? `/createConsulta/${consultaId}` : (animalId ? `/getAllConsultas/${animalId}` : `/getAllConsultas`)}
            />
          </div>
        )}
        {showErrorAlert && <ErrorAlert message={errorMessage || (modo === "criar" ? "Erro ao criar ficha" : "Erro ao editar ficha")} show={showErrorAlert} />}
      </div>
    </div>
  );
}

export default FichaSolicitacaoExame;