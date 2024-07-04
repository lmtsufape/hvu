import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import { createAnimal } from "../../../services/animalService";
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";
import VoltarButton from "../VoltarButton";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function CreateAnimalForm() {
  const router = useRouter();

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedRaca, setSelectedRaca] = useState(null);

  const [racasByEspecie, setRacasByEspecie] = useState([]);
  const [isRacaSelectDisabled, setIsRacaSelectDisabled] = useState(true);
  const [especieName, setEspecieName] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [animalData, setAnimalData] = useState({
    nome: '',
    sexo: '',
    alergias: '',
    dataNascimento: '',
    imagem: '',
    raca: { id: null }
  });

  const [errors, setErrors] = useState({
    nome: "",
    dataNascimento: "",
    sexo: "",
    especie: "",
    raca: ""
  });

  useEffect(() => {
    if (especies.length > 0 && selectedEspecie === null) {
      setSelectedEspecie(null);
      setSelectedRaca(null); 
    }
    if (racas.length > 0 && selectedRaca === null) {
      setSelectedRaca(null);
    }
  }, [especies, racas, selectedEspecie, selectedRaca]);

  const formatDate = (data) => {
    if (!data) return ""; // Retorna vazio se não houver data
    const dataObj = new Date(data);
    const dia = String(dataObj.getUTCDate()).padStart(2, "0");
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0");
    const ano = dataObj.getUTCFullYear();
    return `${ano}-${mes}-${dia}`;
  };

  const handleAnimalChange = (event) => {
    const { name, value } = event.target;
    setAnimalData({ ...animalData, [name]: value });
  };

  console.log("animalData:", animalData);

  const handleEspecieSelection = (event) => {
    const selectedEspecieId = event.target.value;
    setSelectedEspecie(selectedEspecieId);
    setSelectedRaca(null);

    const racasFiltradas = racas.filter((r) => r.especie.id === parseInt(selectedEspecieId));
    setRacasByEspecie(racasFiltradas);

    setIsRacaSelectDisabled(false);
  };

  const handleRacaSelection = (event) => {
    const selectedRacaId = event.target.value;
    const selectedRacaObj = racas.find((r) => r.id === parseInt(selectedRacaId));
    setSelectedRaca(selectedRacaObj.id);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!animalData.nome) {
      newErrors.nome = "Campo obrigatório";
    }
    
    if (!animalData.sexo) {
      newErrors.sexo = "Campo obrigatório";
    }
    if (!selectedEspecie) {
      newErrors.especie = "Campo obrigatório";
    }
    if (!selectedEspecie && !selectedRaca) {
      newErrors.raca = "Selecione uma espécie";
    }
    if (selectedEspecie && !selectedRaca) {
      newErrors.raca = "Campo obrigatório";
    }
    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let animalToCreate = {};
    if (validateForm()) {
      if (especies.length > 0 && racas.length > 0) {
        if(selectedRaca === null) {
          animalToCreate = {
            nome: animalData.nome,
            sexo: animalData.sexo,
            alergias: animalData.alergias,
            dataNascimento: formatDate(animalData.dataNascimento),
            imagem: animalData.imagem,  
            raca: null
          };
        }else{
          animalToCreate = {
            nome: animalData.nome,
            sexo: animalData.sexo,
            alergias: animalData.alergias,
            dataNascimento: formatDate(animalData.dataNascimento),
            imagem: animalData.imagem,
            raca: {
              id: parseInt(selectedRaca)
            }
          };
        }
        console.log("objeto do animal:", animalToCreate)

        try {
          const newAnimal = await createAnimal(animalToCreate);
          console.log(newAnimal);
          resetForm();
          setShowAlert(true);
        } catch (error) {
          console.error("Erro ao criar animal:", error);
          console.log("Detalhes do erro:", error.response);
          resetForm();
          setShowErrorAlert(true);
        }
      } else {
        console.log("Aguardando dados de espécies e raças carregarem...");
      }
    } else {
      console.log("Formulário inválido, preencha corretamente e tente novamente.");
    }
  };

  const resetForm = () => {
    setAnimalData({
      nome: "",
      sexo: "",
      alergias: "",
      dataNascimento: "",
      imagem: "NULL",
    });
    setSelectedEspecie(especies.length > 0 ? especies[0]?.id.toString() : "");
    setSelectedRaca(racas.length > 0 ? racas[0]?.id.toString() : "");
    setRacasByEspecie([]);
    setIsRacaSelectDisabled(true);
    setErrors({
      nome: "",
      dataNascimento: "",
      sexo: "",
      alergias: "",
      especie: "",
      raca: "",
    });
  };


  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Cadastrar animal</h1>
      <form className={styles.form_box} onSubmit={handleSubmit}>
        <div className="row">
          <div className={`col ${styles.col}`}>
            <label htmlFor="nome" className="form-label">Nome <span className={styles.obrigatorio}>*</span></label>
            <input
              type="text"
              className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
              name="nome"
              placeholder="Digite o nome do animal"
              value={animalData.nome}
              onChange={handleAnimalChange}
            />
            {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
          </div>
          <div className={`col ${styles.col}`}>
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
            <input
              type="date"
              className={`form-control ${styles.input}`}
              name="dataNascimento"
              value={animalData.dataNascimento || ""}
              onChange={handleAnimalChange}
            />
          </div>
        </div>
  
        <div className="row">
          <div className={`col ${styles.col}`}>
            <label htmlFor="especie" className="form-label">Espécie <span className={styles.obrigatorio}>*</span></label>
            <select 
              className={`form-select ${styles.input} ${errors.especie ? "is-invalid" : ""}`}
              name="especie"
              aria-label="Selecione a espécie do animal"
              value={selectedEspecie || ""}
              onChange={handleEspecieSelection}
            >
              <option value="">Selecione a espécie</option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nome}
                </option>
              ))}
            </select>
            {errors.especie && <div className={`invalid-feedback ${styles.error_message}`}>{errors.especie}</div>}
          </div>

          <div className={`col ${styles.col}`}>
            <label htmlFor="raca" className="form-label">Raça {selectedEspecie && <span className={styles.obrigatorio}>*</span>}</label>
            <select 
              className={`form-select ${styles.input} ${errors.raca ? "is-invalid" : ""}`}
              name="raca"
              aria-label="Selecione a raça do animal"
              value={selectedRaca || ""}
              onChange={handleRacaSelection}
              disabled={!selectedEspecie} 
            >
              <option value="">Selecione a raça</option>
              {racasByEspecie.map((raca) => (
                <option key={raca.id} value={raca.id}>
                  {raca.nome}
                </option>
              ))}
            </select>
            {errors.raca && <div className={`invalid-feedback ${styles.error_message}`}>{errors.raca}</div>}
          </div>
        </div>
  
        <div className="row">
          <div className={`col ${styles.col}`}>
            <label htmlFor="alergias" className="form-label">Alergias</label>
            <input 
              type="text"
              className={`form-control ${styles.input}`}
              name="alergias"
              placeholder="Digite as alergias, se houver"
              value={animalData.alergias}
              onChange={handleAnimalChange}
            />
          </div>
  
          <div className={`col ${styles.col}`}>
            <label htmlFor="sexo" className="form-label">Sexo <span className={styles.obrigatorio}>*</span></label>
            <select 
              className={`form-select ${styles.input} ${errors.sexo ? "is-invalid" : ""}`}
              name="sexo"
              aria-label="Selecione o sexo do animal"
              value={animalData.sexo}
              onChange={handleAnimalChange}
            >
              <option value="">Selecione o sexo do animal</option>
              <option value="macho">Macho</option>
              <option value="femea">Fêmea</option>
            </select>
            {errors.sexo && <div className={`invalid-feedback ${styles.error_message}`}>{errors.sexo}</div>}
          </div>
        </div>
  
        <div className={styles.button_container}>
          <button className={styles.cadastrar_button} type="submit">
            Cadastrar
          </button>
        </div>
      </form>
      {<Alert message="Animal cadastrado com sucesso!" show={showAlert} url='/meusAnimais' />}
      {showErrorAlert && <ErrorAlert message="Erro ao realizar cadastro, tente novamente." show={showErrorAlert} />}
    </div>
  );
}

export default CreateAnimalForm;
