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
                                disabled={isReadOnly}
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
                                        disabled={isReadOnly}
                                        onChange={handleChangeSelect}
                                        placeholder="Digite a postura"
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.column}>
                            <label>Nível de consciência:
                                <select name="nivelDeConsciencia" value={formData.nivelDeConsciencia} disabled={isReadOnly} onChange={handleChange}>
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
                                <select name="scoreCorporal" value={formData.scoreCorporal} disabled={isReadOnly} onChange={handleChange}>
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
                                <input type="text" name="temperatura" value={formData.temperatura} disabled={isReadOnly} onChange={handleChange} placeholder="Digite a temperatura" />
                            </label>
                        </div>


                        <div className={styles.column}>
                            <label>Turgor cutâneo:
                                <input type="text" name="turgorCutaneo" value={formData.TurgorCutaneo} disabled={isReadOnly} onChange={handleChange} placeholder="Turgor cutâneo" />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>TPC:
                                <input type="text" name="tpc" value={formData.tpc} disabled={isReadOnly} onChange={handleChange} placeholder="Digite o TPC" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className={styles.column}>
                            <label>Mucosas</label>
                        </div>

                        <p>Localização (oculopalpebral, nasal, bucal, vulvar, prepúcial ou anal)</p>
                        <div className={styles.checkbox_container}>
                            {Object.keys(formData?.options??{}).map((option) => (
                                <div key={option}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={option}
                                            checked={formData.options[option]}
                                            disabled={isReadOnly}
                                            onChange={handleCheckboxChangeMucosas}
                                        />
                                        {option === "roseas" && "Róseas"}
                                        {option === "roseasPalidas" && "Róseas pálidas"}
                                        {option === "porcelanicas" && "Porcelânicas"}
                                        {option === "hiperemicas" && "Hiperêmicas"}
                                        {option === "cianoticas" && "Cianóticas"}
                                        {option === "ictaricas" && "Ictéricas"}
                                        {option === "naoAvaliado" && "Não avaliado"}
                                    </label>
                                    {formData.options[option] && (
                                        <div className={styles.location_input}>
                                            <input
                                                type="text"
                                                name={option}
                                                value={formData.mucosas[option]}
                                                disabled={isReadOnly}
                                                onChange={handleLocationChange}
                                                placeholder="Digite a localização"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className={styles.column}>
                            <label>Linfonodos</label>
                        </div>
                        <div className={styles.checkbox_container}>
                            {linfonodos.map((linfonodo) => (
                                <div key={linfonodo.value}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={linfonodo.value}
                                            checked={linfonodo.value in formData.linfonodos}
                                            disabled={isReadOnly}
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
                                                        disabled={isReadOnly}
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
                            <textarea type="text" name="alteracoesClinicas" value={formData.alteracoesClinicas} disabled={isReadOnly} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>



                    {!isReadOnly && (
                    <div className={styles.button_box}>
                        <VoltarWhiteButton onClick={prevStep} />
                        <ContinuarFichasGreenButton type="submit" />
                    </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default FichaDermatologicaStep2;