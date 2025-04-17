import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import { createFicha } from '../../../../services/fichaService';
import FinalizarFichaModal from "../FinalizarFichaModal";
import moment from 'moment';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";

function FichaDermatologicaRetorno() {

    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [formData, setFormData] = useState({
        Anamnese: "",
        tratamento: "",
        resultados: "",
        locaisAfetados: "",
        condutaTerapeutica: "",
        estagiarios: "",
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

    const handleSubmit = async (event) => {
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
        const fichaData = {
            nome: "Ficha de sessão",  
            conteudo:{
                anamnese: formData.Anamnese,
                tratamento: formData.tratamentos,
                resultados: formData.resultados,
                locaisAfetados: formData.locaisAfetados,
                condutaTerapeutica: formData.condutaTerapeutica,
                estagiarios: formData.estagiarios,
            },
            dataHora: dataFormatada 
        };

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha clínica dermatológica de retorno </h1>
            <div className={styles.form_box}>
                <form>
                    <div className={styles.column}>
                        <label>Anamnese/Histórico clínico: <br></br>
                            <textarea name="Anamnese" value={formData.Anamnese} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Tratamentos realizados (Início/Término/Resposta terapêutica): <br></br>
                            <textarea name="tratamentos" value={formData.tratamentos} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Resultados dos exames realizados: <br></br>
                            <textarea name="resultados" value={formData.resultados} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <h1 className={styles.title}>Exame físico dermatológico/Descrição lesional</h1>
                    <div className={styles.column}>
                        <label>Locais afetados: <br></br>
                            <textarea name="locaisAfetados" value={formData.locaisAfetados} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Conduta terapêutica: <br></br>
                            <textarea name="condutaTerapeutica" value={formData.condutaTerapeutica} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Estagiários: <br></br>
                            <textarea name="estagiarios" value={formData.estagiarios} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
                {<Alert message="Ficha criada com sucesso!" show={showAlert} url={`/fichaDermatologicaRetorno`} />}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaDermatologicaRetorno;