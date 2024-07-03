import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import TipoConsultaList from "@/hooks/useTipoConsultaList";
import MedicoList from "@/hooks/useMedicoList";
import { createVagaNormal } from "../../../services/vagaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function GerenciarVagas() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const { especialidades } = EspecialidadeList();
    const { tiposConsulta } = TipoConsultaList();
    const { medicos } = MedicoList();

    const [data, setData] = useState("");

    const handleVagasChange = (numVaga) => {
        setVagas(prevState => ({
            ...prevState,
            [numVaga]: !prevState[numVaga]
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

    const handleDataChange = (event) => {
        setData(event.target.value);
    };
    /*console.log("data:", data);*/


    const [selectedEspecialidade, setSelectedEspecialidade] = useState(new Array(8).fill(''));

    const handleEspecialidadeSelection = (event, position) => {
        const selectedEspecialidadeId = event.target.value;
        setSelectedEspecialidade(prevSelectedEspecialidade => {
            const updatedSelectedEspecialidade = [...prevSelectedEspecialidade];
            updatedSelectedEspecialidade[position] = selectedEspecialidadeId;
            return updatedSelectedEspecialidade;
        });
    };
    /*console.log("selectedEspecialidade", selectedEspecialidade);*/


    const [selectedTipoConsulta, setSelectedTipoConsulta] = useState(new Array(8).fill(''));

    const handleTipoConsultaSelection = (event, position) => {
        const selectedTipoConsultaId = event.target.value;
        setSelectedTipoConsulta(prevSelectedTipoConsulta => {
            const updatedSelectedTipoConsulta = [...prevSelectedTipoConsulta];
            updatedSelectedTipoConsulta[position] = selectedTipoConsultaId;
            return updatedSelectedTipoConsulta;
        });
    };
    /*console.log("selectedTipoConsulta", selectedTipoConsulta);*/

    const [selectedMedico, setSelectedMedico] = useState(new Array(8).fill(''));

    const handleMedicoSelection = (event, position) => {
        const selectedMedicoId = event.target.value;
        setSelectedMedico(prevSelectedMedico => {
            const updatedSelectedMedico = [...prevSelectedMedico];
            updatedSelectedMedico[position] = selectedMedicoId;
            return updatedSelectedMedico;
        });
    };
   /* console.log("selectedMedico", selectedMedico); */

    const validateFields = (agendamento) => {
        const errors = {};
        if (!data) {
            errors.data = "Campo obrigatório";
        }
        return errors;
    };

    const criarJSON = () => {
        const turnoManha = [];
        const turnoTarde = [];

        for (let i = 0; i < selectedEspecialidade.length; i++) {
            const especialidadeId = selectedEspecialidade[i];
            const tipoConsultaId = selectedTipoConsulta[i];
            const medicoId = selectedMedico[i];

            // Verifica se os IDs são diferentes de 0 antes de adicionar ao JSON
            if (especialidadeId !== '' && tipoConsultaId !== '' && medicoId !== '') {
                const objeto = {
                    especialidade: { id: especialidadeId },
                    tipoConsulta: { id: tipoConsultaId },
                    medico: { id: medicoId }
                };

                if (i < 4) {
                    turnoManha.push(objeto);
                } else {
                    turnoTarde.push(objeto);
                }
            }
        }

        const jsonData = {
            data: data,
            turnoManha: turnoManha,
            turnoTarde: turnoTarde
        };

        return jsonData;
    };

    const handleCreateVagas = async () => {
        const validationErrors = validateFields(data);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const vagasToCreate = criarJSON();

        console.log("VagasToCreate:", vagasToCreate);

        try {
            await createVagaNormal(vagasToCreate);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar vagas:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Criar Vagas</h1>
            <form className={styles.inputs_container}>

                <div className={styles.inputs_box}>
                    <div className={`col ${styles.col}`}>
                        <label htmlFor="data" className="form-label">Data  <span className={styles.obrigatorio}>*</span></label>
                        <input
                            placeholder="Digite a data"
                            type="date"
                            className={`form-control ${styles.input_data} ${errors.data ? "is-invalid" : ""}`}
                            name="data"
                            value={data}
                            onChange={handleDataChange}
                        />
                        {errors.data && <div className={`invalid-feedback ${styles.error_message}`}>{errors.data}</div>}
                    </div>
                </div>

                <div className={styles.inputs_box}>

                    <div className="row">
                        <div className={styles.title}><h2>Turno manhã:</h2></div>
                    </div>

                    <div className={`row ${styles.div_space}`}>
                        <div className="col">
                            {Object.entries(vagas)
                                .filter(([numVaga]) => numVaga.includes('vaga1'))
                                .map(([numVaga, selecionado]) => (
                                    <div key={numVaga}>
                                        <div className={styles.input_space}>
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 1 | 08:00 às 09:00
                                            </label>
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
                                                        value={selectedEspecialidade[0] || ''}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 0)}
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
                                                        value={selectedTipoConsulta[0] || ''}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 0)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[0] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 0)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 2 | 09:00 às 10:00
                                            </label>
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
                                                        value={selectedEspecialidade[1] || ""}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 1)}
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
                                                        value={selectedTipoConsulta[1] || ""}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 1)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[1] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 1)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 3 | 10:00 às 11:00
                                            </label>
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
                                                        value={selectedEspecialidade[2] || ""}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 2)}
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
                                                        value={selectedTipoConsulta[2] || ""}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 2)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[2] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 2)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 4 | 11:00 às 12:00
                                            </label>
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
                                                        value={selectedEspecialidade[3] || ""}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 3)}
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
                                                        value={selectedTipoConsulta[3] || ""}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 3)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[3] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 3)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 5 | 13:00 às 14:00
                                            </label>
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
                                                        value={selectedEspecialidade[4] || ""}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 4)}
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
                                                        value={selectedTipoConsulta[4] || ""}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 4)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[4] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 4)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 6 | 14:00 às 15:00
                                            </label>
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
                                                        value={selectedEspecialidade[5] || ""}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 5)}
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
                                                        value={selectedTipoConsulta[5] || ""}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 5)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[5] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 5)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 7 | 15:00 às 16:00
                                            </label>
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
                                                        value={selectedEspecialidade[6] || ""}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 6)}
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
                                                        value={selectedTipoConsulta[6] || ""}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 6)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[6] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 6)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
                                            <label htmlFor={`${numVaga}-checkbox`} className="form-label">
                                                Vaga 8 | 16:00 às 17:00
                                            </label>
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
                                                        value={selectedEspecialidade[7] || ""}
                                                        onChange={(event) => handleEspecialidadeSelection(event, 7)}
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
                                                        value={selectedTipoConsulta[7] || ""}
                                                        onChange={(event) => handleTipoConsultaSelection(event, 7)}
                                                    >
                                                        <option value="">Selecione o tipo de consulta</option>
                                                        {tiposConsulta.map((tipoConsulta) => (
                                                            <option key={tipoConsulta.id} value={tipoConsulta.id}>
                                                                {tipoConsulta.tipo}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`col ${styles.col}`}>
                                                    <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;</label>
                                                    <select
                                                        className={`form-select ${styles.input}`}
                                                        name="medico"
                                                        aria-label="Selecione um(a) veterinário(a)"
                                                        value={selectedMedico[7] || ''}
                                                        onChange={(event) => handleMedicoSelection(event, 7)}
                                                    >
                                                        <option value="">Selecione o veterinário(a)</option>
                                                        {medicos.map((medico) => (
                                                            <option key={medico.id} value={medico.id}>
                                                                {medico.nome}
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
            {<Alert message="Vagas cadastradas com sucesso!" show={showAlert} url={`/agendamentosDia`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao criar vagas, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default GerenciarVagas;
