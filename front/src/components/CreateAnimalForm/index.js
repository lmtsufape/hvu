import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../CreateTutorEnderecoForm/index.module.css";
import { VoltarWhiteButton } from "../WhiteButton/index";
import { createAnimal } from "../../../services/animalService";
import { useRouter } from "next/router";
import EspeciesList from "@/hooks/EspecieList";
import RacasList from "@/hooks/RacaList";

function CreateAnimalForm() {
  const router = useRouter();

  const { especies, isLoading: isEspeciesLoading, error: especiesError } = EspeciesList();
  const { racas, isLoading: isRacasLoading, error: racasError } = RacasList();

  const [selectedEspecie, setSelectedEspecie] = useState("");
  const [selectedRaca, setSelectedRaca] = useState("");
  const [animalData, setAnimalData] = useState({
    nome: "",
    sexo: "",
    alergias: "",
    dataNascimento: "",
    imagem: "NULL",
    especie: "",
    raca: "",
  });

  useEffect(() => {
    if (especies.length > 0) {
      setSelectedEspecie(especies[0]?.id);
    }
    if (racas.length > 0) {
      setSelectedRaca(racas[0]?.id);
    }
  }, [especies, racas]);

  function handleAnimalChange(event) {
    const { name, value } = event.target;
    setAnimalData({ ...animalData, [name]: value });
  }

  function handleEspecieSelection(event) {
    const selectedEspecieId = event.target.value;
    setSelectedEspecie(selectedEspecieId);
  }

  function handleRacaSelection(event) {
    const selectedRacaId = event.target.value;
    setSelectedRaca(selectedRacaId);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const animalToCreate = {
      ...animalData,
      especie: especies.find((e) => e.id === selectedEspecie),
      raca: racas.find((r) => r.id === selectedRaca),
    };

    try {
      const response = await createAnimal(animalToCreate);
      console.log(response);
      //router.push("/pagina-de-sucesso");
    } catch (error) {
      console.error("Erro ao criar animal:", error);
    }
  }

  return (
    <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              placeholder="Insira o nome do animal"
              value={animalData.nome}
              onChange={handleAnimalChange}
            />
          </div>
          <div className="col">
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
            <input type="text"
              className="form-control"
              name="dataNascimento"
              placeholder="Ex: 12/12/2012"
              value={animalData.dataNascimento}
              onChange={handleAnimalChange}
            />
          </div>
        </div>

        <div className="row">
        <div className="col">
            <label htmlFor="especie" className="form-label">Espécie</label>
            <select 
              className="form-select"
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
              className="form-select"
              name="raca"
              aria-label="Selecione a espécie do animal"
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

        <div className={styles.espacodosforms}></div>
        <div className="row">
          <div className="col">
            <label htmlFor="peso" className="form-label">Alergias</label>
            <input 
              type="text"
              className="form-control"
              name="alergia"
              placeholder="Alergias"
              value={animalData.alergias}
              onChange={handleAnimalChange}
            />
          </div>

          <div className="col">
            <label htmlFor="porte" className="form-label">Porte</label>
            <select 
              className="form-select"
              name="porte"
              aria-label="Selecione o porte do animal"
              value={animalData.porte}
              onChange={handleRacaSelection}
            >
              <option value="">Selecione o porte do animal</option>
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
              <option value="gigante">Gigante</option>
            </select>
          </div>
          <div className="col">
            <label htmlFor="sexo" className="form-label">Sexo</label>
            <select className="form-select"
              name="sexo"
              aria-label="Selecione o sexo do animal"
              value={animalData.sexo}
              onChange={handleAnimalChange}
            >
              <option value="">Selecione o sexo do animal</option>
              <option value="macho">Macho</option>
              <option value="femea">Fêmea</option>
            </select>
          </div>
        </div>

        <div className={styles.continuarbotao}>
          <VoltarWhiteButton />
          <button className={styles.green_button}>
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAnimalForm;
