import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from "moment";
import FinalizarFichaModal from "../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from "../../../../services/animalService";
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";

function FichaSolicitacaoExame() {
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [consultaId, setConsultaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [tutor, setTutor] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);
  const { id, modo } = router.query; 
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Estados para checkboxes e campos "Outros"
  const [formData, setFormData] = useState({
    hematologiaDiagnostica: [],
    urinalise: [],
    parasitologico: [],
    bioquimicaClinica: [],
    citologiaHistopatologia: [],
    imunologicos: [],
    imaginologia: [],
    cardiologia: [],
  });

  // Estados para campos "Outros"
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

  // Estados para exibir inputs "Outros"
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

    useEffect(() => {
        // Se o modo for 'visualizar', define o estado para somente leitura
        if (modo === 'visualizar') {
            setIsReadOnly(true);
        }
    }, [modo]);


  // Obtém o ID da ficha e animal da URL
  useEffect(() => {
    if (router.isReady) {
        const id = router.query.consultaId;
        const animalId = router.query.animalId;
        const ficha = router.query.fichaId;
        if (id) {
            setConsultaId(id);
        }
        if (animalId) {
            setAnimalId(animalId);
        }
        if (ficha) {
            setFichaId(ficha);
        }
    }
  }, [router.isReady, router.query.consultaId]);

   useEffect(() => {
    if (!animalId) return;
    if (!fichaId) return;

    const fetchData = async () => {
        try {
            const animalData = await getAnimalById(animalId);
            setAnimal(animalData);
        } catch (error) {
            console.error('Erro ao buscar animal:', error);
        }

        try {
            const tutorData = await getTutorByAnimal(animalId);
            setTutor(tutorData);
        } catch (error) {
            console.error('Erro ao buscar tutor do animal:', error);
        } 

        try {
            const formData = await getFichaById(fichaId);
            const conteudo = (JSON.parse(formData.conteudo));
            setFormData(conteudo.formData || {});
            console.log('Conteúdo da ficha:', conteudo);
            setOtherValues(conteudo.otherValues || {});
            setData(formData.dataHora);
        } catch (error) {
            console.error('Erro ao buscar dados da ficha:', error);
        } finally {
            setLoading(false);
        }
    };

        fetchData();
    }, [animalId, fichaId]);

  // Carrega token e roles do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!roles.includes("medico") && !roles.includes("patologista")) {
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

  const handleCheckboxChange = (event, field) => {
    const { value, checked } = event.target;

    setShowOtherInputs((prev) => ({
      ...prev,
      [field]: value === "Outros(s):" ? checked : prev[field],
    }));

    if (value === "Outros(s):" && !checked) {
      setOtherValues((prev) => ({ ...prev, [field]: "" }));
    }

    setFormData((prev) => {
      const updatedField = checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value);
      return { ...prev, [field]: updatedField };
    });
  };

  const handleOtherInputChange = (field, value) => {
    setOtherValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss");

    // Substitui "Outros(s):" pelos valores digitados nos campos "Outros"
    const finalFormData = { ...formData };
    Object.keys(finalFormData).forEach((field) => {
      if (finalFormData[field].includes("Outros(s):") && otherValues[field].trim() !== "") {
        finalFormData[field] = finalFormData[field].filter((item) => item !== "Outros(s):");
        finalFormData[field].push(otherValues[field].trim());
      }
    });

    const fichaData = {
      nome: "Ficha Solicitação de Exame",
      conteudo: {
        hematologiaDiagnóstica: finalFormData.hematologiaDiagnostica,
        urinálise: finalFormData.urinalise,
        parasitologico: finalFormData.parasitologico,
        bioquímicaClínica: finalFormData.bioquimicaClinica,
        citologiaHistopatologia: finalFormData.citologiaHistopatologia,
        imunológicos: finalFormData.imunologicos,
        imaginologia: finalFormData.imaginologia,
        cardiologia: finalFormData.cardiologia,
      },
      dataHora: dataFormatada,
    };

    try {
      await updateFicha(fichaData, fichaId);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao editar ficha:", error);
      setShowErrorAlert(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha de Solicitação de Exame</h1>

      <div className={styles.form_box}>
        <form>
          {/* Seção de Dados do Animal */}
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
                              <p>{animal.raca && animal.raca.especie && animal.raca.especie.nome}</p>
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
                              <p>{animal.raca && animal.raca.nome}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Porte</h6>
                              <p>{animal.raca && animal.raca.porte ? animal.raca.porte : "Não definido"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Data de nascimento</h6>
                              <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : "Não definida"}</p>
                            </div>
                          </div>
                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Alergias</h6>
                              <p>{animal.alergias ? animal.alergias : "Não definidas"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Número da ficha</h6>
                              <p>{animal.numeroFicha ? animal.numeroFicha : "Não definido"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Tutor</h6>
                              <p>{tutor.nome ? tutor.nome : "Não definido"}</p>
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

          {/* Seções de Checkboxes */}
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
                      checked={Array.isArray(formData[field]) && formData[field].includes(item)}
                      disabled={isReadOnly}
                      onChange={(e) => handleCheckboxChange(e, field)}
                      className="form-control"
                    />
                    {item}
                  </label>
                ))}
                {showOtherInputs[field] && (
                  <input
                    type="text"
                    placeholder="Digite aqui..."
                    value={otherValues[field]}
                    onChange={(e) => handleOtherInputChange(field, e.target.value)}
                    className="form-control"
                  />
                )}
              </div>
            </div>
          ))}

          {!isReadOnly && (
          <div className={styles.button_box}>
            <CancelarWhiteButton />
            <FinalizarFichaModal onConfirm={handleSubmit} />
          </div>
          )}
        </form>

        {showAlert && consultaId && (
          <div className={styles.alert}>
            <Alert
              message="Ficha editada com sucesso!"
              show={showAlert}
              url={`/createConsulta/${consultaId}`}
            />
          </div>
        )}
        {showErrorAlert && <ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />}
      </div>
    </div>
  );
}

export default FichaSolicitacaoExame;