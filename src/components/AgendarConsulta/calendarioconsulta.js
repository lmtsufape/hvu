import React, { useState } from 'react';
import Select from 'react-select';
import styles from "./calendarioconsulta.module.css"

const HorariosSemana = () => {
  const [selecionarData, setSelecionarData] = useState(new Date());
  const [selecionarHorario, setSelecionarHorario] = useState(null);

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
    <div className={styles.boxprincipal}>
      <h1 className={styles.titulodataconsulta}>Data da Consulta</h1>
      <h2 className={styles.descricaotitulodataconsulta}>Selecione o dia e o horário disponível de sua preferência para o atendimento</h2>
      <div className={styles.containersemana}>
  {weekDates.map((date) => {
    // Verifique se o dia da semana não é sábado (6) ou domingo (0)
    if (date.getDay() !== 6 && date.getDay() !== 0) {
      return (
        <div key={date} className={styles.containerdia}>
          <h2 className={styles.diasdasemana}>{date.toLocaleDateString('pt-BR', { weekday: 'short'})}</h2>
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
      <div>
        <p>Data selecionada: {selecionarData.toDateString()}</p>
        <p>Horário selecionado: {selecionarHorario ? selecionarHorario.label : 'Nenhum horário selecionado'}</p>
      </div>
    </div>
  );
};

export default HorariosSemana;
