import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import SearchBar from "../SearchBar";
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
      if (!term) return true;

      const medicoNome = (agendamento.medico?.nome || "").toLowerCase();
      const dataConsulta = formatDate(agendamento.dataVaga).toLowerCase();
      const tiposFicha = (agendamento.fichas || [])
        .map((ficha) => (ficha.nome || "").toLowerCase())
        .join(" ");

      return (
        medicoNome.includes(term) ||
        dataConsulta.includes(term) ||
        tiposFicha.includes(term) ||
        "consulta".includes(term)
      );
    });

  return (
    <div className={`${styles.pageContainer} ${embedded ? styles.embeddedContainer : ""}`}>
      <div className={styles.headerArea}>
        {!embedded && (
          <div className={styles.titleMeusAgendamentos}>
            <h1>Histórico de Fichas do Paciente</h1>
          </div>
        )}
        <div className={styles.searchWrapper}>
          <SearchBar
            placeholder="Buscar por médico, tipo de ficha ou data da consulta"
            onSearchChange={setSearchTerm}
          />
        </div>
      </div>

      {filteredAgendamentos.length === 0 ? (
        <div className={styles.message}>
          {searchTerm.trim()
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
