import React from 'react';
import { useRouter } from 'next/router';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './filter.module.css';

function Filter() {
  const router = useRouter();

  const handlDiaClick = () => {
      router.push('getAllAgendamentoDiaSecretario');
  };

  const handlSemanaClick = () => {
    router.push('getAllAgendamentoSemanaSecretario');
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

export default Filter;
