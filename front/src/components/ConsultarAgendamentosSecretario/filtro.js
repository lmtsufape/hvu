import React from 'react';
import { useRouter } from 'next/router';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './filtro.module.css';

function Filtro() {
  const router = useRouter();

  const handlDiaClick = () => {
      router.push('agendamentosdodiasecretario');
  };

  const handlSemanaClick = () => {
    router.push('agendamentosdasemanasecretario');
  };

  return ( 
    <div className={styles.box} >
      <DropdownButton title="Filtrar" id="bg-nested-dropdown">
        <Dropdown.Item eventKey="1" onClick={handlDiaClick}>Dia</Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={handlSemanaClick}>Semana</Dropdown.Item>
      </DropdownButton>
    </div>
  );
}

export default Filtro
