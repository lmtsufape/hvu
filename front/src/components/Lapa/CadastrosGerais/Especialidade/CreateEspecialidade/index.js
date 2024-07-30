import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createEspecialidade } from "../../../../../../services/especialidadeService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";

function CreateEspecialidade() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const [especialidade, setEspecialidade] = useState({
        nome: ""
    });

    const handleEspecialidadeChange = (event) => {
        const { name, value } = event.target;
        setEspecialidade({ ...especialidade, [name]: value });
    };
    console.log(especialidade);

    const validateForm = () => {
        const errors = {};
        if (!especialidade.nome) {
          errors.nome = "Campo obrigatório";
        }
        return errors;
      };

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }
        try {
            await createEspecialidade(especialidade);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar especialidade:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar especialidade</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="nome" className="form-label">Nome <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                placeholder="Digite a especialidade"
                                className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
                                name="nome"
                                value={especialidade.nome}
                                onChange={handleEspecialidadeChange}
                            />
                            {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleSubmit}>
                        Criar
                    </button>
                </div>
            </form>
            {<Alert message="Especialidade criada com sucesso!" show={showAlert} url={`/gerenciarEspecialidades`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao cadastrar especialidade, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateEspecialidade;
