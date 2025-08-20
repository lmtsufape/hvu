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
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from '../../../../services/animalService';

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
    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor, setTutor] = useState({});
    const router = useRouter();
    const [agendamentoId, setAgendamentoId] = useState(null);

    const [formData, setFormData] = useState({
        anamnese: [],
        dataColheita: "",
        historicoExameFisico: "",
        localizacaoLesao: "",
        imagemLesao: {
            imagem: "",
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

    // Função para gerar uma chave única no localStorage com base no consultaId
    const getLocalStorageKey = () => `solicitacaoCitologiaFormData_${consultaId || "default"}`;
    const storageKeyDrawing = () => `citologiaDrawingLines_${consultaId || "default"}`;

    // Carrega os dados do formulário e dos campos "Outros" do localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && consultaId) {
            const savedFormData = localStorage.getItem(getLocalStorageKey());
            if (savedFormData) {
                try {
                    const parsedData = JSON.parse(savedFormData);
                    setFormData(parsedData.formData || {
                        anamnese: [],
                        dataColheita: "",
                        historicoExameFisico: "",
                        localizacaoLesao: "",
                        imagemLesao: {
                            imagem: "",
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
                    setOtherValue(parsedData.otherValue || "");
                    setOtherValueLesao(parsedData.otherValueLesao || "");
                    setShowOtherInput(parsedData.formData?.anamnese.includes("Outros(s):"));
                    setShowOtherInputLesao(parsedData.formData?.caracteristicasLesao.selecionadas.includes("Outros(s):"));
                    setImagemDesenhada(parsedData.formData?.imagemLesao.imagem || null);
                } catch (error) {
                    console.error("Erro ao carregar os dados do localStorage:", error);
                }
            }
        }
    }, [consultaId]);

    // Salva os dados do formulário e dos campos "Outros" no localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && consultaId) {
            localStorage.setItem(
                getLocalStorageKey(),
                JSON.stringify({ formData, otherValue, otherValueLesao })
            );
        }
    }, [formData, otherValue, otherValueLesao, consultaId]);

    // Obtém o ID da ficha e animal da URL
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.fichaId;
            const animalId = router.query.animalId;
            const aId = router.query.agendamentoId; 
            if (id) {
                setConsultaId(id);
            }
            if (aId) {
                setAgendamentoId(aId); 
            }
            if (animalId) {
                setAnimalId(animalId);
            }
        }
    }, [router.isReady, router.query.fichaId, router.query.animalId]);

    // Carrega os dados do animal e tutor
    useEffect(() => {
        if (!animalId) return;

        const fetchData = async () => {
            try {
                const animalData = await getAnimalById(animalId);
                setAnimal(animalData);
            } catch (error) {
                console.error('Erro ao buscar animal:', error);
            }

            try {
                const tutorData = await getTutorByAnimal(animalId);
                setTutor(tutorData);
            } catch (error) {
                console.error('Erro ao buscar tutor do animal:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [animalId]);

    // Carrega token e roles do localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
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

    const handleSaveDrawing = (imagemFinal, linhasDesenhadas) => {
        console.log("Imagem final recebida:", imagemFinal); // Debug
        console.log("Linhas desenhadas:", linhasDesenhadas); // Debug
        setFormData(prev => ({
            ...prev,
            imagemLesao: {
                imagem: imagemFinal, // Base64 da imagem com desenhos
                linhasDesenhadas: linhasDesenhadas // Array de pontos desenhados
            }
        }));
        setImagemDesenhada(imagemFinal); // Atualiza a imagem exibida no formulário
        localStorage.setItem(storageKeyDrawing, JSON.stringify(linhasDesenhadas));
    };

    const renderImagemLesao = () => {
        if (imagemDesenhada) {
            return (
                <img
                    src={imagemDesenhada}
                    alt="Localização das lesões com marcações"
                    style={{ maxWidth: '500px', border: '1px solid #ccc' }}
                />
            );
        }
        return (
            <img
                src="/images/localizacao_lesao_citologia.png"
                alt="Localização das lesões"
                style={{ maxWidth: '500px', border: '1px solid #ccc' }}
            />
        );
    };



    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name.includes(".")) {
            const nameParts = name.split(".");
            setFormData((prev) => {
                const updatedFormData = { ...prev };
                let current = updatedFormData;
                for (let i = 0; i < nameParts.length - 1; i++) {
                    current = current[nameParts[i]];
                }
                current[nameParts[nameParts.length - 1]] = value;
                return updatedFormData;
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (event, field, setShowOtherInput, setOtherValue) => {
        const { value, checked } = event.target;

        if (value === "Outros(s):") {
            setShowOtherInput(checked);
            if (!checked) setOtherValue("");
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

    const handleSubmit = async () => {
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");

        let anamneseFinal = [...formData.anamnese];
        let caracteristicasFinal = [...formData.caracteristicasLesao.selecionadas];

        if (anamneseFinal.includes("Outros(s):") && otherValue.trim() !== "") {
            anamneseFinal = anamneseFinal.filter(item => item !== "Outros(s):");
            anamneseFinal.push(otherValue.trim());
        }
        if (caracteristicasFinal.includes("Outros(s):") && otherValueLesao.trim() !== "") {
            caracteristicasFinal = caracteristicasFinal.filter(item => item !== "Outros(s):");
            caracteristicasFinal.push(otherValueLesao.trim());
        }


        const fichaData = {
            nome: "Ficha de solicitação de citologia",
            conteudo: {
                anamnese: anamneseFinal,
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
            dataHora: dataFormatada,
            agendamento: {
                id: Number(agendamentoId)
            }
        };


        try {
            const resultado = await createFicha(fichaData);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem(getLocalStorageKey());
            localStorage.removeItem(storageKeyDrawing);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            setShowErrorAlert(true);
        }
    };

    const cleanLocalStorage = () => {
        localStorage.removeItem(getLocalStorageKey());
        localStorage.removeItem(storageKeyDrawing);
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Solicitação de Citologia</h1>

            <div className={styles.form_box}>
                <form>
                    <div className={styles.box_ficha_toggle}>
                        <button
                            type="button"
                            className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
                            onClick={() => setShowButtons(prev => !prev)}
                        >
                            Dados do animal
                        </button>
                        {showButtons && (
                            <div className={styles.container_toggle}>
                                <ul>
                                    {animal && (
                                        <li key={animal.id} className={styles.infos_box}>
                                            <div className={styles.identificacao}>
                                                <div className={styles.nome_animal}>{animal.nome}</div>
                                                <div className={styles.especie_animal}>Nome</div>
                                            </div>
                                            <div className={styles.form}>
                                                <div className={styles["animal-data-box"]}>
                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Espécie</h6>
                                                            <p>{animal.raca && animal.raca.especie && animal.raca.especie.nome}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Sexo</h6>
                                                            <p>{animal.sexo}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Peso</h6>
                                                            <p>{animal.peso === 0 || animal.peso === '' ? 'Não definido' : animal.peso}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Raça</h6>
                                                            <p>{animal.raca && animal.raca.nome}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Porte</h6>
                                                            <p>{animal.raca && animal.raca.porte ? animal.raca.porte : 'Não definido'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Data de nascimento</h6>
                                                            <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : 'Não definida'}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Alergias</h6>
                                                            <p>{animal.alergias ? animal.alergias : 'Não definidas'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Número da ficha</h6>
                                                            <p>{animal.numeroFicha ? animal.numeroFicha : 'Não definido'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Tutor</h6>
                                                            <p>{tutor.nome ? tutor.nome : 'Não definido'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Data da colheita</label>
                            <input
                                type="date"
                                name="dataColheita"
                                value={formData.dataColheita}
                                onChange={handleChange}
                            />
                        </div>
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
                        <label>Descrição das lesões:</label>
                        <div
                            onClick={() => setShowDrawingModal(true)}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            {renderImagemLesao()}
                            <p style={{ color: 'black' }}>Clique para desenhar sobre a imagem</p>
                        </div>
                    </div>

                    <DrawingModal
                        show={showDrawingModal}
                        onHide={() => setShowDrawingModal(false)}
                        backgroundImage="/images/localizacao_lesao_citologia.png"
                        onSave={handleSaveDrawing}
                        showDrawingModal={showDrawingModal}
                        dimensoesImagem={dimensoesImagem}
                        linhasEditadas={formData.imagemLesao.linhasDesenhadas}
                        storageKeyDrawing={storageKeyDrawing}
                    />

                    <div className={styles.column}>
                        <label>Método de colheita</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {["PAAF", "Swab", "Capilaridade", "Imprint", "Escarificação", "Outros(s):"].map((item) => (

                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.anamnese.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "anamnese", setShowOtherInput, setOtherValue)}
                                    className="form-control"
                                />
                                {item}
                            </label>
                        ))}

                        {showOtherInput && (
                            <input
                                type="text"
                                placeholder="Digite aqui..."
                                value={otherValue}
                                onChange={(e) => setOtherValue(e.target.value)}
                                className="form-control"
                            />
                        )}
                    </div>

                    <div className={styles.column}>
                        <label>Características da Lesão / Material</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {["Nódulo", "Pápula", "Vesícula", "Tumefação", "Tumoração", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.caracteristicasLesao.selecionadas.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "caracteristicasLesao", setShowOtherInputLesao, setOtherValueLesao)}
                                    className="form-control"
                                />
                                {item}
                            </label>
                        ))}

                        {showOtherInputLesao && (
                            <input
                                type="text"
                                placeholder="Digite aqui..."
                                value={otherValueLesao}
                                onChange={(e) => setOtherValueLesao(e.target.value)}
                                className="form-control"
                            />
                        )}
                    </div>

                    <div className={styles.box}>
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
                                className="form-control"
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
                                <option value="elevada">Elevada</option>
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
                                <option value="Móvel">Móvel</option>
                                <option value="Fixo">Fixo</option>
                            </select>
                        </div>
                    </div>

                    <h2>Citologia</h2>
                    <div className={styles.box}>
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
                            <input
                                name="citologia.comentarios"
                                value={formData.citologia.comentarios}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.button_box}>
                        <CancelarWhiteButton onClick={cleanLocalStorage} />
                        <FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>

                {showAlert && consultaId && (
                    <div className={styles.alert}>
                        <Alert
                            message="Ficha criada com sucesso!"
                            show={showAlert}
                            url={`/createConsulta/${consultaId}`}
                        />
                    </div>
                )}
                {showErrorAlert && <ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />}
            </div>
        </div>
    );
}

export default FichaSolicitacaoCitologia;