import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "@/components/VoltarButton";
import { CancelarWhiteButton } from "@/components/WhiteButton";
import { updateFichaSolicitacao, getFichaSolicitacaoById } from "../../../../services/fichaSolicitacaoService";
import TutorList from "@/hooks/useTutorList";
import AnimalList from "@/hooks/useAnimalList";
import MedicoList from "@/hooks/useMedicoList";
import Alert from "@/components/Alert";
import ErrorAlert from "@/components/ErrorAlert";

function UpdateFicha(){
    const router = useRouter();
    const { id } = router.query;
    const [errors, setErrors] = useState({});
    const { tutores, error: tutoreserror } = TutorList();
    const { animais, error: animaiserror } = AnimalList();
    const { medicos, error: medicoserror } = MedicoList();
    const [selectedTutor, setSelectedTutor] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState([]);
    const [selectedMedico, setSelectedMedico] = useState([]);
    const [selectedTutores, setSelectedTutores] = useState([]);
    const [selectedAnimais, setSelectedAnimais] = useState([]);
    const [selectedMedicos, setSelectedMedicos] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [fichaDeSolicitacaoData, setFichaDeSolicitacao] = useState({
        fichaClinica: "",
        tipoServico: "",
        dataHoraObito: "",
        dataRecebimento: "",
        estadoConservacao: "",
        acondicionamento: "",
        eutanasia: false,
        historico: "",
        caracteristicasAdicionais: "",
        tutor: [],
        animal: [],
        medico: []
    });

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const fichaData = await getFichaSolicitacaoById(id);
                    setFichaDeSolicitacao(fichaData);  // Atualiza os dados da ficha
    
                    // Pré-seleciona os tutores
                    if (fichaData.tutor) {
                        setSelectedTutores(fichaData.tutor);
                    }
    
                    // Pré-seleciona os animais
                    if (fichaData.animal) {
                        setSelectedAnimais(fichaData.animal);
                    }
    
                    // Pré-seleciona os médicos
                    if (fichaData.medico) {
                        setSelectedMedicos(fichaData.medico);
                    }
                } catch (error) {
                    console.error('Erro ao buscar informações:', error);
                }
            };
            fetchData();
        }
    }, [id]);   
    
    useEffect(() => {
        //Tutor
        if (selectedTutor && selectedTutor.length > 0) {
            const selectedTutoresData = tutores.filter(tutor => selectedTutor.includes(tutor.id));
            setSelectedTutores(selectedTutoresData.map(tutor => tutor.id));
        }
        //Animal
        if (selectedAnimal && selectedAnimal.length > 0) {
            const selectedAnimaisData = animais.filter(animal => selectedAnimal.includes(animal.id));
            setSelectedAnimais(selectedAnimaisData.map(animal => animal.id));
        }
        //Veterinários
        if (selectedMedico && selectedMedico.length > 0) {
            const selectedMedicosData = medicos.filter(medico => selectedMedico.includes(medico.id));
            setSelectedMedicos(selectedMedicosData.map(medico => medico.id));
        }
    }, [selectedTutor, tutores, selectedAnimal, animais, selectedMedico, medicos]);

    console.log("Tutor:", selectedTutores);    
    console.log("Animal:", selectedAnimais);
    console.log("Médico:", selectedMedicos);
    

    const handleTutorSelection = (event) => {
        const value = event.target.value;
        setSelectedTutores(value ? [value] : []);
        console.log('Tutor selecionado:', value);
    };    

    const handleAnimalSelection = (event) => {
        const value = event.target.value;
        setSelectedAnimais(value ? [value] : []);
        console.log('Animal selecionado:', value);
    };
    
    const handleMedicoSelection = (event) => {
        const value = event.target.value;
        setSelectedMedicos(value ? [value] : []);
        console.log('Medico selecionado:', value);
    };
    
    const handleFichaChange = (event) => {
        try {
            const { name, value } = event.target;
            setFichaDeSolicitacao({ ...fichaDeSolicitacaoData, [name]: value });
        }catch (error) {
            console.error('Erro ao puxar dados da ficha:', error);
          }        
    };

    const validateForm = () => {
        const newErrors = {};
        setErrors(newErrors);    
        return Object.keys(newErrors).length === 0;
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().slice(0, 16);
    };
      

      const handleFichaUpdate = async (event) => {
        event.preventDefault();
    
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
    
        const FichaToUpdate = {
            fichaClinica: fichaDeSolicitacaoData.fichaClinica,
            tipoServico: fichaDeSolicitacaoData.tipoServico,
            dataHoraObito: formatDate(fichaDeSolicitacaoData.dataHoraObito),
            dataRecebimento: formatDate(fichaDeSolicitacaoData.dataRecebimento),
            estadoConservacao: fichaDeSolicitacaoData.estadoConservacao,
            acondicionamento: fichaDeSolicitacaoData.acondicionamento,
            eutanasia: fichaDeSolicitacaoData.eutanasia,
            historico: fichaDeSolicitacaoData.historico,
            caracteristicasAdicionais: fichaDeSolicitacaoData.caracteristicasAdicionais,
            tutor: selectedTutores,
            animal: selectedAnimais,
            medico: selectedMedicos,
        };
    
        console.log("FichaToUpdate:", FichaToUpdate);
    
        try {
            await updateFichaSolicitacao(id, FichaToUpdate); 
            setShowAlert(true); 
        } catch (error) {
            console.error("Erro ao editar Ficha:", error);
            console.log("Erro ao editar informações. Por favor, tente novamente.");
            setShowErrorAlert(true);   
        }
    };
    

    return (
        <div className={styles.container}>
          <VoltarButton />
          <h1>Editar informações da Ficha de Solicitação de Serviço</h1>
      
          <form className={styles.form_box} onSubmit={handleFichaUpdate}>
                {fichaDeSolicitacaoData &&(
                    <li key={fichaDeSolicitacaoData.id} className={styles.list}>
                        <div className="row">
                        {renderFichaInput("Código Patologia", fichaDeSolicitacaoData.codigoPatologia, "nome", fichaDeSolicitacaoData.codigoPatologia, handleFichaChange, "text", errors.nome)}
                            <h2>Informações sobre o Material</h2>
                            <div className="col">
                                <label htmlFor="dataHoraObito" className="form-label">Data e Hora do Óbito</label>
                                <input
                                type="datetime-local"
                                className={`form-control ${errors.dataHoraObito ? "is-invalid" : ""}`}
                                id="dataHoraObito"
                                name="dataHoraObito"
                                value={fichaDeSolicitacaoData.dataHoraObito}
                                onChange={handleFichaChange}
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
                                onChange={handleFichaChange}
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
                                    onChange={handleFichaChange}
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
                                onChange={handleFichaChange}
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
                                onChange={handleFichaChange}
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
                                onChange={handleFichaChange}
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
                                    onChange={handleFichaChange}
                                />
                                {errors.dataRecebimento && <div className="invalid-feedback">{errors.dataRecebimento}</div>}
                                </div>
                                <div className="col">
                                <label htmlFor="acondicionamento" className="form-label">Acondicionamento</label>
                                <select
                                    className={`form-select ${errors.acondicionamento ? "is-invalid" : ""}`}
                                    name="acondicionamento"
                                    value={fichaDeSolicitacaoData.acondicionamento}
                                    onChange={handleFichaChange}
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
                                    onChange={handleFichaChange}
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
                                    value={selectedTutores.length > 0 ? selectedTutores[0] : ""}
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
                                    value={selectedAnimais.length > 0 ? selectedAnimais[0] : ""}
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
                                    value={selectedMedicos.length > 0 ? selectedMedicos[0] : ""}
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

                    </li>
                )}
            <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleFichaUpdate}>
                        Salvar
                    </button>
                </div>
          </form>
          {<Alert message="Informações da Ficha de Solicitação de Serviço editadas com sucesso!" show={showAlert} url={`/lapa/getFichaById/${id}`} />}
          {showErrorAlert && <ErrorAlert message="Erro ao editar informações da Ficha de Solicitação de Serviço, tente novamente." show={showErrorAlert} />}
        </div>
      );

      function renderFichaInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask = null, show = false, setShow = null) {
        const InputComponent = mask ? InputMask : 'input';
    
        //função modificada para aceitar o evento
        const toggleShow = (event) => {
            event.preventDefault(); //impede o comportamento padrão do botão submeter o formulario
            setShow(!show);
        };
    
        return (
            <div className="mb-3">
                <label htmlFor={name} className="form-label">{label}</label>
                <InputComponent
                    mask={mask}
                    type={type}
                    className={`form-control ${styles.input} ${errorMessage ? "is-invalid" : ""}`}
                    name={name}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={onChange}
                />
                {errorMessage && <div className={`invalid-feedback ${styles.error_message}`}>{errorMessage}</div>}
                {type === "password" && (
                    <div className={styles.input_group_append}>
                        <button className="btn btn-outline-secondary" type="button" onClick={toggleShow}>
                            <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
                        </button>
                    </div>
                )}
            </div>
        );
    }
    
}

export default UpdateFicha;