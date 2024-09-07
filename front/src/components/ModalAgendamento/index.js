import React, { useState } from 'react';
import styles from "./index.module.css";
import { reagendamento } from '../../../services/agendamentoService';

const ModalAgendamento = ({
  tutor,
  selectedVaga,
  isOpen,
  closeModal,
  descricaoCancelamento,
  setDescricaoCancelamento,
  handleCancelarConsulta
}) => {
  const [showReagendarModal, setShowReagendarModal] = useState(false);
  const [dataHorario, setDataHorario] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novoHorario, setNovoHorario] = useState('');

  if (!isOpen) return null;

  console.log("selectedVaga:", selectedVaga); 
  console.log("dataHorario:", dataHorario); 
  console.log("novaData:", novaData); 
  console.log("novoHorario:", novoHorario); 

  const handleReagendarVaga = async () => {
    try {
      const agendamentoId = selectedVaga?.agendamento?.id;
      console.log("agendamentoId:", agendamentoId);
      if (!agendamentoId) {
        throw new Error("Agendamento ID não encontrado.");
      }

      // Combinar a nova data e o novo horário no formato desejado
      const dataHorarioFormatado = new Date(`${novaData}T${novoHorario}:00.000Z`).toISOString();
      setDataHorario(dataHorarioFormatado);

      await reagendamento(dataHorarioFormatado, agendamentoId);
      setShowReagendarModal(false);
      closeModal(); 
      console.log("Reagendamento concluído com sucesso!")
    } catch (error) {
      console.error('Erro ao reagendar vaga:', error);
    }
  };

  const handleOpenReagendarModal = () => {
    setShowReagendarModal(true);
  };

  const handleCloseReagendarModal = () => {
    setShowReagendarModal(false);
  };

  return (
    <div>
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.container1}>
                <div className={styles.box}>
                  <div className={styles.title}>{selectedVaga?.agendamento?.animal?.nome || ""}</div>
                  <div className={styles.subtitle}>{selectedVaga?.agendamento?.animal?.raca?.especie?.nome || ""}</div>
                </div>
                <div className={styles.div_button1}>
                  <button onClick={closeModal} className={styles.button_close_modal}>X</button>
                </div>
              </div>
              <div className={styles.container2}>
                <div className={styles.box}>
                  <div className={styles.title}>Tutor</div>
                  <div className={styles.subtitle}>{tutor?.nome || "Não há"}</div>
                </div>
                <div className={styles.box}>
                  <div className={styles.title}>Especialidade</div>
                  <div className={styles.subtitle}>{selectedVaga?.especialidade?.nome}</div>
                </div>
              </div>
              <div className={styles.box}>
                <div className={styles.title}>Descrição do Cancelamento</div>
                <input
                  type="text"
                  value={descricaoCancelamento}
                  onChange={(e) => setDescricaoCancelamento(e.target.value)}
                  className={styles.input}
                  placeholder="Digite a descrição do cancelamento"
                />
              </div>
              <div className={styles.div_button2}>
                <button onClick={handleOpenReagendarModal} className={styles.button_reagendar_consulta}>
                  Reagendar consulta
                </button>
                <button 
                  onClick={handleCancelarConsulta} 
                  className={styles.button_cancelar_consulta} 
                  disabled={!descricaoCancelamento.trim()}>
                  Cancelar consulta
                </button>
              </div>
            </div>
          </div>
          {showReagendarModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <div className={styles.box}>
                    <div className={styles.title}>Reagendar Consulta</div>
                    <input
                      className={styles.input}
                      aria-label="Selecione a nova data"
                      type="date" 
                      value={novaData}
                      onChange={(e) => setNovaData(e.target.value)}
                    />
                    <select
                      className={styles.input}
                      aria-label="Selecione o novo horário"
                      value={novoHorario}
                      onChange={(e) => setNovoHorario(e.target.value)}
                    >
                      <option value="">Selecione o horário</option>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                    </select>
                  </div>
                  <div className={styles.div_button2}>
                    <button onClick={handleReagendarVaga} className={styles.button_reagendar_consulta}>
                      Confirmar Reagendamento
                    </button>
                    <button onClick={handleCloseReagendarModal} className={styles.button_cancelar_consulta}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

export default ModalAgendamento;
