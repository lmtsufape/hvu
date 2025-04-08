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

function FichaClinicaMedica() {
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
        queixaPrincipal: "",// ou string vazia ""

        HistoricoMedico: {vacinação: "", // ou "sim"/"não"
            vacinasSelecionadas: [], // array das vacinas selecionadas
            vermifugação: "", // ou "sim"/"não"
            produtoVermifugação: "", // texto do produto
            dataVacinação: null,  // ou string vazia ""
            dataVermifugação: null  // ou string vazia ""
            },
        ExameFisico: {
            alimentacao: "",
            ectoparasitas: "", // ou "sim"/"não"
            produtoEctoparasitas: "", // texto do produto
            dataEctoparasitas: null, // ou string vazia ""
            postura: "", // ou string vazia ""
            temperatura: "", // ou string vazia ""
            score: "", // ou string vazia ""
            freqCardiaca: "", // ou string vazia ""
            freqRespiratoria: "", // ou string vazia ""
            hidratacao: "", // ou string vazia ""
            tpc: "", // ou string vazia ""
            turgor: "", // ou string vazia ""
            mucosas: "", // ou string vazia ""
            linfonodosGeral: "", // ou string vazia ""
            linfonodosLocal: []} // array das opções selecionadas
          
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
        event.preventDefault();
        setShowErrorAlert(false);
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
        const fichaData = {
            nome: "Ficha Clinica Medica",
            conteudo: {
                queixaPrincipal: formData.queixaPrincipal,
                HistoricoMedico: {
                    vacinação: formData.HistoricoMedico.vacinação,
                    vacinasSelecionadas: formData.HistoricoMedico.vacinasSelecionadas,
                    vermifugação: formData.HistoricoMedico.vermifugação,
                    produtoVermifugação: formData.HistoricoMedico.produtoVermifugação,
                    dataVacinação: formData.HistoricoMedico.dataVacinação,
                    dataVermifugação: formData.HistoricoMedico.dataVermifugação,
                    ectoparasitas: formData.HistoricoMedico.ectoparasitas,
                    produtoEctoparasitas: formData.HistoricoMedico.produtoEctoparasitas,
                    dataEctoparasitas: formData.HistoricoMedico.dataEctoparasitas
                },
                ExameFisico: {
                    alimentacao: formData.ExameFisico.alimentacao,
                    postura: formData.ExameFisico.postura,
                    temperatura: formData.temperatura,
                    score: formData.ExameFisico.score,
                    freqCardiaca: formData.ExameFisico.freqCardiaca,
                    freqRespiratoria: formData.ExameFisico.freqRespiratoria,
                    hidratacao: formData.ExameFisico.hidratacao,
                    tpc: formData.ExameFisico.tpc,
                    turgor: formData.ExameFisico.turgor,
                    mucosas: formData.ExameFisico.mucosas,
                    linfonodosGeral: formData.ExameFisico.linfonodosGeral,
                    linfonodosLocal: formData.ExameFisico.linfonodosLocal

                }
            },
            dataHora: dataFormatada
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

    if (formData.HistoricoMedico.vacinação === "sim" && 
        formData.HistoricoMedico.vacinasSelecionadas.length === 0) {
        errors.vacinas = "Selecione pelo menos uma vacina";
    }
        setErrors(errors);
        return errors;
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha Clinica Medica</h1>
            <div className={styles.form_box}>
                <form onSubmit = {handleSubmit}>
                    <h2>Anamnese Geral</h2>

                    <div className={styles.column}>
                        <label>QUEIXA PRINCIPAL (evolução do quadro, tratamentos, resultados):</label>
                        <input 
                            type="text" 
                            name="queixaPrincipal" 
                            value={formData.queixaPrincipal || ""} 
                            onChange={handleChange}
                            className={`form-control ${styles.input} ${errors.queixaPrincipal ? "is-invalid" : ""}`} 
                        />
                        {errors.queixaPrincipal && <div className={`invalid-feedback ${styles.error_message}`}>{errors.queixaPrincipal}</div>}
                    </div>

                    <div className={styles.column}>
                        <h3>HISTÓRICO MÉDICO PREGRESSO:</h3>

                        {/* Vacinação */}
                    <div className="mb-3">
                        <label>Vacinação:</label>
                        <div className="d-flex gap-3 mb-2">
                        <div className="form-check">
                            <input 
                            type="radio" 
                            name="vacinação" 
                            id="vacinação-nao"
                            value="não"
                            checked={formData.vacinação === "não"}
                            onChange={() => setFormData({...formData, vacinação: "não", vacinasSelecionadas: []})}
                            className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="vacinação-nao">NÃO</label>
                        </div>
                        <div className="form-check">
                            <input 
                            type="radio" 
                            name="vacinação" 
                            id="vacinação-sim"
                            value="sim"
                            checked={formData.vacinação === "sim"}
                            onChange={() => setFormData({...formData, vacinação: "sim"})}
                            className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="vacinação-sim">SIM</label>
                        </div>
                        </div>

                        {formData.vacinação === "sim" && (
                        <div className="d-flex flex-wrap gap-3">
                            {["ANTI-RÁBICA", "GIARDÍA", "LEISHMANIOSE", "POLIVALENTE", "TOSSE DOS CANIS", "POLIVALENTE FELINA"].map(vacina => (
                            <div key={vacina} className="form-check">
                                <input
                                    type="checkbox"
                                    id={`vacina-${vacina}`}
                                    checked={formData.HistoricoMedico.vacinasSelecionadas?.includes(vacina) || false}
                                    onChange={(e) => {
                                        const novasVacinas = e.target.checked
                                            ? [...formData.HistoricoMedico.vacinasSelecionadas, vacina]
                                            : formData.HistoricoMedico.vacinasSelecionadas.filter(v => v !== vacina);
                                        
                                        setFormData(prevFormData => ({
                                            ...prevFormData,
                                            HistoricoMedico: {
                                                ...prevFormData.HistoricoMedico,
                                                vacinasSelecionadas: novasVacinas,  // Atualiza as vacinas selecionadas
                                            }
                                        }));
                                    }}
                                    className="form-check-input"
                                />
                                <label className="form-check-label" htmlFor={`vacina-${vacina}`}>
                                    {vacina}
                                </label>
                            </div>
                        ))}
                        </div>
                        )}
                    </div>

                    {/* Vermifugação */}
                    <div className="mb-3">
                        <label>Vermifugação:</label>
                        <div className="d-flex gap-3 mb-2">
                        <div className="form-check">
                            <input 
                            type="radio" 
                            name="vermifugação" 
                            id="vermifugação-nao"
                            value="não"
                            checked={formData.vermifugação === "não"}
                            onChange={() => setFormData({
                                ...formData, 
                                vermifugação: "não", 
                                produtoVermifugação: "",
                                dataVermifugação: null
                            })}
                            className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="vermifugação-nao">NÃO</label>
                        </div>
                        <div className="form-check">
                            <input 
                            type="radio" 
                            name="vermifugação" 
                            id="vermifugação-sim"
                            value="sim"
                            checked={formData.vermifugação === "sim"}
                            onChange={() => setFormData({...formData, vermifugação: "sim"})}
                            className="form-check-input"
                            />
                            <label className="form-check-label" htmlFor="vermifugação-sim">SIM</label>
                        </div>
                        </div>

                        {formData.vermifugação === "sim" && (
                        <>
                            <div className="mb-3">
                            <label>Produto:</label>
                            <input
                                type="text"
                                name="produtoVermifugação"
                                value={formData.produtoVermifugação || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                            </div>
                            
                            <div className="mb-3">
                            <label>Data da Vermifugação:</label>
                            <input
                                type="date"
                                name="dataVermifugação"
                                value={formData.dataVermifugação || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                            {errors.dataVermifugação && <div className="text-danger small">{errors.dataVermifugação}</div>}
                            </div>
                        </>
                        )}
                    </div>
                    </div>


                    <div className={styles.column}>
                        <h5 className="mb-3">Alimentação</h5>
                        <div className="form-group">
                                {["RAÇÃO", "DIETA CASEIRA", "RAÇÃO + DIETA CASEIRA"].map(opcao => (
                                <label key={opcao}>
                                <input
                                    type="radio"
                                    name="alimentacao"
                                    value={opcao}
                                    checked={formData.alimentacao === opcao}
                                    onChange={handleChange}
                                /> {opcao}
                                </label>
                            ))}
                         </div>   

                         {/* Controle de Ectoparasitas */}
                        <div className="mb-3">
                            <label>Controle de Ectoparasitas:</label>
                            <div className="d-flex gap-3 mb-2">
                            <div className="form-check">
                                <input 
                                type="radio" 
                                name="Ectoparasitas" 
                                id="Ectoparasitas-nao"
                                value="não"
                                checked={formData.ectoparasitas === "não"}
                                onChange={() => setFormData({
                                    ...formData, 
                                    ectoparasitas: "não", 
                                    produtoVermifugação: "",
                                    dataVermifugação: null
                                })}
                                className="form-check-input"
                                />
                                <label className="form-check-label" htmlFor="ectoparasitas-nao">NÃO</label>
                            </div>
                            <div className="form-check">
                                <input 
                                type="radio" 
                                name="ectoparasitas" 
                                id="ectoparasitas-sim"
                                value="sim"
                                checked={formData.ectoparasitas === "sim"}
                                onChange={() => setFormData({...formData, ectoparasitas: "sim"})}
                                className="form-check-input"
                                />
                                <label className="form-check-label" htmlFor="ectoparasitas-sim">SIM</label>
                            </div>
                            </div>

                            {formData.ectoparasitas === "sim" && (
                            <>
                                <div className="mb-3">
                                <label>Produto:</label>
                                <input
                                    type="text"
                                    name="produtoVermifugação"
                                    value={formData.produtoVermifugação || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                </div>
                                
                                <div className="mb-3">
                                <label>Data:</label>
                                <input
                                    type="date"
                                    name="dataEctoparasitas"
                                    value={formData.dataEctoparasitas || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                {errors.dataEctoparasitas && <div className="text-danger small">{errors.dataEctoparasitas}</div>}
                                </div>
                            </>
                            )}
                        </div>      
                     </div>  

                     <div>
                        <h5>Exame físico geral</h5>
                        <label>Postura:</label>
                        {["ESTAÇÃO", "DECÚBITO", "CAVALETE", "OUTRAS"].map(opcao => (
                            <label key={opcao}>
                            <input
                                type="radio"
                                name="postura"
                                value={opcao}
                                checked={formData.postura === opcao}
                                onChange={handleChange}
                            /> {opcao}
                            </label>
                        ))}
                    </div>
                    
                    <div>
                        <label>Temperatura: 
                            <input 
                            type="number" 
                            name="temperatura" 
                            value={formData.temperatura || ""} 
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="100"
                            /> °C
                        </label>
                        {errors.temperatura && <div style={{color:"red"}}>{errors.temperatura}</div>}
                    </div>

                    <div>
                        <h5>Score corporal</h5>
                        {["CAQUÉTICO", "MAGRO", "NORMAL", "SOBREPESO", "OBESO"].map(opcao => (
                            <label key={opcao}>
                            <input 
                                type="radio" 
                                name="score" 
                                value={opcao} 
                                checked={formData.score === opcao} 
                                onChange={handleChange}
                            /> {opcao}
                            </label>
                        ))}
                        </div>
                        
                        <div style={{display: 'flex', gap: '20px'}}>
                        <div>
                            <label>
                            FREQUÊNCIA CARDÍACA (BPM):
                            <input 
                                type="number" 
                                name="freqCardiaca" 
                                value={formData.freqCardiaca || ''} 
                                onChange={handleChange}
                                style={{width: '80px', marginLeft: '5px'}}
                            />
                            </label>
                        </div>
                        
                        <div>
                            <label>
                            FREQUÊNCIA RESPIRATÓRIA (RPM):
                            <input 
                                type="number" 
                                name="freqRespiratoria" 
                                value={formData.freqRespiratoria || ''} 
                                onChange={handleChange}
                                style={{width: '80px', marginLeft: '5px'}}
                            />
                            </label>
                        </div>
                        </div>

                        <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
                        <div>
                            <h5 style={{marginTop: 0}}>HIDRATAÇÃO:</h5>
                            {["NORMAL", "6 A 8%", "8 A 10%", "ACIMA DE 10%"].map(opcao => (
                            <div key={opcao}>
                                <label>
                                <input
                                    type="radio"
                                    name="hidratacao"
                                    value={opcao}
                                    checked={formData.hidratacao === opcao}
                                    onChange={handleChange}
                                    required
                                /> {opcao}
                                </label>
                            </div>
                            ))}
                        </div>

                        <div>
                            <label>
                            TPC:
                            <input
                                type="number"
                                name="tpc"
                                value={formData.tpc || ''}
                                onChange={handleChange}
                                min="1"
                                max="10"
                                style={{width: '60px', marginLeft: '5px'}}
                                required
                            /> segundos
                            </label>
                            {errors.tpc && <div style={{color: 'red', fontSize: '0.8rem'}}>{errors.tpc}</div>}
                        </div>
                        </div>

                        <div>
                        <div>
                            <h5>TURGOR CUTÂNEO:</h5>
                            {["NORMAL", "REDUZIDO"].map(opcao => (
                            <label key={opcao} style={{marginRight: '15px'}}>
                                <input type="radio" name="turgor" value={opcao} checked={formData.turgor === opcao} onChange={handleChange}/> {opcao}
                            </label>
                            ))}
                        </div>

                        <div>
                            <h5>MUCOSAS:</h5>
                            {["RÓSEAS", "RÓSEAS PÁLIDAS", "PORCELANAS", "HIPERÊMICAS", "CIANÓTICAS", "ICTÉRICAS"].map(opcao => (
                            <label key={opcao} style={{marginRight: '15px'}}>
                                <input type="radio" name="mucosas" value={opcao} checked={formData.mucosas === opcao} onChange={handleChange}/> {opcao}
                            </label>
                            ))}
                        </div>

                        <div>
                            <h5>LINFONODOS:</h5>
                            {["S/A", "AUMENTADO", "DOLOROSO", "ADERIDO"].map(opcao => (
                            <label key={opcao} style={{marginRight: '15px'}}>
                                <input type="radio" name="linfonodosGeral" value={opcao} checked={formData.linfonodosGeral === opcao} onChange={handleChange}/> {opcao}
                            </label>
                            ))}
                            <div style={{marginTop: '10px'}}>
                            {["MANDIBULAR D", "PRÉ-ESCAPULAR D", "AXILAR D", "INGUINAL D", "POPLÍTEO D", "MANDIBULAR E", "PRÉ-ESCAPULAR E", "AXILAR E", "INGUINAL E", "POPLÍTEO E"].map(opcao => (
                                <label key={opcao} style={{marginRight: '15px'}}>
                                <input 
                                    type="checkbox" 
                                    name="linfonodosLocal" 
                                    value={opcao} 
                                    checked={formData.linfonodosLocal?.includes(opcao) || false}
                                    onChange={(e) => {
                                    const novasLocalizacoes = e.target.checked
                                        ? [...(formData.linfonodosLocal || []), opcao]
                                        : (formData.linfonodosLocal || []).filter(item => item !== opcao);
                                    setFormData({...formData, linfonodosLocal: novasLocalizacoes});
                                    }}
                                /> {opcao}
                                </label>
                            ))}
                            </div>
                        </div>
                        </div>


                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        <button type="submit" className={styles.criar_button}>
                            Continuar
                        </button>
                    </div>

                </form>
                {<Alert message="Ficha criada com sucesso!" show={showAlert} url={`/fichaClinicaMedica`} />}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaClinicaMedica;