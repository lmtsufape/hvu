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

    const { especialidades } = EspecialidadeList();

    const [vagasData, setVagasData] = useState({
        data: "",
        turnoManha: [],
        turnoTarde: [],
    });

    const handleVagasChange = (numVaga) => {
        setVagas(prevState => ({
            ...prevState,
            [numVaga]: !prevState[numVaga]
        }));
    };

    const adicionarAoTurnoManha = (numVaga, especialidadeId, tipoConsultaId) => {
        handleVagasChange(numVaga);
    
        const novoObjeto = {
            especialidade: { id: especialidadeId },
            tipoConsulta: { id: tipoConsultaId }
        };
    
        // Atualiza o estado, adicionando o novo objeto à lista de turnoManha
        setVagasData(prevState => ({
            ...prevState,
            turnoManha: [...prevState.turnoManha, novoObjeto]
        }));
    };

    const adicionarAoTurnoTarde = () => {
        const novoObjeto = {
        especialidade: { id: 1 },
        tipoConsulta: { id: 1 }
    };

    // Atualiza o estado, adicionando o novo objeto à lista de turnoTarde
    setVagasData(prevState => ({
        ...prevState,
        turnoTarde: [...prevState.turnoTarde, novoObjeto]
        }));
    };

    const [vagas, setVagas] = useState({
        vaga1: false,
        vaga2: false,
        vaga3: false,
        vaga4: false,
        vaga5: false,
        vaga6: false,
        vaga7: false,
        vaga8: false
    });

    const handleVagasDataChange = (event) => {
        const { name, value } = event.target;
        setVagasData({ ...vagasData, [name]: value });
    };
    console.log("vagasData:", vagasData);


    const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
    const handleEspecialidadeSelection = (event) => {
        const selectedEspecialidadeId = event.target.value;
        setSelectedEspecialidade(selectedEspecialidadeId);
    };
    console.log("selectedEspecialidade", selectedEspecialidade);

    const { tiposConsulta } = TipoConsultaList();
    const [selectedTipoConsulta, setSelectedTipoConsulta] = useState(null);
    const handleTipoConsultaSelection = (event) => {
        const selectedTipoConsultaId = event.target.value;
        setSelectedTipoConsulta(selectedTipoConsultaId);
    };
    console.log("selectedTipoConsulta", selectedTipoConsulta);


    const handleCreateVagas = async () => {
        const vagasToCreate = {
            data: vagasData.data,
            turnoManha: vagasData.turnoManha,
            turnoTarde: vagasData.turnoTarde,
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
                            name="data"
                            value={vagasData.data}
                            onChange={handleVagasDataChange}
                        />
                    </div>
                </div>

                <div className={styles.inputs_box}>

                    <div className="row">
                        <div className={styles.title}><h2>Turno manhã:</h2></div>
                    </div>

                    <div className={`row ${styles.div_space}`}>
                        <div className="col">
                        {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga1'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 1
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => adicionarAoTurnoManha(numVaga, selectedEspecialidade, selectedTipoConsulta)}
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
                                                        value={selectedEspecialidade || ''}
                                                        onChange={(event) => handleEspecialidadeSelection(event)}
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
                                                        value={selectedTipoConsulta || ''}
                                                        onChange={(event) => handleTipoConsultaSelection(event)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
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
                            {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga2'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 2
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleVagasChange(numVaga)}
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
                                                                {tipoConsulta.tipo}
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
                            {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga3'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 3
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleVagasChange(numVaga)}
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
                                                                {tipoConsulta.tipo}
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
                            {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga4'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 4
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleVagasChange(numVaga)}
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
                                                                {tipoConsulta.tipo}
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
                            {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga5'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 5
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleVagasChange(numVaga)}
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
                                                                {tipoConsulta.tipo}
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
                            {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga6'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 6
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleVagasChange(numVaga)}
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
                                                                {tipoConsulta.tipo}
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
                            {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga7'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 7
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleVagasChange(numVaga)}
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
                                                                {tipoConsulta.tipo}
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
                            {Object.entries(vagas)
                                .filter(([numVaga]) => ['vaga8'].includes(numVaga))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <div htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 8
                                            </div>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                id={`${numVaga}-checkbox`}
                                                checked={selecionado}
                                                onChange={() => handleVagasChange(numVaga)}
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
                                                                {tipoConsulta.tipo}
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
