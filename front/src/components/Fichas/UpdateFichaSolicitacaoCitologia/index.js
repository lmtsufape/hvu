import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import FinalizarFichaModal from "../FinalizarFichaModal";
import { CancelarWhiteButton } from "../../WhiteButton";
import DrawingModal from "@/components/Fichas/DrawingModal";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from '../../../../services/animalService';
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";

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
    const [fichaId, setFichaId] = useState(null);
    const [data, setData] = useState([]);
    const router = useRouter();
    
    const [agendamentoId, setAgendamentoId] = useState(null);

    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor, setTutor] = useState({});


    const [formData, setFormData] = useState({
        anamnese: [],
        dataColheita: "",
        historicoExameFisico: "",
        localizacaoLesao: "",
        imagemLesao: {
            imagem: "", // string base64 (PNG)
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

    const { id, modo } = router.query; 
    const [isReadOnly, setIsReadOnly] = useState(false);
                          
    useEffect(() => {
              // Se o modo for 'visualizar', define o estado para somente leitura
              if (modo === 'visualizar') {
                  setIsReadOnly(true);
              }
            }, [modo]);

    useEffect(() => {
        if (router.isReady) {
            const id = router.query.consultaId;
            const animalId = router.query.animalId;
            const ficha = router.query.fichaId;
            const aId = router.query.agendamentoId; 
            if (id) {
                setConsultaId(id);
            }
            if (animalId) {
                setAnimalId(animalId);
            }
            if (aId) {
            setAgendamentoId(aId); // Armazena o ID do agendamento
             }

            if (ficha) {
                setFichaId(ficha);
            }
        }
    }, [router.isReady, router.query.consultaId]);

   useEffect(() => {
        if (!animalId) return;
        if (!fichaId) return;

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
            } 

            try {
                const formData = await getFichaById(fichaId);
                const conteudo = (JSON.parse(formData.conteudo));
                console.log("Dados da ficha:", conteudo);
                setFormData(conteudo);
                setImagemDesenhada(conteudo.imagemLesao.imagem); 
                setData(formData.dataHora);
            } catch (error) {
                console.error('Erro ao buscar dados da ficha:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [animalId, fichaId]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
        setLoading(false); // Alterar o estado para falso após o carregamento
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
        const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss");

        let anamneseFinal = Array.isArray(formData.anamnese) ? [...formData.anamnese] : [];
        let caracteristicasFinal = Array.isArray(formData.caracteristicasLesao?.selecionadas) ? [...formData.caracteristicasLesao.selecionadas] : [];

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
            await updateFicha(fichaData, fichaId);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar ficha:", error);
            setShowErrorAlert(true);
        }
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

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Solicitação de Citologia</h1>

            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
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
                                                <div  className={styles["animal-data-box"]}>
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
                                                            <p>{animal.raca && animal.raca.porte ? animal.raca && animal.raca.porte : 'Não definido'}</p>
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
                                disabled={isReadOnly}
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
                            disabled={isReadOnly}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.column}>
                        <label>Localização da lesão:</label>
                        <input
                            type="text"
                            name="localizacaoLesao"
                            value={formData.localizacaoLesao}
                            disabled={isReadOnly}
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
                        disabled={isReadOnly}
                        onSave={handleSaveDrawing}
                        showDrawingModal={showDrawingModal}
                        dimensoesImagem={dimensoesImagem}
                        linhasEditadas={formData.imagemLesao?.linhasDesenhadas}
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
                                    checked={formData.anamnese?.includes(item)}
                                    disabled={isReadOnly}
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
                            disabled={isReadOnly}
                            onChange={(e) => setOtherValue(e.target.value)}
                            className="form-control"
                        />
                    )}

                    {/* CARACTERÍSTICAS DA LESÃO / MATERIAL */}
                    <div className={styles.column}>
                        <label>Características da Lesão / Material</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {["Nódulo", "Pápula", "Vesícula", "Tumefação", "Tumoração", "Outros(s):"].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.caracteristicasLesao?.selecionadas.includes(item)}
                                    disabled={isReadOnly}
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
                            disabled={isReadOnly}
                            onChange={(e) => setOtherValueLesao(e.target.value)}
                            className="form-control"
                        />
                    )}

                    {/* CAMPOS DE TEXTO E SELECTS DENTRO DE CARACTERISTICASLESAO */}
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Descrição:</label>
                            <input
                                type="text"
                                name="caracteristicasLesao.descricao"
                                value={formData.caracteristicasLesao?.descricao}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Cor:</label>
                            <input
                                type="text"
                                name="caracteristicasLesao.cor"
                                value={formData.caracteristicasLesao?.cor}
                                disabled={isReadOnly}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>


                        <div className={styles.column}>
                            <label>Consistência:</label>
                            <input
                                type="text"
                                name="caracteristicasLesao.consistencia"
                                value={formData.caracteristicasLesao?.consistencia}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.column}>
                            <label>Bordas:</label>
                            <input
                                type="text"
                                name="caracteristicasLesao.bordas"
                                value={formData.caracteristicasLesao?.bordas}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>



                        <div className={styles.column}>
                            <label>Ulceração:</label>
                            <select
                                name="caracteristicasLesao.ulceracao"
                                value={formData.caracteristicasLesao?.ulceracao}
                                disabled={isReadOnly}
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
                                value={formData.caracteristicasLesao?.dorPalpacao}
                                disabled={isReadOnly}
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
                                value={formData.caracteristicasLesao?.temperaturaLocal}
                                disabled={isReadOnly}
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
                                value={formData.caracteristicasLesao?.relacaoTecidosVizinhos}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="Móvel">móvel</option>
                                <option value="Fixo">Fixo</option>
                            </select>
                        </div>
                    </div>
                    {/* CAMPOS PARA CITOLGIA */}
                    <h2>Citologia</h2>
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Descrição:</label>
                            <input
                                type="text"
                                name="citologia.descricao"
                                value={formData.citologia?.descricao}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Método:</label>
                            <input
                                type="text"
                                name="citologia.metodo"
                                value={formData.citologia?.metodo}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Número de Lâminas:</label>
                            <input
                                type="number"
                                name="citologia.numeroLaminas"
                                value={formData.citologia?.numeroLaminas}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Resultado:</label>
                            <input
                                type="text"
                                name="citologia.resultado"
                                value={formData.citologia?.resultado}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Conclusão:</label>
                            <input
                                type="text"
                                name="citologia.conclusao"
                                value={formData.citologia?.conclusao}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.column}>
                            <label>Comentários:</label>
                            <input
                                name="citologia.comentarios"
                                value={formData.citologia?.comentarios}
                                disabled={isReadOnly}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                    {!isReadOnly && (
                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                    )}
                </form>

                {showAlert && consultaId &&
                    <div className={styles.alert}>
                        <Alert message="Ficha editada com sucesso!"
                            show={showAlert} url={`/createConsulta/${consultaId}`} />
                    </div>}
                {showErrorAlert && (<ErrorAlert message="Erro ao editar ficha" show={showErrorAlert} />)}

            </div>
        </div>
    );
}

export default FichaSolicitacaoCitologia;