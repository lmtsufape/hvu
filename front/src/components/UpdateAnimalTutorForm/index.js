import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { VoltarWhiteButton } from "../WhiteButton/index";
import { getAnimalById } from '../../../services/animalService';
import { updateAnimal } from '../../../services/animalService';
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";

function UpdateAnimalForm() {
  const router = useRouter();
  const { id } = router.query;

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedRaca, setSelectedRaca] = useState({
    nome: "",
    sexo: "",
    alergias: "",
    dataNascimento: "",
    imagem: "null"
});

  const [animal, setAnimal] = useState({});

  const formatDate = (data) => {
    if (!data) return null; // Evita chamar split em uma string vazia
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const animalData = await getAnimalById(id);
          setAnimal(animalData);
        } catch (error) {
          console.error('Erro ao buscar animal:', error);
        }
      };
  
      fetchData();
    }
  }, [id]);

  const handleAnimalChange = (event) => {
    try {
      const { name, value } = event.target;
      const newValue = name === "dataNascimento" ? formatDate(value) : value;
  
      setAnimal((prevAnimal) => ({ ...prevAnimal, [name]: newValue }));
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

  console.log("raça", selectedRaca);

  console.log("Dados de raça", getSelectedRaca());

  const handleUpdateAnimal = async (event) => {
    event.preventDefault();

    const animalToUpdate = {
      ...animal,
      raca: getSelectedRaca(),
    };

    console.log("Dados do animal a ser atualizado:", animalToUpdate);

    if (id) {
      try {
        const updatedAnimal = await updateAnimal(id, animalToUpdate);
        setAnimal(updatedAnimal);

        if (updatedAnimal.ok) { // Correção aqui
          router.push(`/getAnimalByIdTutor/${id}`);
        } else {
          console.error('Erro ao atualizar o animal.');
        }
      } catch (error) {
        console.error('Erro ao atualizar o animal:', error); // Correção aqui
      }
    }
  }

  return (
    <form className={`${styles.boxcadastrotutor} ${styles.container}`}>
    <ul className={styles.form_box}>
    {animal && ( 
      <li key={animal.id}>
        <div className="row">
          <div className="col">
            <label htmlFor="nome" className="form-label">Nome</label>
              <input 
                type="text" 
                className="form-control" 
                name="nome"
                placeholder={animal.nome}
                value={animal.nome}
                onChange={handleAnimalChange}
              >
              </input>
          </div>
          <div className="col">
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
              <input type="text" 
                className="form-control" 
                name="nascimento"
                placeholder={animal.dataNascimento}
                value={animal.dataNascimento}
                onChange={handleAnimalChange}
              >
              </input>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label htmlFor="especie" className="form-label">Espécie</label>
            <select 
              className='form-select'
              name="especie"
              aria-label={animal.raca && animal.raca.especie && animal.raca.especie.nome}
              value={selectedEspecie}
              onChange={handleEspecieSelection}
            >
              <option value="">{animal.raca && animal.raca.especie && animal.raca.especie.nome}</option>
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
              aria-label={getSelectedRaca()?.nome || 'Selecione a raça do animal'}
              value={selectedRaca || ''}
              onChange={handleRacaSelection}
            >
              <option value="">{animal.raca && animal.raca.nome}</option>
              {racas.map((raca) => (
                <option key={raca.id} value={raca.id}>
                  {raca.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      
        <div className="row">
          <div className="col">
            <label htmlFor="alergias" className="form-label">Alergias</label>
            <input type="text" 
                className="form-control" 
                name="alergias"
                placeholder={animal.alergias}
                value={animal.alergias}
                onChange={handleAnimalChange}
              >
            </input>
          </div>

          <div className="col">
            <label htmlFor="sexo" className="form-label">Sexo</label>
            <select className="form-select" 
                name="sexo"
                aria-label={animal.sexo}
                value={animal.sexo}
                onChange={handleAnimalChange}
              >
                <option value="">{animal.sexo}</option>
                <option value="macho">Macho</option>
                <option value="femea">Fêmea</option>
            </select>
          </div>
        </div>     

        <div className={styles.button_container}>
          <VoltarWhiteButton />
          <button type="button" className={styles.atualizar_button} onClick={handleUpdateAnimal}>
            Atualizar
          </button>
        </div>
        </li>
      )}
    </ul>
    </form>
  );
}


export default UpdateAnimalForm;
