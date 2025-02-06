import React, { useState } from "react";
import InputMask from "react-input-mask";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createTutorForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function CreateTutorForm({ tutorFormData, handleTutorChange, errors }) {
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  return (
    <div className={`${styles.boxcadastrotutor}`}>
      <div className={`row`}>
        <div className="col-12">
          {renderInput(
            "Nome Completo",
            "Insira seu nome completo",
            "nome",
            tutorFormData.nome,
            handleTutorChange,
            errors.nome,
            "text"
          )}
        </div>

        <div className="col-md-6">
          {renderInput(
            "E-mail",
            "Insira seu email",
            "email",
            tutorFormData.email,
            handleTutorChange,
            errors.email,
            "email"
          )}
        </div>

        <div className="col-md-6">
          {renderInput(
            "Telefone",
            "Insira seu telefone",
            "telefone",
            tutorFormData.telefone,
            handleTutorChange,
            errors.telefone,
            "tel",
            "(99) 99999-9999"
          )}
        </div>

        <div className="col-md-6">
          {renderInput(
            "CPF",
            "Insira seu CPF",
            "cpf",
            tutorFormData.cpf,
            handleTutorChange,
            errors.cpf,
            "text",
            "999.999.999-99"
          )}
        </div>

        <div className="col-md-6">
          {renderInput(
            "Crie uma senha",
            "Crie uma senha",
            "senha",
            tutorFormData.senha,
            handleTutorChange,
            errors.senha,
            "password",
            null,
            showSenha,
            setShowSenha
          )}
        </div>

        <div className="col-md-6">
          {renderInput(
            "Confirmar senha",
            "Confirme sua senha",
            "confirmarSenha",
            tutorFormData.confirmarSenha,
            handleTutorChange,
            errors.confirmarSenha,
            "password",
            null,
            showConfirmarSenha,
            setShowConfirmarSenha
          )}
        </div>
      </div>
    </div>
  );
}

function renderInput(
  label,
  placeholder,
  name,
  value,
  onChange,
  error,
  type = "text",
  mask = null,
  show,
  setShow
) {
  const InputComponent = mask ? InputMask : "input";
  const inputType = type === "password" ? (show ? "text" : "password") : type;

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
        <span className={styles.obrigatorio}>*</span>
      </label>
      <div className="input-group">
        <InputComponent
          mask={mask}
          type={inputType}
          className={`form-control ${styles.input} ${
            error ? "is-invalid" : ""
          }`}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {type === "password" && (
          <span
            className={`input-group-text ${styles.eyeIcon}`}
            onClick={() => setShow(!show)}
            style={{
              cursor: "pointer",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8px",
              color: "#000",
            }}
          >
            <FontAwesomeIcon
              icon={show ? faEyeSlash : faEye}
              color="#333333"
              style={{ fontSize: "17px" }}
            />
          </span>
        )}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}

export default CreateTutorForm;
