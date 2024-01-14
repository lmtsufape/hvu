import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createTutorForm.module.css";

function CreateTutorForm({ tutorFormData, handleTutorChange, errors }) {
    return (
        <div className={styles.boxcadastrotutor}>
            <div className={styles.cadastrotutor}>
                <div className={styles.titulo}>Tutor</div>
                {renderInput("Nome Completo", "nome", tutorFormData.nome, handleTutorChange, errors.nome, "text")}
                <div className="row">
                    <div className="col">
                        {renderInput("E-mail", "email", tutorFormData.email, handleTutorChange, errors.email, "email")}
                        {renderInput("CPF", "cpf", tutorFormData.cpf, handleTutorChange, errors.cpf, "text", 11)}
                        {renderInput("Telefone", "telefone", tutorFormData.telefone, handleTutorChange, errors.telefone, "tel", 11)}
                    </div>
                    <div className="col">
                        {renderInput("Senha", "senha", tutorFormData.senha, handleTutorChange, errors.senha, "password")}
                        {renderInput("RG", "rg", tutorFormData.rg, handleTutorChange, errors.rg, "text", 7)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderInput(label, name, value, onChange, error, type = "text", maxLength) {
    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label}</label>
            <input
                type={type}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                name={name}
                placeholder={`Insira o ${label.toLowerCase()}`}
                maxLength={maxLength}
                value={value}
                onChange={onChange}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

export default CreateTutorForm;
