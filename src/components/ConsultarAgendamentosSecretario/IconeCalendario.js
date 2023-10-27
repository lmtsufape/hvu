import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

function IconeCalendario() {
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const handleDataSelecionada = (date) => {
    setDataSelecionada(date);
  };

  const mostrarOcultarCalendario = () => {
    setMostrarCalendario(!mostrarCalendario);
  };

  return (
    <div className="mb-3">
      <div className="form-label">
        <img
          src="calendario-icon.png"
          alt="Calendário"
          onMouseEnter={mostrarOcultarCalendario}
          onMouseLeave={mostrarOcultarCalendario}
        />
        {mostrarCalendario && (
          <DatePicker
            selected={dataSelecionada}
            onChange={handleDataSelecionada}
            dateFormat="dd/MM/yyyy"
            className="form-control"
            placeholderText="Ex: 13/07/2023"
            locale={ptBR}
          />
        )}
      </div>
    </div>
  );
}

export default IconeCalendario;
