import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../FormularioCadastroEndereco/formulariocadastroendereco.module.css";
import { ContinuarGreenButton } from "../GreenButton/green_button";
import { VoltarWhiteButton } from "../WhiteButton/white_button";
import { useRouter } from "next/router";
import { updateTutor } from "../../../services/tutorService";

function FormularioCadastroEndereco() {
  const router = useRouter();
  const { id } = router.query;

  const [formularioEndereco, setFormularioEndereco] = useState({
    endereco: {
      cep: "",
      rua: "",
      municipio: "",
      cidade: "",
      numero: "",
      bairro: ""
    }
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormularioEndereco({
      endereco: {
        ...formularioEndereco.endereco,
        [name]: value
      }
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    // Verifica se o ID não é nulo
    if (id) {
      // Aqui você pode utilizar o ID da URL (id) para alguma lógica
      console.log("ID da URL:", id);
  
      try {
        // Use o ID da URL para chamar a função de atualização com o endereço
        const response = await updateTutor(id, { endereco: formularioEndereco.endereco });
        console.log(response);
  
        // Aqui você pode redirecionar para a URL com o ID, se necessário
        router.push(`/cadastroanimal/${id}`);
      } catch (error) {
        console.error("Erro ao atualizar tutor:", error);
      }
    } else {
      console.error("ID da URL não encontrado");
    }
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
              value={formularioEndereco.endereco.rua}
              onChange={handleInputChange}>
            </input>
        </div>

        <div class="mb-3">
          <label for="bairro" class="form-label">Bairro</label>
          <input type="text" 
            class="form-control" 
            name="bairro" 
            placeholder="Ex: Centro"
            value={formularioEndereco.endereco.bairro}
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
                  value={formularioEndereco.endereco.numero}
                  onChange={handleInputChange}>
                </input>
              </div>
              <div class="col">
                <label for="cidade" class="form-label">CEP</label>
                <input type="text" 
                  class="form-control" 
                  name="cep"
                  placeholder="Ex: 55250-000" 
                  value={formularioEndereco.endereco.cep}
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
                  value={formularioEndereco.endereco.municipio}
                  onChange={handleInputChange}>
                </input>
              </div>
              <div class="col">
                <label for="cidade" class="form-label">Cidade</label>
                <input type="text" 
                  class="form-control" 
                  name="cidade"
                  placeholder="Ex: Garanhuns" 
                  value={formularioEndereco.endereco.cidade}
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
  );
}

export default FormularioCadastroEndereco
