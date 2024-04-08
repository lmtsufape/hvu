import React, { useState } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createEnderecoForm.module.css";

function CreateEnderecoForm({ enderecoFormData, handleEnderecoChange, errors }) {
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const handleCEPChange = async (event) => {
    const cep = event.target.value;
    handleEnderecoChange(event); // Chama a função handleEnderecoChange para atualizar o estado com o valor do CEP

    if (cep.length === 9) { // Verifica se o CEP foi completamente preenchido
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const { localidade, uf } = response.data;

        setCidade(localidade);
        setEstado(uf);

        // Atualiza o estado com os dados obtidos da API - cidade e estado
        handleEnderecoChange({
          target: {
            name: "cidade",
            value: localidade
          }
        });

        handleEnderecoChange({
          target: {
            name: "estado",
            value: uf
          }
        });
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  return (
    <div className={styles.boxcadastrotutor}>
      <div className={styles.titulo}>Endereço</div>
      {renderInput("Rua", "rua", enderecoFormData.rua, handleEnderecoChange, "Ex: Avenida Bom Pastor", errors.rua)}
      {renderInput("Bairro", "bairro", enderecoFormData.bairro, handleEnderecoChange, "Ex: Centro", errors.bairro)}
      <div className="mb-3">
        <div className="row">
          <div className="col">
            {renderInput("CEP", "cep", enderecoFormData.cep, handleCEPChange, "Ex: 55250-000", errors.cep, "text", "99999-999")}
            {renderInput("Estado", "estado", estado, handleEnderecoChange, "Ex: Pernambuco", errors.estado)}
          </div>
          <div className="col">
            {renderInput("Número", "numero", enderecoFormData.numero, handleEnderecoChange, "Ex: 140", errors.numero)}
            {renderInput("Cidade", "cidade", cidade, handleEnderecoChange, "Ex: Garanhuns", errors.cidade)}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderInput(label, name, value, onChange, placeholder, error, type = "text", mask) {
  const InputComponent = mask ? InputMask : 'input';
  const inputProps = mask ? { mask } : {};

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
      <InputComponent
        type={type}
        className={`form-control ${styles.input} ${error ? 'is-invalid' : ''}`}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default CreateEnderecoForm;
