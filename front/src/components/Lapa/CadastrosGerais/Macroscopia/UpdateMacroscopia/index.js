import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { updateCampoLaudo, getCampoLaudoById } from "../../../../../../services/campoLaudoService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";

function UpdateCampoLaudo() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [campoLaudo, setCampoLaudo] = useState({});

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const campoLaudoData = await getCampoLaudoById(id);
                    setCampoLaudo(campoLaudoData);
                } catch (error) {
                    console.error('Erro ao buscar Macroscopia:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    const handleCampoLaudoChange = (event) => {
        const { name, value } = event.target;
        setCampoLaudo({ ...campoLaudo, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!campoLaudo.descricao) {
            errors.descricao = "Campo obrigatório";
        }
        return errors;
    };

    const handleCampoLaudoUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            await updateCampoLaudo(campoLaudo.id, campoLaudo);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar Macroscopia:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações da Macroscopia</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="descricao" className="form-label">Descrição</label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.descricao ? "is-invalid" : ""}`}
                                name="descricao"
                                value={campoLaudo.descricao || ""}
                                onChange={handleCampoLaudoChange}
                            />
                            {errors.descricao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.descricao}</div>}
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleCampoLaudoUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {showAlert && <Alert message="Informações da Macroscopia editadas com sucesso!" show={showAlert} url={`/gerenciarCampoLaudo`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações da Macroscopia, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateCampoLaudo;
