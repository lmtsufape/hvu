import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import dateStyles from "../Date/index.module.css";
import Filter from '../GetAgendamentosFilter';
import { DataCompleta, DataCurta, DiaDaSemana } from '../Date';
import CalendarGrennIcon from '../CalendarGreenIcon';
import SearchBar from '../SearchBar';
import VoltarButton from '../VoltarButton';

function GetAllAgendamentosDiaForm() {
  const router = useRouter();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  const handleDataSelecionada = (novaData) => {
    setDataSelecionada(novaData);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>

        < VoltarButton />
        <h1>Agendamentos do dia</h1>

        <div className={styles.cadendar_container}>
          <div className={styles.cadendar_box}>
            <div className={dateStyles.data_completa}>{DataCompleta(dataSelecionada)}</div>
            < CalendarGrennIcon onDataSelecionada={handleDataSelecionada} />
          </div>
          < Filter />
        </div>
        <div className={styles.menu}>
          <div className={styles.button_options}>
            <button className={styles.button} onClick={(e) => router.push("/agendamentoEspecial")}>Novo agendamento</button>
            <button className={styles.button}>Criar vagas</button>
          </div>
          < SearchBar />
        </div>

        <table className={styles.table}>
          <thead>
            <tr className={styles.line1_box}>
              <th className={styles.column1_line1}></th>
              <th>
                <div className={styles.line1}>
                  <div className={dateStyles.dia_da_semana}>{DiaDaSemana(dataSelecionada)}</div>
                  <div className={dateStyles.curta}>{DataCurta(dataSelecionada)}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className={styles.time}>08:00</th>
              <th className={styles.th}>
                <div className={styles.cardsJuntos}>
                  <button className={styles.button_precriada} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Pantufa  &bull; Felino</div>
                          <h2 className={styles.status_precriada}>Pré-criada</h2>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>08h00 - 09h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_finalizado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Mel  &bull; Canino</div>
                          <div className={styles.status_finalizado}>Finalizado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>08h00 - 09h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_agendado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Pantufa  &bull; Felino</div>
                          <div className={styles.status_agendado}>Agendado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>08h00 - 09h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_precriada} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Pantufa  &bull; Felino</div>
                          <h2 className={styles.status_precriada}>Pré-criada</h2>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>08h00 - 09h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </th>
            </tr>
            <tr>
              <th className={styles.time}>09:00</th>
              <th className={styles.th}>
                <div className={styles.cardsJuntos}>
                  <button className={styles.button_disponivel} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Mel  &bull; Canino</div>
                          <div className={styles.status_disponivel}>Disponível</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>09h00 - 10h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_cancelado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Duque  &bull; Canino</div>
                          <div className={styles.status_cancelado}>Cancelado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>09h00 - 10h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_finalizado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Mel  &bull; Canino</div>
                          <div className={styles.status_finalizado}>Finalizado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>09h00 - 10h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </th>
            </tr>
            <tr>
              <th className={styles.time}>10:00</th>
              <th className={styles.th}>
                <div className={styles.cardsJuntos}>
                  <button className={styles.button_cancelado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Duque  &bull; Canino</div>
                          <div className={styles.status_cancelado}>Cancelado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>10h00 - 11h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_precriada} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Pantufa  &bull; Felino</div>
                          <h2 className={styles.status_precriada}>Pré-criada</h2>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>10h00 - 11h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_disponivel} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Mel  &bull; Canino</div>
                          <div className={styles.status_disponivel}>Disponível</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>10h00 - 11h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_precriada} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Pantufa  &bull; Felino</div>
                          <h2 className={styles.status_precriada}>Pré-criada</h2>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>10h00 - 11h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </th>
            </tr>
            <tr>
              <th className={styles.time}>11:00</th>
              <th className={styles.th}>
                <div className={styles.cardsJuntos}>
                  <button className={styles.button_agendado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Pantufa  &bull; Felino</div>
                          <div className={styles.status_agendado}>Agendado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>11h00 - 12h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_cancelado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Duque  &bull; Canino</div>
                          <div className={styles.status_cancelado}>Cancelado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>11h00 - 12h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button className={styles.button_agendado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Pantufa  &bull; Felino</div>
                          <div className={styles.status_agendado}>Agendado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>11h00 - 12h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </th>
            </tr>
            <tr>
              <th className={styles.time}>12:00</th>
              <th className={styles.th}>
                <div className={styles.cardsJuntos}>
                  <button className={styles.button_finalizado} onClick={openModal}>
                    <div className={styles.infos_container}>
                      <div>
                        <div className={styles.infos_box1}>
                          <div className={styles.info1}>Mel  &bull; Canino</div>
                          <div className={styles.status_finalizado}>Finalizado</div>
                        </div>
                        <div className={styles.infos_box2}>
                          <div className={styles.info2}>Exame</div>
                          <div className={styles.info2}>12h00 - 13h00</div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.container1}>
                <div className={styles.box}>
                  <div className={styles.title}>Animal_nome</div>
                  <div className={styles.subtitle}>Espécie</div>
                </div>
                <div className={styles.div_button1}>
                  <button onClick={closeModal} className={styles.button_close_modal}>X</button>
                </div>
              </div>
              <div className={styles.container2}>
                <div className={styles.box}>
                  <div className={styles.title}>Tutor</div>
                  <div className={styles.subtitle}>tutor_nome</div>
                </div>
                <div className={styles.box}>
                  <div className={styles.title}>Especialidade</div>
                  <div className={styles.subtitle}>especialidade_nome</div>
                </div>
              </div>
              <div className={styles.div_button2}>
                <button className={styles.button_cancelar_consulta}>Cancelar consulta</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllAgendamentosDiaForm;
