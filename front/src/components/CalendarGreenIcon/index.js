// IconeCalendario.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarGrennIcon({ onDataSelecionada }) {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleMouseEnter = () => {
    setMostrarCalendario(true);
  };

  const handleMouseLeave = () => {
    setMostrarCalendario(false);
  };

  const onChangeData = (novaData) => {
    setDataSelecionada(novaData);
    onDataSelecionada && onDataSelecionada(novaData); // Certifique-se de que onDataSelecionada exista antes de chamar
  };

  return (
    <div>
      <img
        src='./images/calendario.svg'
        alt="Imagem"
        onMouseEnter={handleMouseEnter}
        style={{ cursor: 'pointer' }}
      />

      {mostrarCalendario && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <Calendar onChange={onChangeData} value={dataSelecionada} />
        </div>
      )}
    </div>
  );
}

export default CalendarGrennIcon;
