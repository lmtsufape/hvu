import React, { useState, useEffect } from 'react';
import styles from "./index.module.css";
import dateStyles from "../Date/index.module.css";
import Filter from "../GetAgendamentosFilter";
import CalendarGrennIcon from '../CalendarGreenIcon';
import SearchBar from '../SearchBar';
import { DataCompleta } from "../Date";
import VoltarButton from '../VoltarButton';
import { getAllVaga } from '../../../services/vagaService';

function GetAllAgendamentosSemanaForm() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [vagas, setVagas] = useState([]);
  const [agendamentosPorHora, setAgendamentosPorHora] = useState({});

  const horarios = ['08:00', '09:00', '10:00', '11:00', '12:00'];
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dias = [];

  for (let i = 0; i < 7; i++) {
    const dia = new Date(dataSelecionada);
    dia.setDate(dataSelecionada.getDate() - dataSelecionada.getDay() + i);
    dias.push(dia);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const VagasData = await getAllVaga();
        setVagas(VagasData);

        const horarioMap = {};
        horarios.forEach(horario => {
          dias.forEach(dia => {
            const key = `${dia.toISOString().slice(0, 10)}T${horario}:00`;
            horarioMap[key] = VagasData.filter(vaga => vaga.dataHora.startsWith(key));
          });
        });
        setAgendamentosPorHora(horarioMap);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };
    fetchData();
  }, [dataSelecionada]);

  const getStatusColor = status => {
    switch (status) {
      case 'cancelado': return 'red';
      case 'precriada': return 'yellow';
      case 'Disponivel': return 'green';
      default: return 'grey'; // for null and unknown statuses
    }
  };

  return (
    <div className={styles.pagina}>

      <div className={styles.container}>
        <VoltarButton />
        <h1>Agendamentos da semana</h1>
        <div className={styles.calendar_container}>
          <div className={styles.calendar_box}>
            <div className={dateStyles.data_completa}>{DataCompleta(dataSelecionada)}</div>
            <CalendarGrennIcon onDataSelecionada={setDataSelecionada} />
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
              <th className={styles.coluna_l1}></th>
              {dias.map((dia, index) => (
                <th key={index}>
                  <div className={styles.coluna_l1}>
                    <h6>{diasDaSemana[dia.getDay()]}</h6>
                    <div>{`${dia.getDate().toString().padStart(2, '0')}/${(dia.getMonth() + 1).toString().padStart(2, '0')}`}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {horarios.map((horario, index) => (
              <tr key={index} className={styles.linha}>
                <th className={styles.coluna1}>{horario}</th>
                {dias.map(dia => {
                  const key = `${dia.toISOString().slice(0, 10)}T${horario}:00`;
                  const agendamentos = agendamentosPorHora[key] || [];
                  return (
                    <td key={dia.toISOString()} className={styles.th}>
                      {agendamentos.map((agendamento, idx) => (
                        <div key={idx} className={styles[agendamento.status.toLowerCase()]}>
                          <span>
                            {agendamento?.agendamento?.animal?.nome ? agendamento.agendamento.animal.nome : agendamento.status}
                          </span>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllAgendamentosSemanaForm;