import { React, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { createAviso } from "../../../services/avisoService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function CreateAviso() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");

    const [aviso, setAviso] = useState({
        texto: "",
        habilitado: false
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

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

      const handleAvisoChange = (event) => {
        const { name, type, checked, value } = event.target;
        
        setAviso((prevAviso) => ({
            ...prevAviso,
            [name]: type === "checkbox" ? checked : value, 
        }));
    };
    
    console.log(aviso);

    const validateForm = () => {
        const errors = {};
        if (!aviso.texto) {
          errors.texto = "Campo obrigatório";
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
            await createAviso(aviso);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar aviso:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar aviso</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="texto" className="form-label">Texto<span className={styles.obrigatorio}>*</span></label>
                            <textarea
                                type="text"
                                placeholder="Digite o aviso"
                                className={`form-control ${styles.input} ${errors.texto ? "is-invalid" : ""}`}
                                name="texto"
                                value={aviso.texto}
                                onChange={handleAvisoChange}
                            />
                            {errors.texto && <div className={`invalid-feedback ${styles.error_message}`}>{errors.texto}</div>}
                        </div>
                    </div>
                    <div className={`col ${styles.col} ${styles.hab}`}>
                        <label className="form-label">
                            Habilitado: 
                        </label>
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
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleSubmit}>
                        Criar
                    </button>
                </div>
            </form>
            {<Alert message="Aviso criado com sucesso!" show={showAlert} url={`/gerenciarAvisos`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao cadastrar aviso, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateAviso;
