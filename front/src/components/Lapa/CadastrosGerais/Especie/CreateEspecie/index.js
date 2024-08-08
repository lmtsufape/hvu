import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createEspecie } from "../../../../../../services/especieService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";

function CreateEspecie() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const [especie, setEspecie] = useState({
        nome: ""
    });

    const handleEspecieChange = (event) => {
        const { name, value } = event.target;
        setEspecie({ ...especie, [name]: value });
    };
    console.log(especie);

    const validateForm = () => {
        const errors = {};
        if (!especie.nome) {
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
            await createEspecie(especie);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar espécie:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar espécie</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="nome" className="form-label">Nome <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                placeholder="Digite a espécie"
                                className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
                                name="nome"
                                value={especie.nome}
                                onChange={handleEspecieChange}
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
            {<Alert message="Espécie criada com sucesso!" show={showAlert} url={`/gerenciarEspecies`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao criar especie, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateEspecie;
