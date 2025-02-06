import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import VoltarButton from "../VoltarButton";
import SearchBar from "../SearchBar";
import {
  getAgendamentoTutor,
  deleteAgendamento,
} from "../../../services/agendamentoService";
import { format } from "date-fns";
import { CriarAgendamentoWhiteButton } from "../WhiteButton";
import ErrorAlert from "../ErrorAlert";
import { cancelarAgendamento } from "../../../services/consultaService";

export default function MeusAgendamentos() {
  const router = useRouter();

  const [agendamentos, setAgendamentos] = useState([]);
  const [cancelarModalId, setCancelarModalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [canceledAgendamentoId, setCanceledAgendamentoId] = useState(null); // Estado para controlar o ID do agendamento cancelado recentemente
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

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
        const agendamentosData = await getAgendamentoTutor();
        setAgendamentos(agendamentosData);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      } finally {
        setLoading(false); // Marcar como carregado após buscar os dados
      }
    };
    fetchData();
  }, [canceledAgendamentoId]); // Adicionar canceledAgendamentoId como uma dependência

  const handleDeleteAgendamento = async (agendamentoData) => {
    const cancelamento = {
      agendamento: {
        id: agendamentoData.id,
      },
      descricao: "Cancelamento solicitado pelo tutor",
    };
    try {
      await cancelarAgendamento(cancelamento);
      setAgendamentos(
        agendamentos.filter(
          (agendamento) => agendamento.id !== agendamentoData.id
        )
      );
      setCancelarModalId(null);
      setCanceledAgendamentoId(agendamentoData.id); // Atualiza o estado para acionar a recuperação da lista
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      setCancelarModalId(null);
      setShowErrorAlert(true);
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const compareDates = (a, b) => {
    const dateA = new Date(a.dataVaga);
    const dateB = new Date(b.dataVaga);
    return dateB - dateA;
  };

  const filteredAgendamentos = agendamentos.filter(
    (agendamento) =>
      agendamento.animal &&
      agendamento.animal.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAgendamentos = filteredAgendamentos.sort(compareDates);

  // Verifica se os dados estão carregando
  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  // Verifica se o usuário tem permissão
  if (!roles.includes("tutor")) {
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

  return (
    <div>
      <VoltarButton />
      <div className={styles.titleMeusAgendamentos}>
        <h1>Meus Agendamentos</h1>
      </div>
      <div className={styles.navbar}>
        <SearchBar
          placeholder="Buscar agendamento através do nome do animal"
          onSearchChange={setSearchTerm}
        />
        <CriarAgendamentoWhiteButton />
      </div>

      {sortedAgendamentos.length === 0 ? (
        <div className={styles.message}>Não há consultas marcadas.</div>
      ) : (
        <ul className={styles.list} style={{ padding: 0 }}>
          {sortedAgendamentos.map((agendamento) => (
            <li key={agendamento.id} className={styles.info_container}>
              <div className={styles.agendamentos}>
                <div className={styles.agendamentoBox}>
                  <div>
                    <h1>Consulta Clínica</h1>
                    <h2>
                      {format(
                        new Date(agendamento.dataVaga),
                        "dd/MM 'às' HH:mm"
                      )}
                    </h2>
                  </div>
                  <div>
                    <h1>Paciente</h1>
                    <h2>{agendamento.animal && agendamento.animal.nome}</h2>
                  </div>
                  <div>
                    {agendamento && agendamento.status === "Agendado" ? (
                      <button
                        className={styles.agendamento_button}
                        onClick={() => setCancelarModalId(agendamento.id)}
                      >
                        <h1>Cancelar</h1>
                      </button>
                    ) : (
                      <button className={styles.finalizar_button} disabled>
                        <h1>{agendamento.status}</h1>
                      </button>
                    )}
                  </div>
                </div>
                {cancelarModalId === agendamento.id && (
                  <div className={styles.modal}>
                    <div className={styles.box1}>
                      <div>Deseja realmente cancelar?</div>
                      <button
                        onClick={() => setCancelarModalId(null)}
                        className={styles.button_close_modal}
                      >
                        X
                      </button>
                    </div>
                    <div className={styles.box2}>
                      <button
                        className={styles.cancelar_button}
                        onClick={() => setCancelarModalId(null)}
                      >
                        Voltar
                      </button>
                      <button
                        className={styles.excluir_button2}
                        onClick={() => handleDeleteAgendamento(agendamento)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {showAlert && (
        <ErrorAlert
          message="Agendamento cancelado com sucesso!"
          show={showAlert}
        />
      )}
      {showErrorAlert && (
        <ErrorAlert
          message="Erro ao cancelar agendamento, tente novamente"
          show={showErrorAlert}
        />
      )}
    </div>
  );
}
