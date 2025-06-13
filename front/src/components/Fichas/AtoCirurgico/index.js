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
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from '../../../../services/animalService';
import { useRouter } from 'next/router';

function FichaAtoCirurgico() {
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor, setTutor] = useState({});


    const [formData, setFormData] = useState({
        descricaoAtoCirurgico: "",
        prognostico: "",
        protocolos: [
            { medicacao: "", dose: "", frequencia: "", periodo: "" }
        ],
        reavaliacao: "",
        equipeResponsavel: "",
        nomeDaCirurgia: "",
        data: "",
        medicosResponsaveis: "",
    });

    const [consultaId, setConsultaId] = useState(null);

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("fichaAtoCirurgicoFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []);

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("fichaAtoCirurgicoFormData", JSON.stringify(formData));
        }
    }, [formData]);

    useEffect(() => {
        if (router.isReady) {
            const id = router.query.fichaId;
            if (id) {
                setConsultaId(id);
                console.log("ID da ficha:", id);
            }
        }
    }, [router.isReady, router.query.fichaId]);

    const { protocolos = [] } = formData;

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

    useEffect(() => {
        if (router.isReady) {
            const id = router.query.fichaId;
            const animalId = router.query.animalId;
            if (id) {
                setConsultaId(id);
            }
            if (animalId) {
                setAnimalId(animalId);
            }
        }
    }, [router.isReady, router.query.fichaId]);

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

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

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
        event?.preventDefault();
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
        const fichaData = {
            nome: "Ficha de ato cirúrgico",
            conteudo: {
                descricaoAtoCirurgico: formData.descricaoAtoCirurgico,
                prognostico: formData.prognostico,
                protocolos: formData.protocolos,
                reavaliacao: formData.reavaliacao,
                equipeResponsavel: formData.equipeResponsavel,
                data: formData.data,
                nomeDaCirurgia: formData.nomeDaCirurgia,
                medicosResponsaveis: formData.medicosResponsaveis,

            },
            dataHora: dataFormatada
        };

        console.log("Ficha enviada:", fichaData);

        try {
            const resultado = await createFicha(fichaData);
            console.log("Resposta da api", resultado.id);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("fichaAtoCirurgicoFormData");
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            if (error.response && error.response.data && error.response.data.code) {
                setErrorMessage(error.response.data.message);
            }
            setShowErrorAlert(true);
        }
    };

    const handleChangeTratamentos = (index, campo, valor) => {
        setFormData((prev) => {
            const novosTratamentos = [...prev.protocolos];
            novosTratamentos[index][campo] = valor;

            return {
                ...prev,
                protocolos: novosTratamentos
            };
        });
    };

    const adicionarLinhaTratamento = () => {
        setFormData((prev) => ({
            ...prev,
            protocolos: [
                ...prev.protocolos,
                { medicacao: "", dose: "", frequencia: "", periodo: "" }
            ]
        }));
    };

    const removerUltimaLinhaTratamento = () => {
        setFormData((prev) => {
            const tratamentos = prev.protocolos;
            if (tratamentos.length > 1) {
                return {
                    ...prev,
                    protocolos: tratamentos.slice(0, -1),
                };
            }
            return prev;
        });
    };

    const cleanLocalStorage = () => {
        localStorage.removeItem("fichaAtoCirurgicoFormData");
    }

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de ato cirúrgico </h1>

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

                    <div className={styles.titulo}>
                        Descrição do ato cirúrgico
                    </div>

                    <div className={styles.column}>
                        <textarea id="caixa-alta" name="descricaoAtoCirurgico"
                            value={formData.descricaoAtoCirurgico}
                            onChange={handleChange} />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.column}>
                            <label>Nome da Cirurgia</label>
                            <textarea name="nomeDaCirurgia" value={formData.nomeDaCirurgia} onChange={handleChange} />
                        </div>
                        <div className={styles.column}>
                            <label>Data</label>
                            <input
                                type="date" name="data" value={formData.data} onChange={handleChange}

                            />
                        </div>
                    </div>

                    <div className={styles.titulo}>
                        Prognóstico pós cirúrgico
                    </div>

                    <div className={styles.column}>
                        <label>Prognóstico</label>
                        <select id="meia-caixa" name="prognostico" value={formData.prognostico} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="FAVORAVEL">Favorável</option>
                            <option value="RESERVADO">Reservado</option>
                            <option value="DESFAVORAVEL">Desfavorável</option>
                        </select>
                    </div>

                    <div className={styles.column}>
                        <label>Protocolos terapêuticos a serem instituidos</label>
                        <table className={styles.tabela_tratamento}>
                            <thead>
                                <tr>
                                    <th id="medicacao"> Medicação</th>
                                    <th>Dose</th>
                                    <th>Frequência</th>
                                    <th>Período</th>
                                </tr>
                            </thead>
                            <tbody>
                                {protocolos.map((linha, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                value={linha.medicacao}
                                                onChange={(e) => handleChangeTratamentos(index, "medicacao", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={linha.dose}
                                                onChange={(e) => handleChangeTratamentos(index, "dose", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={linha.frequencia}
                                                onChange={(e) => handleChangeTratamentos(index, "frequencia", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={linha.periodo}
                                                onChange={(e) => handleChangeTratamentos(index, "periodo", e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.bolha_container}>
                            <div className={styles.bolha} onClick={adicionarLinhaTratamento}>
                                +
                            </div>
                            <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaLinhaTratamento}>
                                -
                            </div>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <label>Retorno para reavaliações</label>
                        <textarea name="reavaliacao" value={formData.reavaliacao} onChange={handleChange} rows="4" cols="50" />
                    </div>
                    <div className={styles.column}>
                        <label>Plantonista(s) discente(s): </label>
                        <textarea name="equipeResponsavel" value={formData.equipeResponsavel} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Médico(s) Veterinário(s) Responsável:</label>
                        <textarea name="medicosResponsaveis" value={formData.medicosResponsaveis} onChange={handleChange} />
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage} />
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

export default FichaAtoCirurgico;