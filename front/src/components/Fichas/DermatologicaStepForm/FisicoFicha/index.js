import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

function FichaDermatologicaStep2({ formData, handleChange, nextStep, prevStep, handleChangeSelect, handleCheckboxChangeMucosas, handleLocationChange, handleLinfonodoChange, handleCaracteristicaChange }) {
    const linfonodos = [
        { value: "mandibularD", label: "Mandibular D" },
        { value: "mandibularE", label: "Mandibular E" },
        { value: "cervicalSuperiorD", label: "Cervical superior D" },
        { value: "cervicalSuperiorE", label: "Cervical superior E" },
        { value: "axilarD", label: "Axilar D" },
        { value: "axilarE", label: "Axilar E" },
        { value: "inguinalD", label: "Inguinal D" },
        { value: "inguinalE", label: "Inguinal E" },
        { value: "popliteoD", label: "Poplíteo D" },
        { value: "popliteoE", label: "Poplíteo E" }
    ];

    const caracteristicas = [
        { value: "sa", label: "S/A" },
        { value: "aumentado", label: "Aumentado" },
        { value: "doloroso", label: "Doloroso" },
        { value: "aderido", label: "Aderido" },
        { value: "naoAvaliado", label: "Não avaliado" }
    ];
    const handleSubmit = (event) => {
        event.preventDefault();
        nextStep();
    };

    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor, setTutor] = useState({});
    const [consultaId, setConsultaId] = useState(null);

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

    return (
        <div className={styles.container}>
            <VoltarButton onClick={prevStep} />
            <h1>Ficha Dermatológica</h1>
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
                    <h2>Exame físico geral</h2>

                    <div className={styles.box}>
                        <div className={styles.column}>

                            <label htmlFor="postura">Postura:</label>
                            <select
                                id="postura"
                                name="postura"
                                value={formData.tipo.postura}
                                onChange={handleChangeSelect}
                            >
                                <option value="">Selecione</option>
                                <option value="Estacao">Estação</option>
                                <option value="Decubito">Decúbito</option>
                                <option value="Cavalete">Cavalete</option>
                                <option value="Ortopneica">Ortopnéica</option>
                                <option value="Outros">Outros</option>
                            </select>

                            {formData.tipo.postura === "Outros" && (
                                <div>
                                    <label htmlFor="outrosDetalhes">Especifique a postura:</label>
                                    <input
                                        id="outrosDetalhes"
                                        type="text"
                                        name="outrosDetalhes"
                                        value={formData.tipo.outrosDetalhes}
                                        onChange={handleChangeSelect}
                                        placeholder="Digite a postura"
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.column}>
                            <label>Nível de consciência:
                                <select name="nivelDeConsciencia" value={formData.nivelDeConsciencia} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Alerta">Alerta</option>
                                    <option value="Deprimido">Deprimido</option>
                                    <option value="Excitado">Excitado</option>
                                    <option value="AusenteComa">Ausente (coma)</option>
                                </select>
                            </label>
                        </div>

                        <div className={styles.column}>
                            <label>Score corporal:
                                <select name="scoreCorporal" value={formData.scoreCorporal} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Caquetico">Caquetico</option>
                                    <option value="Magro">Magro</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Sobrepeso">Sobrepeso</option>
                                    <option value="Obeso">Obeso</option>
                                </select>
                            </label>
                        </div>


                        <div className={styles.column}>
                            <label>Temperatura:
                                <input type="text" name="temperatura" value={formData.temperatura} onChange={handleChange} placeholder="Digite a temperatura" />
                            </label>
                        </div>


                        <div className={styles.column}>
                            <label>Turgor cutâneo:
                                <input type="text" name="turgorCutaneo" value={formData.TurgorCutaneo} onChange={handleChange} placeholder="Turgor cutâneo" />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>TPC:
                                <input type="text" name="tpc" value={formData.tpc} onChange={handleChange} placeholder="Digite o TPC" />
                            </label>
                        </div>
                    </div>
                    <div className="row fw-medium mb-2">
                        <div className="col-3 mb-3 mt-4">Mucosas</div>
                        <div className="col mt-4 mb-3">
                            Localização (oculopalpebral, nasal, bucal, vulvar, prepucial ou anal)
                        </div>

                        <div>
                            {Object.keys(formData.options).map((options) => (
                                <div key={options} className="row align-items-start mb-2">
                                    <div className={`${styles.checkbox_container} ${styles.checkbox_square} col-3`}>
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                name={options}
                                                checked={formData.options[options]}
                                                onChange={handleCheckboxChangeMucosas}
                                                className="me-2"
                                            />
                                            {options === "roseas" && "Róseas"}
                                            {options === "roseasPalidas" && "Róseas-pálidas"}
                                            {options === "porcelanicas" && "Porcelânicas"}
                                            {options === "hiperemicas" && "Hiperêmicas"}
                                            {options === "cianoticas" && "Cianóticas"}
                                            {options === "ictaricas" && "Ictéricas"}
                                            {options === "naoAvaliado" && "Não-avaliado"}
                                        </label>
                                    </div>

                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name={options}
                                            value={formData.mucosas[options]}
                                            onChange={handleLocationChange}
                                            disabled={!formData.options[options]}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className={styles.column}>
                            <label>Linfonodos</label>
                        </div>
                        <div className={`${styles.checkbox_container} ${styles.checkbox_square}`}>
                            {linfonodos.map((linfonodo) => (
                                <div key={linfonodo.value}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={linfonodo.value}
                                            checked={linfonodo.value in formData.linfonodos}
                                            onChange={(e) => handleLinfonodoChange(e, linfonodo.value)}
                                        />

                                        {linfonodo.label}
                                    </label>

                                    {formData.linfonodos[linfonodo.value] && (
                                        <div className={styles.options_border}>
                                            {caracteristicas.map((caracteristica) => (
                                                <label key={caracteristica.value}>
                                                    <input
                                                        type="checkbox"
                                                        name={caracteristica.value}
                                                        checked={formData.linfonodos[linfonodo.value]?.includes(caracteristica.value) || false}
                                                        onChange={(e) => handleCaracteristicaChange(e, linfonodo.value)}
                                                    />
                                                    {caracteristica.label}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.column}>
                        <label>Alterações clínicas diversas:
                            <textarea type="text" name="alteracoesClinicas" value={formData.alteracoesClinicas} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>


                    <div className={styles.button_box}>
                        <VoltarWhiteButton onClick={prevStep} />
                        <ContinuarFichasGreenButton type="submit" />
                    </div>

                </form>
            </div>
        </div>
    )
}

export default FichaDermatologicaStep2;