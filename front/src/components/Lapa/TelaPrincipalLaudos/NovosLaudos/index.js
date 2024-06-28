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
    fichaClinica: '',
    tipoServico: '',
    dataHoraObito: '',
    dataRecebimento: '',
    estadoConservacao: '',
    acondicionamento: '',
    eutanasia: false,
    historico: '',
    caracteristicasAdicionais: '',
    tutor: { id: null },
    animal: { id: null },
    medico: { id: null },
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
    medico: ""
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

  const handleTutorSelection = (event) => {
    const selectedTutorId = parseInt(event.target.value);
    setSelectedTutor(selectedTutorId);
    setFichaDeSolicitacaoData(prevData => ({
      ...prevData,
      tutor: { id: selectedTutorId }
    }));
    console.log('Tutor selecionado:', selectedTutorId);
    console.log('Dados da ficha de solicitação:', fichaDeSolicitacaoData);
  };

  const handleAnimalSelection = (event) => {
    const selectedAnimalId = parseInt(event.target.value);
    setSelectedAnimal(selectedAnimalId);
    setFichaDeSolicitacaoData(prevData => ({
      ...prevData,
      animal: { id: selectedAnimalId }
    }));
    console.log('Animal selecionado:', selectedAnimalId);
    console.log('Dados da ficha de solicitação:', fichaDeSolicitacaoData);
  };

  const handleMedicoSelection = (event) => {
    const selectedMedicoId = parseInt(event.target.value);
    setSelectedMedico(selectedMedicoId);
    setFichaDeSolicitacaoData(prevData => ({
      ...prevData,
      medico: { id: selectedMedicoId }
    }));
    console.log('Médico selecionado:', selectedMedicoId);
    console.log('Dados da ficha de solicitação:', fichaDeSolicitacaoData);
  };

  const handleFichaDeSolicitacaoChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
  console.log(fichaDeSolicitacaoData);

  setFichaDeSolicitacaoData({
    ...fichaDeSolicitacaoData,
    [name]: newValue,
  });
  };
  
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString();
  };
  
  const validateForm = () => {
  const newErrors = {};

  if (!fichaDeSolicitacaoData.fichaClinica) {
    newErrors.fichaClinica = "Ficha Clínica é obrigatória.";
  }
  if (!fichaDeSolicitacaoData.tipoServico) {
    newErrors.tipoServico = "Tipo de Serviço é obrigatório.";
  }
  if (!fichaDeSolicitacaoData.dataHoraObito) {
    newErrors.dataHoraObito = "Data e Hora do Óbito são obrigatórias.";
  }
  if (!fichaDeSolicitacaoData.dataRecebimento) {
    newErrors.dataRecebimento = "Data de Recebimento é obrigatória.";
  }
  if (!fichaDeSolicitacaoData.estadoConservacao) {
    newErrors.estadoConservacao = "Estado de Conservação é obrigatório.";
  }
  if (!fichaDeSolicitacaoData.acondicionamento) {
    newErrors.acondicionamento = "Acondicionamento é obrigatório.";
  }
  if (!fichaDeSolicitacaoData.tutor.id) {
    newErrors.tutor = "Selecione um Tutor.";
  }
  if (!fichaDeSolicitacaoData.animal.id) {
    newErrors.animal = "Selecione um Animal.";
  }
  if (!fichaDeSolicitacaoData.medico.id) {
    newErrors.medico = "Selecione um Médico.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
        const fichaDeSolicitacaoToCreate = {
          fichaClinica: fichaDeSolicitacaoData.fichaClinica,
          tipoServico: fichaDeSolicitacaoData.tipoServico,
          dataHoraObito: formatDate(fichaDeSolicitacaoData.dataHoraObito),
          dataRecebimento: formatDate(fichaDeSolicitacaoData.dataRecebimento),
          estadoConservacao: fichaDeSolicitacaoData.estadoConservacao,
          acondicionamento: fichaDeSolicitacaoData.acondicionamento,
          eutanasia: fichaDeSolicitacaoData.eutanasia,
          historico: fichaDeSolicitacaoData.historico,
          caracteristicasAdicionais: fichaDeSolicitacaoData.caracteristicasAdicionais,
          tutor: { 
            id: selectedTutor
          },
          animal: { 
            id: selectedAnimal 
          },
          medico: { 
            id: selectedMedico
          }
        };

        try {
            const newFicha = await createFichaSolicitacao(fichaDeSolicitacaoToCreate);
            console.log(newFicha);
            setShowAlert(true);
            resetForm();
        } catch (error) {
            console.error("Erro ao criar ficha de solicitação:", error);
            if (error.response) {
                console.log("Detalhes do erro:", error.response);
                if (error.response.status === 400) {
                    alert("Erro ao enviar dados: Verifique os campos preenchidos.");
                } else {
                    alert("Erro ao criar ficha de solicitação. Por favor, tente novamente mais tarde.");
                }
            } else {
                alert("Erro de rede ou servidor. Por favor, tente novamente mais tarde.");
            }
            setShowErrorAlert(true);
        }
    } else {
        console.log("Formulário inválido, preencha corretamente e tente novamente.");
    }
  };
  
  const resetForm = () => {
    setFichaDeSolicitacaoData({
      fichaClinica: "",
      tipoServico: "",
      dataHoraObito: "",
      dataRecebimento: "", 
      estadoConservacao: "",
      acondicionamento: "", 
      eutanasia: false,
      historico: "",
      caracteristicasAdicionais: "",
      tutor: { id: null },
      animal: { id: null },
      medico: { id: null },
    });
  
    setErrors({
      fichaClinica: "",
      tipoServico: "",
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
              id="dataHoraObito"
              name="dataHoraObito"
              value={fichaDeSolicitacaoData.dataHoraObito}
              onChange={handleFichaDeSolicitacaoChange}
            />
            {errors.dataHoraObito && <div className="invalid-feedback">{errors.dataHoraObito}</div>}
          </div>
          <div className="col">
            <label htmlFor="estadoConservacao" className="form-label">Estado de Conservação</label>
            <select
              className={`form-select ${errors.estadoConservacao ? "is-invalid" : ""}`}
              id="estadoConservacao"
              name="estadoConservacao"
              value={fichaDeSolicitacaoData.estadoConservacao}
              onChange={handleFichaDeSolicitacaoChange}
            >
              <option value="">Selecione o estado de conservação</option>
              <option value="BOM">Bom</option>
              <option value="REGULAR">Regular</option>
              <option value="RUIM">Ruim</option>
            </select>
            {errors.estadoConservacao && <div className="invalid-feedback">{errors.estadoConservacao}</div>}
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
          <div className="col">
            <label htmlFor="fichaClinica" className="form-label">Ficha Clínica</label>
            <input
              type="text"
              className={`form-control ${errors.fichaClinica ? "is-invalid" : ""}`}
              name="fichaClinica"
              placeholder="Insira a Ficha Clínica"
              value={fichaDeSolicitacaoData.fichaClinica}
              onChange={handleFichaDeSolicitacaoChange}
            />
            {errors.fichaClinica && <div className="invalid-feedback">{errors.fichaClinica}</div>}
          </div>
        </div>
        <div className="row">
            <h1></h1>
            <div className="col">
              <label htmlFor="dataRecebimento" className="form-label">Data de Recebimento</label>
              <input
                type="datetime-local"
                className={`form-control ${errors.dataRecebimento ? "is-invalid" : ""}`}
                id= "dataRecebimento"
                name="dataRecebimento"
                value={fichaDeSolicitacaoData.dataRecebimento}
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
                id="animal"
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
              id="medico"
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
      {<Alert message="Ficha de Solicitação cadastrada com sucesso!" show={showAlert} url='/lapa/telaprincipallaudos/laudosEmAndamento' />}
    </div>
  );
   

}
export default CreateFichaForm;