import React from "react";
import InputMask from "react-input-mask";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createEnderecoForm.module.css";

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
            {renderInput("CEP", "cep", enderecoFormData.cep, handleEnderecoChange, "Ex: 55250-000", errors.cep, "text", "99999-999")}
          </div>
          <div className="col">
            {renderInput("Estado", "estado", enderecoFormData.estado, handleEnderecoChange, "Ex: Pernambuco", errors.estado)}
            {renderInput("Cidade", "cidade", enderecoFormData.cidade, handleEnderecoChange, "Ex: Garanhuns", errors.cidade)}
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
        className={`form-control ${error ? 'is-invalid' : ''}`}
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
