import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import { createAnimal } from "../../../services/animalService";
import { useRouter } from "next/router";
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";
import VoltarButton from "../VoltarButton";

function CreateAnimalForm() {
  const router = useRouter();

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedRaca, setSelectedRaca] = useState(null);

  const [racasByEspecie, setRacasByEspecie] = useState([]);
  const [isRacaSelectDisabled, setIsRacaSelectDisabled] = useState(true);

  const [animalData, setAnimalData] = useState({
    nome: '',
    sexo: '',
    alergias: '',
    dataNascimento: '',
    imagem: '',
    peso: null,
    raca: { id: null }
  });

  const [errors, setErrors] = useState({
    nome: "",
    dataNascimento: "",
    sexo: "",
    alergias: "",
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
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${ano}-${mes}-${dia}`;
  };

  const handleAnimalChange = (event) => {
    const { name, value } = event.target;
    const newValue = name === "dataNascimento" ? formatDate(value) : value;
    setAnimalData({ ...animalData, [name]: newValue });
  };

  const handleEspecieSelection = (event) => {
    const selectedEspecieId = event.target.value;
    setSelectedEspecie(selectedEspecieId);
    setSelectedRaca(null);

    const racasFiltradas = racas.filter((r) => r.especie.id === parseInt(selectedEspecieId));
    setRacasByEspecie(racasFiltradas);
    setIsRacaSelectDisabled(false);
  };

  console.log("Selected especie:", selectedEspecie)

  const handleRacaSelection = (event) => {
    const selectedRacaId = event.target.value;
    const selectedRacaObj = racas.find((r) => r.id === parseInt(selectedRacaId));
    setSelectedRaca(selectedRacaObj.id);
  };
  console.log("Selected raça:", selectedRaca)

  const validateForm = () => {
    const newErrors = {};

    if (!animalData.nome) {
      newErrors.nome = "Campo obrigatório";
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
          dataNascimento: animalData.dataNascimento,
          imagem: animalData.imagem,  
          peso: animalData.peso,
          raca: null
        };
      }else{
        animalToCreate = {
          nome: animalData.nome,
          sexo: animalData.sexo,
          alergias: animalData.alergias,
          dataNascimento: animalData.dataNascimento,
          imagem: animalData.imagem,
          peso: animalData.peso,
          raca: {
            id: parseInt(selectedRaca)
          }
        };
      }
        console.log("objeto do animal:", animalToCreate)

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
    } else {
      console.log("Formulário inválido, corrija os erros.");
    }
  };

  const resetForm = () => {
    setAnimalData({
      nome: "",
      sexo: "",
      alergias: "",
      dataNascimento: "",
      peso: null,
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
      < VoltarButton />
      <h1>Informações do Animal</h1>
      <form className={styles.form_box} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label htmlFor="nome" className="form-label">Nome <span className={styles.obrigatorio}>*</span></label>
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
            <label htmlFor="especie" className="form-label">Espécie <span className={styles.obrigatorio}>*</span></label>
            <select 
              className={`form-select ${errors.especie ? "is-invalid" : ""}`}
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
              className={`form-select ${errors.raca ? "is-invalid" : ""}`}
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
            <label htmlFor="alergias" className="form-label">Alergias <span className={styles.obrigatorio}>*</span></label>
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

          
       
          <div className="col"  style={{ position: 'relative', display: 'inline-block' }}>
            <label htmlFor="peso" className="form-label">Peso </label>
            <input 
              type="number"
              step={0.1}
              pattern="\d+(\.\d{2})?"
              min="0"
              className="form-control"
              name="peso"
              placeholder="Peso (Opcional)"
              value={animalData.peso}
              onChange={handleAnimalChange}
              style={{ paddingRight: '30px' }} 
            />
            <span style={{ position: 'absolute', right: '20px', top: '15px', bottom: '0', height: '10px', margin: 'auto', pointerEvents: 'none' }}>kg</span>
            {errors.alergias && <div className="invalid-feedback">{errors.alergias}</div>}
          </div>
  
          <div className="col">
            <label htmlFor="sexo" className="form-label">Sexo <span className={styles.obrigatorio}>*</span></label>
            <select 
              className={`form-select ${errors.sexo ? "is-invalid" : ""}`}
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
          <button className={styles.cadastrar_button} type="submit">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAnimalForm;
