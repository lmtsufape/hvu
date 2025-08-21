import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { updateEstagiario, getEstagiarioById } from "../../../../../../services/estagiarioService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function UpdateEstagiario() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [estagiario, setEstagiario] = useState({
        id: null,
        nome: "", 
        cpf: "",
        periodo: "",
        obrigatorio: false,
        ativo: false
    });
    const roles = getRoles();
    const token= getToken();

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

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const estagiarioData = await getEstagiarioById(id);
                    setEstagiario({
                        id: estagiarioData.id,
                        nome: estagiarioData.nome,
                        cpf: estagiarioData.cpf,
                        periodo: estagiarioData.periodo,
                        obrigatorio: estagiarioData.obrigatorio,
                        ativo: estagiarioData.ativo
                    });
                } catch (error) {
                    console.error('Erro ao buscar estagiário:', error);
                }
            };
            fetchData();
        }
    }, [id]);

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

    const handleEstagiarioUpdate = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await updateEstagiario(estagiario.id, estagiario);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar estagiário:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações do Estagiário</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="nome" className="form-label">Nome</label>
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
                            <label htmlFor="cpf" className="form-label">CPF</label>
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
                        <div className={`col ${styles.col}`}>
                        <label className="form-label"></label>
                            <label htmlFor="periodo" className="form-label">Período</label>
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
                    <label className="form-label"></label>
                        <div className={`col ${styles.col}`}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="obrigatorio"
                                    checked={estagiario.obrigatorio}
                                    onChange={handleEstagiarioChange}
                                />
                                Obrigatório
                            </label>
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="ativo"
                                    checked={estagiario.ativo}
                                    onChange={handleEstagiarioChange}
                                />
                                Ativo
                            </label>
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleEstagiarioUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {showAlert && <Alert message="Informações do estagiário editadas com sucesso!" show={showAlert} url={`/lapa/gerenciarEstagiarios`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações do estagiário, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateEstagiario;
