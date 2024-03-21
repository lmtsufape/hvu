import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Select from 'react-select';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from '../WhiteButton';
import { getAllAnimal } from '../../../services/animalService';
import { getAllVaga } from '../../../services/vagaService';
import { createAgendamento } from '../../../services/agendamentoService';

const HorariosSemana = () => {
  const router = useRouter();

  const [selecionarData, setSelecionarData] = useState(new Date());
  const [selecionarHorario, setSelecionarHorario] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [animais, setAnimais] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null); 

  const [vagas, setVagas] = useState(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const timeOptions = [
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
  ];

  const diasSemana = {
    0: 'Domingo',
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado'
  };

  const handleDateChange = (date) => {
    setSelecionarData(date);
  };

  const handleTimeChange = (selectedOption) => {
    setSelecionarHorario(selectedOption);
  };

  // Função para avançar uma semana
  const avancarSemana = () => {
    const proximaSemana = new Date(selecionarData);
    proximaSemana.setDate(proximaSemana.getDate() + 7);
    setSelecionarData(proximaSemana);
  };

  // Função para retroceder uma semana
  const retrocederSemana = () => {
    const semanaAnterior = new Date(selecionarData);
    semanaAnterior.setDate(semanaAnterior.getDate() - 7);
    setSelecionarData(semanaAnterior);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const AnimaisData = await getAllAnimal();
        setAnimais(AnimaisData);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const VagasData = await getAllVaga();
        setVagas(VagasData);
        console.log("VagasData:", VagasData);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };
    fetchData();
  }, []);

  const handleAnimalSelection = (event) => {
    const animalId = event.target.value;
    const selectedAnimalInfo = animais.find(animal => animal.id === parseInt(animalId));
    setSelectedAnimal(selectedAnimalInfo);
  };
  console.log("selectedAnimal", selectedAnimal);

  const formatDate = (dateString, selectedTime) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = selectedTime ? ` às ${selectedTime}` : '';
    return formattedDate + formattedTime;
  };

  const handleCreateAgendamento = async () => {
    // Separar a hora e os minutos do horário selecionado
    const [hour, minute] = selecionarHorario.value.split(':').map(Number);
    
    // Clonar a data selecionada para evitar mutação indesejada
    const selectedDate = new Date(selecionarData);
  
    // Definir a hora e os minutos selecionados na data selecionada
    selectedDate.setHours(hour, minute);
  
    const agendamentoToCreate = {
      animal: { id: selectedAnimal.id },
      dataVaga: selectedDate.toISOString()
    };
  
    console.log("agendamentoToCreate", agendamentoToCreate);
  
    try {
      const newAgendamento = await createAgendamento(agendamentoToCreate);
      console.log(newAgendamento);
      alert("Consulta agendada com sucesso!");
      router.push("/meusAgendamentos");
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.voltar_button}>
        <VoltarButton />
      </div>

      <div className={styles.title_box}>
        <h1>Agendar Consulta</h1>
      </div>

      <div className={styles.boxprincipal}>
        <div className={styles.select_container}>
          <div className={styles.select_box}>
            <h1>Paciente</h1>
            <select 
              className="form-select" aria-label="Default select example"
              name="animal"
              value={selectedAnimal ? selectedAnimal.id : ''} // Alterado
              onChange={handleAnimalSelection}
            >
              <option value="">Selecione um paciente</option>
              {animais && animais.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome}
                </option>
              ))}
            </select>
          </div>
        </div>


        <h1 className={styles.titulodataconsulta}>Data da Consulta</h1>
        <h2 className={styles.descricaotitulodataconsulta}>Selecione o dia e o horário disponível de sua preferência para o atendimento</h2>
        <div className={styles.button_voltar_avancar}>
          <button className={styles.button_voltar} onClick={retrocederSemana}>⭠</button>
          <button className={styles.button_avancar} onClick={avancarSemana}>⭢</button>
        </div>
        <div className={styles.containersemana}>
          {Array.from({ length: 7 }, (_, index) => {
            const currentDate = new Date(selecionarData);
            currentDate.setDate(currentDate.getDate() - currentDate.getDay() + index);
            if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
              return (
                <div key={currentDate} className={styles.containerdia}>
                  <h2 className={styles.diasdasemana}>{diasSemana[currentDate.getDay()]}</h2>
                  <p className={styles.data}>{currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</p>
                  <div className="time-buttons">
                    {timeOptions.map((timeOption) => (
                      <button
                        key={timeOption.value}
                        className={
                          currentDate.getDate() === selecionarData.getDate() && selecionarHorario?.value === timeOption.value
                            ? `${styles.botaohora} selected`
                            : styles.botaohora
                        }
                        onClick={() => {
                          handleDateChange(currentDate);
                          handleTimeChange(timeOption);
                        }}
                      >
                        {timeOption.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className={styles.button_container}>
          <CancelarWhiteButton />
          <button className={styles.agendar_button} onClick={openModal}>Agendar</button>
        </div>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>

              <div className={styles.container1}>
                <div className={styles.box}>
                  <div className={styles.title}>Tem certeza que deseja realizar o agendamento?</div>
                </div>

                <div className={styles.div_button1}>
                  <button onClick={closeModal} className={styles.button_close_modal}>X</button>
                </div>
              </div>

              <div className={styles.container2}>
                <div className={styles.box}>
                  <div className={styles.item}>Paciente</div>
                  <div className={styles.subtitle}>{selectedAnimal ? selectedAnimal.nome : ''}</div> {/* Alterado */}
                </div>

                <div className={styles.box}>
                  <div className={styles.item}>Data</div>
                  <div className={styles.subtitle}>{formatDate(selecionarData, selecionarHorario ? selecionarHorario.label : '')}</div>
                </div>
              </div>

              <div className={styles.div_button2}>
                <div><button className={styles.button_cancelar_consulta} onClick={closeModal}>Cancelar</button></div>
                <div><button className={styles.button_agendar_consulta} type='button' onClick={handleCreateAgendamento}>Agendar</button></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorariosSemana;
