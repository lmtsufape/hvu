import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../FormularioCadastroEndereco/formulariocadastroendereco.module.css";
import { ContinuarGreenButton } from "../GreenButton/green_button";
import { VoltarWhiteButton } from "../WhiteButton/white_button";
import { useRouter } from "next/router";
import { createEndereco } from "../../../services/enderecoService";


function FormularioCadastroEndereco(){
  const router = useRouter();

  const [formularioEndereco, setFormularioEndereco] = useState({
    cep: "",
    rua: "",
    municipio: "",
    cidade: "",
    numero: "",
    bairro: ""
});

async function handleSubmit(event) {
    event.preventDefault();

    const response = await createEndereco(formularioEndereco);
    console.log(response);
    
    router.push("/cadastroanimal");
}

function handleInputChange(event) {
    const { name, value } = event.target;
    setFormularioEndereco({ ...formularioEndereco, [name]: value });
}

  return (
    <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
      <form onSubmit={handleSubmit}>
        <div class="mb-3">
            <label for="rua" class="form-label">Rua</label>
            <input type="text" 
              class="form-control" 
              name="rua"
              placeholder="Ex: Avenida Bom Pastor"
              value={formularioEndereco.rua}
              onChange={handleInputChange}>
            </input>
        </div>

        <div class="mb-3">
          <label for="bairro" class="form-label">Bairro</label>
          <input type="text" 
            class="form-control" 
            name="bairro" 
            placeholder="Ex: Centro"
            value={formularioEndereco.bairro}
            onChange={handleInputChange}>
          </input>
        </div>

        <div class="mb-3">
          <div class="row">
              <div class="col ">
                <label for="estado" class="form-label">Número</label>
                <input type="text" 
                  class="form-control" 
                  name="numero"
                  placeholder="Ex: 140" 
                  value={formularioEndereco.numero}
                  onChange={handleInputChange}>
                </input>
              </div>
              <div class="col">
                <label for="cidade" class="form-label">CEP</label>
                <input type="text" 
                  class="form-control" 
                  name="cep"
                  placeholder="Ex: 55250-000" 
                  value={formularioEndereco.cep}
                  onChange={handleInputChange}>
                </input>
              </div>
            </div>
        
          <div className={styles.espacodosforms}>
            <div class="row">
              <div class="col ">
                <label for="municipio" class="form-label">Município</label>
                <input type="text" 
                  class="form-control" 
                  name="municipio"
                  placeholder="Ex: Pernambuco" 
                  value={formularioEndereco.municipio}
                  onChange={handleInputChange}>
                </input>
              </div>
              <div class="col">
                <label for="cidade" class="form-label">Cidade</label>
                <input type="text" 
                  class="form-control" 
                  name="cidade"
                  placeholder="Ex: Garanhuns" 
                  value={formularioEndereco.cidade}
                  onChange={handleInputChange}>
                </input>
              </div>
            </div>
            <div className={styles.continuarbotao}>
                <VoltarWhiteButton/>
                <button type="submit" className={styles.green_button}>
                    Continuar
                </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormularioCadastroEndereco
