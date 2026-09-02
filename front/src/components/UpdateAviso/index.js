import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateAviso, getAvisoById } from "../../../services/avisoService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateAviso() {
    const router = useRouter();
    const { id } = router.query;

    const [aviso, setAviso] = useState({ texto: "", habilitado: false });
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            const storedRoles = JSON.parse(localStorage.getItem("roles"));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                setShowErrorAlert(false);
        try {
                    const avisoData = await getAvisoById(id);
                    setAviso(avisoData || { texto: "", habilitado: false });
                } catch (error) {
                    console.error("Erro ao buscar aviso:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id]);

    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    if (!roles.includes("secretario")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

    const handleAvisoChange = (event) => {
        const { name, value, type, checked } = event.target;
        setAviso((prevAviso) => ({
            ...prevAviso,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!aviso.texto.trim()) {
            errors.texto = "Campo obrigatório";
        }
        return errors;
    };

    const handleAvisoUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setShowErrorAlert(false);
        try {
            await updateAviso(aviso.id, aviso);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar aviso:", error);
            
            const isDataIntegrityError = error?.response?.data?.error === "Erro de integridade de dados" || error?.response?.data?.message?.includes("violates foreign key constraint");
                if (error?.response?.data?.message && !isDataIntegrityError) {
                    setErrorMessage(error?.response?.data?.message);
                } else if (error?.response?.data?.error && !isDataIntegrityError) {
                    setErrorMessage(error?.response?.data?.error);
                } else {
                setErrorMessage("");
            }
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar aviso</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="texto" className="form-label">Texto</label>
                            <textarea
                                className={`form-control ${styles.input} ${errors.texto ? "is-invalid" : ""}`}
                                name="texto"
                                value={aviso.texto}
                                onChange={handleAvisoChange}
                            />
                            {errors.texto && <div className={`invalid-feedback ${styles.error_message}`}>{errors.texto}</div>}
                        </div>
                    </div>
                    <div className={`col ${styles.col} ${styles.hab}`}>
                        <label className="form-label">Habilitado:</label>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                name="habilitado"
                                checked={aviso.habilitado}
                                onChange={handleAvisoChange}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleAvisoUpdate}>
                        Editar
                    </button>
                </div>
            </form>
            <Alert message="Aviso editado com sucesso!" show={showAlert} url={`/gerenciarAvisos`} />
            {showErrorAlert && <ErrorAlert message={errorMessage || "Erro ao editar aviso, tente novamente."} show={showErrorAlert} />}
        </div>
    );
}

export default UpdateAviso;
