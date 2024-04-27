import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import MedicoList from "@/hooks/useMedicoList";
import { createCronograma } from "../../../services/cronogramaService";

function CreateCronograma() {
    const router = useRouter();

    const [errors, setErrors] = useState({});

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

    const { especialidades } = EspecialidadeList();
    const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
    const handleEspecialidadeSelection = (event) => {
        const selectedEspecialidadeId = event.target.value;
        setSelectedEspecialidade(selectedEspecialidadeId);
    };

    const { medicos } = MedicoList();
    const [selectedMedico, setSelectedMedico] = useState(null);
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
            alert("Agenda criada com sucesso!");
            router.push(`/getAllCronograma/${selectedMedico}`);
        } catch (error) {
            console.error("Erro ao criar agenda:", error);
            alert("Erro ao criar agenda. Por favor, tente novamente.");
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
                                                Segunda
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
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    />
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
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    />
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
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    />
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
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    />
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
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-inicio`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.inicio || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "inicio")}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <div htmlFor={`${dia}-fim`} className="form-label"><h6 className={styles.time}>Horário de fim</h6></div>
                                                    <input
                                                        type="time"
                                                        className={`form-control ${styles.input}`}
                                                        id={`${dia}-fim`}
                                                        value={cronograma.horariosJson[dia.toUpperCase()]?.fim || ""}
                                                        onChange={handleHorarioChange(dia.toUpperCase(), "fim")}
                                                    />
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
        </div>
    );
}

export default CreateCronograma;
