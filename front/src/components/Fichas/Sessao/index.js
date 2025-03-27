import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import { createFicha } from '../../../../services/fichaService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';

function FichaSessao() {
    const router = useRouter();

    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState({});
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        numeroSessao: "",
        sessaoData: "",
        anotacao: "",
        estagiario: "",
        rg: ""
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
        }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUsuario();
                setUserId(userData.usuario.id);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, []);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("medico")) {
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); // Gera a data atual no formato ISO 8601
        const fichaData = {
            nome: "Ficha de sessão",  
            conteudo:{
                numeroSessao: formData.numeroSessao,
                sessaoData: formData.sessaoData,
                anotacao: formData.anotacao,
                rg: formData.rg,
                estagiario: formData.estagiario
            },
            dataHora: dataFormatada // Gera a data atual no formato ISO 8601

        };
    
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            console.log(fichaData)
            await createFicha(fichaData);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            if (error.response && error.response.data && error.response.data.code) {
                setErrorMessage(error.response.data.message);
            }
            setShowErrorAlert(true);
        }
    };
    
    const validateForm = () => {
        const errors = {};

        if(!formData.numeroSessao){
            errors.numeroSessao = "Campo obrigatório";
        }
        if(!formData.sessaoData){
            errors.sessaoData = "Campo obrigatório";
        }
        setErrors(errors);
        return errors;
      };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de sessão</h1>
            <div className={styles.form_box}>
                <form onSubmit = {handleSubmit}>
                    <div className={styles.column}>
                        <label>Sessão nº:</label>
                        <input type="text" name="numeroSessao" 
                        value={formData.numeroSessao} 
                        onChange={handleChange}
                        className={`form-control ${errors.numeroSessao ? "is-invalid" : ""}`} />
                        {errors.numeroSessao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.numeroSessao}</div>}
                    
                    </div>
                    <div className={styles.column}>
                        <label>Data:</label>
                        <input type="date" name="sessaoData" 
                        value={formData.sessaoData} 
                        onChange={handleChange}
                        className={`form-control ${errors.numeroSessao ? "is-invalid" : ""}`} />
                        {errors.numeroSessao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.numeroSessao}</div>}
                    </div>
                    <div className={styles.column}>
                        <label>Anotação: 
                            <textarea name="anotacao" value={formData.anotacao} onChange={handleChange} rows="10" cols="50" />
                        </label>
                    </div>              

                    <div className={styles.column}>
                        <label>Estagiário: </label>
                        <input type="text" name="estagiario" value={formData.estagiario} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>RG: </label>
                        <input type="text" name="rg" value={formData.rg} onChange={handleChange} />
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        <button type="submit" className={styles.criar_button}>
                            Continuar
                        </button>
                    </div>
                    
                </form>
                {<Alert message="Ficha criada com sucesso!" show={showAlert} url={`/fichaSessao`} />}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaSessao;