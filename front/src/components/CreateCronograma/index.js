import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import MedicoList from "@/hooks/useMedicoList";
import { createCronograma } from "../../../services/cronogramaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function CreateCronograma() {
    const router = useRouter();
    const {id} = router.query;

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");

    const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
    const [selectedMedico, setSelectedMedico] = useState(id);

    const [cronograma, setCronograma] = useState({
        nome: "",
        tempoAtendimento: null,
        horariosJson: {},
        medico: { id: null },
        especialidade: { id: null }
    });

    const [diasDaSemana, setDiasDaSemana] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false
    });

    const { especialidades } = EspecialidadeList();
    const { medicos } = MedicoList();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario")) {
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

    const handleDiasDaSemanaChange = (dia) => {
        setDiasDaSemana(prevState => ({
            ...prevState,
            [dia]: !prevState[dia]
        }));
    };

    const handleHorarioChange = (dia, campo) => (event) => {
        const { value } = event.target;
        setCronograma(prevCronograma => ({
            ...prevCronograma,
            horariosJson: {
                ...prevCronograma.horariosJson,
                [dia]: {
                    ...prevCronograma.horariosJson[dia],
                    [campo]: value
                }
            }
        }));
    };

    const handleCronogramaChange = (event) => {
        const { name, value } = event.target;
        setCronograma({ ...cronograma, [name]: value });
    };
    console.log("cronograma:", cronograma);

    const handleEspecialidadeSelection = (event) => {
        const selectedEspecialidadeId = event.target.value;
        setSelectedEspecialidade(selectedEspecialidadeId);
    };
    
    const handleMedicoSelection = (event) => {
        const selectedMedicoId = event.target.value;
        setSelectedMedico(selectedMedicoId);
    };

    console.log("medico", selectedMedico);

    const validateFields = (cronograma) => {
        const errors = {};
        if (!cronograma.nome) {
            errors.nome = "Campo obrigatório";
        }
        if (!cronograma.tempoAtendimento) {
            errors.tempoAtendimento = "Campo obrigatório";
        }
        if (selectedEspecialidade === null) {
            errors.selectedEspecialidade = "Campo obrigatório";
        }
        if (selectedMedico === null) {
            errors.selectedMedico = "Campo obrigatório";
        }

        return errors;
    };


    const handleCreateCronograma = async () => {
        const validationErrors = validateFields(cronograma);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const diasSelecionados = Object.entries(diasDaSemana)
            .filter(([_, selecionado]) => selecionado)
            .map(([dia]) => dia.toUpperCase());
        
        const horariosJson = {};
        diasSelecionados.forEach(dia => {
            if (cronograma.horariosJson[dia]) {
                horariosJson[dia] = cronograma.horariosJson[dia]; 
            } else {
                horariosJson[dia] = {
                    inicio: "00:00",
                    fim: "00:00"
                };
            }
        });

        const cronogramaToCreate = {
            nome: cronograma.nome,
            tempoAtendimento: parseInt(cronograma.tempoAtendimento),
            horariosJson: JSON.stringify(horariosJson),
            medico: { id: parseInt(selectedMedico) },
            especialidade: { id: parseInt(selectedEspecialidade) }
        };
        console.log("cronogramaToCreate", cronogramaToCreate);

        try {
            await createCronograma(cronogramaToCreate);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar agenda:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Criar agenda</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="nome" className="form-label">Nome de agenda<span className={styles.obrigatorio}>*</span></label>
                            <input
                                placeholder="Digite o nome"
                                type="text"
                                className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
                                name="nome"
                                value={cronograma.nome}
                                onChange={handleCronogramaChange}
                            />
                            {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="especialidade" className="form-label">Especialidade<span className={styles.obrigatorio}>*</span></label>
                            <select
                                className={`form-select ${styles.input} ${errors.selectedEspecialidade ? "is-invalid" : ""}`}
                                name="especialidade"
                                aria-label="Selecione uma especialidade"
                                value={selectedEspecialidade || ""}
                                onChange={handleEspecialidadeSelection}
                            >
                                <option value="">Selecione a especialidade</option>
                                {especialidades.map((especialidade) => (
                                    <option key={especialidade.id} value={especialidade.id}>
                                        {especialidade.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.selectedEspecialidade && <div className={`invalid-feedback ${styles.error_message}`}>{errors.selectedEspecialidade}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;<span className={styles.obrigatorio}>*</span></label>
                            <select
                                className={`form-select ${styles.input} ${errors.selectedMedico ? "is-invalid" : ""}`}
                                name="medico"
                                aria-label="Selecione o(a) veterinário(a)"
                                value={selectedMedico || ""}
                                onChange={handleMedicoSelection}
                                disabled={id !== 'null' ? true : false}
                            >
                                <option value="">Selecione o(a) veterinário(a)</option>
                                {medicos.map((medico) => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.selectedMedico && <div className={`invalid-feedback ${styles.error_message}`}>{errors.selectedMedico}</div>}
                        </div>

                        <div className={`col ${styles.col}`}>
                            <label htmlFor="tempoAtendimento" className="form-label">Tempo do atendimento<span className={styles.obrigatorio}>*</span></label>
                            <input
                                placeholder="Digite o tempo em minutos"
                                type="text"
                                className={`form-control ${styles.input} ${errors.tempoAtendimento ? "is-invalid" : ""}`}
                                name="tempoAtendimento"
                                value={cronograma.tempoAtendimento}
                                onChange={handleCronogramaChange}
                            />
                            {errors.tempoAtendimento && <div className={`invalid-feedback ${styles.error_message}`}>{errors.tempoAtendimento}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className={styles.title}><h2>Horários de atendimento</h2></div>
                    </div>

                    <div className={`row ${styles.div_space}`}>
                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['Monday'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Segunda-feira
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${dia}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleDiasDaSemanaChange(dia)}
                                            />
                                        </div>
                                        {selecionado && (
                                            <div className={`col ${styles.time_container}`}>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-inicio`} className="form-label"><h6 className={styles.time}>Horário de início</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    >
                                                        <option value="">Selecione o horário de início</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    >
                                                        <option value="">Selecione o horário de fim</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['Tuesday'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Terça-feira
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${dia}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleDiasDaSemanaChange(dia)}
                                            />
                                        </div>
                                        {selecionado && (
                                            <div className={`col ${styles.time_container}`}>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-inicio`} className="form-label"><h6 className={styles.time}>Horário de início</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    >
                                                        <option value="">Selecione o horário de início</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    >
                                                        <option value="">Selecione o horário de fim</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['Wednesday'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Quarta-feira
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${dia}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleDiasDaSemanaChange(dia)}
                                            />
                                        </div>
                                        {selecionado && (
                                            <div className={`col ${styles.time_container}`}>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-inicio`} className="form-label"><h6 className={styles.time}>Horário de início</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    >
                                                        <option value="">Selecione o horário de início</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    >
                                                        <option value="">Selecione o horário de fim</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['Thursday'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Quinta-feira
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${dia}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleDiasDaSemanaChange(dia)}
                                            />
                                        </div>
                                        {selecionado && (
                                            <div className={`col ${styles.time_container}`}>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-inicio`} className="form-label"><h6 className={styles.time}>Horário de início</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    >
                                                        <option value="">Selecione o horário de início</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    >
                                                        <option value="">Selecione o horário de fim</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['Friday'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Sexta-feira
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${dia}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleDiasDaSemanaChange(dia)}
                                            />
                                        </div>
                                        {selecionado && (
                                            <div className={`col ${styles.time_container}`}>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-inicio`} className="form-label"><h6 className={styles.time}>Horário de início</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    >
                                                        <option value="">Selecione o horário de início</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    >
                                                        <option value="">Selecione o horário de fim</option>
                                                        <option value="07:30">07:30</option>
                                                        <option value="08:30">08:30</option>
                                                        <option value="09:30">09:30</option>
                                                        <option value="10:30">10:30</option>
                                                        <option value="11:30">11:30</option>
                                                        <option value="12:30">12:30</option>
                                                        <option value="13:30">13:30</option>
                                                        <option value="14:30">14:30</option>
                                                        <option value="15:30">15:30</option>
                                                        <option value="16:30">16:30</option>
                                                        <option value="17:30">17:30</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                       
                    </div> 
                </div>

                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleCreateCronograma}>
                        Criar
                    </button>
                </div>

            </form>
            {<Alert message="Agenda criada com sucesso!" show={showAlert} url={`/getAllCronograma/${selectedMedico}`} />}   
            {showErrorAlert && <ErrorAlert message="Erro ao criar agenda, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateCronograma;
