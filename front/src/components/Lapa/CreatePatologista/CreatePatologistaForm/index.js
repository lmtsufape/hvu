import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";   

function CreatePatologistaForm({ patologistaFormData, handlePatologistaChange, errors }) {
    return (
        <div className={styles.boxcadastropatologista}>
            <div className={styles.cadastropatologista}>
                <div className={styles.titulo}></div>
                {renderInput("Nome Completo", "nome", patologistaFormData.nome, handlePatologistaChange, errors.nome, "text")}
                <div className="row">
                    <div className="col">
                        {renderInput("E-mail", "email", patologistaFormData.email, handlePatologistaChange, errors.email, "email")}
                        {renderInput("CPF", "cpf", patologistaFormData.cpf, handlePatologistaChange, errors.cpf, "text", 11)}
                        {renderInput("CRMV", "crmv", patologistaFormData.crmv, handlePatologistaChange, errors.crmv, "text", 7)}
                    </div>
                    <div className="col">
                        {renderInput("Senha", "senha", patologistaFormData.senha, handlePatologistaChange, errors.senha, "password")}
                        {renderInput("Telefone", "telefone", patologistaFormData.telefone, handlePatologistaChange, errors.telefone, "tel", 11)}
                        
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

export default CreatePatologistaForm;
