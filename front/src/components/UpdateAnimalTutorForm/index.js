import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { VoltarWhiteButton } from "../WhiteButton/index";
import { getAnimalById, updateAnimal } from '../../../services/animalService';  // Import both functions from animalService
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";

function UpdateAnimalForm() {
  const router = useRouter();
  const { id } = router.query;

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState('');
  const [selectedRaca, setSelectedRaca] = useState('');

  const [racasByEspecie, setRacasByEspecie] = useState([]);

  const [animalData, setAnimalData] = useState({
    nome: '',
    sexo: '',
    alergias: '',
    dataNascimento: '',
    imagem: ''
  });

  const [racaData, setRacaData] = useState({
    id: null
  });

  useEffect(() => {
    if (especies.length > 0) {
      setSelectedEspecie(especies[0]?.id.toString()); // Convert to string
    }
    if (racas.length > 0) {
      setSelectedRaca(racas[0]?.id.toString()); // Convert to string
    }
  }, [especies, racas]);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const animal = await getAnimalById(id);
          setAnimalData(animal);
        } catch (error) {
          console.error('Erro ao buscar animal:', error);
        }
      };

      fetchData();
    }
  }, [id]);

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
      const selectedEspecieId = event.target.value;
      setSelectedEspecie(selectedEspecieId);

      // Filtrar as raças correspondentes à espécie selecionada
      const racasFiltradas = racas.filter((r) => r.especie.id.toString() === selectedEspecieId);
      setRacasByEspecie(racasFiltradas);
    } catch (error) {
      console.error('Erro ao selecionar espécie:', error);
    }
  };

  const handleRacaSelection = (event) => {
    try {
      const selectedRacaId = event.target.value;
      const selectedRacaObj = racas.find((r) => r.id.toString() === selectedRacaId);
      setRacaData(selectedRacaObj);
    } catch (error) {
      console.error('Erro ao selecionar raça:', error);
    }
  };

  const handleUpdateAnimal = async (event) => {
    event.preventDefault();

    const animalToUpdate = {
      nome: animalData.nome,
      sexo: animalData.sexo,
      alergias: animalData.alergias,
      dataNascimento: animalData.dataNascimento,
      imagem: animalData.imagem,
      raca: {
        id: racaData.id
      }
    };

    console.log("Dados do animal a ser atualizado:", animalToUpdate);

    if (id) {
      try {
        const updatedAnimal = await updateAnimal(id, animalToUpdate);
        setAnimalData(updatedAnimal);

        if (updatedAnimal.ok) {
          console.log("animal atualizado com sucesso!");
        } else {
          console.error('Erro ao atualizar o animal.');
        }
      } catch (error) {
        console.error('Erro ao atualizar o animal:', error);
      }
    }
  };

  return (
    <form className={`${styles.boxcadastrotutor} ${styles.container}`} onSubmit={handleUpdateAnimal}>
      <ul className={styles.form_box}>
        {animalData && (
          <li key={animalData.id}>
            <div className="row">
              <div className="col">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  name="nome"
                  placeholder={animalData.nome}
                  value={animalData.nome}
                  onChange={handleAnimalChange}
                />
              </div>
              <div className="col">
                <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
                <input
                  type="text"
                  className="form-control"
                  name="dataNascimento"
                  placeholder={animalData.dataNascimento}
                  value={animalData.dataNascimento}
                  onChange={handleAnimalChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label htmlFor="especie" className="form-label">Espécie</label>
                <select
                  className='form-select'
                  name="especie"
                  aria-label={animalData.raca && animalData.raca.especie && animalData.raca.especie.nome}
                  value={selectedEspecie}
                  onChange={handleEspecieSelection}
                >
                  <option value="">{animalData.raca && animalData.raca.especie && animalData.raca.especie.nome}</option>
                  {especies.map((especie) => (
                    <option key={especie.id} value={especie.id.toString()}>
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
                  aria-label={animalData.raca && animalData.raca.nome}
                  value={selectedRaca}
                  onChange={handleRacaSelection}
                >
                  <option value="">{animalData.raca && animalData.raca.nome}</option>
                  {racasByEspecie.map((raca) => (
                    <option key={raca.id} value={raca.id.toString()}>
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
                  placeholder={animalData.alergias}
                  value={animalData.alergias}
                  onChange={handleAnimalChange}
                />
              </div>

              <div className="col">
                <label htmlFor="sexo" className="form-label">Sexo</label>
                <select className="form-select"
                  name="sexo"
                  aria-label={animalData.sexo}
                  value={animalData.sexo}
                  onChange={handleAnimalChange}
                >
                  <option value="">{animalData.sexo}</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>
            </div>

            <div className={styles.button_container}>
              <VoltarWhiteButton />
              <button type="submit" className={styles.atualizar_button}>
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
