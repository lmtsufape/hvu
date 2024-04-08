import React from "react";
import InputMask from "react-input-mask";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./createTutorForm.module.css";
//inportacao para usar o icone "i"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'; 

function CreateTutorForm({ tutorFormData, handleTutorChange, errors }) {
    return (
        <div className={styles.boxcadastrotutor}>
            <div className={styles.cadastrotutor}>
            <div className={styles.titulo}>Tutor</div>
                <div className={styles.infoContainer}>
                    <FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />
                    <span className={styles.informativoLAI} title="Conforme as diretrizes da Lei de Acesso à Informação (LAI), esclarecemos que os dados do Registro Geral (RG) e do Cadastro de Pessoa Física (CPF) solicitados durante o processo de cadastro são utilizados exclusivamente para verificação de identidade e associação ao registro fiscal, respeitando os mais altos padrões de segurança e privacidade. ">Informativo LAI</span>
                </div>

                
                {renderInput("Nome Completo", "Insira seu nome completo", "nome", tutorFormData.nome, handleTutorChange, errors.nome, "text")}
                <div className="row">
                    <div className="col">
                        {renderInput("E-mail", "Insira seu email", "email", tutorFormData.email, handleTutorChange, errors.email, "email")}
                        {renderInput("CPF", "Insira seu CPF", "cpf", tutorFormData.cpf, handleTutorChange, errors.cpf, "text", "999.999.999-99")}
                        {renderInput("Crie uma senha", "Crie uma senha", "senha", tutorFormData.senha, handleTutorChange, errors.senha, "password")}
                    </div>
                    <div className="col">
                        {renderInput("Telefone", "Insira seu telefone", "telefone", tutorFormData.telefone, handleTutorChange, errors.telefone, "tel", "(99) 99999-9999")}
                        {renderInput("RG", "Insira seu RG", "rg", tutorFormData.rg, handleTutorChange, errors.rg, "text", "99.999.999-9")}
                        {renderInput("Confirmar senha", "Confirme sua senha ", "confirmarSenha", tutorFormData.confirmarSenha, handleTutorChange, errors.confirmarSenha, "password")}
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderInput(label, placeholder, name, value, onChange, error, type = "text", mask = null) {
    const InputComponent = mask ? InputMask : 'input';

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
            <InputComponent
                mask={mask}
                type={type}
                className={`form-control ${styles.input} ${error ? 'is-invalid' : ''}`}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

export default CreateTutorForm;