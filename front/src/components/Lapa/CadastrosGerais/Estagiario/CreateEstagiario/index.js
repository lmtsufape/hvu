import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createEstagiario } from "../../../../../../services/estagiarioService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";

function CreateEstagiario() {
    const router = useRouter();

    const [estagiario, setEstagiario] = useState({
        nome: "",
        cpf: "",
        periodo: "",
        obrigatorio: false,
        ativo: true
    });

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleEstagiarioChange = (event) => {
        const { name, value, type, checked } = event.target;
        setEstagiario({ ...estagiario, [name]: type === 'checkbox' ? checked : value });
    };

    const validateForm = () => {
        const errors = {};
        if (!estagiario.nome) {
            errors.nome = "Campo obrigatório";
        }
        if (!estagiario.cpf) {
            errors.cpf = "Campo obrigatório";
        }
        if (!estagiario.periodo) {
            errors.periodo = "Campo obrigatório";
        }
        return errors;
    };

    const handleEstagiarioCreate = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await createEstagiario(estagiario);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar estagiário:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar Estagiário</h1>
            <div className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label className="form-label"></label>
                            <label htmlFor="nome" className="form-label">Nome <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
                                name="nome"
                                value={estagiario.nome}
                                onChange={handleEstagiarioChange}
                            />
                            {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="cpf" className="form-label">CPF <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.cpf ? "is-invalid" : ""}`}
                                name="cpf"
                                value={estagiario.cpf}
                                onChange={handleEstagiarioChange}
                            />
                            {errors.cpf && <div className={`invalid-feedback ${styles.error_message}`}>{errors.cpf}</div>}
                        </div>
                    </div>

                    <div className="row">
                    <label className="form-label"></label>
                        <div className={`col ${styles.col}`}>
                            
                            <label htmlFor="periodo" className="form-label">Período <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.periodo ? "is-invalid" : ""}`}
                                name="periodo"
                                value={estagiario.periodo}
                                onChange={handleEstagiarioChange}
                            />
                            {errors.periodo && <div className={`invalid-feedback ${styles.error_message}`}>{errors.periodo}</div>}
                        </div>
                    </div>

                    <div className="row">
                    <label className="form-label"></label>
                        <div className={`col ${styles.col}`}>
                            <label className="form-label">Obrigatório</label>
                            <input
                                type="checkbox"
                                name="obrigatorio"
                                checked={estagiario.obrigatorio}
                                onChange={handleEstagiarioChange}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleEstagiarioCreate}>
                        Criar
                    </button>
                </div>
            </div>
            {showAlert && <Alert message="Estagiário criado com sucesso!" show={showAlert} url={`/lapa/gerenciarEstagiarios`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao criar estagiário, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateEstagiario;
