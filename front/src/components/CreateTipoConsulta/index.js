import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { createTipoConsulta } from "../../../services/tipoConsultaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function CreateTipoConsulta() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const [tipoConsulta, setTipoConsulta] = useState({
        tipo: ""
    });

    const handleTipoConsultaChange = (event) => {
        const { name, value } = event.target;
        setTipoConsulta({ ...tipoConsulta, [name]: value });
    };
    console.log(tipoConsulta);

    const validateForm = () => {
        const errors = {};
        if (!tipoConsulta.tipo) {
          errors.tipo = "Campo obrigatório";
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
            await createTipoConsulta(tipoConsulta);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar tipo de consulta:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar tipo de consulta</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="tipo" className="form-label">Nome <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                placeholder="Digite o tipo de consulta"
                                className={`form-control ${styles.input} ${errors.tipo ? "is-invalid" : ""}`}
                                name="tipo"
                                value={tipoConsulta.tipo}
                                onChange={handleTipoConsultaChange}
                            />
                            {errors.tipo && <div className={`invalid-feedback ${styles.error_message}`}>{errors.tipo}</div>}
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
            {<Alert message="Tipo de consulta criado com sucesso!" show={showAlert} url={`/gerenciarTiposConsulta`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao criar tipo de consulta, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateTipoConsulta; 
