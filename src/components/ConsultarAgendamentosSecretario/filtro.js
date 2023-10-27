import React from 'react';
import { useRouter } from 'next/router';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './filtro.module.css';

function Filtro() {
    return ( 
        <DropdownButton title="Filtrar" id="bg-nested-dropdown">
          <Dropdown.Item eventKey="1">Dia</Dropdown.Item>
          <Dropdown.Item eventKey="2">Semana</Dropdown.Item>
        </DropdownButton>
    );
}

export default Filtro