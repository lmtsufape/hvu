import React, { useState, useEffect, useMemo } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { getFichasByAnimalId } from "../../../services/fichaService";
import { getVagaByAgendamento } from "../../../services/vagaService";

function HistoricoFichasAnimal({
  animalId: animalIdProp,
  embedded = false,
  skipPermissionCheck = false,
  allowedRoles = ["medico"],
}) {
  const router = useRouter();
  const { id: animalIdFromRoute } = router.query;
  const animalId = animalIdProp || animalIdFromRoute;
  const [agendamentosComFichas, setAgendamentosComFichas] = useState(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipoFicha, setFiltroTipoFicha] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const rotasPorNome = {
    "Ficha clínica ortopédica": "/updateFichaOrtopedica",
    "Ficha clínica cardiológica": "/updateFichaCardiologica",
    "Ficha Clínica Médica": "/updateFichaClinicaMedica",
    "Ficha clínico médica de retorno": "/updateFichaMedicaRetorno",
    "Ficha dermatológica de retorno": "/updateFichaDermatologicaRetorno",
    "Ficha de solicitação de citologia": "/updateFichaSolicitacaoCitologia",
    "Ficha clínica dermatológica": "/updateFichaDermatologica",
    "Ficha de Retorno Clínico de Animais Silvestres e Exóticos": "/updateFichaRetornoClinicoSil",
    "Ficha clínica neurológica": "/updateFichaNeurologica",
    "Ficha de sessão": "/updateFichaSessao",
    "Ficha de Reabilitação Integrativa": "/updateFichaReabilitacao",
    "Ficha Solicitação de Exame": "/updateFichaSolicitacaoExame",
    "Ficha Clínica Médica (silvestres ou exóticos)": "/updateFichaClinicaMedicaSilvestres",
    "Ficha Anestesiológica": "/updateFichaAnestesiologia",
    "Ficha de ato cirúrgico": "/updateFichaAtoCirurgico",
  };

  useEffect(() => {
    const fetchDataAndGroup = async () => {
      if (!animalId) {
        setLoading(false);
        return;
      }
      try {
        const todasAsFichas = await getFichasByAnimalId(animalId);
        if (!Array.isArray(todasAsFichas)) {
          setAgendamentosComFichas(new Map());
          return;
        }

        const groupedByAgendamento = todasAsFichas.reduce((acc, ficha) => {
          const agendamento = ficha.agendamento;
          if (agendamento?.id) {
            if (!acc.has(agendamento.id)) {
              acc.set(agendamento.id, { ...agendamento, fichas: [] });
            }
            acc.get(agendamento.id).fichas.push(ficha);
          }
          return acc;
        }, new Map());

        // Buscar o médico de cada agendamento via a Vaga associada
        const agendamentoIds = Array.from(groupedByAgendamento.keys());
        await Promise.all(
          agendamentoIds.map(async (agendamentoId) => {
            try {
              const vaga = await getVagaByAgendamento(agendamentoId);
              if (vaga?.medico) {
                const agendamento = groupedByAgendamento.get(agendamentoId);
                agendamento.medico = vaga.medico;
              }
            } catch (err) {
              console.warn(`Não foi possível buscar a vaga do agendamento ${agendamentoId}:`, err);
            }
          })
        );

        setAgendamentosComFichas(groupedByAgendamento);
      } catch (error) {
        console.error("Erro ao buscar ou agrupar as fichas:", error);
        setAgendamentosComFichas(new Map());
      } finally {
        setLoading(false);
      }
    };
    fetchDataAndGroup();
  }, [animalId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Data não informada";
    const date = new Date(dateString);
    if (isNaN(date)) return "Data inválida";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month} às ${hours}:${minutes}`;
  };

  // Extrair tipos de ficha disponíveis para o dropdown (deve ficar antes dos returns condicionais)
  const tiposFichaDisponiveis = useMemo(() => {
    const tipos = new Set();
    Array.from(agendamentosComFichas.values()).forEach((agendamento) => {
      (agendamento.fichas || []).forEach((ficha) => {
        if (ficha.nome) tipos.add(ficha.nome);
      });
    });
    return Array.from(tipos).sort();
  }, [agendamentosComFichas]);

  if (loading) {
    return <div className={styles.message}>Carregando histórico do paciente...</div>;
  }

  if (
    !skipPermissionCheck &&
    (!token || !allowedRoles.some((role) => roles.includes(role)))
  ) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado.</h3>
      </div>
    );
  }

  const filteredAgendamentos = Array.from(agendamentosComFichas.values())
    .filter((agendamento) => {
      const term = searchTerm.trim().toLowerCase();

      // Filtro por texto (médico ou tipo de ficha)
      if (term) {
        const medicoNome = (agendamento.medico?.nome || "").toLowerCase();
        const tiposFicha = (agendamento.fichas || [])
          .map((ficha) => (ficha.nome || "").toLowerCase())
          .join(" ");

        const matchTexto = medicoNome.includes(term) || tiposFicha.includes(term);
        if (!matchTexto) return false;
      }

      // Filtro por tipo de ficha (dropdown)
      if (filtroTipoFicha) {
        const temTipo = (agendamento.fichas || []).some(
          (ficha) => ficha.nome === filtroTipoFicha
        );
        if (!temTipo) return false;
      }

      // Filtro por período de data
      if (filtroDataInicio || filtroDataFim) {
        const dataAgendamento = agendamento.dataVaga
          ? new Date(agendamento.dataVaga)
          : null;

        if (!dataAgendamento) return false;

        if (filtroDataInicio) {
          const inicio = new Date(filtroDataInicio);
          inicio.setHours(0, 0, 0, 0);
          if (dataAgendamento < inicio) return false;
        }

        if (filtroDataFim) {
          const fim = new Date(filtroDataFim);
          fim.setHours(23, 59, 59, 999);
          if (dataAgendamento > fim) return false;
        }
      }

      return true;
    });

  const limparFiltros = () => {
    setSearchTerm("");
    setFiltroTipoFicha("");
    setFiltroDataInicio("");
    setFiltroDataFim("");
  };

  const temFiltrosAtivos = searchTerm || filtroTipoFicha || filtroDataInicio || filtroDataFim;

  return (
    <div className={`${styles.pageContainer} ${embedded ? styles.embeddedContainer : ""}`}>
      <div className={styles.headerArea}>
        {!embedded && (
          <div className={styles.titleMeusAgendamentos}>
            <h1>Histórico de Fichas do Paciente</h1>
          </div>
        )}

        <div className={styles.filtrosContainer}>
          <div className={styles.filtroRow}>
            <div className={styles.filtroGroup}>
              <label className={styles.filtroLabel}>Buscar por médico ou ficha</label>
              <input
                type="text"
                className={styles.filtroInput}
                placeholder="Digite o nome do médico ou tipo de ficha"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filtroGroup}>
              <label className={styles.filtroLabel}>Tipo de ficha</label>
              <select
                className={styles.filtroSelect}
                value={filtroTipoFicha}
                onChange={(e) => setFiltroTipoFicha(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                {tiposFichaDisponiveis.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filtroRow}>
            <div className={styles.filtroGroup}>
              <label className={styles.filtroLabel}>Data início</label>
              <input
                type="date"
                className={styles.filtroInput}
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
              />
            </div>

            <div className={styles.filtroGroup}>
              <label className={styles.filtroLabel}>Data fim</label>
              <input
                type="date"
                className={styles.filtroInput}
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
              />
            </div>

            {temFiltrosAtivos && (
              <button
                className={styles.limparFiltrosButton}
                onClick={limparFiltros}
                type="button"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredAgendamentos.length === 0 ? (
        <div className={styles.message}>
          {temFiltrosAtivos
            ? "Nenhuma ficha encontrada com os filtros informados."
            : "Não há fichas registradas para este animal."}
        </div>
      ) : (
        <ul className={styles.list}>
          {filteredAgendamentos.map((vaga) => (
            <li key={vaga.id} className={styles.agendamento_container}>
              <div className={styles.agendamentoHeader}>
                <div>
                  <h1>Consulta</h1>
                  <h2>{formatDate(vaga.dataVaga)}</h2>
                </div>
              </div>

              <div className={styles.fichas_list}>
                <p className={styles.medicoPrincipal}>
                  Médico responsável: {vaga.medico?.nome || "Não informado"}
                </p>
                <h3>Fichas da Consulta:</h3>

                {vaga.fichas.map((ficha) => (
                  <div key={ficha.id} className={styles.ficha_item}>
                    <div className={styles.ficha_info}>
                      <span className={styles.ficha_nome}>
                        {ficha.nome || "Ficha sem nome"}
                      </span>
                      <span className={styles.ficha_medico}>
                        Médico: {vaga.medico?.nome || "Não informado"}
                      </span>
                      <span className={styles.ficha_data}>
                        Criada em: {ficha.dataHora ? formatDate(ficha.dataHora) : "Data não informada"}
                      </span>
                    </div>

                    <button
                      className={styles.acessar_button}
                      onClick={() => {
                        const basePath = rotasPorNome[ficha.nome];
                        if (basePath) {
                          const url = `${basePath}?fichaId=${ficha.id}&animalId=${animalId}&agendamentoId=${vaga.id}&modo=visualizar`;
                          router.push(url);
                        } else {
                          alert(`A visualização para "${ficha.nome}" ainda não foi implementada.`);
                        }
                      }}
                    >
                      Visualizar
                    </button>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistoricoFichasAnimal;
