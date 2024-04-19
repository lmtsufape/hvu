import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import TipoConsultaList from "@/hooks/useTipoConsultaList";
import { createVagaNormal } from "../../../services/vagaService";

function GerenciarVagas() {
    const router = useRouter();

    const [vagas, setVagas] = useState({
        data: "",
        turnoManha: [],
        turnoTarde: [],
    });

    const [diasDaSemana, setDiasDaSemana] = useState({
        vaga1: false,
        vaga2: false,
        vaga3: false,
        vaga4: false,
        vaga5: false,
        vaga6: false,
        vaga7: false,
        vaga8: false
    });

    const handleDiasDaSemanaChange = (dia) => {
        setDiasDaSemana(prevState => ({
            ...prevState,
            [dia]: !prevState[dia]
        }));
    };

    const handleHorarioChange = (dia, campo) => (event) => {
        const { value } = event.target;
        setVagas(prevVagas => ({
            ...prevVagas,
            horariosJson: {
                ...prevVagas.horariosJson,
                [dia]: {
                    ...prevVagas.horariosJson[dia],
                    [campo]: value
                }
            }
        }));
    };

    const handleVagasChange = (event) => {
        const { name, value } = event.target;
        setVagas({ ...vagas, [name]: value });
    };
    console.log("vagas:", vagas);

    const { especialidades } = EspecialidadeList();
    const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
    const handleEspecialidadeSelection = (event) => {
        const selectedEspecialidadeId = event.target.value;
        setSelectedEspecialidade(selectedEspecialidadeId);
    };

    const { tiposConsulta } = TipoConsultaList();
    const [selectedTipoConsulta, setSelectedTipoConsulta] = useState(null);
    const handleTipoConsultaSelection = (event) => {
        const selectedTipoConsultaId = event.target.value;
        setSelectedTipoConsulta(selectedTipoConsultaId);
    };

    console.log("selectedTipoConsulta", selectedTipoConsulta);


    const handleCreateVagas = async () => {
        const turnoManha = Object.entries(diasDaSemana)
            .filter(([dia, selecionado]) => selecionado && dia.startsWith('vaga'))
            .map(([dia]) => ({
                especialidade: { id: 1 }, // Aqui você pode ajustar conforme necessário
                tipoConsulta: { id: 1 } // Aqui você pode ajustar conforme necessário
            }));

        const turnoTarde = Object.entries(diasDaSemana)
            .filter(([dia, selecionado]) => selecionado && dia.startsWith('vaga'))
            .map(([dia]) => ({
                especialidade: { id: 1 }, // Aqui você pode ajustar conforme necessário
                tipoConsulta: { id: 2 } // Aqui você pode ajustar conforme necessário
            }));

        const vagasToCreate = {
            data: vagas.data,
            turnoManha: turnoManha,
            turnoTarde: turnoTarde,
        };

        try {
            await createVagaNormal(vagasToCreate);
            alert("Vagas criada com sucesso!");
            router.push(`/agendamentosDia`);
        } catch (error) {
            console.error("Erro ao criar vagas:", error);
            alert("Erro ao criar vagas. Por favor, tente novamente.");
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Criar agenda</h1>
            <form className={styles.inputs_container}>
                
                <div className={styles.inputs_box}>
                    <div className={`col ${styles.col}`}>
                        <label htmlFor="data" className="form-label">Data</label>
                        <input
                            placeholder="Digite a data"
                            type="date"
                            className={`form-control ${styles.input}`}
                            name="nome"
                            value={vagas.nome}
                            onChange={handleVagasChange}
                        />
                    </div>
                </div>

                <div className={styles.inputs_box}>

                    <div className="row">
                        <div className={styles.title}><h2>Turno manhã:</h2></div>
                    </div>

                    <div className={`row ${styles.div_space}`}>
                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga1'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 1
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga2'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 2
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga3'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 3
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga4'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 4
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                        
                       
                    </div> 
                </div>

                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={styles.title}><h2>Turno tarde:</h2></div>
                    </div>

                    <div className={`row ${styles.div_space}`}>
                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga5'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 5
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga6'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 6
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga7'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 7
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="col">
                            {Object.entries(diasDaSemana)
                                .filter(([dia]) => ['vaga8'].includes(dia))
                                .map(([dia, selecionado]) => (
                                    <div key={dia}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${dia}-checkbox`} className="form-label">
                                                Vaga 8
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
                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
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
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="tipoConsulta" className="form-label">Tipo de consulta</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="tipoConsulta"
                                                        aria-label="Selecione um tipo de consulta"
                                                        value={selectedTipoConsulta || ""}
                                                        onChange={handleTipoConsultaSelection}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.nome}
                                                            </option>
                                                        ))}
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
                    <button type="button" className={styles.criar_button} onClick={handleCreateVagas}>
                        Criar
                    </button>
                </div>

            </form>
        </div>
    );
}

export default GerenciarVagas;
