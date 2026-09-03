import React, { useState, useEffect, useMemo } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { getFichasByAnimalId } from "../../../services/fichaService";
import { getVagaByAgendamento } from "../../../services/vagaService";
import { getAgendamento } from "../../../services/agendamentoService"; // <- busca agendamentos do sistema

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

  // Estados para adição de fichas
  const [fichaParaAdicionar, setFichaParaAdicionar] = useState({});
  const [fichaGeralSelecionada, setFichaGeralSelecionada] = useState("");
  const [agendamentoFallbackId, setAgendamentoFallbackId] = useState(null);

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
    const carregarDados = async () => {
      if (!animalId) {
        setLoading(false);
        return;
      }

      // 1. Procura no sistema se esse animal tem ALGUM agendamento existente para usar o ID
      try {
        const todosAgendamentos = await getAgendamento();
        if (Array.isArray(todosAgendamentos)) {
          const agendamentoDoAnimal = todosAgendamentos.find(
            (ag) => ag.animal?.id === Number(animalId) || ag.animalId === Number(animalId)
          );
          if (agendamentoDoAnimal?.id) {
            setAgendamentoFallbackId(agendamentoDoAnimal.id);
          }
        }
      } catch (errAg) {
        console.warn("Não foi possível carregar a lista de agendamentos:", errAg);
      }

      // 2. Busca o histórico de fichas já existentes do animal
      try {
        const todasAsFichas = await getFichasByAnimalId(animalId);

        if (Array.isArray(todasAsFichas) && todasAsFichas.length > 0) {
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

          const agendamentoIds = Array.from(groupedByAgendamento.keys());
          if (agendamentoIds.length > 0) {
            setAgendamentoFallbackId(agendamentoIds[0]);
          }

          // Carrega médico responsável da vaga de cada agendamento
          await Promise.all(
            agendamentoIds.map(async (agendamentoId) => {
              try {
                const vaga = await getVagaByAgendamento(agendamentoId);
                if (vaga?.medico) {
                  const agendamento = groupedByAgendamento.get(agendamentoId);
                  agendamento.medico = vaga.medico;
                }
              } catch (err) {
                console.warn(`Erro ao carregar vaga do agendamento ${agendamentoId}:`, err);
              }
            })
          );

          setAgendamentosComFichas(groupedByAgendamento);
        } else {
          setAgendamentosComFichas(new Map());
        }
      } catch (error) {
        console.error("Erro ao carregar fichas:", error);
        setAgendamentosComFichas(new Map());
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
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

  const tiposFichaDisponiveis = useMemo(() => {
    const tipos = new Set();
    Array.from(agendamentosComFichas.values()).forEach((agendamento) => {
      (agendamento.fichas || []).forEach((ficha) => {
        if (ficha.nome) tipos.add(ficha.nome);
      });
    });
    return Array.from(tipos).sort();
  }, [agendamentosComFichas]);

  // Adicionar ficha atrelada a uma consulta já listada
  const handleAdicionarFicha = (agendamentoId) => {
    const tipoSelecionado = fichaParaAdicionar[agendamentoId];
    if (!tipoSelecionado) {
      alert("Por favor, selecione um tipo de ficha.");
      return;
    }

    const pathBase = rotasPorNome[tipoSelecionado];
    if (pathBase) {
      router.push(`${pathBase}?animalId=${animalId}&agendamentoId=${agendamentoId}&modo=criar`);
    } else {
      alert(`A rota para "${tipoSelecionado}" não foi localizada.`);
    }
  };

  // Adicionar ficha no botão superior (mesmo sem fichas)
  const handleAdicionarNovaFichaGeral = () => {
    if (!fichaGeralSelecionada) {
      alert("Por favor, selecione um tipo de ficha.");
      return;
    }

    const pathBase = rotasPorNome[fichaGeralSelecionada];
    if (!pathBase) {
      alert(`A rota para "${fichaGeralSelecionada}" não foi localizada.`);
      return;
    }

    // Se encontramos um agendamento prévio no banco, enviamos ele para a tela de update não quebrar
    if (agendamentoFallbackId) {
      router.push(`${pathBase}?animalId=${animalId}&agendamentoId=${agendamentoFallbackId}&modo=criar`);
    } else {
      // Caso o animal não tenha NENHUM agendamento no banco:
      // Redireciona com animalId. (Se a tela de update quebrar aqui, é porque no Java a entidade Ficha exige obrigatoriamente um Agendamento existente).
      router.push(`${pathBase}?animalId=${animalId}&modo=criar`);
    }
  };

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

  // Qualquer médico ou quem estiver acessando pela rota embedded de médico
  const podeAdicionarFicha = roles.includes("medico") || embedded;

  const filteredAgendamentos = Array.from(agendamentosComFichas.values()).filter((agendamento) => {
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      const medicoNome = (agendamento.medico?.nome || "").toLowerCase();
      const tiposFicha = (agendamento.fichas || [])
        .map((ficha) => (ficha.nome || "").toLowerCase())
        .join(" ");

      if (!medicoNome.includes(term) && !tiposFicha.includes(term)) return false;
    }

    if (filtroTipoFicha) {
      const temTipo = (agendamento.fichas || []).some((ficha) => ficha.nome === filtroTipoFicha);
      if (!temTipo) return false;
    }

    if (filtroDataInicio || filtroDataFim) {
      const dataAgendamento = agendamento.dataVaga ? new Date(agendamento.dataVaga) : null;
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

        {/* Botão Superior para médicos adicionarem ficha livremente */}
        {podeAdicionarFicha && filteredAgendamentos.length === 0 && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "18px" }}>
            <select
              className={styles.filtroSelect}
              value={fichaGeralSelecionada}
              onChange={(e) => setFichaGeralSelecionada(e.target.value)}
              style={{ maxWidth: "320px" }}
            >
              <option value="">Selecionar ficha para adicionar...</option>
              {Object.keys(rotasPorNome).map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.acessar_button}
              onClick={handleAdicionarNovaFichaGeral}
            >
              Adicionar Ficha
            </button>
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
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
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

                {podeAdicionarFicha && (
                  <div
                    className={styles.adicionarFichaContainer}
                    style={{ display: "flex", gap: "8px", alignItems: "center", margin: "10px 0" }}
                  >
                    <select
                      className={styles.filtroSelect}
                      value={fichaParaAdicionar[vaga.id] || ""}
                      onChange={(e) =>
                        setFichaParaAdicionar({
                          ...fichaParaAdicionar,
                          [vaga.id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecionar nova ficha...</option>
                      {Object.keys(rotasPorNome).map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={styles.acessar_button}
                      onClick={() => handleAdicionarFicha(vaga.id)}
                    >
                      Adicionar
                    </button>
                  </div>
                )}

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
                      <span className={styles.ficha_prontuario}>
                        Prontuário: {ficha?.animal?.codigoProntuario || "Não informado"}
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