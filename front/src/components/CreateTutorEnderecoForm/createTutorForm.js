
import React, { useState } from "react";
import InputMask from "react-input-mask";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createTutorForm.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


function CreateTutorForm({ tutorFormData, handleTutorChange, errors }) {
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
    return (
        <div className={styles.boxcadastrotutor}>
            <div className={styles.cadastrotutor}>
            <div className={styles.titulo}>Tutor</div>
                
                {renderInput("Nome Completo", "Insira seu nome completo", "nome", tutorFormData.nome, handleTutorChange, errors.nome, "text")}
                <div className="row">
                    <div className="col">
                        {renderInput("E-mail", "Insira seu email", "email", tutorFormData.email, handleTutorChange, errors.email, "email")}
                        {renderInput("CPF", "Insira seu CPF", "cpf", tutorFormData.cpf, handleTutorChange, errors.cpf, "text", "999.999.999-99")}
                        {renderInput("Crie uma senha", "Crie uma senha", "senha", tutorFormData.senha, handleTutorChange, errors.senha, "password", null, showSenha, setShowSenha)}
                    </div>
                    <div className="col">
                        {renderInput("Telefone", "Insira seu telefone", "telefone", tutorFormData.telefone, handleTutorChange, errors.telefone, "tel", "(99) 99999-9999")}
                        {renderInput("RG", "Insira seu RG", "rg", tutorFormData.rg, handleTutorChange, errors.rg, "text", "99.999.999-9")}
                        {renderInput("Confirmar senha", "Confirme sua senha ", "confirmarSenha", tutorFormData.confirmarSenha, handleTutorChange, errors.confirmarSenha, "password", null, showConfirmarSenha, setShowConfirmarSenha)}
                    </div>
                </div>
                {/* Adição da informação sobre a LAI */}
            
            </div>
        </div>
    );
}


function renderInput(label, placeholder, name, value, onChange, error, type = "text", mask = null, show, setShow) {
    const InputComponent = mask ? InputMask : 'input';
    const inputType = type === "password" ? (show ? "text" : "password") : type;

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
            <div className="input-group">
            <InputComponent
                mask={mask}
                type={inputType}
                className={`form-control ${styles.input} ${error ? 'is-invalid' : ''}`}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {type === "password" && (
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => setShow(!show)}>
                            <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
                        </button>
                    </div>
                )}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
        </div>
    );
}

export default CreateTutorForm;