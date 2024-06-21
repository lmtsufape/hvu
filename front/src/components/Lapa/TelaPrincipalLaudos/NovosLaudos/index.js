import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import { createFichaSolicitacao } from "../../../../../services/fichaSolicitacaoService";
import TutorList from "@/hooks/useTutorList";
import AnimalList from "@/hooks/useAnimalList";
import AnimalByTutorList from "@/hooks/useAnimalByTuorList";
import { getAnimalByTutor } from "../../../../../services/animalService";
import MedicoList from "@/hooks/useMedicoList";
import VoltarButton from "../../VoltarButton";
import Alert from "@/components/Alert";
import ErrorAlert from "@/components/ErrorAlert";

function CreateFichaForm() {
  const router = useRouter();

  const { tutores, error: tutoreserror } = TutorList();
  const { animais, error: animaiserror } = AnimalList();
  const { medicos, error: medicoserror } = MedicoList();

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedMedico, setSelectedMedico] = useState(null);

  const [selectedTutorDetails, setSelectedTutorDetails] = useState(null);
  const [selectedAnimalDetails, setSelectedAnimalDetails] = useState(null);
  const [selectedMedicoDetails, setSelectedMedicoDetails] = useState(null);

  const [animaisByTutor, setAnimaisByTutor] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [fichaDeSolicitacaoData, setFichaDeSolicitacaoData] = useState({
    fichaClinica: "",
    tipoServico: "",
    dataHoraObito: "",
    dataRecebimento: "",
    estadoConservacao: "",
    acondicionamento: "",
    eutanasia: false,
    historico: "",
    caracteristicasAdicionais: "",
    tutorId: null,
    animalId: null,
    medicoId: null,
  });
  
  const [errors, setErrors] = useState({
    fichaClinica: "",
    tipoServico: "",
    dataHoraObito: "",
    dataRecebimento: "",
    estadoConservacao: "",
    acondicionamento: "",
    eutanasia: "",
    historico: "",
    caracteristicasAdicionais: "",
    tutor: "",
    animal: "",
    medico: "",
  });  

  useEffect(() => {
    if (tutores.length > 0 && selectedTutor === null) {
      setSelectedTutor(null);
    }
    if (animais.length > 0 && selectedAnimal === null) {
      setSelectedAnimal(null);
    }
    if (medicos.length > 0 && selectedMedico === null) {
      setSelectedMedico(null);
    }
  }, [tutores, animais, medicos, selectedTutor, selectedAnimal, selectedMedico]);

  const handleTutorSelection = async (event) => {
    const selectedTutorId = event.target.value;
    setSelectedTutor(selectedTutorId);
    setSelectedAnimal(null);
    setSelectedMedico(null);
  
    try {
      const response = await getAnimalByTutor(selectedTutorId);
      const animaisFiltrados = response.data;
      setAnimaisByTutor(animaisFiltrados);
  
      if (animaisFiltrados.length === 0) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
  
      const tutorDetails = tutores.find(tutor => tutor.id === parseInt(selectedTutorId));
      setSelectedTutorDetails(tutorDetails);
    } catch (error) {
      setShowErrorAlert(true);
    }
  };

  

  const handleAnimalSelection = (event) => {
    const selectedAnimalId = event.target.value;
    const animalDetails = animais.find(animal => animal.id === parseInt(selectedAnimalId));
    setSelectedAnimalDetails(animalDetails);
    setSelectedAnimal(selectedAnimalId); // Correção: Definindo o ID do animal selecionado
  };
  
  const handleMedicoSelection = (event) => {
    const selectedMedicoId = event.target.value;
    const medicoDetails = medicos.find(medico => medico.id === parseInt(selectedMedicoId));
    setSelectedMedicoDetails(medicoDetails);
    setSelectedMedico(selectedMedicoId); // Correção: Definindo o ID do médico selecionado
  };  

  const formatDate = (data) => {
    if (!data) return ''; // Verifica se a data é válida
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const hora = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${ano}-${mes}-${dia}T${hora}:${minutos}`;
  };
 
  const handleFichaDeSolicitacaoChange = (event) => {
    const { name, value, type, checked } = event.target;
  
    // Verificar se o tipo é um checkbox
    const newValue = type === 'checkbox' ? checked : value;
  
    setFichaDeSolicitacaoData({ ...fichaDeSolicitacaoData, [name]: newValue });
  };
  

  const validateForm = () => {
    const newErrors = {};
  
    if (!fichaDeSolicitacaoData.dataHoraObito) {
      newErrors.dataHoraObito = "Campo obrigatório";
    }
    setErrors(newErrors);
  
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      const fichaDeSolicitacaoToCreate = {
        dataHoraObito: fichaDeSolicitacaoData.dataHoraObito,
        dataRecebimento: fichaDeSolicitacaoData.dataRecebimento,
        estadoConservacao: fichaDeSolicitacaoData.estadoConservacao,
        acondicionamento: fichaDeSolicitacaoData.acondicionamento,
        eutanasia: fichaDeSolicitacaoData.eutanasia,
        historico: fichaDeSolicitacaoData.historico,
        caracteristicasAdicionais: fichaDeSolicitacaoData.caracteristicasAdicionais,
        tutorId: selectedTutor ? parseInt(selectedTutor) : null,
        animalId: selectedAnimal ? parseInt(selectedAnimal.id) : null,
        medicoId: selectedMedico ? parseInt(selectedMedico.id) : null,
      };
  
      try {
        const newFicha = await createFichaSolicitacao(fichaDeSolicitacaoToCreate);
        console.log(newFicha);
        setShowAlert(true);
        resetForm();
      } catch (error) {
        console.error("Erro ao criar ficha de solicitação:", error);
        console.log("Detalhes do erro:", error.response);
        setShowErrorAlert(true);
      }
    } else {
      console.log("Formulário inválido, preencha corretamente e tente novamente.");
    }
  };  
  
  const resetForm = () => {
    setFichaDeSolicitacaoData({
      dataHoraObito: "",
      dataRecebimento: "", 
      estadoConservacao: "",
      acondicionamento: "", 
      eutanasia: false,
      historico: "",
      caracteristicasAdicionais: "",
      tutorId: null,
      animalId: null,
      medicoId: null,
    });
  
    setSelectedTutor(null);
    setSelectedAnimal(null);
    setSelectedMedico(null);
  
    setErrors({
      dataHoraObito: "",
      dataRecebimento: "", // Novo campo: Data de Recebimento
      estadoConservacao: "",
      acondicionamento: "", // Novo campo: Acondicionamento
      eutanasia: "", // Novo campo: Eutanásia
      historico: "",
      caracteristicasAdicionais: "",
      tutor: "",
      animal: "",
      medico: "",
    });
  };
  

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Informações Obrigatórias da Ficha de Solicitação de Serviço - Necropsia/Laudo</h1>
      <form className={styles.form_box} onSubmit={handleSubmit}>
        <div className="row">
          <h2>Informações sobre o Material</h2>
          <div className="col">
            <label htmlFor="dataHoraObito" className="form-label">Data e Hora do Óbito</label>
            <input
              type="datetime-local"
              className={`form-control ${errors.dataHoraObito ? "is-invalid" : ""}`}
              name="dataHoraObito"
              value={formatDate(fichaDeSolicitacaoData.dataHoraObito)}
              onChange={handleFichaDeSolicitacaoChange}
            />
            {errors.dataHoraObito && <div className="invalid-feedback">{errors.dataHoraObito}</div>}
          </div>
          <div className="col">
            <label htmlFor="estadoConservacao" className="form-label">Estado de Conservação</label>
            <input
              type="text"
              className={`form-control ${errors.estadoConservacao ? "is-invalid" : ""}`}
              name="estadoConservacao"
              placeholder="Insira o Estado de Conservação"
              value={fichaDeSolicitacaoData.estadoConservacao}
              onChange={handleFichaDeSolicitacaoChange}
            />
          </div>
          <div className="col">
              <label htmlFor="eutanasia" className="form-label">Eutanásia</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="eutanasia"
                  checked={fichaDeSolicitacaoData.eutanasia}
                  onChange={handleFichaDeSolicitacaoChange}
                />
                <label className="form-check-label" htmlFor="eutanasia">
                  Realizada
                </label>
              </div>
            </div>
        </div>

        <div className="row">
        <h1></h1>
          <div className="col">
            <label htmlFor="historico" className="form-label">Histórico</label>
            <input
              type="text"
              className={`form-control ${errors.historico ? "is-invalid" : ""}`}
              name="historico"
              placeholder="Insira o Histórico"
              value={fichaDeSolicitacaoData.historico}
              onChange={handleFichaDeSolicitacaoChange}
            />
          </div>
          <div className="col">
            <label htmlFor="caracteristicasAdicionais" className="form-label">Características Adicionais</label>
            <input
              type="text"
              className={`form-control ${errors.caracteristicasAdicionais ? "is-invalid" : ""}`}
              name="caracteristicasAdicionais"
              placeholder="Insira as Características Adicionais"
              value={fichaDeSolicitacaoData.caracteristicasAdicionais}
              onChange={handleFichaDeSolicitacaoChange}
            />
          </div>
        </div>
        <div className="row">
            <h1></h1>
            <div className="col">
              <label htmlFor="dataRecebimento" className="form-label">Data de Recebimento</label>
              <input
                type="datetime-local"
                className={`form-control ${errors.dataRecebimento ? "is-invalid" : ""}`}
                name="dataRecebimento"
                value={formatDate(fichaDeSolicitacaoData.dataRecebimento)}
                onChange={handleFichaDeSolicitacaoChange}
              />
              {errors.dataRecebimento && <div className="invalid-feedback">{errors.dataRecebimento}</div>}
            </div>
            <div className="col">
              <label htmlFor="acondicionamento" className="form-label">Acondicionamento</label>
              <select
                className={`form-select ${errors.acondicionamento ? "is-invalid" : ""}`}
                name="acondicionamento"
                value={fichaDeSolicitacaoData.acondicionamento}
                onChange={handleFichaDeSolicitacaoChange}
              >
                <option value="">Selecione o tipo de acondicionamento</option>
                <option value="CONGELADO">Congelado</option>
                <option value="REFRIGERADO">Refrigerado</option>
                <option value="AMBIENTE">Ambiente</option>
              </select>
              {errors.acondicionamento && <div className="invalid-feedback">{errors.acondicionamento}</div>}
            </div>
            <div className="col">
              <label htmlFor="tipoServico" className="form-label">Tipo de Serviço</label>
              <select
                className={`form-select ${errors.tipoServico ? "is-invalid" : ""}`}
                name="tipoServico"
                value={fichaDeSolicitacaoData.tipoServico}
                onChange={handleFichaDeSolicitacaoChange}
              >
                <option value="">Selecione o tipo de Serviço</option>
                <option value="NECROPSIA_SEM_MICROSCOPIA">Necropsia</option>
                <option value="MICROSCOPIA">Microscopia</option>
                <option value="NECROPSIA_COM_MICROSCOPIA">Necropsia com Microscopia</option>
              </select>
              {errors.tipoServico && <div className="invalid-feedback">{errors.tipoServico}</div>}
            </div>
          </div>
                       

        <div className="row">
          <h2>Identificação do Tutor</h2>
          <div className="col">
            <label htmlFor="tutor" className="form-label">Tutor</label>
            <select 
              className={`form-select ${errors.tutor ? "is-invalid" : ""}`}
              name="tutor"
              aria-label="Selecione o Tutor do animal"
              value={selectedTutor || ""}
              onChange={handleTutorSelection}
            >
              <option value="">Selecione o Tutor</option>
              {tutores.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <h2>Identificação do Animal</h2>
          <div className="col">
            <div className="mb-3">
              <label htmlFor="animal" className="form-label">Animal</label>
              <select
                className={`form-control ${errors.animal ? "is-invalid" : ""}`}
                name="animal"
                value={selectedAnimal || ""}
                onChange={handleAnimalSelection}
              >
                <option value="">Selecione um animal</option>
                {animais && animais.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <h2>Veterinário Requisitante</h2>
          <div className="col">
            <label htmlFor="medico" className="form-label">Veterinário</label>
            <select 
              className={`form-select ${errors.medico ? "is-invalid" : ""}`}
              name="medico"
              aria-label="Selecione o Médico"
              value={selectedMedico || ""}
              onChange={handleMedicoSelection}
            >
              <option value="">Selecione o veterinário</option>
              {medicos && medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.button_container}>
          <button className={styles.cadastrar_button} type="submit">
            Cadastrar
          </button>
        </div>

      </form>
    </div>
  );
   

}
export default CreateFichaForm;