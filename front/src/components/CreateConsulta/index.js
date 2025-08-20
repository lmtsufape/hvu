import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import "react-datepicker/dist/react-datepicker.css";
import VoltarButton from "../VoltarButton";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import { createConsulta } from "../../../services/consultaService";
import { getVagaById } from "../../../services/vagaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";
import { getFichaById } from "../../../services/fichaService";
import { deleteFicha } from "../../../services/fichaService";
import { getConsultaByAnimal } from "../../../services/consultaService";

// Hook personalizado para gerenciar fichaIds
const useFichaManager = () => {
  const [fichaIds, setFichaIds] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIds = localStorage.getItem("fichaIds");
      if (storedIds) {
        try {
          const parsedIds = JSON.parse(storedIds);
          if (Array.isArray(parsedIds)) {
            setFichaIds(parsedIds.filter((id) => id && id !== "null"));
            console.log("parsedIds:", parsedIds);
          }
        } catch (error) {
          console.error("Erro ao ler fichaIds:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log("Ficha IDs atualizados:", fichaIds);
  }, [fichaIds]);

  const addFichaId = (newId) => {
    if (!newId) return;

    setFichaIds((prevIds) => {
      if (prevIds.includes(newId)) return prevIds;

      const updatedIds = [...prevIds, newId];
      localStorage.setItem("fichaIds", JSON.stringify(updatedIds));
      return updatedIds;
    });
  };

  return { fichaIds, addFichaId, setFichaIds };
};

// Função para limpar conteúdo da ficha (remover campos vazios e indesejados)
const cleanFichaContent = (content) => {
  const clean = (obj) => {
    if (Array.isArray(obj)) {
      const cleanedArray = obj
        .map((item) => clean(item))
        .filter(
          (item) =>
            item !== undefined &&
            !(typeof item === "object" && Object.keys(item).length === 0)
        );
      return cleanedArray.length > 0 ? cleanedArray : undefined;
    }

    if (obj && typeof obj === "object") {
      const cleaned = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (
          key.toLowerCase() !== "otherExameValue" &&
          key.toLowerCase() !== "opc" &&
          key.toLowerCase() !== "option"
        ) {
          const cleanedValue = clean(value);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
      });
      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }

    return obj !== "" && obj !== null && obj !== undefined ? obj : undefined;
  };

  return clean(content) || {};
};

// Função para validar string base64
const isValidBase64 = (str) => str && typeof str === "string" && str.startsWith("data:image/");

// Função para formatar o conteúdo da ficha
const formatFichaContent = (content) => {
  if (!content || typeof content !== "object") {
    return <p>Sem conteúdo disponível</p>;
  }

  return Object.entries(content).map(([key, value]) => {
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, " ");
    

    // Ignorar chaves indesejadas
    if (key.toLowerCase() === "opc" || key.toLowerCase() === "option") {
      return null;
    }

    // Caso especial para "Imagem da Lesão"
    if (key === "Imagem da Lesão" && value && typeof value === "object") {
      const imagemBase64 = value["Imagem (base64 ou URL)"];
      return (
        <div key={key} className={styles.fichaField}>
          <strong>{formattedKey}:</strong>
          {imagemBase64 && isValidBase64(imagemBase64) ? (
            <img
              src={imagemBase64}
              alt="Imagem da Lesão"
              style={{ maxWidth: "500px", border: "1px solid #ccc", marginTop: "10px" }}
            />
          ) : (
            <p>Sem imagem disponível</p>
          )}
          {/* Opcional: Exibir detalhes de "Linhas Desenhadas", se necessário */}
          {/* {value["Linhas Desenhadas"] && (
            <div style={{ marginTop: "10px" }}>
              <p><strong>Linhas Desenhadas:</strong></p>
              <p>Tamanho: {value["Linhas Desenhadas"].size}</p>
              <p>Ferramenta: {value["Linhas Desenhadas"].tool}</p>
              <p>Cor: {value["Linhas Desenhadas"].color}</p>
              <p>Pontos: {value["Linhas Desenhadas"].points.join(", ")}</p>
            </div>
          )} */}
        </div>
      );
    }
    if (key.toLowerCase() === "parametros" && Array.isArray(value)) {
  const valoresComDados = value.filter((item) => {
    // Mantém apenas os tempos que têm mais que só o tempo preenchido
    const { tempo, ...resto } = item;
    return Object.values(resto).some((v) => v !== "" && v !== null && v !== undefined);
  });

  if (valoresComDados.length === 0) return null;

  return (
    <div key={key}>
      <strong>{formattedKey}:</strong>
      {valoresComDados.map((item, idx) => (
        <div key={idx} style={{ marginLeft: "20px" }}>
          {Object.entries(item).map(([subKey, subValue]) => {
            const formattedSubKey = subKey
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .replace(/_/g, " ");
            return (
              <p key={subKey}>
                <strong>{formattedSubKey}:</strong> {String(subValue)}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}

    // Para arrays simples (ex.: Anamnese)
    if (Array.isArray(value) && value.every((item) => typeof item !== "object")) {
      return (
        <div key={key} className={styles.fichaField}>
          <strong>{formattedKey}:</strong>
          {value.length > 0 ? value.join(", ") : "Nenhum item selecionado"}
        </div>
      );
    }

    // Para arrays de objetos (ex.: itens complexos)
    if (Array.isArray(value)) {
      return (
        <div key={key} className={styles.fichaField}>
          <strong>{formattedKey}:</strong>
          {value.map((item, idx) => (
            <div key={idx} style={{ marginLeft: "20px" }}>
              {Object.entries(item)
                .filter(([subKey]) => subKey.toLowerCase() !== "opc" && subKey.toLowerCase() !== "option")
                .map(([subKey, subValue]) => {
                  const formattedSubKey = subKey
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace(/_/g, " ");
                  return (
                    <p key={subKey}>
                      <strong>{formattedSubKey}:</strong> {String(subValue) || "Não informado"}
                    </p>
                  );
                })}
            </div>
          ))}
        </div>
      );
    }

    // Para objetos aninhados (ex.: Características da Lesão, Citologia)
    if (typeof value === "object" && value !== null) {
      return (
        <div key={key} className={styles.fichaField}>
          <strong>{formattedKey}:</strong>
          <div style={{ marginLeft: "20px" }}>{formatFichaContent(value)}</div>
        </div>
      );
    }

    // Para valores simples
    return (
      <div key={key} className={styles.fichaField}>
        <strong>{formattedKey}:</strong> {String(value) || "Não informado"}
      </div>
    );
  }).filter(Boolean); // Remove elementos nulos
};

function CreateConsulta() {
  const router = useRouter();
  const { id } = router.query;

  const [showButtons, setShowButtons] = useState(false);
  const [showFichas, setShowFichas] = useState(false);
  const [selectedFichaId, setSelectedFichaId] = useState(null);

  const [historicoConsultas, setHistoricoConsultas] = useState([]); // Renomeado para evitar conflito
  const [loadingHistorico, setLoadingHistorico] = useState(false); // Para controlar o carregamento do histórico
  const [showHistorico, setShowHistorico] = useState(false); // Para controlar o toggle

  const { fichaIds, addFichaId, setFichaIds } = useFichaManager();
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showAlertFicha, setShowAlertFicha] = useState(false);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [animalId, setAnimalId] = useState(null);
  const [medicoId, setMedicoId] = useState(null);
  const [consulta, setConsulta] = useState({
    pesoAtual: null,
    idadeAtual: null,
    queixaPrincipal: "",
    alteracoesClinicasDiversas: "",
    suspeitasClinicas: "",
    alimentacao: "",
    medico: { id: null },
    parecer: null,
    proximaConsulta: false,
    encaminhamento: null,
    animal: { id: null },
    dataVaga: "",
    fichaIds: fichaIds,
    obito: false, // Adicionando campo obito
  });
  const [vagaData, setVagaData] = useState({});
  const { especialidades, error: especialidadesError } = EspecialidadeList();
  const [especialidade, setEspecialidade] = useState(null);
  const [fichasDados, setFichas] = useState([]);

  const handleEspecialidadeSelection = (event) => {
    const selectedEspecialidadeId = event.target.value;
    setEspecialidade(selectedEspecialidadeId);
  };


  // Parte responsavel pelo historico clinico do animal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month} às ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!animalId) return; // Só busca se tiver o ID do animal

    const fetchHistorico = async () => {
      setLoadingHistorico(true);
      try {
        const consultasData = await getConsultaByAnimal(animalId);
        setHistoricoConsultas(consultasData);
      } catch (error) {
        console.error("Erro ao buscar histórico de consultas:", error);
      } finally {
        setLoadingHistorico(false);
      }
    };

     // Só busca o histórico se o toggle estiver aberto
    if (showHistorico) {
      fetchHistorico();
    }
  }, [animalId, showHistorico]);

  
  useEffect(() => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem('consultaFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Atualiza o estado 'consulta' com os dados salvos
        setConsulta(parsedData);
      } catch (error) {
        console.error("Erro ao carregar dados do formulário do localStorage:", error);
        // Se houver erro, limpa o item inválido
        localStorage.removeItem('consultaFormData');
      }
    }
  }
}, []);

useEffect(() => {
  // Este efeito roda sempre que o estado 'consulta' for atualizado.
  // A verificação inicial evita salvar o estado padrão vazio na primeira renderização,
  // embora salvá-lo não seja um grande problema.
  if (consulta.queixaPrincipal || consulta.pesoAtual || consulta.idadeAtual) {
      localStorage.setItem('consultaFormData', JSON.stringify(consulta));
  }
}, [consulta]);

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const fetchedFichas = await Promise.all(
          fichaIds.map((id) => getFichaById(id))
        );
        const fichasComConteudo = fetchedFichas.map((ficha) => ({
          ...ficha,
          conteudo: cleanFichaContent(JSON.parse(ficha.conteudo || "{}")),
        }));
        setFichas(fichasComConteudo);
        console.log("Fichas processadas:", fichasComConteudo);
      } catch (error) {
        console.error("Erro ao buscar fichas:", error);
        setShowErrorAlert(true);
      }
    };

    if (fichaIds.length > 0) {
      fetchFichas();
    }
  }, [fichaIds]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentFichaId = localStorage.getItem("fichaId");
      if (currentFichaId) {
        console.log("currentFichaId:", currentFichaId);
        addFichaId(currentFichaId);
        localStorage.removeItem("fichaId");
      }
    }
  }, [addFichaId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const vagaJson = await getVagaById(id);
          setVagaData(vagaJson);
          setAnimalId(vagaJson.agendamento.animal.id);
          setMedicoId(vagaJson.medico.id);
        } catch (error) {
          console.error("Erro ao buscar vaga:", error);
          setShowErrorAlert(true);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setConsulta((prev) => ({ ...prev, fichaIds }));
  }, [fichaIds]);

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

  const handleConsultaChange = (event) => {
    const { name, value } = event.target;
    setConsulta({ ...consulta, [name]: value });
  };

  const handleProximaConsultaChange = (event) => {
    const { value } = event.target;
    setConsulta({ ...consulta, proximaConsulta: value === "true" });
  };

  const handleObitoChange = (event) => {
  const value = event.target.value === 'true';
    setConsulta(prevConsulta => ({
      ...prevConsulta,
      obito: value
    }));
  };

  

  const validateFields = (consulta) => {
    const errors = {};
    if (!consulta.pesoAtual || isNaN(consulta.pesoAtual) || consulta.pesoAtual <= 0) {
      errors.pesoAtual = "Peso deve ser um número positivo";
    }
    if (!consulta.idadeAtual || isNaN(consulta.idadeAtual) || consulta.idadeAtual <= 0) {
      errors.idadeAtual = "Idade deve ser um número positivo";
    }
    if (!consulta.queixaPrincipal.trim()) {
      errors.queixaPrincipal = "Campo obrigatório";
    }
    if (!consulta.alteracoesClinicasDiversas.trim()) {
      errors.alteracoesClinicasDiversas = "Campo obrigatório";
    }
    if (!consulta.suspeitasClinicas.trim()) {
      errors.suspeitasClinicas = "Campo obrigatório";
    }
    if (!consulta.alimentacao.trim()) {
      errors.alimentacao = "Campo obrigatório";
    }
    return errors;
  };

  const consultaToCreate = {
    pesoAtual: isNaN(parseFloat(consulta.pesoAtual)) ? null : parseFloat(consulta.pesoAtual),
    idadeAtual: isNaN(parseFloat(consulta.idadeAtual)) ? null : parseFloat(consulta.idadeAtual),
    queixaPrincipal: consulta.queixaPrincipal.trim(),
    alteracoesClinicasDiversas: consulta.alteracoesClinicasDiversas.trim(),
    suspeitasClinicas: consulta.suspeitasClinicas.trim(),
    alimentacao: consulta.alimentacao.trim(),
    medico: { id: medicoId },
    proximaConsulta: consulta.proximaConsulta,
    encaminhamento: especialidade ? { id: especialidade } : null,
    animal: { id: animalId },
    dataVaga: vagaData.dataHora,
    ficha: fichaIds.map((id) => ({ id: Number(id) })),
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields(consulta);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      console.log("Criando consulta com os dados:", consultaToCreate);
      await createConsulta(consultaToCreate, id);
      // Limpa os dados salvos do localStorage após o sucesso
      localStorage.removeItem('consultaFormData');
      // Também é uma boa ideia limpar os IDs das fichas aqui
      localStorage.removeItem('fichaIds'); 
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      setShowErrorAlert(true);
    }
  };

  const handleClick = (path, id) => {
    router.push(`${path}?fichaId=${id}&animalId=${animalId}&agendamentoId=${id}`);
  };

  const rotasPorNome = {
    "Ficha de sessão": "/updateFichaSessao",
    "Ficha Anestesiológica": "/updateFichaAnestesiologia",
    "Ficha de ato cirúrgico": "/updateFichaAtoCirurgico",
    "Ficha clínica cardiológica": "/updateFichaCardiologica",
    "Ficha Clínica Médica": "/updateFichaClinicaMedica",
    "Ficha Clínica Médica (silvestres ou exóticos)": "/updateFichaClinicaMedicaSilvestres",
    "Ficha dermatológica de retorno": "/updateFichaDermatologicaRetorno",
    "Ficha clínica dermatológica": "/updateFichaDermatologica",
    "Ficha de solicitação de citologia": "/updateFichaSolicitacaoCitologia",
    "Ficha clínico médica de retorno": "/updateFichaMedicaRetorno",
    "Ficha clínica neurológica": "/updateFichaNeurologica",
    "Ficha clínica ortopédica": "/updateFichaOrtopedica",
    "Ficha de Reabilitação Integrativa": "/updateFichaReabilitacao",
    "Ficha Solicitação de Exame": "/updateFichaSolicitacaoExame",
    "Ficha de Retorno Clínico de Animais Silvestres e Exóticos": "/updateFichaRetornoClinicoSil",
  };

  const handleRoute = (fichaNome, id, fichaId) => {
    const path = rotasPorNome[fichaNome];
    router.push(`${path}?consultaId=${id}&animalId=${animalId}&fichaId=${fichaId}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFicha(id);
      setFichas((prev) => prev.filter((ficha) => ficha.id !== id));
      setFichaIds((prev) => {
        const updatedIds = prev.filter((fichaId) => fichaId !== id.toString());
        localStorage.setItem("fichaIds", JSON.stringify(updatedIds));
        return updatedIds;
      });
      setShowAlertFicha(true);
      if (selectedFichaId === id) {
        setSelectedFichaId(null);
      }
    } catch (error) {
      console.error("Erro ao deletar ficha:", error);
      setShowErrorAlert(true);
    }
  };

  const handleCloseAlertFicha = () => {
    setShowAlertFicha(false);
  };

  const toggleFichaDisplay = (fichaId) => {
    setSelectedFichaId((prev) => (prev === fichaId ? null : fichaId));
  };

  return (
    <>
      <VoltarButton />
      <div>
        <h1 className={styles.titulocadastro}>Criar consulta</h1>
      </div>

      <div className={`${styles.boxagendarconsulta} ${styles.container}`}>




        <div className={styles.box_ficha_toggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${showHistorico ? styles.minimize : styles.expand}`}
              onClick={() => setShowHistorico((prev) => !prev)}
            >
              {showHistorico ? "Ocultar Histórico Clínico" : "Visualizar Histórico Clínico"}
            </button>
            {showHistorico && (
              <div className={styles.ficha_container}>
                <div className={styles.form_box}>
                  {loadingHistorico ? (
                    <p className={styles.message}>Carregando histórico...</p>
                  ) : historicoConsultas.length === 0 ? (
                    <p className={styles.message}>Não há consultas registradas para este animal.</p>
                  ) : (
                    <ul className={styles.list}>
                      {historicoConsultas.map((consulta) => (
                        <li key={consulta.id} className={styles.info_container}>
                          <div className={styles.agendamentos}>
                            <div className={styles.agendamentoBox}>
                              <div>
                                <h1>Consulta Clínica</h1>
                                <h2>{formatDate(consulta.dataVaga)}</h2>
                              </div>
                              <div>
                                <h1>Paciente</h1>
                                <h2>{consulta.animal?.nome}</h2>
                              </div>
                              <div>
                                <h1>Veterinário&#40;a&#41;</h1>
                                <h2>{consulta.medico?.nome}</h2>
                              </div>
                              <div>
                                <button
                                  className={styles.acessar_button}
                                  onClick={() =>
                                    router.push(`/getConsultaById/${consulta.id}`)
                                  }
                                >
                                  Visualizar
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>





        <form>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="animal" className="form-label">
                Paciente<span className={styles.obrigatorio}>*</span>
              </label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={
                  vagaData.agendamento &&
                  vagaData.agendamento.animal &&
                  vagaData.agendamento.animal.nome ||
                  "Carregando..."
                }
                disabled
              />
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="medico" className="form-label">
                Veterinário(a)<span className={styles.obrigatorio}>*</span>
              </label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={vagaData.medico && vagaData.medico.nome || "Carregando..."}
                disabled
              />
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="pesoAtual" className="form-label">
                  Peso atual<span className={styles.obrigatorio}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.pesoAtual ? "is-invalid" : ""}`}
                  name="pesoAtual"
                  placeholder="Digite o peso do animal"
                  value={consulta.pesoAtual || ""}
                  onChange={handleConsultaChange}
                />
                {errors.pesoAtual && (
                  <div className={`invalid-feedback ${styles.error_message}`}>
                    {errors.pesoAtual}
                  </div>
                )}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="idadeAtual" className="form-label">
                  Idade atual<span className={styles.obrigatorio}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.idadeAtual ? "is-invalid" : ""}`}
                  name="idadeAtual"
                  placeholder="Digite a idade do animal"
                  value={consulta.idadeAtual || ""}
                  onChange={handleConsultaChange}
                />
                {errors.idadeAtual && (
                  <div className={`invalid-feedback ${styles.error_message}`}>
                    {errors.idadeAtual}
                  </div>
                )}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="medico" className="form-label">
                  Especialidade
                </label>
                <select
                  className={`form-select ${styles.input}`}
                  name="encaminhamento"
                  aria-label="Selecione uma especialidade"
                  value={especialidade || ""}
                  onChange={handleEspecialidadeSelection}
                >
                  <option value="">Selecione uma especialidade</option>
                  {especialidades.map((especialidade) => (
                    <option key={especialidade.id} value={especialidade.id}>
                      {especialidade.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="queixaPrincipal" className="form-label">
                  Queixa principal
                </label>
                <textarea
                  className={`form-control ${styles.input} ${errors.queixaPrincipal ? "is-invalid" : ""}`}
                  name="queixaPrincipal"
                  placeholder="Digite a queixa principal"
                  value={consulta.queixaPrincipal || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                {errors.queixaPrincipal && (
                  <div className={`invalid-feedback ${styles.error_message}`}>
                    {errors.queixaPrincipal}
                  </div>
                )}
              </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="alteracoesClinicasDiversas" className="form-label">
                  Alterações clínicas diversas
                </label>
                <textarea
                  className={`form-control ${styles.input} ${errors.alteracoesClinicasDiversas ? "is-invalid" : ""}`}
                  name="alteracoesClinicasDiversas"
                  placeholder="Digite as alterações clínicas diversas"
                  value={consulta.alteracoesClinicasDiversas || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                {errors.alteracoesClinicasDiversas && (
                  <div className={`invalid-feedback ${styles.error_message}`}>
                    {errors.alteracoesClinicasDiversas}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="suspeitasClinicas" className="form-label">
                  Suspeitas clínicas
                </label>
                <textarea
                  className={`form-control ${styles.input} ${errors.suspeitasClinicas ? "is-invalid" : ""}`}
                  name="suspeitasClinicas"
                  placeholder="Digite as suspeitas clínicas"
                  value={consulta.suspeitasClinicas || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                {errors.suspeitasClinicas && (
                  <div className={`invalid-feedback ${styles.error_message}`}>
                    {errors.suspeitasClinicas}
                  </div>
                )}
              </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="alimentacao" className="form-label">
                  Alimentação
                </label>
                <textarea
                  className={`form-control ${styles.input} ${errors.alimentacao ? "is-invalid" : ""}`}
                  name="alimentacao"
                  placeholder="Digite a alimentação"
                  value={consulta.alimentacao || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                {errors.alimentacao && (
                  <div className={`invalid-feedback ${styles.error_message}`}>
                    {errors.alimentacao}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col_radio}`}>
                <label htmlFor="tipoEspecial" className="form-label">
                  Retorno?
                </label>
                <div>
                  <input
                    type="radio"
                    className={`form-check-input ${styles.checkbox}`}
                    id="sim"
                    name="proximaConsulta"
                    value="true"
                    checked={consulta.proximaConsulta === true}
                    onChange={handleProximaConsultaChange}
                  />
                  <label htmlFor="sim" className={styles.input}>
                    Sim
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    className={`form-check-input ${styles.checkbox}`}
                    id="nao"
                    name="proximaConsulta"
                    value="false"
                    checked={consulta.proximaConsulta === false}
                    onChange={handleProximaConsultaChange}
                  />
                  <label htmlFor="nao" className={styles.input}>
                    Não
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
          <div className="row">
            <div className={`col ${styles.col_radio}`}>
              <label htmlFor="obito" className="form-label">
                Óbito?
              </label>
              <div>
                <input
                  type="radio"
                  className={`form-check-input ${styles.checkbox}`}
                  id="obito_sim"
                  name="obito"
                  value="true"
                  checked={consulta.obito === true}
                  onChange={handleObitoChange}
                />
                <label htmlFor="obito_sim" className={styles.input}>
                  Sim
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  className={`form-check-input ${styles.checkbox}`}
                  id="obito_nao"
                  name="obito"
                  value="false"
                  checked={consulta.obito === false}
                  onChange={handleObitoChange}
                />
                <label htmlFor="obito_nao" className={styles.input}>
                  Não
                </label>
              </div>
            </div>
          </div>
        </div>

          <div className={styles.box_ficha_toggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
              onClick={() => setShowButtons((prev) => !prev)}
            >
              {showButtons ? "Minimizar Fichas" : "Fichas"}
            </button>
            {showButtons && (
              <div className={styles.ficha_container}>
                <div className={styles.form_box}>
                  <div className={styles.box_ficha_buttons}>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaClinicaMedica", id)}
                    >
                      Ficha clínica médica
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaMedicaRetorno", id)}
                    >
                      Ficha clínica médica de retorno
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaClinicaMedicaSilvestres", id)}
                    >
                      Ficha clínica médica silvestres ou exóticos
                    </button>

                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaRetornoClinicoSil", id)}
                    >
                      Ficha clínica médica de retorno silvestre ou exóticos
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaAtoCirurgico", id)}
                    >
                      Ficha de ato cirúrgico
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaAnestesiologia", id)}
                    >
                      Ficha de anestesiologia
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaCardiologica", id)}
                    >
                      Ficha cardiológica
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaAtendimentoOrtopedico", id)}
                    >
                      Ficha ortopédica
                    </button>
                
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaDermatologica", id)}
                    >
                      Ficha dermatológica
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaDermatologicaRetorno", id)}
                    >
                      Ficha dermatológica de retorno
                    </button>

                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaNeurologica", id)}
                    >
                      Ficha neurológica
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaReabilitacaoIntegrativa", id)}
                    >
                      Ficha de reabilitação integrativa
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaSessao", id)}
                    >
                      Ficha de sessão
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaSolicitacaoCitologia", id)}
                    >
                      Ficha de solicitação de citologia
                    </button>
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaSolicitacaoExame", id)}
                    >
                      Ficha de solicitação de exame
                    </button>
                    
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão Fichas Solicitadas */}
          <div className={styles.box_ficha_toggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${showFichas ? styles.minimize : styles.expand}`}
              onClick={() => setShowFichas((prev) => !prev)}
            >
              {showFichas ? "Ocultar Fichas Adicionadas" : "Fichas Adicionadas"}
            </button>
            {showFichas && (
              <div className={styles.ficha_container}>
                <div className={styles.form_box}>
                  <div className={styles.box_ficha_buttons}>
                    {fichasDados.length > 0 ? (
                      fichasDados.map((ficha) => (
                        <div key={ficha.id} className={styles.ficha_item}>
                          <button
                            type="button"
                            className={`${styles.ficha_button} ${
                              selectedFichaId === ficha.id ? styles.selected : ""
                            }`}
                            onClick={() => toggleFichaDisplay(ficha.id)}
                            aria-label={`Exibir detalhes da ficha ${ficha.nome || "Ficha sem nome"}`}
                          >
                            {ficha.nome || `Ficha ${ficha.id}`}
                          </button>
                          {selectedFichaId === ficha.id && (
                            <div
                              className={styles.ficha_details}
                              style={{
                                border: "1px solid #ccc",
                                margin: "10px 0",
                                padding: "10px",
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              <p>
                                <strong>ID:</strong> {ficha.id}
                              </p>
                              <p>
                                <strong>Data de criação:</strong>{" "}
                                {new Date(ficha.dataHora).toLocaleString()}
                              </p>
                              <p>
                                <strong>Nome:</strong> {ficha.nome || "Sem nome"}
                              </p>
                              {/*<div className={styles.fichaContent}>
                                {formatFichaContent(ficha.conteudo)}
                              </div>*/}
                              <div className={styles.fichaActions}>
                                <button
                                  className={styles.voltarButton}
                                  type="button"
                                  onClick={() => handleDelete(ficha.id)}
                                  style={{ marginTop: "15px" }}
                                  aria-label={`Excluir ficha ${ficha.nome || "Ficha sem nome"}`}
                                >
                                  Excluir ficha
                                </button>
                                <button
                                  className={styles.voltarButton}
                                  type="button"
                                  style={{ marginTop: "15px" }}
                                  onClick={() => handleRoute(ficha.nome, id, ficha.id)}
                                >
                                  Editar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={styles.no_fichas}>Nenhuma ficha solicitada.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.continuarbotao}>
            <button
              className={styles.voltarButton}
              type="button"
              onClick={() => router.back()}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={styles.continuarButton}
              onClick={handleSubmit}
            >
              Criar
            </button>
          </div>
        </form>

        {showAlert && (
          <Alert
            message="Consulta criada com sucesso!"
            show={showAlert}
            url={`/getAllConsultas/${vagaData.agendamento?.animal?.id}`}
          />
        )}
        {showAlertFicha && (
          <Alert
            message="Ficha excluída com sucesso!"
            show={showAlertFicha}
            onClose={handleCloseAlertFicha}
          />
        )}
        {vagaData.consulta === null ? (
          showErrorAlert && (
            <ErrorAlert
              message="Erro ao criar consulta, tente novamente."
              show={showErrorAlert}
            />
          )
        ) : (
          showErrorAlert && (
            <ErrorAlert
              message="Consulta já foi criada, tente editá-la."
              show={showErrorAlert}
            />
          )
        )}
      </div>
    </>
  );
}

export default CreateConsulta;