import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { createFicha } from '../../../../services/fichaService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import FinalizarFichaModal from "../FinalizarFichaModal";
import { CancelarWhiteButton } from "../../WhiteButton";
import DrawingModal from "@/components/Fichas/DrawingModal";

function FichaSolicitacaoCitologia() {

    const [showAlert, setShowAlert] = useState(false);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherValue, setOtherValue] = useState("");
    const [showOtherInputLesao, setShowOtherInputLesao] = useState(false);
    const [otherValueLesao, setOtherValueLesao] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [showDrawingModal, setShowDrawingModal] = useState(false);
    const dimensoesImagem = { largura: 700, altura: 360 };
    const [imagemDesenhada, setImagemDesenhada] = useState(null);
    const [consultaId, setConsultaId] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        anamnese: [],
        dataColheita: "",
        historicoExameFisico: "",
        localizacaoLesao: "",
        imagemLesao:{
            imagem:"", // string base64 (PNG)
            linhasDesenhadas: [],
          },
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

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("SolicitacaoCitologiaFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []); 

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("SolicitacaoCitologiaFormData", JSON.stringify(formData));
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

    const handleSaveDrawing = (imagemFinal, linhasDesenhadas) => {
        setFormData(prev => ({
          ...prev,
          imagemLesao: {
            imagem: imagemFinal,                // string base64 (PNG)
            linhasDesenhadas: linhasDesenhadas // array com dados dos traços
          }
        }));
        setImagemDesenhada(imagemFinal); // Atualiza o estado da imagem desenhada
    };  

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        // Verifica se o nome do campo contém pontos (caminho aninhado)
        if (name.includes(".")) {
            const nameParts = name.split(".");
            setFormData((prev) => {
                const updatedFormData = { ...prev };
                let current = updatedFormData;
                // Percorre o caminho e atualiza o valor no objeto aninhado
                for (let i = 0; i < nameParts.length - 1; i++) {
                    current = current[nameParts[i]];
                }
                current[nameParts[nameParts.length - 1]] = value;
                return updatedFormData;
            });
        } else {
            // Caso o campo não seja aninhado, trata diretamente
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
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
            nome: "Ficha de solicitação de citologia",
            conteudo: {
                Anamnese: anamneseFinal, 
                dataColheita: formData.dataColheita,
                historicoExameFisico: formData.historicoExameFisico,
                localizacaoLesao: formData.localizacaoLesao,
                imagemLesao: formData.imagemLesao,
                caracteristicasLesao: { 
                    ...formData.caracteristicasLesao, // Mantém os outros campos
                    selecionadas: caracteristicasFinal //sobrescreve o campo selecionados
                }, 
                citologia: formData.citologia
            },
            dataHora: dataFormatada 
        };
    
        try {
            const resultado = await createFicha(fichaData);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("SolicitacaoCitologiaFormData");
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            setShowErrorAlert(true);
        }
    };

    const cleanLocalStorage = () => {
        localStorage.removeItem("SolicitacaoCitologiaFormData");
    }

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Solicitação de Citologia</h1>
            
            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>

                    
                    <div className={styles.column}>
                        <label>Data da colheita</label>
                        <input
                            type="date"
                            name="dataColheita"
                            value={formData.dataColheita}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.column}>
                        <label>Histórico/Exame físico:</label>
                        <input
                            type="text"
                            name="historicoExameFisico"
                            value={formData.historicoExameFisico}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className={styles.column}>
                        <label>Localização da lesão:</label>
                        <input
                            type="text"
                            name="localizacaoLesao"
                            value={formData.localizacaoLesao}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.column}>
                        <label>Descrição das lesões:
                            <div 
                                onClick={() => setShowDrawingModal(true)}
                                style={{cursor: 'pointer', textAlign: 'center'}}
                            >
                                {imagemDesenhada ? (
                                    <img 
                                    src={imagemDesenhada} 
                                    alt="Localização das lesões com marcações" 
                                    style={{maxWidth: '500px'}}
                                    />
                                ) : (
                                    <img
                                    src="/images/localizacao_lesao_citologia.png"
                                    alt="Localização das lesões"
                                    style={{ maxWidth: '500px'}}
                                    />
                                )}
                                <p style={{color: 'black'}}>Clique para desenhar sobre a imagem</p>
                            </div>
                        </label>
                    </div>

                    <DrawingModal 
                        show={showDrawingModal}
                        onHide={() => setShowDrawingModal(false)}
                        backgroundImage="/images/localizacao_lesao_citologia.png"
                        onSave={handleSaveDrawing}
                        showDrawingModal={showDrawingModal}
                        dimensoesImagem={dimensoesImagem}
                    />
                    
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
                                name="caracteristicasLesao.descricao"
                                value={formData.caracteristicasLesao.descricao}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Cor:</label>
                            <input
                                type="text"
                                name="caracteristicasLesao.cor"
                                value={formData.caracteristicasLesao.cor}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Consistência:</label>
                            <input
                                type="text"
                                name="caracteristicasLesao.consistencia"
                                value={formData.caracteristicasLesao.consistencia}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Bordas:</label>
                            <input
                                type="text"
                                name="caracteristicasLesao.bordas"
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
                                name="caracteristicasLesao.ulceracao"
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
                                name="caracteristicasLesao.dorPalpacao"
                                value={formData.caracteristicasLesao.dorPalpacao}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </div>

                        <div className={styles.column}>
                            <label>Temperatura local:</label>
                            <select
                                name="caracteristicasLesao.temperaturaLocal"
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
                                name="caracteristicasLesao.relacaoTecidosVizinhos"
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
                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage}/>
                        < FinalizarFichaModal onConfirm={handleSubmit} />
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
    );
}

export default FichaSolicitacaoCitologia;