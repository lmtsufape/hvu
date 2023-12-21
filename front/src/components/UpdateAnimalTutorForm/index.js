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

  const [selectedEspecie, setSelectedEspecie] = useState('');
  const [selectedRaca, setSelectedRaca] = useState('');
  const [animalData, setAnimalData] = useState({
    nome: '',
    nascimento: '',
    especie: '',
    raca: '',
    alergias: '',
    porte: '',
    sexo: '',
  });
  const [animal, setAnimal] = useState({});

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnimalData({ ...animalData, [name]: value });
  };

  const handleEspecieSelection = (event) => {
    try {
      const selectedEspecieId = event.target.value;
      setSelectedEspecie(selectedEspecieId);
    } catch (error) {
      console.error('Erro ao selecionar espécie:', error);
    }
  };

  const handleRacaSelection = (event) => {
    try {
      const selectedRacaId = event.target.value;
      setSelectedRaca(selectedRacaId);
    } catch (error) {
      console.error('Erro ao selecionar raça:', error);
    }
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
                placeholder={animal.dataNascimento}
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
              aria-label={animal.raca && animal.raca.especie && animal.raca.especie.nome}
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
              aria-label={animal.raca && animal.raca.especie && animal.raca.especie.nome}
              value={selectedRaca}
              onChange={handleRacaSelection}
            >
              <option value="">{animal.raca && animal.raca.especie && animal.raca.especie.nome}</option>
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
              aria-label={animal.raca && animal.raca.porte}
              value={selectedRaca}
              onChange={handleRacaSelection}
            >
              <option value="">{animal.raca && animal.raca.porte}</option>
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
                aria-label={animal.sexo}
                value={animalData.sexo}
                onChange={handleInputChange}
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
