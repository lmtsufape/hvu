import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from "./white_button.module.css"; // Importe o módulo CSS

function FiltrarWhiteButton() {
  return (
    <ButtonGroup>
      <DropdownButton className={styles.white_button} as={ButtonGroup} title="Filtrar" id="bg-nested-dropdown">
        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
      </DropdownButton>
    </ButtonGroup>
  );
}

export default FiltrarWhiteButton;
