import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateEspecie, getEspecieById } from "../../../services/especieService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateEspecie() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [especie, setEspecie] = useState({});

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const especieData = await getEspecieById(id);
                    setEspecie(especieData);

                    console.log("especieData:", especieData)
                } catch (error) {
                    console.error('Erro ao buscar espécie:', error);
                } finally {
                    setLoading(false); // Marcar como carregado após buscar os dados
                }
            };
            fetchData();
        }
    }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
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

    const handleEspecieChange = (event) => {
        const { name, value } = event.target;
        setEspecie({ ...especie, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!especie.nome) {
          errors.nome = "Campo obrigatório";
        }
        return errors;
      };

    const handleEspecieUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }

        try {
            await updateEspecie(especie.id, especie);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar espécie:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações da espécie</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="nome" className="form-label">Espécie</label>
                            <input
                                type="text"
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
                    <button type="button" className={styles.criar_button} onClick={handleEspecieUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {<Alert message="Informações da espécie editadas com sucesso!" show={showAlert} url={`/gerenciarEspecies`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações da espécie, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateEspecie;
