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

  const [selectedEspecie, setSelectedEspecie] = useState({});
  const [selectedRaca, setSelectedRaca] = useState({});
  const [racasByEspecie, setRacasByEspecie] = useState([]);

  const [animalData, setAnimalData] = useState({
    nome: "",
    sexo: "",
    alergias: "",
    dataNascimento: "",
    imagem: "NULL"
  });

  useEffect(() => {
    if (especies.length > 0) {
      setSelectedEspecie(especies[0]?.id);
    }
    if (racas.length > 0) {
      setSelectedRaca(racas[0]?.id);
    }
  }, [especies, racas]);
  
  const formatDate = (data) => {
    const [dia, mes, ano] = data.split("/");
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
      const selectedEspecieId = event.target.value;
      setSelectedEspecie(selectedEspecieId);
    } catch (error) {
      console.error('Erro ao selecionar espécie:', error);
    }
  };

  const getSelectedEspecie = () => {
    return especies.find((e) => e.id === selectedEspecie);
  };
  
  const handleRacaSelection = (event) => {
    try {
      const selectedRacaId = event.target.value;
      setSelectedRaca(selectedRacaId);
    } catch (error) {
      console.error('Erro ao selecionar raça:', error);
    }
  };

  const getSelectedRaca = () => {
    return racas.find((r) => r.id === selectedRaca);
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
          ...animalData,
          raca: getSelectedRaca(),
        };
    
        console.log(getSelectedRaca());
        console.log("Dados do animal a ser criado:", animalToCreate);
    
        try {
          const newAnimal = await createAnimal(animalToCreate);
          console.log(newAnimal);
          router.push("/getAllAnimalTutor");
        } catch (error) {
          console.error("Erro ao criar animal:", error);
          console.log("Detalhes do erro:", error.response);
        }
      } else {
        console.log("Aguardando dados de espécies e raças carregarem...");
      }
   // } else {
   //   console.log("Formulário inválido, corrija os erros.");
  //   }
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
            <input type="text"
              className={`form-control ${errors.dataNascimento ? "is-invalid" : ""}`}
              name="dataNascimento"
              placeholder="Ex: 12/12/2012"
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
            value={selectedEspecie}
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
            value={selectedRaca}
            onChange={handleRacaSelection}
          >
            <option value="">Selecione</option>
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