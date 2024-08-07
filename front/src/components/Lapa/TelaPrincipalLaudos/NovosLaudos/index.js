import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import { createFichaSolicitacao } from "../../../../../services/fichaSolicitacaoService";
import TutorList from "@/hooks/useTutorList";
import AnimalList from "@/hooks/useAnimalList";
import MedicoList from "@/hooks/useMedicoList";
import VoltarButton from "../../VoltarButton";
import Alert from "@/components/Alert";
import { Modal, Button } from 'react-bootstrap';

function CreateFichaForm() {
  const router = useRouter();

  const [filteredTutores, setFilteredTutores] = useState([]);
  const [searchError, setSearchError] = useState(false); // Estado para controlar erros de pesquisa
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchErrorMedico, setSearchErrorMedico] = useState(false); // Estado para controle de erro na pesquisa de médicos veterinários
  const [searchTermMedico, setSearchTermMedico] = useState('');
  const [showMedicoModal, setShowMedicoModal] = useState(false);
  const [filteredMedicos, setFilteredMedicos] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]); 


  
  const handleShowModal = () => {
    if (searchTerm) {
      setShowModal(true);
    } else {
      setSearchError(true); // Set search error state if search term is empty
    }
  };

  const { tutores, error: tutoreserror } = TutorList();
  const { animais, error: animaiserror } = AnimalList();
  const { medicos, error: medicoserror } = MedicoList();

  const [selectedTutor, setSelectedTutor] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState([]);

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

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  
    if (term) {
      const filtered = tutores.filter(t => 
        t.id.toString().includes(term) || t.nome.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTutores(filtered);
      setSearchError(false);
    } else {
      setFilteredTutores([]);
      setSearchError(true); 
    }
  };
  
  const handleTutorSelection = (tutor) => {
    if (!tutor || !tutor.id) {
      console.error('Tutor inválido:', tutor);
      return;
    }
  
    // Armazena o ID do tutor selecionado localmente
    setSelectedTutor(tutor.id);
  
    // Atualiza os dados da ficha de solicitação enviando apenas o ID do tutor para o backend
    setFichaDeSolicitacaoData(prevData => ({
      ...prevData,
      tutor: {
        id: tutor.id // Envia apenas o ID para o backend
      }
    }));
  
    // Fecha o modal após a seleção do tutor
    setShowModal(false);
  
    // Define o termo de pesquisa como o nome do tutor selecionado
    setSearchTerm(tutor.nome);

    setFilteredAnimals(tutor.animal);
  
    console.log('Tutor selecionado:', tutor.id); // Mostra apenas o ID do tutor
    console.log('Dados da ficha de solicitação atualizados:', fichaDeSolicitacaoData);
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
  
  const handleMedicoSearch = (event) => {
    const term = event.target.value;
    setSearchTermMedico(term);

    if (term) {
      const filtered = medicos.filter(medico =>
        medico.id.toString().includes(term) || medico.nome.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMedicos(filtered);
      setSearchErrorMedico(false);
    } else {
      setFilteredMedicos([]);
    }
  };

  const handleShowMedicoModal = () => {
    if (searchTermMedico) {
      setShowMedicoModal(true);
    } else {
      setSearchErrorMedico(true);
    }
  };

  const handleMedicoSelection = (medico) => {
    const selectedMedicoId = medico.id; // Obtém o ID diretamente do objeto medico
    
    setSelectedMedico(selectedMedicoId); // Armazena o ID do médico selecionado
    setFichaDeSolicitacaoData(prevData => ({
      ...prevData,
      medico: { id: selectedMedicoId } // Armazena apenas o ID do médico selecionado
    }));
    setShowMedicoModal(false); // Fecha o modal após a seleção do médico
    setSearchTermMedico(medico.nome); // Define o termo de pesquisa como o nome do médico selecionado
  
    console.log('Médico selecionado:', selectedMedicoId); // Mostra apenas o ID do médico
    console.log('Dados da ficha de solicitação atualizados:', fichaDeSolicitacaoData);
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
                <option value="NECROPSIA">Necropsia</option>
                <option value="MICROSCOPIA">Microscopia</option>
                <option value="NECROPSIA_COM_MICROSCOPIA">Necropsia com Microscopia</option>
              </select>
              {errors.tipoServico && <div className="invalid-feedback">{errors.tipoServico}</div>}
            </div>
          </div>
                       

          <div className="row">
          <div className="row">
            <h2>Identificação do Tutor</h2>
            <div className="col">
              <label htmlFor="search" className="form-label">Pesquisar Tutor</label>
              <div className="input-group">
                <input
                  type="text"
                  className={`form-control ${searchError ? 'is-invalid' : ''}`}
                  id="search"
                  placeholder="Digite o ID ou nome do tutor"
                  value={searchTerm}
                  onChange={(event) => handleSearch(event)}  // Aqui deve chamar handleSearch para filtrar tutores
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleShowModal}
                >
                  Buscar
                </button>
              </div>
              {searchError && (
                <div className="invalid-feedback">
                  Por favor, digite um termo de pesquisa válido.
                </div>
              )}
            </div>
          </div>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Selecione o Tutor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {filteredTutores.length > 0 ? (
                <ul className="list-group">
                  {filteredTutores.map(tutor => (
                    <li 
                      key={tutor.id} 
                      className="list-group-item" 
                      onClick={() => handleTutorSelection(tutor)}
                      style={{ cursor: 'pointer' }}
                    >
                      <strong>Nome:</strong> {tutor.nome} <br />
                      <strong>Email:</strong> {tutor.email} <br />
                      <strong>Telefone:</strong> {tutor.telefone} <br />
                      <strong>Endereço:</strong> {tutor.endereco.cep}, {tutor.endereco.rua}, {tutor.endereco.numero}, {tutor.endereco.bairro}, {tutor.endereco.municipio}, {tutor.endereco.cidade}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum tutor encontrado.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>


        <div className="row">
        <h2>Identificação do Animal</h2>
        <div className="col">
          <div className="mb-3">
            <label htmlFor="animal" className="form-label">Animal</label>
            <select
              className={`form-control`}
              id="animal"
              name="animal"
              onChange={handleAnimalSelection}
            >
              <option value="">Selecione um animal</option>
              {filteredAnimals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

        <div className="row">
        <div className="row">
          <h2>Identificação do Veterinário</h2>
          <div className="col">
            <label htmlFor="searchMedico" className="form-label">Pesquisar Veterinário</label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${searchErrorMedico ? 'is-invalid' : ''}`}
                id="searchMedico"
                placeholder="Digite o ID ou nome do médico"
                value={searchTermMedico}
                onChange={(event) => handleMedicoSearch(event)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleShowMedicoModal}
              >
                Buscar
              </button>
            </div>
            {searchErrorMedico && (
              <div className="invalid-feedback">
                Por favor, digite um termo de pesquisa válido.
              </div>
            )}
          </div>
        </div>


        <Modal show={showMedicoModal} onHide={() => setShowMedicoModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Selecione o Médico Veterinário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filteredMedicos.length > 0 ? (
              <ul className="list-group">
                {filteredMedicos.map(medico => (
                  <li
                    key={medico.id}
                    className="list-group-item"
                    onClick={() => handleMedicoSelection(medico)}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>Nome:</strong> {medico.nome} <br />
                    <strong>Email:</strong> {medico.email} <br />
                    <strong>Telefone:</strong> {medico.telefone} <br />
                    <strong>CRMV:</strong> {medico.crmv}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum médico veterinário encontrado.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMedicoModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
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