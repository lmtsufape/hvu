import React from 'react';
import styles from './index.module.css';

function FilterEspecieRaca({ onChange }) {
  return ( 
    <div>
      <select className={styles.filter} onChange={onChange}>
        <option value="especie">Espécie</option>
        <option value="raca">Raça</option>
      </select>
    </div>
  );
}

export default FilterEspecieRaca;
