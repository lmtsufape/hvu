import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateTipoConsulta, getTipoConsultaById } from "../../../services/tipoConsultaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateTipoConsulta() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [tipoConsulta, setTipoConsulta] = useState({});

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setRoles(storedRoles || []);
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const tipoConsultaData = await getTipoConsultaById(id);
                    setTipoConsulta(tipoConsultaData);

                    console.log("tipoConsultaData:", tipoConsultaData)
                } catch (error) {
                    console.error('Erro ao buscar tipo de consulta:', error);
                } finally {
                    setLoading(false); // Marcar como carregado após buscar os dados
                }
            };
            fetchData();
        }
    }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    const handleTipoConsultaChange = (event) => {
        const { name, value } = event.target;
        setTipoConsulta({ ...tipoConsulta, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!tipoConsulta.tipo) {
          errors.tipo = "Campo obrigatório";
        }
        return errors;
      };

    const handleTipoConsultaUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }

        try {
            await updateTipoConsulta(tipoConsulta.id, tipoConsulta);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar tipo de consulta:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações do tipo de consulta</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="tipo" className="form-label">Tipo de consulta</label>
                            <input
                                type="text"
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
                    <button type="button" className={styles.criar_button} onClick={handleTipoConsultaUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {<Alert message="Informações do tipo de consulta editadas com sucesso!" show={showAlert} url={`/gerenciarTiposConsulta`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações do tipo de consulta, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateTipoConsulta;
