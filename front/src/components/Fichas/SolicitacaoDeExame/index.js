import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { createFicha } from "../../../../services/fichaService";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from "moment";
import FinalizarFichaModal from "../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from "../../../../services/animalService";

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

  // Função para gerar uma chave única no localStorage com base no fichaId
  const getLocalStorageKey = () => `solicitacaoExameFormData_${consultaId || "default"}`;

  // Carrega os dados do formulário e dos campos "Outros" do localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && consultaId) {
      const savedFormData = localStorage.getItem(getLocalStorageKey());
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setFormData(parsedData.formData || {
            hematologiaDiagnostica: [],
            urinalise: [],
            parasitologico: [],
            bioquimicaClinica: [],
            citologiaHistopatologia: [],
            imunologicos: [],
            imaginologia: [],
            cardiologia: [],
          });
          setOtherValues(parsedData.otherValues || {
            hematologiaDiagnostica: "",
            urinalise: "",
            parasitologico: "",
            bioquimicaClinica: "",
            citologiaHistopatologia: "",
            imunologicos: "",
            imaginologia: "",
            cardiologia: "",
          });
          setShowOtherInputs({
            hematologiaDiagnostica: parsedData.formData?.hematologiaDiagnostica.includes("Outros(s):"),
            urinalise: parsedData.formData?.urinalise.includes("Outros(s):"),
            parasitologico: parsedData.formData?.parasitologico.includes("Outros(s):"),
            bioquimicaClinica: parsedData.formData?.bioquimicaClinica.includes("Outros(s):"),
            citologiaHistopatologia: parsedData.formData?.citologiaHistopatologia.includes("Outros(s):"),
            imunologicos: parsedData.formData?.imunologicos.includes("Outros(s):"),
            imaginologia: parsedData.formData?.imaginologia.includes("Outros(s):"),
            cardiologia: parsedData.formData?.cardiologia.includes("Outros(s):"),
          });
        } catch (error) {
          console.error("Erro ao carregar os dados do localStorage", error);
        }
      }
    }
  }, [consultaId]);

  // Salva os dados do formulário e dos campos "Outros" no localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && consultaId) {
      localStorage.setItem(
        getLocalStorageKey(),
        JSON.stringify({ formData, otherValues })
      );
    }
  }, [formData, otherValues, consultaId]);

  // Obtém o ID da ficha e animal da URL
  useEffect(() => {
    if (router.isReady) {
      const id = router.query.fichaId;
      const animalId = router.query.animalId;
      if (id) {
        setConsultaId(id);
      }
      if (animalId) {
        setAnimalId(animalId);
      }
    }
  }, [router.isReady, router.query.fichaId, router.query.animalId]);

  // Carrega os dados do animal e tutor
  useEffect(() => {
    if (!animalId) return;

    const fetchData = async () => {
      try {
        const animalData = await getAnimalById(animalId);
        setAnimal(animalData);
      } catch (error) {
        console.error("Erro ao buscar animal:", error);
      }

      try {
        const tutorData = await getTutorByAnimal(animalId);
        setTutor(tutorData);
      } catch (error) {
        console.error("Erro ao buscar tutor do animal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animalId]);

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
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");

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
        "Hematologia Diagnóstica": formData.hematologiaDiagnostica,
        "Urinálise": formData.urinalise,
        "Parasitológico": formData.parasitologico,
        "Bioquímica Clínica": formData.bioquimicaClinica,
        "Citologia / Histopatologia": formData.citologiaHistopatologia,
        "Imunológicos": formData.imunologicos,
        "Imaginologia": formData.imaginologia,
        "Cardiologia": formData.cardiologia
      },
      dataHora: dataFormatada,
    };

    try {
      const resultado = await createFicha(fichaData);
      localStorage.setItem("fichaId", resultado.id.toString());
      localStorage.removeItem(getLocalStorageKey()); // Limpa os dados após salvar
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
      setShowErrorAlert(true);
    }
  };

  const cleanLocalStorage = () => {
    localStorage.removeItem(getLocalStorageKey());
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
                      checked={formData[field].includes(item)}
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

          <div className={styles.button_box}>
            <CancelarWhiteButton onClick={cleanLocalStorage} />
            <FinalizarFichaModal onConfirm={handleSubmit} />
          </div>
        </form>

        {showAlert && consultaId && (
          <div className={styles.alert}>
            <Alert
              message="Ficha criada com sucesso!"
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