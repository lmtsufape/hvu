import React from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';

function Filter() {
  const router = useRouter();

  const handlDiaClick = () => {
    router.push('/agendamentosDia');
  };

  const handlSemanaClick = () => {
    router.push('/agendamentosSemana');
  };

  return ( 
    <div>
      <select className={styles.filter} onChange={(e) => {
        const selectedOption = e.target.value;
        if (selectedOption === 'dia') {
          handlDiaClick();
        } else if (selectedOption === 'semana') {
          handlSemanaClick();
        }
      }}>
        <option value="filtro">Filtro</option>
        <option value="dia">Dia</option>
        <option value="semana">Semana</option>
      </select>
    </div>
  );
}

export default Filter;
