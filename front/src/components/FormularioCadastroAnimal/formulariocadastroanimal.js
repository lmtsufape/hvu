import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../FormularioCadastroAnimal/formulariocadastroanimal.module.css";
import { VoltarWhiteButton } from "../WhiteButton/white_button";
import { updateTutor } from "../../../services/tutorService";
import { useRouter } from "next/router";

function FormularioCadastroAnimal() {
  const router = useRouter();
  const { id } = router.query;

  const [formularioAnimal, setFormularioAnimal] = useState({
    animal: {
      nome: "",
      sexo: "",
      alergias: "",
      dataNascimento: "",
      especie: {
        nome: ""
      },
      raca: {
        nome: "",
        porte:""
      }
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();
  
    if (id) {
      console.log("ID da URL:", id);
  
      try {
        const response = await updateTutor(id, { animal: formularioAnimal.animal });
        console.log(response);
  
       // router.push(`/cadastroanimal/${id}`);
      } catch (error) {
        console.error("Erro ao atualizar tutor:", error);
      }
    } else {
      console.error("ID da URL não encontrado");
    }
  }

  function handleAnimalChange(event) {
    const { name, value } = event.target;
    setFormularioAnimal({ ...formularioAnimal, [name]: value });
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
              value={formularioAnimal.animal.nome}
              onChange={handleAnimalChange}
            />
          </div>
          <div className="col">
            <label htmlFor="nascimento" className="form-label">Data de Nascimento</label>
            <input type="text"
              className="form-control"
              name="dataNascimento"
              placeholder="Ex: 12/12/2012"
              value={formularioAnimal.animal.dataNascimento}
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
                value={formularioAnimal.animal.especie.nome}
                onChange={handleAnimalChange}
              />
            </div>
            <div className="col">
              <label htmlFor="raca" className="form-label">Raça</label>
              <input type="text"
                className="form-control"
                name="raca"
                placeholder="Insira a raça do animal"
                value={formularioAnimal.animal.raca.nome}
                onChange={handleAnimalChange}
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
              value={formularioAnimal.animal.alergias}
              onChange={handleAnimalChange}
            />
          </div>

          <div className="col">
            <label htmlFor="porte" className="form-label">Porte</label>
            <select className="form-select"
              name="porte"
              aria-label="Selecione o porte do animal"
              value={formularioAnimal.animal.raca.porte}
              onChange={handleAnimalChange}
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
              value={formularioAnimal.animal.sexo}
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
          <button type="submit" className={styles.green_button}>
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioCadastroAnimal;
