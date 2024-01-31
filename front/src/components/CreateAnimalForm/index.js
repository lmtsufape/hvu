import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import { VoltarWhiteButton } from "../WhiteButton/index";
import { createAnimal } from "../../../services/animalService";
import { useRouter } from "next/router";
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";

function CreateAnimalForm() {
  const router = useRouter();

  const [errors, setErrors] = useState({
    nome: "",
    dataNascimento: "",
    sexo: "",
    alergias: "",
    especie: "",
    raca: ""
  });

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedRaca, setSelectedRaca] = useState(null);

  const [racasByEspecie, setRacasByEspecie] = useState([]);

  const [isRacaSelectDisabled, setIsRacaSelectDisabled] = useState(true);

  const [animalData, setAnimalData] = useState({
    nome: "",
    sexo: "",
    alergias: "",
    dataNascimento: "",
    imagem: "NULL"
  });

  const [racaData, setRacaData] = useState({
    id: null
  });

useEffect(() => {
  if (especies.length > 0 && selectedEspecie === null) {
    setSelectedEspecie(especies[0]?.id);
  }
  if (racas.length > 0 && selectedRaca === null) {
    setSelectedRaca(racas[0]?.id);
  }
}, [especies, racas, selectedEspecie, selectedRaca]);
  
  const formatDate = (data) => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${ano}-${mes}-${dia}`;
  };

  const handleAnimalChange = (event) => {
    try {
      const { name, value } = event.target;
      
      // Se o campo for "dataNascimento", formate a data
      const newValue = name === "dataNascimento" ? formatDate(value) : value;
  
      setAnimalData({ ...animalData, [name]: newValue });
    } catch (error) {
      console.error('Erro ao puxar dados do animal:', error);
    }
  };
  
  const handleEspecieSelection = (event) => {
    try {
      const selectedEspecieId = parseInt(event.target.value);
      setSelectedEspecie(selectedEspecieId);

      setSelectedRaca(null);
  
      // Filtrar as raças correspondentes à espécie selecionada
      const racasFiltradas = racas.filter((r) => r.especie.id === selectedEspecieId);
      setRacasByEspecie(racasFiltradas);
  
      setIsRacaSelectDisabled(false);
    } catch (error) {
      console.error('Erro ao selecionar espécie:', error);
    }
  };
  
  const handleRacaSelection = (event) => {
    try {
      const selectedRacaId = parseInt(event.target.value);
      const selectedRacaObj = racas.find((r) => r.id === selectedRacaId);
      console.log(selectedRacaObj)
  console.log(selectedRacaObj)
      setRacaData(selectedRacaObj);
      console.log(racaData)
    } catch (error) {
      console.error('Erro ao selecionar raça:', error);
    }
  };
  

  const validateForm = () => {
    const newErrors = {};
  
    if (!animalData.nome) {
      newErrors.nome = "Campo obrigatório";
    }
    if (!animalData.dataNascimento) {
      newErrors.dataNascimento = "Campo obrigatório";
    }
    if (!animalData.sexo) {
      newErrors.sexo = "Campo obrigatório";
    }
    if (!animalData.alergias) {
      newErrors.alergias = "Campo obrigatório";
    }
    if (!selectedEspecie) {
      newErrors.especie = "Campo obrigatório";
    }
    if (!selectedRaca) {
      newErrors.raca = "Campo obrigatório";
    } else {
      if (!selectedRaca.nome) {
        newErrors.raca = "Campo obrigatório";
      }
      if (!selectedRaca.porte) {
        newErrors.porte = "Campo obrigatório";
      }
    }
  
    setErrors(newErrors);
  
    return Object.values(newErrors).every((error) => error === "");
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

  //  if (validateForm()) {
      if (especies.length > 0 && racas.length > 0) {  
        const animalToCreate = {
          nome: animalData.nome,
          sexo: animalData.sexo,
          alergias: animalData.alergias,
          dataNascimento: animalData.dataNascimento,
          imagem: animalData.imagem,
          raca: {
            id: racaData.id
          }
        };

        console.log("Dados do animal a ser criado:", animalToCreate);
    
        try {
          const newAnimal = await createAnimal(animalToCreate);
          console.log(newAnimal);
          router.push("/getAllAnimalTutor");
          resetForm();
        } catch (error) {
          console.error("Erro ao criar animal:", error);
          console.log("Detalhes do erro:", error.response);
          resetForm();
        }
      } else {
        console.log("Aguardando dados de espécies e raças carregarem...");
      }
   // } else {
   //   console.log("Formulário inválido, corrija os erros.");
  //   }
  };

  const resetForm = () => {
    setAnimalData({
        nome: "",
        sexo: "",
        alergias: "",
        dataNascimento: "",
        imagem: "NULL"
    });
    setSelectedEspecie(especies.length > 0 ? especies[0]?.id : null);
    setSelectedRaca(racas.length > 0 ? racas[0]?.id : null);
    setRacasByEspecie([]);
    setIsRacaSelectDisabled(true);
    setErrors({
        nome: "",
        dataNascimento: "",
        sexo: "",
        alergias: "",
        especie: "",
        raca: ""
    });
  };

  return (
    <div className={styles.container}>
      <h1>Informações do Animal</h1>
      <form className={styles.form_box} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input
              type="text"
              className={`form-control ${errors.nome ? "is-invalid" : ""}`}
              name="nome"
              placeholder="Insira o nome do animal"
              value={animalData.nome}
              onChange={handleAnimalChange}
            />
          </div>
          <div className="col">
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
            <input
              type="date"
              className={`form-control ${errors.dataNascimento ? "is-invalid" : ""}`}
              name="dataNascimento"
              value={animalData.dataNascimento}
              onChange={handleAnimalChange}
            />
            {errors.dataNascimento && <div className="invalid-feedback">{errors.dataNascimento}</div>}
          </div>
        </div>
  
        <div className="row">
        <div className="col">
          <label htmlFor="especie" className="form-label">Espécie</label>
          <select 
            className='form-select'
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
        </div>

        <div className="col">
          <label htmlFor="raca" className="form-label">Raça</label>
          <select 
            className='form-select'
            name="raca"
            aria-label="Selecione a raça do animal"
            value={selectedRaca || ""}
            onChange={handleRacaSelection}
            disabled={isRacaSelectDisabled} 
          >
            <option value="">Selecione a raça</option>
            {racasByEspecie.map((raca) => (
              <option key={raca.id} value={raca.id}>
                {raca.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
  
        <div className="row">
          <div className="col">
            <label htmlFor="peso" className="form-label">Alergias</label>
            <input 
              type="text"
              className={`form-control ${errors.alergias ? "is-invalid" : ""}`}
              name="alergias"
              placeholder="Alergias"
              value={animalData.alergias}
              onChange={handleAnimalChange}
            />
            {errors.alergias && <div className="invalid-feedback">{errors.alergias}</div>}
          </div>
  
          <div className="col">
            <label htmlFor="sexo" className="form-label">Sexo</label>
            <select 
              className='form-select'
              name="sexo"
              aria-label="Selecione o sexo do animal"
              value={animalData.sexo}
              onChange={handleAnimalChange}
            >
              <option value="">Selecione o sexo do animal</option>
              <option value="macho">Macho</option>
              <option value="femea">Fêmea</option>
            </select>
            {errors.sexo && <div className="invalid-feedback">{errors.sexo}</div>}
          </div>
        </div>
  
        <div className={styles.button_container}>
          <VoltarWhiteButton />
          <button className={styles.cadastrar_button} type="submit">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAnimalForm;