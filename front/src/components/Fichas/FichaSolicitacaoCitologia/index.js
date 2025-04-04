import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { createFicha } from '../../../../services/fichaService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';



function FichaSolicitacaoCitologia() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherValue, setOtherValue] = useState("");
    const [showOtherInputLesao, setShowOtherInputLesao] = useState(false);
    const [otherValueLesao, setOtherValueLesao] = useState("");
    const [errors, setErrors] = useState({});
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    
  

    const [formData, setFormData] = useState({
        anamnese: [],
        caracteristicasLesao: {
            selecionadas: [],
            descricao: "",
            cor: "",
            consistencia: "",
            bordas: "",
            ulceracao: "",
            dorPalpacao: "",
            temperaturaLocal: "",
            relacaoTecidosVizinhos: ""
        },
        citologia: {
            descricao: "",
            metodo: "",
            numeroLaminas: "",
            resultado: "",
            conclusao: "",
            comentarios: ""
        }

        
    });
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
        setLoading(false); // Alterar o estado para falso após o carregamento
    }, []);

    useEffect(() => {
        const storedData = localStorage.getItem("formData");
        if (storedData) {
            try {
                setFormData(JSON.parse(storedData));
            } catch (error) {
                console.error("Erro ao carregar os dados do localStorage", error);
            }
        }
    }, []);

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
    
        setFormData((prev) => {
            if (prev.caracteristicasLesao.hasOwnProperty(name)) {
                return {...prev,caracteristicasLesao: {...prev.caracteristicasLesao,[name]: value}};
            }return prev;
        });
        if (name.startsWith("citologia.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                citologia: {...prev.citologia,[field]: value}}));return;
        }
        setFormData((prev) => ({...prev,[name]: value}));
    };

    const handleCheckboxChange = (event, field, setShowOtherInput, setOtherValue) => {
        const { value, checked } = event.target;
    
        if (value === "Outros(s):") {
            setShowOtherInput(checked);
            if (!checked) setOtherValue(""); // Limpa o valor se desmarcar
        }
    
        setFormData((prev) => {
            if (field === "anamnese") {
                return { 
                    ...prev, 
                    anamnese: checked 
                        ? [...prev.anamnese, value] 
                        : prev.anamnese.filter((item) => item !== value) 
                };
            }
            
            if (field === "caracteristicasLesao") {
                return { 
                    ...prev, 
                    caracteristicasLesao: { 
                        ...prev.caracteristicasLesao, 
                        selecionadas: checked 
                            ? [...prev.caracteristicasLesao.selecionadas, value] 
                            : prev.caracteristicasLesao.selecionadas.filter((item) => item !== value) 
                    } 
                };
            }
    
            return prev;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
    
        let anamneseFinal = [...formData.anamnese];
        let caracteristicasFinal = [...formData.caracteristicasLesao.selecionadas];
    
        // Se "Outros(s):" estiver selecionado e houver um valor digitado, substitui no array
        if (anamneseFinal.includes("Outros(s):") && otherValue.trim() !== "") {
            anamneseFinal = anamneseFinal.filter(item => item !== "Outros(s):");
            anamneseFinal.push(otherValue.trim());
        }
        // Se "Outros(s):" estiver selecionado e houver um valor digitado, substitui no array
        if (caracteristicasFinal.includes("Outros(s):") && otherValueLesao.trim() !== "") {
            caracteristicasFinal = caracteristicasFinal.filter(item => item !== "Outros(s):");
            caracteristicasFinal.push(otherValueLesao.trim());
        }
    
        const fichaData = {
            nome: "Ficha clínico médica de retorno",
            conteudo: {
                Anamnese: anamneseFinal, // Agora já corrigido
                caracteristicasLesao: { selecionadas: caracteristicasFinal }, // Corrigido aqui
                citologia: formData.citologia
            },
            dataHora: dataFormatada 
        };
    
        try {
            console.log(fichaData);
            await createFicha(fichaData);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            setShowErrorAlert(true);
        }
    };
    
    

    

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Solicitação de Citologia</h1>
            
            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
                    
                    <h1 className={styles.title}>Método de colheita</h1>
                    <div className={styles.anamnesecontainer}>
                        {["PAAF", "Swab", "Capilaridade", "Imprint", "Escarificação", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.anamnese.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "anamnese", setShowOtherInput, setOtherValue)}
                                /> 
                                {item}
                            </label>
                        ))}
                    </div>
                    {showOtherInput && (
                    <input
                        type="text"
                        placeholder="Digite aqui..."
                        value={otherValue}
                        onChange={(e) => setOtherValue(e.target.value)}
                    />
                    )}

                    {/* CARACTERÍSTICAS DA LESÃO / MATERIAL */}
                    <h1 className={styles.title}>Características da Lesão / Material</h1>
                    <div className={styles.anamnesecontainer}>
                        {["Nódulo", "Pápula", "Vesícula", "Tumefação", "Tumoração", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.caracteristicasLesao.selecionadas.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "caracteristicasLesao", setShowOtherInputLesao, setOtherValueLesao)}
                                /> 
                                {item}
                            </label>
                        ))}
                    </div>
                    
                    {showOtherInputLesao && (
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            value={otherValueLesao}
                            onChange={(e) => setOtherValueLesao(e.target.value)}
                        />
                    )}

                    {/* CAMPOS DE TEXTO E SELECTS DENTRO DE CARACTERISTICASLESAO */}
                    <div className={styles.fieldsContainer}>
                        <div className={styles.column}>
                            <label>Descrição:</label>
                            <input
                                type="text"
                                name="descricao"
                                value={formData.caracteristicasLesao.descricao}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Cor:</label>
                            <input
                                type="text"
                                name="cor"
                                value={formData.caracteristicasLesao.cor}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Consistência:</label>
                            <input
                                type="text"
                                name="consistencia"
                                value={formData.caracteristicasLesao.consistencia}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Bordas:</label>
                            <input
                                type="text"
                                name="bordas"
                                value={formData.caracteristicasLesao.bordas}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* NOVOS SELECTS "SIM" OU "NÃO" */}
                    <div className={styles.fieldsContainer}>
                        <div className={styles.column}>
                            <label>Ulceração:</label>
                            <select
                                name="ulceracao"
                                value={formData.caracteristicasLesao.ulceracao}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </div>

                        <div className={styles.column}>
                            <label>Dor à palpação:</label>
                            <select
                                name="dorPalpacao"
                                value={formData.caracteristicasLesao.dorPalpacao}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="Si">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </div>

                        <div className={styles.column}>
                            <label>Temperatura local:</label>
                            <select
                                name="temperaturaLocal"
                                value={formData.caracteristicasLesao.temperaturaLocal}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="elevada">elevada</option>
                                <option value="Normal">Normal</option>
                            </select>
                        </div>

                        <div className={styles.column}>
                            <label>Relação com os tecidos vizinhos:</label>
                            <select
                                name="relacaoTecidosVizinhos"
                                value={formData.caracteristicasLesao.relacaoTecidosVizinhos}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="Móvel">móvel</option>
                                <option value="Fixo">Fixo</option>
                            </select>
                        </div>
                         {/* CAMPOS PARA CITOLGIA */}
                    <h1 className={styles.title}>Citologia</h1>
                    <div className={styles.fieldsContainer}>
                        <div className={styles.column}>
                            <label>Descrição:</label>
                            <input
                                type="text"
                                name="citologia.descricao"
                                value={formData.citologia.descricao}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Método:</label>
                            <input
                                type="text"
                                name="citologia.metodo"
                                value={formData.citologia.metodo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Número de Lâminas:</label>
                            <input
                                type="number"
                                name="citologia.numeroLaminas"
                                value={formData.citologia.numeroLaminas}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Resultado:</label>
                            <input
                                type="text"
                                name="citologia.resultado"
                                value={formData.citologia.resultado}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Conclusão:</label>
                            <input
                                type="text"
                                name="citologia.conclusao"
                                value={formData.citologia.conclusao}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Comentários:</label>
                            <textarea
                                name="citologia.comentarios"
                                value={formData.citologia.comentarios}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>Continuar</button>
                </form>

                {<Alert message="Ficha criada com sucesso!" show={showAlert} url={'/fichaSolicitacaoCitologia'} />}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
                
            </div>
        </div>
    );
}

export default FichaSolicitacaoCitologia;