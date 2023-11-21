import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";import { useRouter } from "next/router";
import styles from "../FormularioCadastroAnimal/formulariocadastroanimal.module.css";
import { VoltarWhiteButton } from "../WhiteButton/white_button";
import { createAnimal } from "../../../services/animalService";
import { createEspecie } from "../../../services/especieService";
import { createRaca } from "../../../services/racaService";

function FormularioCadastroAnimal() {
  const router = useRouter();

  const [formularioAnimal, setFormularioAnimal] = useState({
    nome: "",
    sexo: "",
    alergias: "",
    dataNascimento: "",
    imagem: "NULL"
  });

  const [formularioEspecie, setFormularioEspecie] = useState({
    nome: "",
    descricao: "NULL"
  });

  const [formularioRaca, setFormularioRaca] = useState({
    nome: "",
    porte: "",
    descricao: "NULL"
  });

  async function handleSubmit(event) {
    event.preventDefault();
  
      const animalPromise = await createAnimal(formularioAnimal);
      const especiePromise = await createEspecie(formularioEspecie);
      const racaPromise = await createRaca(formularioRaca);
  
      const [animalResponse, especieResponse, racaResponse] = await Promise.all([
        animalPromise,
        especiePromise,
        racaPromise
      ]);
  
      console.log(animalResponse);
      console.log(especieResponse);
      console.log(racaResponse);
  
      router.push("/consultaranimaltutor");
  }
  

function handleAnimalChange(event) {
    const { name, value } = event.target;
    setFormularioAnimal({ ...formularioAnimal, [name]: value });
}

function handleEspecieChange(event) {
  const { name, value } = event.target;
  setFormularioEspecie({ ...formularioEspecie, [name]: value });
}

function handleRacaChange(event) {
  const { name, value } = event.target;
  setFormularioRaca({ ...formularioRaca, [name]: value });
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
              value={formularioAnimal.nome}
              onChange={handleAnimalChange}
            />
          </div>
          <div className="col">
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
            <input type="text"
              className="form-control"
              name="dataNascimento"
              placeholder="Ex: 12/12/2012"
              value={formularioAnimal.dataNascimento}
              onChange={handleAnimalChange}
            />
          </div>
        </div>

        <div className={styles.espacodosforms}>
          <div className="row">
            <div className="col">
              <label htmlFor="especie" className="form-label">Espécie</label>
              <input type="text"
                className="form-control"
                name="especie"
                placeholder="Insira a espécie do animal"
                value={formularioEspecie.nome}
                onChange={handleEspecieChange}
              />
            </div>
            <div className="col">
              <label htmlFor="raca" className="form-label">Raça</label>
              <input type="text"
                className="form-control"
                name="raca"
                placeholder="Insira a raça do animal"
                value={formularioRaca.nome}
                onChange={handleRacaChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.espacodosforms}></div>
        <div className="row">
          <div className="col">
            <label htmlFor="peso" className="form-label">Alergias</label>
            <input type="text"
              className="form-control"
              name="alergia"
              placeholder="Alergias"
              value={formularioAnimal.alergias}
              onChange={handleAnimalChange}
            />
          </div>

          <div className="col">
            <label htmlFor="porte" className="form-label">Porte</label>
            <select className="form-select"
              name="porte"
              aria-label="Selecione o porte do animal"
              value={formularioRaca.porte}
              onChange={handleRacaChange}
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
              value={formularioAnimal.sexo}
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

export default FormularioCadastroAnimal;
