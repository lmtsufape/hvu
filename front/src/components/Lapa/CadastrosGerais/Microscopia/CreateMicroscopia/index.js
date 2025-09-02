import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createCampoLaudoMicroscopia } from "../../../../../../services/campoLaudoMicroscopiaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import OrgaosList from "@/hooks/useOrgaoList";
import { getToken, getRoles } from "../../../../../../services/userService";

function CreateMicroscopia() {
    const router = useRouter();
    const { orgaos, error } = OrgaosList();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errors, setErrors] = useState({});
    const [microscopia, setMicroscopia] = useState({
        descricao: "",
        processamento: "",
        orgao: { id: null }
    });

    const roles = getRoles();
    const token = getToken();

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>
                    Acesso negado: Faça login para acessar esta página.
                </h3>
            </div>
        );
    }

    if (!roles.includes("patologista")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>
                    Acesso negado: Você não tem permissão para acessar esta página.
                </h3>
            </div>
        );
    }

    const processamentoOptions = [
        "CLIVAGEM",
        "EMBLOCAMENTO",
        "MICROTOMIA",
        "DESPARAFINIZACAO",
        "COLORACAO",
        "PERDAMATERIAL"
    ];

    const handleMicroscopiaChange = (event) => {
        const { name, value } = event.target;
        setMicroscopia({ ...microscopia, [name]: value });
    };

    const handleOrgaoChange = (event) => {
        const selectedId = Number(event.target.value); // garante que seja número
        setMicroscopia({ ...microscopia, orgao: { id: selectedId } });
    };

    const validateForm = () => {
        const errors = {};
        if (!microscopia.descricao) errors.descricao = "Campo obrigatório";
        if (!microscopia.processamento) errors.processamento = "Campo obrigatório";
        if (!microscopia.orgao.id) errors.orgao = "Selecione um órgão";
        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        try {
            await createCampoLaudoMicroscopia(microscopia);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar microscopia:", error);
            setShowErrorAlert(true);
        }
    };

    if (error) {
        return <div>Erro ao carregar órgãos: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar Microscopia</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="descricao" className="form-label">
                                Descrição <span className={styles.obrigatorio}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Digite a descrição da microscopia"
                                className={`form-control ${styles.input} ${errors.descricao ? "is-invalid" : ""}`}
                                name="descricao"
                                value={microscopia.descricao}
                                onChange={handleMicroscopiaChange}
                            />
                            {errors.descricao && (
                                <div className={`invalid-feedback ${styles.error_message}`}>
                                    {errors.descricao}
                                </div>
                            )}
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="processamento" className="form-label">
                                Processamento <span className={styles.obrigatorio}>*</span>
                            </label>
                            <select
                                className={`form-select ${styles.input} ${errors.processamento ? "is-invalid" : ""}`}
                                name="processamento"
                                value={microscopia.processamento}
                                onChange={handleMicroscopiaChange}
                            >
                                <option value="" disabled>Selecione o processamento</option>
                                {processamentoOptions.map((proc) => (
                                    <option key={proc} value={proc}>
                                        {proc.charAt(0) + proc.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.processamento && (
                                <div className={`invalid-feedback ${styles.error_message}`}>
                                    {errors.processamento}
                                </div>
                            )}
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="orgao" className="form-label">
                                Órgão <span className={styles.obrigatorio}>*</span>
                            </label>
                            <select
                                className={`form-select ${styles.input} ${errors.orgao ? "is-invalid" : ""}`}
                                name="orgao"
                                value={microscopia.orgao.id || ""}
                                onChange={handleOrgaoChange}
                            >
                                <option value="" disabled>Selecione um órgão</option>
                                {orgaos.map((orgao) => (
                                    <option key={orgao.id} value={orgao.id}>
                                        {orgao.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.orgao && (
                                <div className={`invalid-feedback ${styles.error_message}`}>
                                    {errors.orgao}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleSubmit}>
                        Criar
                    </button>
                </div>
            </form>

            {showAlert && (
                <Alert
                    message="Microscopia criada com sucesso!"
                    show={showAlert}
                    url={`/lapa/gerenciarMicroscopias`}
                />
            )}
            {showErrorAlert && (
                <ErrorAlert
                    message="Erro ao cadastrar microscopia, tente novamente."
                    show={showErrorAlert}
                />
            )}
        </div>
    );
}

export default CreateMicroscopia;
