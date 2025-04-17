import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import moment from 'moment';
import { createFicha } from '../../../../services/fichaService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import FinalizarFichaModal from "../FinalizarFichaModal";

function FichaAtoCirurgico() {
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        descricaoAtoCirurgico: "",
        prognostico: "",
        protocolos: "",
        reavaliacao: "",
        equipeResponsavel: ""
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
                console.log("userData:", userData);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            } finally {
                setLoading(false); 
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

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
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
        const fichaData = {
            nome: "Ficha de ato cirúrgico",  
            conteudo:{
                descricaoAtoCirurgico: formData.descricaoAtoCirurgico,
                prognostico: formData.prognostico,
                protocolos: formData.protocolos,
                reavaliacao: formData.reavaliacao,
                equipeResponsavel: formData.equipeResponsavel,
            },
            dataHora: dataFormatada 
        };

        try {
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
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de ato cirúrgico </h1>
            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
                    
                    <div className={styles.column}>
                        <label>Descrição do ato cirúrgico: <br></br>
                            <textarea name="descricaoAtoCirurgico" 
                            value={formData.descricaoAtoCirurgico} 
                            onChange={handleChange} rows="4" cols="50"/>
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Prognóstico pós cirúrgico: 
                            <select name="prognostico" value={formData.prognostico} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="FAVORAVEL">Favorável</option>
                                <option value="RESERVADO">Reservado</option>
                                <option value="DESFAVORAVEL">Desfavorável</option>
                            </select>
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Protocolos terapêuticos a serem instituidos: 
                            <textarea name="protocolos" value={formData.protocolos} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Retorno para reavaliações:
                            <textarea name="reavaliacao" value={formData.reavaliacao} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Plantonista(s) discente(s): 
                            <textarea name="equipeResponsavel" value={formData.equipeResponsavel} onChange={handleChange} rows="4" cols="50"/>
                        </label>
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
                {<Alert message="Ficha criada com sucesso!" show={showAlert} url={`/fichaAtoCirurgico`} />}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaAtoCirurgico;