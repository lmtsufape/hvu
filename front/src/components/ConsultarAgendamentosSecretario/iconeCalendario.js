import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function IconeCalendario() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleClickImagem = () => {
    setMostrarCalendario(!mostrarCalendario);
  };

  const onChangeData = (novaData) => {
    setDataSelecionada(novaData);
  };

  return (
    <div>
      <img
        src='./images/calendario.svg'
        alt="Imagem"
        onClick={handleClickImagem}
        style={{ cursor: 'pointer' }}
      />

      {mostrarCalendario && (
        <div style={{ position: 'absolute', zIndex: 1 }}>
          <Calendar onChange={onChangeData} value={dataSelecionada} />
        </div>
      )}
    </div>
  );
}

export default IconeCalendario;
