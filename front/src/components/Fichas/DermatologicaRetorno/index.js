import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
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
import SolicitacaoDeExameAninhar from "../SolicitacaoDeExameAninhar";

function FichaDermatologicaRetorno() {

    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [mostrarExames, setMostrarExames] = useState(false);
    const [consultaId, setConsultaId] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        Anamnese: "",
        tratamento: "",
        resultados: "",
        locaisAfetados: "",
        condutaTerapeutica: "",
        estagiarios: "",
        peso: "",
        medicoResponsavel: "",
        SolicitacaoDeExame: {
            hematologiaDiagnostica: [],
            urinalise: [],
            parasitologico: [],
            bioquimicaClinica: [],
            citologiaHistopatologia: [],
            imunologicos: [],
            imaginologia: [],
            cardiologia: [],
        },
    });

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("fichaCardiologicaFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []); 

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("fichaCardiologicaFormData", JSON.stringify(formData));
        }
    }, [formData]); 

    // Obtém o ID da ficha da URL
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
        event?.preventDefault(); // Usa encadeamento opcional para evitar erro
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
        const fichaData = {
            nome: "Ficha dermatológica de retorno",  
            conteudo:{
                anamnese: formData.Anamnese,
                tratamento: formData.tratamentos,
                resultados: formData.resultados,
                locaisAfetados: formData.locaisAfetados,
                condutaTerapeutica: formData.condutaTerapeutica,
                estagiarios: formData.estagiarios,
                peso: formData.peso,
                medicoResponsavel: formData.medicoResponsavel,
                SolicitacaoDeExame: formData.SolicitacaoDeExame,
            },
            dataHora: dataFormatada 
        };
    

        try {
            const resultado = await createFicha(fichaData);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("fichaCardiologicaFormData");
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            if (error.response && error.response.data && error.response.data.code) {
                setErrorMessage(error.response.data.message);
            }
            setShowErrorAlert(true);
        }
    };
    const handleFinalizar = async () => {
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
        const fichaData = {
          nome: "Ficha clínico médica de retorno",
          conteudo: {
            anamnese: formData.Anamnese,
            tratamento: formData.tratamentos,
            resultados: formData.resultados,
            locaisAfetados: formData.locaisAfetados,
            condutaTerapeutica: formData.condutaTerapeutica,
            estagiarios: formData.estagiarios,
            peso: formData.peso,
            medicoResponsavel: formData.medicoResponsavel,
            SolicitacaoDeExame: formData.SolicitacaoDeExame,
          },
          dataHora: dataFormatada,
        };
        try {
            const resultado = await createFicha(fichaData);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("fichaCardiologicaFormData");
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            if (error.response && error.response.data && error.response.data.code) {
            setErrorMessage(error.response.data.message);
            } else {
            setErrorMessage("Erro ao criar ficha");
            }
            setShowErrorAlert(true);
        }
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const toggleMostrarExames = () => {
        setMostrarExames((prev) => !prev);
    };

    const cleanLocalStorage = () => {
        localStorage.removeItem("fichaCardiologicaFormData");
    }

    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha clínica dermatológica de retorno </h1>
            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
                    <button className={styles.dados_ocultos} type="button">
                        Identificação do animal
                        <span>+</span>
                    </button>
                    <div className={styles.titulo}>
                        Anamnese
                    </div>
                    <div className={styles.column}>
                        <label>Peso: </label>
                        <textarea name="peso" value={formData.peso} 
                        onChange={handleChange} 
                        style={{ 
                            width: "100px" 
                        }} />
                        
                    </div>

                    <div className={styles.column}>
                        <label>Anamnese/Histórico clínico </label>
                        <textarea name="Anamnese" value={formData.Anamnese} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>
                    <div className={styles.column}>
                        <label>Tratamentos realizados (Início/Término/Resposta terapêutica) </label>
                        <textarea name="tratamentos" value={formData.tratamentos} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>
                    <div className={styles.column}>
                        <label>Resultados dos exames realizados </label>
                        <textarea name="resultados" value={formData.resultados} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>

                    <div className={styles.titulo}>
                        Exame físico dermatológico/Descrição lesional
                    </div>

                    <div className={styles.column}>
                        <label>Locais afetados </label>
                        <textarea name="locaisAfetados" value={formData.locaisAfetados} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>
                    <div className={styles.column}>
                        <label>Conduta terapêutica </label>
                        <textarea name="condutaTerapeutica" value={formData.condutaTerapeutica} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>

                    <button
                        type="button"
                        onClick={toggleMostrarExames}
                        className={`${styles.toggleButton} ${
                            mostrarExames ? styles.minimize : styles.expand
                        }`}
                        >
                        {mostrarExames ? "Ocultar Exames" : "Solicitar Exame"}
                    </button>
                    {mostrarExames && (
                    <SolicitacaoDeExameAninhar
                        formData={formData.SolicitacaoDeExame}
                        setFormData={setFormData}
                    />
                    )}

                    
                    <div className={styles.column}>
                        <label>Médico(s) Veterinário(s) Responsável: </label>
                        <textarea name="medicoResponsavel" value={formData.medicoResponsavel} 
                        onChange={handleChange} />
                        
                    </div>
                    <div className={styles.column}>
                        <label>Plantonista(s) discente(s): </label>
                        <textarea name="estagiarios" value={formData.estagiarios} 
                        onChange={handleChange} />
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage}/>
                        < FinalizarFichaModal onConfirm={handleFinalizar} />
                    </div>
                </form>
                {showAlert && consultaId &&
                <div className={styles.alert}>
                    <Alert message="Ficha criada com sucesso!" 
                    show={showAlert} url={`/createConsulta/${consultaId}`} />
                </div>}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaDermatologicaRetorno;