import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { createFicha } from '../../../../services/fichaService';

function FichaMedicaRetorno() {
    const router = useRouter();

    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [formData, setFormData] = useState({
        
        Anamnese: "",
        exameClinico: "",
        tratamento: "",
        ExamesComplementares: [],
        plantonista: "",
        medico: "",
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

    const handleSubmit = async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        setShowErrorAlert(false);
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); // Gera a data atual no formato ISO 8601
        const fichaData = {
            nome: "Ficha clínico médica de retorno",  
            conteudo:{
                Anamnese: formData.Anamnese,
                exameClinico: formData.exameClinico,
                tratamento: formData.tratamento,
                ExamesComplementares: formData.ExamesComplementares,
                plantonista: formData.plantonista,
                medico: formData.medico,
            },
            dataHora: dataFormatada // Gera a data atual no formato ISO 8601

        };
    
        // const errors = validateForm();
        // if (Object.keys(errors).length > 0) {
        //     setErrors(errors);
        //     return;
        // }

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

    const handleCheckboxChange = (event, field) => {
        const { value, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter((item) => item !== value)
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha clínica médica de retorno</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Retorno - Acompanhamento clínico</h1>
                    <div className={styles.column}>
                        <label>Anamnese: <br></br>
                            <textarea name="Anamnese" value={formData.Anamnese} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Exame clínico: <br></br>
                            <textarea name="exameClinico" value={formData.exameClinico} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Tratamento: <br></br>
                            <textarea name="tratamento" value={formData.tratamento} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <h1 className={styles.title}>Exames complementares</h1>
                    <div className={styles.checkbox_container}>
                    {[
                        "Hemograma", "Alt/Tgp", "Ast/Tgo", "Creatinina", "Uréia",
                        "Proteínas Totais", "Albumina", "Globulina", "Fa", "Ggt",
                        "Glicose", "Triglicérides", "Colesterol Total", "Urinálise",
                        "Bilirrubina Total e Frações", "Tricograma", "Citologia Cutânea",
                        "Raspado Cutâneo", "Citologia Oncológica", "Histopatológico",
                        "Teste Rápido Cinomose", "Teste Rápido Erliquiose", "Citologia Otológica",
                        "Teste Rápido Parvovirose", "Teste Rápido Leishmaniose", "Fiv/Felv"
                    ].map((item) => (
                        <label key={item}>
                            <input
                                type="checkbox"
                                value={item}
                                onChange={(e) => handleCheckboxChange(e, "ExamesComplementares")}
                            /> {item.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                    ))}
                    </div>

                    <div className={styles.column}>
                        <label>Plantonista(s) discente(s):</label>
                        <input type="text" name="plantonista" value={formData.plantonista} onChange={handleChange} />
                    </div>

                    <div className={styles.column}>
                        <label>Médico(s) Veterinário(s) Responsável:</label>
                        <input type="text" name="medico" value={formData.medico} onChange={handleChange} />
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        <button type="submit" className={styles.criar_button}>Continuar</button>
                    </div>
                    
                </form>
                {<Alert message="Ficha criada com sucesso!" show={showAlert} url={`/fichaMedicaRetorno`} />}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaMedicaRetorno;