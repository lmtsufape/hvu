import React, { useState } from 'react';
import Select from 'react-select';
import styles from "./index.module.css";
import VoltarButton from "@/components/VoltarButton";
import { CancelarWhiteButton } from '../WhiteButton';

const HorariosSemana = () => {
  const [selecionarData, setSelecionarData] = useState(new Date());
  const [selecionarHorario, setSelecionarHorario] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const timeOptions = [
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
  ];

const diasSemana = {
    0: 'Domingo',
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado'
  };

  const handleDateChange = (date) => {
    setSelecionarData(date);
  };

  const handleTimeChange = (selectedOption) => {
    setSelecionarHorario(selectedOption);
  };

  // A ideia aqui é obter a data de início da semana
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // Aqui serve para criar um array com as datas da semana
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + index);
    return currentDate;
  });

  return (
    <div className={styles.container}>
      <div className={styles.voltar_button}>
        < VoltarButton />
      </div>

      <div className={styles.title_box}>
        <h1>Agendar Consulta</h1>
      </div>

      <div className={styles.boxprincipal}>
        <div className={styles.select_container}>
          <div className={styles.select_box}>
            <h1>Especialidade</h1>
            <select class="form-select" aria-label="Default select example">
              <option selected>Selecione uma especialidade</option>
              <option value="1">Especialidade 1</option>
              <option value="2">Especialidade 2</option>
              <option value="3">Especialidade 3</option>
            </select>
          </div>

          <div className={styles.select_box}>
            <h1>Paciente</h1>
            <select class="form-select" aria-label="Default select example">
              <option selected>Selecione um paciente</option>
              <option value="1">José Floquinho</option>
              <option value="2">Cuscuz</option>
              <option value="3">Rex</option>
            </select>
          </div>
        </div>

        <h1 className={styles.titulodataconsulta}>Data da Consulta</h1>
        <h2 className={styles.descricaotitulodataconsulta}>Selecione o dia e o horário disponível de sua preferência para o atendimento</h2>
        <div className={styles.containersemana}>
          {weekDates.map((date) => {
            if (date.getDay() !== 6 && date.getDay() !== 0) {
              return (
                <div key={date} className={styles.containerdia}>
                  <h2 className={styles.diasdasemana}>{diasSemana[date.getDay()]}</h2>
                  <p className={styles.data}>{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                  <div className="time-buttons">
                    {timeOptions.map((timeOption) => (
                      <button
                        key={timeOption.value}
                        className={
                          date.getDate() === selecionarData.getDate() && selecionarHorario?.value === timeOption.value
                            ? `${styles.botaohora} selected`
                            : styles.botaohora
                        }
                        onClick={() => {
                          handleDateChange(date);
                          handleTimeChange(timeOption);
                        }}
                      >
                        {timeOption.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className={styles.button_container}>
          < CancelarWhiteButton />
          <button className={styles.agendar_button} onClick={openModal}>Agendar</button>
        </div>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>

              <div className={styles.container1}>
                <div className={styles.box}>
                  <div className={styles.title}>Tem certeza que desaja realizar agendamento?</div>
                </div>

                <div className={styles.div_button1}>
                  <button onClick={closeModal} className={styles.button_close_modal}>X</button>
                </div>
              </div>

              <div className={styles.container2}>
                <div className={styles.box}>
                  <div className={styles.item}>Paciente</div>
                  <div className={styles.subtitle}>animal_nome</div>
                </div>

                <div className={styles.box}>
                  <div className={styles.item}>Data</div>
                  <div className={styles.subtitle}>vagaData</div>
                </div>
              </div>

              <div className={styles.div_button2}>
                <div><button className={styles.button_cancelar_consulta}>Cancelar</button></div>
                <div><button className={styles.button_agendar_consulta}>Agendar</button></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorariosSemana;
