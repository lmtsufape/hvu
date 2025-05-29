import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import { createFicha } from '../../../../services/fichaService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import FinalizarFichaModal from "../FinalizarFichaModal";

function FichaSessao() {

    const [userId, setUserId] = useState(null);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const [formData, setFormData] = useState({
        numeroSessao: "",
        sessaoData: "",
        anotacao: "",
        estagiario: "",
        rg: ""
    });

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("fichaSessaoFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []); 

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("fichaSessaoFormData", JSON.stringify(formData));
        }
    }, [formData]); 

    const [consultaId, setConsultaId] = useState(null);

    useEffect(() => {
    if (router.isReady) {
        const id = router.query.fichaId;
        if (id) {
        setConsultaId(id);
        console.log("ID da ficha:", id);
        }
    }
    }, [router.isReady, router.query.fichaId]);


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

    const cleanLocalStorage = () => {
        localStorage.removeItem("fichaSessaoFormData");
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
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

        try {
            console.log(fichaData)
            const resultado = await createFicha(fichaData);
            console.log("Resposta da api", resultado.id);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("fichaSessaoFormData");
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
            <h1>Ficha de sessão</h1>
            <div className={styles.form_box}>
                <form onSubmit = {handleSubmit}>
                    <div id="flex-grid" className={styles.column}>
                        <div id="flex-column" className={styles.column}>
                            <label>Sessão nº:</label>
                            <input id="meia-caixa" type="text" name="numeroSessao" 
                            value={formData.numeroSessao} 
                            onChange={handleChange} />
                        </div>
                        <div id="flex-column" className={styles.column}>
                            <label>Data:</label>
                            <input id="meia-caixa" type="date" name="sessaoData" 
                            value={formData.sessaoData} 
                            onChange={handleChange}/>
                        </div>
                    </div>

                    <button className={styles.dados_ocultos} type="button">
                        Dados do animal
                        <span>+</span>
                    </button>

                    <div className={styles.titulo}>
                        Anotação
                    </div>
                    <div className={styles.column}>
                        <textarea id="caixa-alta" name="anotacao" value={formData.anotacao} onChange={handleChange} rows="10" cols="50" />
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
                        < CancelarWhiteButton onClick={cleanLocalStorage}/>
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
                {showAlert && consultaId && (
                <Alert message="Ficha criada com sucesso!" show={showAlert} url={`/createConsulta/${consultaId}`} />
                )}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaSessao;