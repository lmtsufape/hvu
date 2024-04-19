import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Select from 'react-select';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from '../WhiteButton';
import { getAllAnimal } from '../../../services/animalService';
import { getAllVaga } from '../../../services/vagaService';
import { createAgendamento } from '../../../services/agendamentoService';
import { set } from 'date-fns';

const HorariosSemana = () => {
  const router = useRouter();

  const [selecionarData, setSelecionarData] = useState(new Date());
  const [selecionarHorario, setSelecionarHorario] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [animais, setAnimais] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null); 

  const [vagas, setVagas] = useState(null);
  const [selectedVaga, setSelectedVaga] = useState(null);

  const [errors, setErrors] = useState({});

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
    console.log("selectedAnimal", selectedAnimal);
  };

  const formatDate = (dateString, selectedTime) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = selectedTime ? ` às ${selectedTime}` : '';
    return formattedDate + formattedTime;
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedAnimal) {
      errors.selectedAnimal = "Campo obrigatório";
    }
    if (!selectedVaga) {
      alert("Selecione uma vaga para realizar o agendamento.");
    }
    return errors;
  };

  const handleAgendar = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      openModal();
    }
  };

  const handleCreateAgendamento = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const agendamentoToCreate = {
      animal: { id: selectedAnimal.id },
      dataVaga: selecionarHorario,
      status: 'Agendado'
    };
  
    console.log("agendamentoToCreate", agendamentoToCreate);
    
    try {
      const newAgendamento = await createAgendamento(agendamentoToCreate, selectedVaga.id);
      console.log(newAgendamento);
      alert("Consulta agendada com sucesso!");
      router.push("/meusAgendamentos");
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      if (error.response && error.response.status === 500) {
        alert("Vaga não está disponível.");
      } else {
        // Se não for 500, faça outra coisa
        alert("Ocorreu um erro ao agendar a consulta. Por favor, tente novamente.");
      }
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
              className={`form-select ${styles.input} ${errors.selectedAnimal ? "is-invalid" : ""}`} 
              aria-label="Default select example"
              name="animal"
              value={selectedAnimal ? selectedAnimal.id : ''}
              onChange={handleAnimalSelection}
            >
              <option value="">Selecione um paciente</option>
              {animais && animais.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome}
                </option>
              ))}
            </select>
            {errors.selectedAnimal && <div className="invalid-feedback">{errors.selectedAnimal}</div>}
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
            const currentDateFormatted = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const vagasForCurrentDay = vagas && vagas.filter(vaga => {
              const vagaDate = new Date(vaga.dataHora);
              const vagaDateFormatted = vagaDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
              return vagaDateFormatted === currentDateFormatted;
            });
            if (!vagasForCurrentDay || vagasForCurrentDay.length === 0) {
              return (
                <div key={currentDate} className={styles.containerdia}>
                  <h2 className={styles.diasdasemana}>{diasSemana[currentDate.getDay()]}</h2>
                  <p className={styles.data}>{currentDateFormatted}</p>
                  <div className={styles.no_vagas}>
                    Não há vagas
                  </div>
                </div>
              );
            }
            return (
              <div key={currentDate} className={styles.containerdia}>
                <h2 className={styles.diasdasemana}>{diasSemana[currentDate.getDay()]}</h2>
                <p className={styles.data}>{currentDateFormatted}</p>
                <div className="time-buttons">
                  {vagasForCurrentDay.map((vaga) => (
                    <button
                      key={vaga.id}
                      className={
                        
                        vaga.status === 'Agendado' || vaga.status === 'Finalizado' ?
                        `${styles.botaohoraIndisponivel} }`
                        :
                        
                        (vaga.tipoConsulta && vaga.tipoConsulta.tipo === 'Retorno' && !(vaga.status === 'Agendado' || vaga.status === 'Finalizado') ?
                        `${styles.botaoRetorno} ${selectedVaga === vaga ? styles.selected : ''}`
                        : `${styles.botaoPrimeiraConsulta} ${selectedVaga === vaga ? styles.selected : ''}`)
                    
                    }
                      onClick={() => {
                        if(!(vaga.status === 'Agendado' || vaga.status === 'Finalizado')){

                        handleDateChange(currentDate);
                        setSelecionarHorario(vaga.dataHora);
                        setSelectedVaga(vaga);
                        }
                      }}
                    >
                      {vaga.dataHora.split('T')[1].split(':').slice(0, 2).join(':')}
                      <br/>{vaga.tipoConsulta ? vaga.tipoConsulta.tipo : ''}
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
          <button className={styles.agendar_button} onClick={handleAgendar}>Agendar</button>
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

              </div>

              <div className={styles.container2}>
                <div className={styles.box}>
                  <div className={styles.item}>Paciente</div>
                  <div className={styles.subtitle}>{selectedAnimal ? selectedAnimal.nome : ''}</div> {/* Alterado */}
                </div>

                <div className={styles.box}>
                  <div className={styles.item}>Horário</div>
                  <div className={styles.subtitle}>{formatDate(selecionarData, 
                        selecionarHorario ? selecionarHorario.split('T')[1].split(':').slice(0, 2).join(':') : '')}
                  </div>
                </div>

                <div className={styles.box}>
                  <div className={styles.item}>Consulta</div>
                  <div className={styles.subtitle}>{selectedVaga && selectedVaga.tipoConsulta ? selectedVaga.tipoConsulta.tipo : ''}</div>
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


