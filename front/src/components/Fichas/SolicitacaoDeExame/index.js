import React, { useState, useEffect, useRef} from "react";
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
import { getCurrentUsuario } from "../../../../services/userService";
import { getMedicoById } from "../../../../services/medicoService";


function FichaSolicitacaoExame() {
  const router = useRouter();
  const formBoxRef = useRef(null);

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
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [medicoLogado, setMedicoLogado] = useState(null); 

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

  const [histopatologicoExtra, setHistopatologicoExtra] = useState({
  aspecto: "",
  local: ""
  });

  // Função para gerar uma chave única no localStorage com base no fichaId
  const getLocalStorageKey = () => `solicitacaoExameFormData_${consultaId || "default"}`;

   useEffect(() => {
    const fetchMedicoData = async () => {
        try {
            // Passo 1: Busca o usuário atual para obter o ID
            const userData = await getCurrentUsuario();
            const medicoId = userData.usuario.id;

            if (medicoId) {
                // Passo 2: Usa o ID para buscar os dados COMPLETOS do médico
                const medicoCompletoData = await getMedicoById(medicoId);
                
                // Passo 3: Armazena o objeto COMPLETO (que tem o CRMV) no estado
                setMedicoLogado(medicoCompletoData);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do médico logado:', error);
        }
    };

    fetchMedicoData();
  }, []);

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
            medicosResponsaveis: nomeMedico 
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
      const aId = router.query.agendamentoId; // Obtém o ID do agendamento da URL
      if (id) {
        setConsultaId(id);
      }
      if (aId) {
        setAgendamentoId(aId); // Define o ID do agendamento  
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

  useEffect(() => {
    console.log("Estado atual do formData:", formData);
    console.log("Estado atual do otherValues:", otherValues);
  }, [formData, otherValues]); // Este useEffect será executado sempre que formData ou otherValues mudarem

    useEffect(() => {
                if (router.isReady) {
                  const medicoFromQuery = router.query.medico;
                  if (medicoFromQuery) {
                    const nomeMedico = decodeURIComponent(medicoFromQuery);
          
                    // ATUALIZA o formData com o nome do médico vindo da URL.
                    setFormData(prevData => ({
                      ...prevData,
                      medicosResponsaveis: nomeMedico 
                    }));
                  }
                }
              }, [router.isReady, router.query.medico]);


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

     if (value === "Histopatológico" && field === "citologiaHistopatologia" && !checked) {
    setHistopatologicoExtra({ aspecto: "", local: "" });
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

  const handleSubmit = async (nomeDoMedicoResponsavel) => {
    

    // Substitui "Outros(s):" pelos valores digitados nos campos "Outros"
    const finalFormData = { ...formData, medicosResponsaveis: nomeDoMedicoResponsavel };
    const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");

    Object.keys(finalFormData).forEach((field) => {
       if (Array.isArray(finalFormData[field]) && finalFormData[field].includes("Outros(s):")) {
      if (finalFormData[field].includes("Outros(s):") && otherValues[field].trim() !== "") {
        finalFormData[field] = finalFormData[field].filter((item) => item !== "Outros(s):");
        finalFormData[field].push(otherValues[field].trim());
      }
    }
    });

    const citoArray = finalFormData.citologiaHistopatologia;
    const histopatologicoIndex = citoArray.indexOf("Histopatológico");

    // Verifica se "Histopatológico" está selecionado
    if (histopatologicoIndex !== -1) {
        // Substitui a string "Histopatológico" por um objeto com os detalhes
        citoArray[histopatologicoIndex] = {
            nome: "Histopatológico", // Mantém o nome para fácil identificação
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
        CitologiaHistopatologia: finalFormData.citologiaHistopatologia,
        Imunológicos: finalFormData.imunologicos,
        Imaginologia: finalFormData.imaginologia,
        Cardiologia: finalFormData.cardiologia,
        medicosResponsaveis: formData.medicosResponsaveis
      },
      dataHora: dataFormatada,
      agendamento: {
                id: Number(agendamentoId)
            }
    };

    console.log("Dados a serem enviados para a API:", JSON.stringify(fichaData, null, 2));

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
    <div className={styles.form_box} ref={formBoxRef}>
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

              {/* Input "Outros(s):" */}
              {showOtherInputs[field] && (
                <textarea
                  type="text"
                  placeholder="Digite aqui..."
                  value={otherValues[field]}
                  onChange={(e) => handleOtherInputChange(field, e.target.value)}
                  className="form-control"
                  rows={4}
                />
              )}

              {field === "citologiaHistopatologia" &&
              formData.citologiaHistopatologia.includes("Histopatológico") && (
                <div className={styles.extraInputs}>
                  <div className={styles.extraInputGroup}>
                    <label className={styles.extraLabel}>Aspecto</label>
                    <input
                      type="text"
                      value={histopatologicoExtra.aspecto}
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
            <CancelarWhiteButton onClick={cleanLocalStorage} />
            < FinalizarFichaModal onConfirm={handleSubmit} />
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
    </div>
  );
}

export default FichaSolicitacaoExame;