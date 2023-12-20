import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { VoltarWhiteButton } from "../WhiteButton/index";
import { updateAnimal } from '../../../services/animalService';
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";

function UpdateAnimalForm() {
  const router = useRouter();
  const { id } = router.query;

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState("");
  const [selectedRaca, setSelectedRaca] = useState("");
  const [animalData, setAnimalData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnimalData({ ...animalData, [name]: value });
  };

  const handleEspecieSelection = (event) => {
    const selectedEspecieId = event.target.value;
    setSelectedEspecie(selectedEspecieId);
  };

  const handleRacaSelection = (event) => {
    const selectedRacaId = event.target.value;
    setSelectedRaca(selectedRacaId);
  };

  const handleUpdateAnimal = async (event) => {
    event.preventDefault();

    const racaToUpdate = {
      ...racas.find((r) => r.id === selectedRaca),
      especie: especies.find((e) => e.id === selectedEspecie),
    };

    const animalToUpdate = {
      ...animalData,
      raca: racaToUpdate,
    };

    if (id) {
      try {
        const response = await updateAnimal(id, animalToUpdate);
        setAnimalData(response);

        if (response.ok) {
          router.push(`/getAnimalByIdTutor/${id}`);
        } else {
          console.error('Erro ao atualizar o animal.');
        }
      } catch (error) {
        console.error('Erro ao buscar animal:', error);
      }
    }
  };

  return (
    <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
    <form className={styles.form_box}>
      <div className="row">
        <div className="col">
          <label htmlFor="nome" className="form-label">Nome</label>
            <input 
              type="text" 
              className="form-control" 
              name="nome"
              placeholder="Insira o nome do animal" 
              value={animalData.nome}
              onChange={handleInputChange}
            >
            </input>
        </div>
        <div className="col">
          <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
            <input type="text" 
              className="form-control" 
              name="nascimento"
              placeholder="Ex: 12/12/2012"
              value={animalData.datanasc}
              onChange={handleInputChange}
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
            aria-label="Selecione a espécie do animal"
            value={selectedEspecie}
            onChange={handleEspecieSelection}
          >
            <option value="">Selecione a espécie do animal</option>
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
            <option value="">Selecione a raça do animal</option>
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
              placeholder="Se possuir alergia, digite aqui" 
              value={animalData.alergias}
              onChange={handleInputChange}
            >
          </input>
        </div>

        <div className="col">
          <label htmlFor="porte" className="form-label">Porte</label>
          <select 
            className='form-select'
            name="porte"
            aria-label="Selecione o porte do animal"
            value={selectedRaca}
            onChange={handleRacaSelection}
          >
            <option value="">Selecione a raça do animal</option>
            {racas.map((raca) => (
              <option key={raca.id} value={raca.id}>
                {raca.porte}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <label htmlFor="sexo" className="form-label">Sexo</label>
          <select className="form-select" 
              name="sexo"
              aria-label="Selecione o sexo do animal"
              value={animalData.sexo}
              onChange={handleInputChange}
            >
              <option value="">Selecione o sexo do animal</option>
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
    </form>
    </div>
  );
}

export default UpdateAnimalForm;
