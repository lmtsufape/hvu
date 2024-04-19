import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import dateStyles from "../Date/index.module.css";
import Filter from '../GetAgendamentosFilter';
import { DataCompleta, DataCurta, DiaDaSemana } from '../Date';
import CalendarGreenIcon from '../CalendarGreenIcon';
import SearchBar from '../SearchBar';
import VoltarButton from '../VoltarButton';
import { getAgendamento, deleteAgendamento } from "../../../services/agendamentoService";
import { getAllVaga, updateVaga } from '../../../services/vagaService';

function GetAllAgendamentosDiaForm() {
  const router = useRouter();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [selectedVaga, setSelectedVaga] = useState(null);

  const handleDataSelecionada = (novaData) => {
    setDataSelecionada(novaData);
    console.log("Data Selecionada:", novaData);
  };

  const openModal = (vaga) => {
    setSelectedVaga(vaga);
    setModalOpen(true);
    console.log("Modal opened");
  };

  const closeModal = () => {
    setModalOpen(false);
    console.log("Modal closed");
  };

  const cancelarConsulta = async () => {
    if (selectedVaga) {
      await updateVaga(selectedVaga.id, { status: "cancelado" });
      router.reload(); // recarrega a página para refletir as mudanças
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const VagasData = await getAllVaga();
        setVagas(VagasData);
        console.log("VagasData:", VagasData);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };
    fetchData();
  }, [dataSelecionada]);

  const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00"];
  console.log("Horários do dia:", horarios);
  console.log(vagas);

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <VoltarButton />
        <h1>Agendamentos do dia</h1>
        <div className={styles.cadendar_container}>
          <div className={styles.cadendar_box}>
            <div className={dateStyles.data_completa}>{DataCompleta(dataSelecionada)}</div>
            <CalendarGreenIcon onDataSelecionada={handleDataSelecionada} />
          </div>
          <Filter />
        </div>
        <div className={styles.menu}>
          <div className={styles.button_options}>
            <button className={styles.button} onClick={(e) => router.push("/agendamentoEspecial")}>
              Novo agendamento
            </button>
            <button className={styles.button}>Criar vagas</button>
          </div>
          <SearchBar />
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.line1_box}>
              <th className={styles.column1_line1}></th>
              <th>
                <div className={styles.line1}>
                  <div className={dateStyles.dia_da_semana}>{DiaDaSemana(dataSelecionada)}</div>
                  <div className={dateStyles.curta}>{DataCurta(dataSelecionada)}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {horarios.map(horario => (
              <tr key={horario}>
                <th className={styles.time}>{horario}</th>
                <th className={styles.th}>
                  <div className={styles.cardsJuntos}>
                    {console.log(`Filtrando vagas para horário: ${horario}`)}
                    {vagas.filter(vaga => vaga.dataHora.startsWith(dataSelecionada.toISOString().slice(0, 10) + 'T' + horario))
                      .map(vaga => {
                        console.log(`Vaga (${vaga.dataHora} - ${vaga.id}):`, vaga);
                        return (
                          <button key={vaga.id} className={`${styles.button} ${styles[`button_${vaga.status.toLowerCase()}`]}`} onClick={() => openModal(vaga)}>
                            <div className={styles.infos_container}>
                              <div>
                                <div className={styles.infos_box1}>
                                  <div className={styles.info1}>{vaga.agendamento?.animal.nome} &bull; {vaga.agendamento?.animal.especie}</div>
                                  <h2 className={styles[`status_${vaga.status ? vaga.status.toLowerCase() : ''}`]}>
                                    {vaga.status === "precriada" ? "Pré-criada" : vaga.status}
                                  </h2>
                                </div>
                                <div className={styles.infos_box2}>
                                  <div className={styles.info2}>Exame</div>
                                  <div className={styles.info2}>{horario} - {new Date(vaga.dataHora).getHours() + 1}:00</div>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.container1}>
                <div className={styles.box}>
                  <div className={styles.title}>{selectedVaga.agendamento?.animal.nome}</div>
                  <div className={styles.subtitle}>{selectedVaga.agendamento?.animal.especie}</div>
                </div>
                <div className={styles.div_button1}>
                  <button onClick={closeModal} className={styles.button_close_modal}>X</button>
                </div>
              </div>
              <div className={styles.container2}>
                <div className={styles.box}>
                  <div className={styles.title}>Tutor</div>
                  <div className={styles.subtitle}>tutor_nome</div>
                </div>
                <div className={styles.box}>
                  <div className={styles.title}>Especialidade</div>
                  <div className={styles.subtitle}>especialidade_nome</div>
                </div>
              </div>
              <div className={styles.div_button2}>
                <button onClick={cancelarConsulta} className={styles.button_cancelar_consulta}>
                  Cancelar consulta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllAgendamentosDiaForm;