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

// Função para verificar se o conteúdo é válido
const hasContent = (value) =>
  value !== null && value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0);

// Função para validar string base64
const isValidBase64 = (str) => str && typeof str === "string" && str.startsWith("data:image/");

// Configuração das fichas
const fichaConfig = {
  "Ficha de ato cirúrgico": [
    { field: "descricaoAtoCirurgico", label: "Descrição do Ato Cirúrgico", type: "textarea", rows: 4 },
    { field: "nomeDaCirurgia", label: "Nome da Cirurgia", type: "textarea" },
    {
      field: "prognostico",
      label: "Prognóstico",
      type: "select",
      options: [
        { value: "", label: "Selecione" },
        { value: "FAVORAVEL", label: "Favorável" },
        { value: "RESERVADO", label: "Reservado" },
        { value: "DESFAVORAVEL", label: "Desfavorável" },
      ],
    },
    {
      field: "protocolos",
      label: "Protocolos Terapêuticos a serem Instituídos",
      type: "table",
      columns: [
        { key: "medicacao", label: "Medicação" },
        { key: "dose", label: "Dose" },
        { key: "frequencia", label: "Frequência" },
        { key: "periodo", label: "Período" },
      ],
    },
    { field: "reavaliacao", label: "Retorno para Reavaliações", type: "textarea", rows: 4 },
    { field: "equipeResponsavel", label: "Plantonista(s) Discente(s)", type: "textarea" },
    { field: "medicosResponsaveis", label: "Médico(s) Veterinário(s) Responsável", type: "textarea" },
    { field: "data", label: "Data", type: "date", fallbackField: "dataConsulta" },
  ],
  "Ficha de solicitação de citologia": [
    { field: "Anamnese", label: "Anamnese", type: "textarea", rows: 4, transform: (value) => (Array.isArray(value) ? value.join(", ") : value) },
    { field: "dataColheita", label: "Data da Colheita", type: "date", fallbackField: "data" },
    { field: "historicoExameFisico", label: "Histórico/Exame Físico", type: "text" },
    { field: "localizacaoLesao", label: "Localização da Lesão", type: "text" },
    { field: "imagemLesao.imagem", label: "Imagem da Lesão", type: "image" },
    { field: "caracteristicasLesao.selecionadas", label: "Características da Lesão", type: "textarea", rows: 4, transform: (value) => value.join(", ") },
    { field: "caracteristicasLesao.descricao", label: "Descrição da Lesão", type: "text" },
    { field: "caracteristicasLesao.cor", label: "Cor", type: "text" },
    { field: "caracteristicasLesao.consistencia", label: "Consistência", type: "text" },
    { field: "caracteristicasLesao.bordas", label: "Bordas", type: "text" },
    { field: "caracteristicasLesao.ulceracao", label: "Ulceração", type: "text" },
    { field: "caracteristicasLesao.dorPalpacao", label: "Dor à Palpação", type: "text" },
    { field: "caracteristicasLesao.temperaturaLocal", label: "Temperatura Local", type: "text" },
    { field: "caracteristicasLesao.relacaoTecidosVizinhos", label: "Relação com Tecidos Vizinhos", type: "text" },
    { field: "citologia.descricao", label: "Descrição Citológica", type: "text" },
    { field: "citologia.metodo", label: "Método", type: "text" },
    { field: "citologia.numeroLaminas", label: "Número de Lâminas", type: "text" },
    { field: "citologia.resultado", label: "Resultado", type: "text" },
    { field: "citologia.conclusao", label: "Conclusão", type: "text" },
    { field: "citologia.comentarios", label: "Comentários", type: "textarea", rows: 4 },
  ],
  "Ficha clínica neurológica": [
    { field: "sintomasNeurologicos", label: "Sintomas Neurológicos", type: "textarea", rows: 4 },
    { field: "examesRealizados", label: "Exames Realizados", type: "textarea", rows: 4 },
    { field: "diagnostico", label: "Diagnóstico", type: "text" },
    { field: "dataConsulta", label: "Data da Consulta", type: "date", fallbackField: "data" },
    { field: "medicoResponsavel", label: "Médico Responsável", type: "text" },
  ],
  "Ficha clínica cardiológica": [
    // Página 1
    { field: "peso", label: "Peso", type: "text" },
    {
      field: "vacinacao",
      label: "Vacinação",
      type: "nested",
      subFields: [
        { field: "antiRabica", label: "Antirrábica", type: "text" },
        { field: "giardia", label: "Giardia", type: "text" },
        { field: "leishmaniose", label: "Leishmaniose", type: "text" },
        { field: "tosseDosCanis", label: "Tosse dos Canis", type: "text" },
        { field: "polivalenteCanina", label: "Polivalente Canina", type: "text" },
        { field: "polivalenteFelina", label: "Polivalente Felina", type: "text" },
        { field: "outros", label: "Outros", type: "text" },
        { field: "naoVacinado", label: "Não Vacinado", type: "text" },
        { field: "naoInformado", label: "Não Informado", type: "text" },
      ],
    },
    { field: "alimentacao", label: "Alimentação", type: "textarea", rows: 4 },
    { field: "estiloVida", label: "Estilo de Vida", type: "textarea", rows: 4 },
    { field: "contactantes", label: "Contactantes", type: "textarea", rows: 4 },
    { field: "sinaisClinicos", label: "Sinais Clínicos", type: "textarea", rows: 4, transform: (value) => (Array.isArray(value) ? value.join(", ") : value) },
    { field: "antecedentesHistorico", label: "Antecedentes/Histórico", type: "textarea", rows: 4 },
    // Página 2
    { field: "ExameFisico.postura", label: "Postura", type: "text" },
    { field: "ExameFisico.nivelConsciencia", label: "Nível de Consciência", type: "text" },
    { field: "ExameFisico.temperatura", label: "Temperatura", type: "text" },
    { field: "ExameFisico.score", label: "Score", type: "text" },
    { field: "ExameFisico.acp", label: "ACP", type: "text" },
    { field: "ExameFisico.pulsoArterial", label: "Pulso Arterial", type: "text" },
    { field: "ExameFisico.distencaoEPulso", label: "Distensão e Pulso", type: "text" },
    { field: "ExameFisico.respiracao", label: "Respiração", type: "text" },
    { field: "ExameFisico.narinasEOutros", label: "Narinas e Outros", type: "text" },
    { field: "ExameFisico.freqCardiaca", label: "Frequência Cardíaca", type: "text" },
    { field: "ExameFisico.freqRespiratoria", label: "Frequência Respiratória", type: "text" },
    { field: "ExameFisico.abdomem", label: "Abdômen", type: "text" },
    { field: "ExameFisico.hidratacao", label: "Hidratação", type: "text" },
    { field: "ExameFisico.tpc", label: "TPC", type: "text" },
    { field: "ExameFisico.turgorCutaneo", label: "Turgor Cutâneo", type: "text" },
    {
      field: "mucosas",
      label: "Mucosas",
      type: "nested",
      subFields: [
        { field: "roseas", label: "Roseas", type: "text" },
        { field: "roseasPalidas", label: "Roseas Pálidas", type: "text" },
        { field: "porcelanicas", label: "Porcelânicas", type: "text" },
        { field: "hiperemicas", label: "Hiperêmicas", type: "text" },
        { field: "cianoticas", label: "Cianóticas", type: "text" },
        { field: "ictaricas", label: "Ictáricas", type: "text" },
        { field: "naoAvaliado", label: "Não Avaliado", type: "text" },
      ],
    },
    {
      field: "linfonodos",
      label: "Linfonodos",
      type: "nested",
      subFields: [], // Dinâmico, pode ser configurado no backend
    },
    // Página 3
    { field: "ExamesComplementares.examesAnteriores", label: "Exames Anteriores", type: "textarea", rows: 4 },
    { field: "diagnostico", label: "Diagnóstico", type: "nested", subFields: [] }, // Dinâmico
    {
      field: "medicacoes",
      label: "Medicações",
      type: "table",
      columns: [
        { key: "medicacao", label: "Medicação" },
        { key: "dose", label: "Dose" },
        { key: "frequencia", label: "Frequência" },
        { key: "periodo", label: "Período" },
      ],
    },
    { field: "plantonistas", label: "Plantonistas", type: "textarea", rows: 4 },
    { field: "medicosResponsaveis", label: "Médicos Responsáveis", type: "textarea", rows: 4 },
  ],
};

// Componentes reutilizáveis para renderizar campos
const TextareaField = ({ label, value, rows = 4 }) => (
  <div className={styles.column}>
    <label>{label}</label>
    <textarea value={value || ""} disabled className="form-control" rows={rows} />
  </div>
);

const TextField = ({ label, value }) => (
  <div className={styles.column}>
    <label>{label}</label>
    <input type="text" value={value || ""} disabled className="form-control" />
  </div>
);

const DateField = ({ label, value }) => (
  <div className={styles.column}>
    <label>{label}</label>
    <input
      type="text"
      value={value ? value.split("-").reverse().join("/") : "Não informada"}
      disabled
      className="form-control"
    />
  </div>
);

const ImageField = ({ label, value }) =>
  isValidBase64(value) ? (
    <div className={styles.column}>
      <label>{label}</label>
      <img src={value} alt={label} style={{ maxWidth: "500px", border: "1px solid #ccc" }} />
    </div>
  ) : null;

const SelectField = ({ label, value, options }) => (
  <div className={styles.column}>
    <label>{label}</label>
    <select value={value || ""} disabled className="form-control">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const TableField = ({ label, value, columns }) => (
  <div className={styles.column}>
    <label>{label}</label>
    <table className={styles.tabela_tratamento}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(value || []).map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.key}>
                <input type="text" value={row[col.key] || ""} disabled className="form-control" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const NestedField = ({ label, value, subFields }) => {
  if (!value || Object.keys(value).length === 0) return null;
  return (
    <div className={styles.column}>
      <label>{label}</label>
      <div style={{ marginLeft: "20px" }}>
        {subFields.map((subField, index) => {
          const subValue = getNestedValue(value, subField.field);
          if (!hasContent(subValue)) return null;
          return renderField({ ...subField, label: subField.label }, value);
        })}
      </div>
    </div>
  );
};

// Função para acessar valores aninhados
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

// Função para renderizar um campo com base na configuração
const renderField = (fieldConfig, content) => {
  const value = getNestedValue(content, fieldConfig.field) || (fieldConfig.fallbackField && getNestedValue(content, fieldConfig.fallbackField));
  if (!hasContent(value)) return null;

  const transformedValue = fieldConfig.transform ? fieldConfig.transform(value) : value;

  switch (fieldConfig.type) {
    case "textarea":
      return <TextareaField label={fieldConfig.label} value={transformedValue} rows={fieldConfig.rows} />;
    case "text":
      return <TextField label={fieldConfig.label} value={transformedValue} />;
    case "date":
      return <DateField label={fieldConfig.label} value={transformedValue} />;
    case "image":
      return <ImageField label={fieldConfig.label} value={transformedValue} />;
    case "select":
      return <SelectField label={fieldConfig.label} value={transformedValue} options={fieldConfig.options} />;
    case "table":
      return <TableField label={fieldConfig.label} value={transformedValue} columns={fieldConfig.columns} />;
    case "nested":
      return <NestedField label={fieldConfig.label} value={value} subFields={fieldConfig.subFields} />;
    default:
      return null;
  }
};

// Função para formatar o conteúdo da ficha
const formatFichaContent = (content, fichaNome) => {
  if (!content || typeof content !== "object") {
    console.log("Conteúdo inválido ou ausente para:", fichaNome, content);
    return <p>Sem conteúdo disponível</p>;
  }

  const config = fichaConfig[fichaNome] || [];
  if (config.length === 0) {
    // Lógica genérica para fichas não configuradas
    return Object.entries(content)
      .filter(([key, value]) => {
        if (key.toLowerCase() === "opc" || key.toLowerCase() === "option") return false;
        return value !== null && value !== undefined;
      })
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .replace(/_/g, " ");

        if (key.toLowerCase().includes("data") && value) {
          return <DateField key={key} label={formattedKey} value={value} />;
        }

        if (key === "Imagem da Lesão" && value && typeof value === "object") {
          const imagemBase64 = value["Imagem (base64 ou URL)"];
          return imagemBase64 && isValidBase64(imagemBase64) ? (
            <ImageField key={key} label={formattedKey} value={imagemBase64} />
          ) : null;
        }

        if (key.toLowerCase() === "parametros" && Array.isArray(value)) {
          const valoresComDados = value.filter((item) => {
            const { tempo, ...resto } = item;
            return Object.values(resto).some((v) => v !== "" && v !== null && v !== undefined);
          });

          return valoresComDados.length > 0 ? (
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
          ) : null;
        }

        if (Array.isArray(value) && value.every((item) => typeof item !== "object")) {
          return value.length > 0 ? (
            <div key={key} className={styles.fichaField}>
              <strong>{formattedKey}:</strong> {value.join(", ")}
            </div>
          ) : null;
        }

        if (Array.isArray(value)) {
          return value.length > 0 ? (
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
          ) : null;
        }

        if (typeof value === "object" && value !== null) {
          const nestedContent = formatFichaContent(value, fichaNome);
          return nestedContent.props.children.length > 0 ? (
            <div key={key} className={styles.fichaField}>
              <strong>{formattedKey}:</strong>
              <div style={{ marginLeft: "20px" }}>{nestedContent}</div>
            </div>
          ) : null;
        }

        return (
          <div key={key} className={styles.fichaField}>
            <strong>{formattedKey}:</strong> {String(value) || "Não informado"}
          </div>
        );
      })
      .filter(Boolean);
  }

  return (
    <div className={styles.form_box}>
      {config.map((fieldConfig, index) => (
        <React.Fragment key={index}>{renderField(fieldConfig, content)}</React.Fragment>
      ))}
    </div>
  );
};

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

// Função para limpar conteúdo da ficha
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

// O restante do componente CreateConsulta permanece igual
function CreateConsulta() {
  const router = useRouter();
  const { id } = router.query;

  const [showButtons, setShowButtons] = useState(false);
  const [showFichas, setShowFichas] = useState(false);
  const [selectedFichaId, setSelectedFichaId] = useState(null);

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
  });
  const [vagaData, setVagaData] = useState({});
  const { especialidades, error: especialidadesError } = EspecialidadeList();
  const [especialidade, setEspecialidade] = useState(null);
  const [fichasDados, setFichas] = useState([]);

  const handleEspecialidadeSelection = (event) => {
    const selectedEspecialidadeId = event.target.value;
    setEspecialidade(selectedEspecialidadeId);
  };

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const fetchedFichas = await Promise.all(
          fichaIds.map(async (id) => {
            const ficha = await getFichaById(id);
            console.log(`Ficha ID ${id} bruta:`, ficha);
            return ficha || { id, nome: "Ficha sem dados", conteudo: {} };
          })
        );
        console.log("Fichas brutas:", fetchedFichas);
        const fichasComConteudo = fetchedFichas.map((ficha) => ({
          ...ficha,
          conteudo: cleanFichaContent(JSON.parse(ficha.conteudo || "{}")),
        }));
        console.log("Fichas processadas:", fichasComConteudo);
        setFichas(fichasComConteudo);
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
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      setShowErrorAlert(true);
    }
  };

  const handleClick = (path, id, fichaId) => {
    router.push(`${path}?consultaId=${id}&animalId=${animalId}&fichaId=${fichaId}`);
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
                      onClick={() => handleClick("/fichaRetornoClinicoSil", id)}
                    >
                      Ficha clínica médica de retorno silvestre
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
                    <button
                      className={styles.ficha_button}
                      type="button"
                      onClick={() => handleClick("/fichaClinicaMedicaSilvestres", id)}
                    >
                      Ficha Clínica Médica (silvestres ou exóticos)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                            <div className={styles.ficha_details}>
                              <div className={styles.fichaContent}>
                                {formatFichaContent(ficha.conteudo, ficha.nome)}
                              </div>
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
                                  aria-label={`Editar ficha ${ficha.nome || "Ficha sem nome"}`}
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