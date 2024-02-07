import React, { useState } from 'react';
import styles from "./index.module.css";
import dateStyles from "../Date/index.module.css";
import NovoAgendamentoButton from "../NovoAgendamentoButton";
import Filter from '../GetAgendamentosFilter';
import { DataCompleta, DataCurta, DiaDaSemana } from '../Date';
import CalendarGrennIcon from '../CalendarGreenIcon';
import SearchBar from '../SearchBar';
import VoltarButton from '../VoltarButton';

function GetAllAgendamentosDiaForm() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDataSelecionada = (novaData) => {
    setDataSelecionada(novaData);
  };

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

        <div className={styles.button_container}>
          <div className={styles.button_box}>
            <button className={styles.button}>Novo agendamento</button>
            <button className={styles.button}>Médicos disponíveis</button>
            <button className={styles.button}>Vagas disponíveis</button>
          </div>
          <SearchBar />
        </div>

        <table className={styles.table}>
          <thead>
            <tr className={styles.linha1}>
              <th className={styles.column1_line1}></th>
              <th>
                <div className={styles.line1}>
                  <p className={dateStyles.dia_da_semana}>{DiaDaSemana(dataSelecionada)}</p>
                  <p className={dateStyles.curta}>{DataCurta(dataSelecionada)}</p>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className={styles.linha}>
              <th className={styles.coluna1}>08:00</th>
              <th className={styles.th}>
                <button className={styles.botao}>
                  <div className={styles.button_button}>
                    <div className={styles.sub1}>
                      <div>Theodore</div>
                      <div>|</div>
                      <div>Canino</div>
                    </div>
                    <div className={styles.sub2}>Cardiologia</div>
                    <div className={styles.sub3}>08:00 - 09:00</div>
                  </div>
                </button>
              </th>
            </tr>

            <tr className={styles.linha}>
              <th className={styles.coluna1}>09:00</th>
              <th className={styles.th}></th>
            </tr>

            <tr className={styles.linha}>
              <th className={styles.coluna1}>10:00</th>
              <th className={styles.th}></th>
            </tr>

            <tr className={styles.linha}>
              <th className={styles.coluna1}>11:00</th>
              <th className={styles.th}></th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllAgendamentosDiaForm;
