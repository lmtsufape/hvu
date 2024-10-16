import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateEspecialidade, getEspecialidadeById } from "../../../services/especialidadeService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateEspecialidade() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [especialidade, setEspecialidade] = useState({});

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
                    const especialidadeData = await getEspecialidadeById(id);
                    setEspecialidade(especialidadeData);

                    console.log("especialidadeData:", especialidadeData)
                } catch (error) {
                    console.error('Erro ao buscar especialidade:', error);
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

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

    const handleEspecialidadeChange = (event) => {
        const { name, value } = event.target;
        setEspecialidade({ ...especialidade, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!especialidade.nome) {
          errors.nome = "Campo obrigatório";
        }
        return errors;
      };

    const handleEspecialidadeUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }

        try {
            await updateEspecialidade(especialidade.id, especialidade);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar especialidade:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações da especialidade</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="nome" className="form-label">Especialidade</label>
                            <input
                                type="text"
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
                    <button type="button" className={styles.criar_button} onClick={handleEspecialidadeUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {<Alert message="Informações da especialidade editadas com sucesso!" show={showAlert} url={`/gerenciarEspecialidades`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações da especialidade, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateEspecialidade;
