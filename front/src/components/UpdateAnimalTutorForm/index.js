import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { getAnimalById, updateAnimal } from '../../../services/animalService';  
import EspeciesList from "@/hooks/useEspecieList";
import RacasList from "@/hooks/useRacaList";
import VoltarButton from '../VoltarButton';

function UpdateAnimalForm() {
  const router = useRouter();
  const { id } = router.query;

  const { especies, error: especiesError } = EspeciesList();
  const { racas, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [selectedRaca, setSelectedRaca] = useState(null);

  const [racasByEspecie, setRacasByEspecie] = useState([]);

  const [animalData, setAnimalData] = useState({
    nome: '',
    sexo: '',
    alergias: '',
    dataNascimento: '',
    imagem: '',
    raca: { id: null }
  });

  // useEffect(() => {
  //   if (especies.length > 0 && selectedEspecie === null) {
  //     setSelectedEspecie(especies[0]?.id.toString());
  //     setSelectedRaca(""); 
  //   }
  //   if (racas.length > 0 && selectedRaca === null) {
  //     setSelectedRaca("");
  //   }
  // }, [especies, racas, selectedEspecie, selectedRaca]);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const animal = await getAnimalById(id);
          setAnimalData(animal);

          // Definir espécie e raça selecionadas inicialmente
          setSelectedEspecie(animal.raca.especie.id);
          setSelectedRaca(animal.raca.id);
        } catch (error) {
          console.error('Erro ao buscar animal:', error);
        }
      };

      fetchData();
    }
  }, [id]);

  useEffect(() => {
    // Atualizar raças correspondentes à espécie inicial
    const racasFiltradas = racas.filter((r) => r.especie.id.toString() === selectedEspecie);
    setRacasByEspecie(racasFiltradas);
  }, [selectedEspecie, racas]);

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

      // Reiniciar a raça selecionada quando a espécie é alterada
      setSelectedRaca(""); // Você pode ajustar isso conforme necessário
    } catch (error) {
      console.error('Erro ao selecionar espécie:', error);
    }
  };

  const handleRacaSelection = (event) => {
    try {
      const selectedRacaId = event.target.value;
      setSelectedRaca(selectedRacaId); // Ajuste aqui
    } catch (error) {
      console.error('Erro ao selecionar raça:', error);
    }
  };

console.log(animalData);
  console.log("selected especie:", selectedEspecie);

  console.log("selected raca:", selectedRaca);

  console.log("-------------------");

  const handleUpdateAnimal = async (event) => {
    event.preventDefault();

    const animalToUpdate = {
      nome: animalData.nome,
      sexo: animalData.sexo,
      alergias: animalData.alergias,
      dataNascimento: animalData.dataNascimento,
      imagem: animalData.imagem,
      raca: {
        id: parseInt(selectedRaca)
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
                  value={animalData.nome}
                  onChange={handleAnimalChange}
                />
              </div>
              <div className="col">
                <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  className="form-control"
                  name="dataNascimento"
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
                  <option value="">Selecione a raça</option>
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
