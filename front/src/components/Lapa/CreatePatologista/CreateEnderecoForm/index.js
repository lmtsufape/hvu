import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"; 

function CreateEnderecoForm({ enderecoFormData, handleEnderecoChange, errors }) {
  return (
    <div className={styles.boxcadastrotutor}>
      <div className={styles.titulo}>Endereço</div>
      {renderInput("Rua", "rua", enderecoFormData.rua, handleEnderecoChange, "Ex: Avenida Bom Pastor", errors.rua)}
      {renderInput("Bairro", "bairro", enderecoFormData.bairro, handleEnderecoChange, "Ex: Centro", errors.bairro)}
      <div className="mb-3">
        <div className="row">
          <div className="col">
            {renderInput("Número", "numero", enderecoFormData.numero, handleEnderecoChange, "Ex: 140", errors.numero)}
            {renderInput("CEP", "cep", enderecoFormData.cep, handleEnderecoChange, "Ex: 55250-000", errors.cep, "text", 8, 8)}
          </div>
          <div className="col">
            {renderInput("Município", "municipio", enderecoFormData.municipio, handleEnderecoChange, "Ex: Pernambuco", errors.municipio)}
            {renderInput("Cidade", "cidade", enderecoFormData.cidade, handleEnderecoChange, "Ex: Garanhuns", errors.cidade)}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderInput(label, name, value, onChange, placeholder, error, type = "text", minLength, maxLength) {
  return (
      <div className="mb-3">
          <label htmlFor={name} className="form-label">{label}</label>
          <input
              type={type}
              className={`form-control ${error ? 'is-invalid' : ''}`}
              name={name}
              placeholder={placeholder}
              minLength={minLength}
              maxLength={maxLength}
              value={value}
              onChange={onChange}
          />
          {error && <div className="invalid-feedback">{error}</div>}
      </div>
  );
}

export default CreateEnderecoForm;
