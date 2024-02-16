import React, { useState } from 'react';
import styles from "./index.module.css";
import dateStyles from "../Date/index.module.css";
import Filter from "../GetAgendamentosFilter";
import CalendarGrennIcon from '../CalendarGreenIcon';
import SearchBar from '../SearchBar';
import { DataCompleta } from "../Date";
import VoltarButton from '../VoltarButton';

function GetAllAgendamentosSemanaForm() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDataSelecionada = (novaData) => {
    setDataSelecionada(novaData);
  };

  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dias = [];

  for (let i = 0; i < 7; i++) {
    const dia = new Date(dataSelecionada);
    dia.setDate(dataSelecionada.getDate() - dataSelecionada.getDay() + i);
    dias.push(dia);
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>

        < VoltarButton />
        <h1>Agendamentos da semana</h1>
        
        <div className={styles.cadendar_container}>
          <div className={styles.cadendar_box}>
            <div className={dateStyles.data_completa}>{DataCompleta(dataSelecionada)}</div>
            <CalendarGrennIcon onDataSelecionada={handleDataSelecionada} />
          </div>          
          <Filter />
        </div>

        <div className={styles.menu}>
          <div className={styles.button_options}>
            <button className={styles.button}>Novo agendamento</button>
            <button className={styles.button}>Médicos disponíveis</button>
            <button className={styles.button}>Vagas disponíveis</button>
          </div>
          <SearchBar />
        </div>

        <table className={styles.tabela}>
          <thead>
            <tr className={styles.linha1}>
              <th className={styles.coluna1_l1}></th>
              {dias.map((dia, index) => (
                <th key={index}>
                  <div className={styles.coluna_l1}>
                    <h6>{diasDaSemana[index]}</h6>
                    <div className={dateStyles.data_completa}>
                      {`${dia.getDate().toString().padStart(2, '0')}/${(dia.getMonth() + 1).toString().padStart(2, '0')}`}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={styles.linha}>
              <th className={styles.coluna1}>08:00</th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
            </tr>

            <tr className={styles.linha}>
              <th className={styles.coluna1}>09:00</th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
            </tr>

            <tr className={styles.linha}>
              <th className={styles.coluna1}>10:00</th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
            </tr>

            <tr className={styles.linha}>
              <th className={styles.coluna1}>11:00</th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
              <th className={styles.th}></th>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default GetAllAgendamentosSemanaForm;
