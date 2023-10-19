import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "../FormularioEditarPerfil/formularioeditarperfil.module.css"
import { FinalizarGreenButton } from "../GreenButton/green_button";
import { VoltarWhiteButton } from "../WhiteButton/white_button";

//json para teste
const listaAnimais = [
  {
      id: 1,
      nome: 'Animal 1',
      especie: 'Cachorro',
      sexo: 'Macho',
      peso: '10 kg',
      raca: 'Vira-lata',
      porte: 'Médio',
      datanasc: '01/01/2018',
  },
  {
      id: 2,
      nome: 'Animal 2',
      especie: 'Gato',
      sexo: 'Fêmea',
      peso: '5 kg',
      raca: 'Siamês',
      porte: 'Pequeno',
      datanasc: '15/03/2019',
  },
];

function FormularioEditarPerfil (){
  const router = useRouter();

  //Para pegar o id da url
  const { id } = router.query;
  const animal = listaAnimais.find(animal => animal.id === parseInt(id));

  const [editarAnimal, setEditarAnimal] = useState({
    nome: animal ? animal.nome : "",
    nascimento: animal ? animal.datanasc : "",
    especie: animal ? animal.especie : "",
    raca: animal ? animal.raca : "",
    peso: animal ? animal.peso : "",
    sexo: animal ? animal.sexo : "",
    porte: animal ? animal.porte : "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditarAnimal({ ...editarAnimal, [name]: value });
  }  

  console.log(editarAnimal);

    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
      <form >
        <div className="row">
          <div className="col">
            <label htmlFor="nome" className="form-label">Nome</label>
                <input 
                   type="text" 
                   className="form-control" 
                   name="nome"
                   placeholder="Insira o nome do animal" 
                   value={editarAnimal.nome}
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
                  value={editarAnimal.datanasc}
                  onChange={handleInputChange}
                  >
                </input>
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
              value={editarAnimal.especie}
              onChange={handleInputChange}
              >

            </input>
          </div>
        <div className="col">
          <label htmlFor="raca" className="form-label">Raça</label>
            <input type="text" 
              className="form-control" 
              name="raca"
              placeholder="Insira a raça do animal" 
              value={editarAnimal.raca}
              onChange={handleInputChange}
              >
            </input>
        </div>
      </div>
    </div>
      
    <div className={styles.espacodosforms}></div>
      <div className="row">
        <div className="col">
          <label htmlFor="peso" className="form-label">Peso</label>
            <input type="text" 
              className="form-control" 
              name="peso"
              placeholder="Digite o peso" 
              value={editarAnimal.peso}
              onChange={handleInputChange}
              >
            </input>
          </div>

        <div className="col">
          <label htmlFor="porte" className="form-label">Porte</label>
            <select className="form-select" 
              name="porte"
              aria-label="Selecione o porte do animal" 
              value={editarAnimal.porte}
              onChange={handleInputChange}
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
              value={editarAnimal.sexo}
              onChange={handleInputChange}
              >
                <option value="">Selecione o sexo do animal</option>
                <option value="macho">Macho</option>
                <option value="femea">Fêmea</option>
            </select>
        </div>
      </div>     

      <div className={styles.continuarbotao}>
        <VoltarWhiteButton/>
        <FinalizarGreenButton />
      </div>
    </form>
  </div>
   
    )
}

export default FormularioEditarPerfil;