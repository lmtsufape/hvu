import React, { useState } from 'react';
import styles from "./dia.module.css";
import dateStyles from "./date.module.css";
import NovoAgendamentoButton from "./novoAgendamentoButton";
import Filter from './filter';
import { DataCompleta, DataCurta, DiaDaSemana } from './date';
import CalendarIcon from './CalendarIcon';
import SearchBar from '../SearchBar';

function AgendamentosDoDia() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const handleDataSelecionada = (novaData) => {
    setDataSelecionada(novaData);
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.header_item1}>Agendamentos da semana</div>
          <Filter />
        </div>

        <div className={styles.box}>
          <div className={styles.itens_box_1}>
            <div className={dateStyles.data_completa}>{DataCompleta(dataSelecionada)}</div>
            <CalendarIcon onDataSelecionada={handleDataSelecionada} />
          </div>
          <div className={styles.itens_box_2}>
            <SearchBar />
            <NovoAgendamentoButton />
          </div>
        </div>

        <table className={styles.tabela}>
          <thead>
            <tr className={styles.linha1}>
              <th className={styles.coluna1_l1}></th>
              <th>
                <div className={styles.coluna_l1}>
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
                  <div className={styles.button_container}>
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

export default AgendamentosDoDia;
