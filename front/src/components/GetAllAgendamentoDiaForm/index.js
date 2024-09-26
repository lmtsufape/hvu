import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import dateStyles from "../Date/index.module.css";
import Filter from "../GetAgendamentosFilter";
import { DataCompleta, DataCurta, DiaDaSemana } from "../Date";
import CalendarGreenIcon from "../CalendarGreenIcon";
import VoltarButton from "../VoltarButton";
import { getVagaByDate } from "../../../services/vagaService";
import { cancelarVaga } from "../../../services/vagaService";
import { getTutorByAnimal } from "../../../services/tutorService";
import ModalAgendamento from "../ModalAgendamento";
import ErrorAlert from "../ErrorAlert";

function GetAllAgendamentosDiaForm() {
  const router = useRouter();
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [tutor, setTutor] = useState("");
  const [descricaoCancelamento, setDescricaoCancelamento] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleDataSelecionada = (novaData) => {
    setDataSelecionada(novaData);
    console.log("Data Selecionada:", novaData);
  };

  const handleCancelarConsulta = async () => {
    try {
      const cancelamentoData = {
        vaga: {
          id: selectedVaga.id,
        },
        descricao: descricaoCancelamento,
      };
      await cancelarVaga(cancelamentoData);
      closeModal();
      setShowAlert(true);
      fetchData();
    } catch (error) {
      console.error("Erro ao cancelar vaga:", error);
    }
  };

  const openModal = async (vaga) => {
    setSelectedVaga(vaga);
    setModalOpen(true);
    if (vaga?.agendamento?.animal?.id) {
      try {
        const tutorSelected = await getTutorByAnimal(
          vaga.agendamento.animal.id
        );
        setTutor(tutorSelected);
      } catch (error) {
        console.error("Erro ao obter tutor:", error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTutor("");
    setDescricaoCancelamento("");
    console.log("Modal closed");
  };

  const fetchData = async () => {
    const dataFormatada = dataSelecionada.toISOString().slice(0, 10); // Obtém 'yyyy-mm-dd'
    try {
      const VagasData = await getVagaByDate(dataFormatada);
      setVagas(VagasData);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataSelecionada]);

  console.log("vagas:: ", vagas);

  const horarios = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <VoltarButton />
        <h1>Agendamentos do dia</h1>
        <div className={styles.cadendar_container}>
          <div className={styles.cadendar_box}>
            <div className={dateStyles.data_completa}>
              {DataCompleta(dataSelecionada)}
            </div>
            <CalendarGreenIcon onDataSelecionada={handleDataSelecionada} />
          </div>
          <Filter />
        </div>
        <div className={styles.menu}>
          <div className={styles.button_options}>
            <button
              className={styles.button}
              onClick={(e) => router.push("/agendamentoEspecial")}
            >
              Novo agendamento
            </button>
            <button
              className={styles.button}
              onClick={(e) => router.push("/gerenciarVagas")}
            >
              Criar vagas
            </button>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.line1_box}>
              <th className={styles.column1_line1}></th>
              <th>
                <div className={styles.line1}>
                  <div className={dateStyles.dia_da_semana}>
                    {DiaDaSemana(dataSelecionada)}
                  </div>
                  <div className={dateStyles.curta}>
                    {DataCurta(dataSelecionada)}
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th className={styles.time}>{horario}</th>
                  <th className={styles.th}>
                    <div className={styles.cardsJuntos}>
                      {vagas
                        ?.filter((vaga) => {
                          const vagaHora = new Date(vaga.dataHora).getHours();
                          const horarioHora = parseInt(
                            horario.split(":")[0],
                            10
                          );
                          return (
                            vaga.dataHora.startsWith(
                              dataSelecionada.toISOString().slice(0, 10)
                            ) && vagaHora === horarioHora
                          );
                        })
                        .map((vaga) => {
                          return (
                            <button
                              key={vaga.id}
                              className={`${styles.button} ${
                                styles[`button_${vaga.status.toLowerCase()}`]
                              }`}
                              onClick={() => openModal(vaga)}
                            >
                              <div className={styles.infos_container}>
                                <div>
                                  <div className={styles.infos_box1}>
                                    <div className={styles.info1}>
                                      {vaga.agendamento?.animal ? (
                                        <>
                                          {vaga.agendamento?.animal.nome} &bull;{" "}
                                          {vaga.tipoConsulta?.tipo}
                                        </>
                                      ) : (
                                        <>{vaga.medico?.nome}</>
                                      )}
                                    </div>
                                    <h2
                                      className={
                                        styles[
                                          `status_${
                                            vaga.status
                                              ? vaga.status.toLowerCase()
                                              : ""
                                          }`
                                        ]
                                      }
                                    >
                                      {vaga.status === "precriada"
                                        ? "Pré-criada"
                                        : vaga.status}
                                    </h2>
                                  </div>
                                  <div className={styles.infos_box2}>
                                    <div className={styles.info2}>
                                      {vaga?.especialidade?.nome}
                                    </div>
                                    <div className={styles.info2}>
                                      {horario} -{" "}
                                      {new Date(vaga.dataHora).getHours() + 1}
                                      :00
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </th>
                </tr>
                {horario === "11:00" && (
                  <tr key="separator" className={styles.separator}>
                    <td colSpan={2} className={styles.separatorCell}></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <ModalAgendamento
        tutor={tutor}
        selectedVaga={selectedVaga}
        isOpen={modalOpen}
        closeModal={closeModal}
        descricaoCancelamento={descricaoCancelamento}
        setDescricaoCancelamento={setDescricaoCancelamento}
        handleCancelarConsulta={handleCancelarConsulta}
      />

      {showAlert && (
        <ErrorAlert
          message="Agendamento cancelado com sucesso!"
          show={showAlert}
        />
      )}
    </div>
  );
}

export default GetAllAgendamentosDiaForm;
