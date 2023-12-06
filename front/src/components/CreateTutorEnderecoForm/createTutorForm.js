import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createTutorForm.module.css";

function CreateTutorForm({ tutorFormData, handleTutorChange, errors }) {
    return (
        <>
            <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
                <div className={styles.cadastrotutor}>
                    <div className={styles.titulo}>Informações do Tutor</div>
                    {renderInput("Nome Completo", "nome", tutorFormData.nome, handleTutorChange, errors.nome, "text")}
                    <div className={styles.espacodosforms}>
                        <div className="row">
                            {renderInput("E-mail", "email", tutorFormData.email, handleTutorChange, errors.email, "email")}
                            {renderInput("Senha", "senha", tutorFormData.senha, handleTutorChange, errors.senha, "password")}
                        </div>
                    </div>
                    <div className={styles.espacodosforms}>
                        <div className="row">
                            {renderInput("CPF", "cpf", tutorFormData.cpf, handleTutorChange, errors.cpf, "text", 11)}
                            {renderInput("RG", "rg", tutorFormData.rg, handleTutorChange, errors.rg, "text", 7)}
                        </div>
                    </div>
                    {renderInput("Telefone para contato", "telefone", tutorFormData.telefone, handleTutorChange, errors.telefone, "tel", 13)}
                </div>
            </div>
        </>
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
