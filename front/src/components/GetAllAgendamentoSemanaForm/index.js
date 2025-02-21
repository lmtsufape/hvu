import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import dateStyles from "../Date/index.module.css";
import CalendarGreenIcon from '../CalendarGreenIcon';
import VoltarButton from '../VoltarButton';
import { DataCompleta } from "../Date";
import { getVagaByPeriod } from '../../../services/vagaService';
import { cancelarAgendamento } from '../../../services/consultaService';
import { cancelarVaga } from '../../../services/vagaService';
import { getTutorByAnimal } from '../../../services/tutorService';
import Filter from '../GetAgendamentosFilter';
import ModalAgendamento from '../ModalAgendamento';
import ErrorAlert from '../ErrorAlert';

function GetAllAgendamentosSemanaForm() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [vagas, setVagas] = useState([]);
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [tutor, setTutor] = useState('');
  const [descricaoCancelamento, setDescricaoCancelamento] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");

  const horarios = ["07:30", "08:30", "09:30", "10:30", "12:30", "13:30", "14:30", "15:30"];
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dias = [];

  for (let i = 0; i < 7; i++) {
    const dia = new Date(dataSelecionada);
    dia.setDate(dataSelecionada.getDate() - dataSelecionada.getDay() + i);
    dias.push(dia);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        const storedRoles = JSON.parse(localStorage.getItem('roles'));
        setToken(storedToken || "");
        setRoles(storedRoles || []);
    }
  }, []);

  const fetchData = async () => {
    const dataInicio = dias[0].toISOString().slice(0, 10);
    const dataFim = dias[6].toISOString().slice(0, 10);
    try {
      const VagasData = await getVagaByPeriod(dataInicio, dataFim);
      setVagas(VagasData);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataSelecionada]);

  // Verifica se o usuário tem permissão
  if (!roles.includes("secretario")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    );
  }

  const getStatusColor = status => {
    switch (status) {
      case 'cancelado': return 'red';
      case 'precriada': return 'yellow';
      case 'Disponivel': return 'green';
      default: return 'grey';
    }
  };

  const handleCancelarConsulta = async () => {
    try {
      const cancelamentoData = {
        vaga: {
          id: selectedVaga.id
        },
        descricao: descricaoCancelamento
      }
      await cancelarVaga(cancelamentoData);
      closeModal();
      setShowAlert(true);
      fetchData();
    } catch (error) {
      console.error('Erro ao cancelar vaga:', error);
    }
  };

  const openModal = async (vaga) => {
    setSelectedVaga(vaga);
    setModalOpen(true);
    if (vaga?.agendamento?.animal?.id) {
      try {
        const tutorSelected = await getTutorByAnimal(vaga.agendamento.animal.id);
        setTutor(tutorSelected);
      } catch (error) {
        console.error('Erro ao obter tutor:', error);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTutor("");
    setDescricaoCancelamento('');
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <VoltarButton />
        <h1>Agendamentos da semana</h1>
        <div className={styles.calendar_container}>
          <div className={styles.calendar_box}>
            <div className={dateStyles.data_completa}>{DataCompleta(dataSelecionada)}</div>
            <CalendarGreenIcon onDataSelecionada={setDataSelecionada} />
          </div>
          <Filter />
        </div>
        <div className={styles.menu}>
          <div className={styles.button_options}>
            <button className={styles.button} onClick={(e) => router.push("/agendamentoEspecial")}>Novo agendamento</button>
            <button className={styles.button} onClick={(e) => router.push("/gerenciarVagas")}>Criar vagas</button>
          </div>
        </div>
        <table className={styles.tabela}>
          <thead>
            <tr className={styles.linha1}>
              <th className={styles.coluna_l1}></th>
              {dias.map((dia, index) => (
                <th key={index}>
                  <div className={styles.coluna_l1}>
                    <h6>{diasDaSemana[dia.getDay()]}</h6>
                    <div>{`${dia.getDate().toString().padStart(2, '0')}/${(dia.getMonth() + 1).toString().padStart(2, '0')}`}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario, index) => (
              <React.Fragment key={index}>
                <tr className={styles.linha}>
                  <th className={styles.coluna1}>{horario}</th>
                  {dias.map(dia => {
                    const key = `${dia.toISOString().slice(0, 10)}T${horario}:00`;
                    const agendamentos = vagas?.filter(vaga => {
                      const vagaHora = new Date(vaga.dataHora).getHours();
                      const horarioHora = parseInt(horario.split(':')[0], 10);
                      return vaga.dataHora.startsWith(dia.toISOString().slice(0, 10)) && vagaHora === horarioHora;
                    });
                    return (
                      <td key={dia.toISOString()} className={styles.th}>
                        {agendamentos.map((agendamento, idx) => (
                          <div key={idx} className={styles[agendamento.status.toLowerCase()]} onClick={() => openModal(agendamento)}>
                            <span>
                              {agendamento?.agendamento?.animal?.nome ? agendamento.agendamento.animal.nome : agendamento.medico?.nome}
                            </span>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
                {horario === "10:30" && (
                  <tr key="separator" className={styles.separator}>
                    <td colSpan={dias.length + 1} className={styles.separatorCell}></td>
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
      {showAlert && <ErrorAlert message="Agendamento cancelado com sucesso!" show={showAlert} />}
    </div>
  );
}

export default GetAllAgendamentosSemanaForm;