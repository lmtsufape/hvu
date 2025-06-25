import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { createFicha } from '../../../../../services/fichaService';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react";
function AtendimentoOrtopedico({ formData, handleChange, nextStep, prevStep }) {

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
            <h1>Ficha de atendimento ortopédico</h1>
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

                    <h2>Inspeção visual</h2>
                    <div className={styles.column}>
                        <label>Condição corporal: </label>
                        <input type="text" name="condicaoCorporal" value={formData.condicaoCorporal} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Comportamento: </label>
                        <input type="text" name="comportamento" value={formData.comportamento} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Postura: </label>
                        <input type="text" name="postura" value={formData.postura} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Capacidade de sustentar o peso: </label>
                        <input type="text" name="capacidadePeso" value={formData.capacidadePeso} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Tumefação: </label>
                        <input type="text" name="tumefacao" value={formData.tumefacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Assimetrias, desvios: </label>
                        <input type="text" name="assimetriaDesvio" value={formData.assimetriaDesvio} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Atrofia muscular: </label>
                        <input type="text" name="atrofiaMuscular" value={formData.atrofiaMuscular} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Escoriações, fístulas: </label>
                        <input type="text" name="escoriacoesFistulas" value={formData.escoriacoesFistulas} onChange={handleChange} />
                    </div>

                    <h2>Marcha</h2>

                    <div className={styles.column}><label>marcha:</label>
                        <select name="marcha" value={formData.marcha} onChange={handleChange} >
                            <option value="">Selecione</option>
                            <option value="anteSe">Ante-si</option>
                            <option value="contraSe">Contra-se</option>
                            <option value="lateral">Lateral</option>
                            <option value="passoTrote">Passo-trote</option>
                            <option value="circulo">Círculos</option>
                            <option value="inclinado">Inclinado</option>

                        </select>
                    </div>

                    <div className={styles.column}>
                        <label>Características: </label>
                        <input type="text" name="caracteristicas" value={formData.caracteristicas} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Claudicação (tipo e grau): </label>
                        <input type="text" name="claudicacao" value={formData.claudicacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Fase de apoio: </label>
                        <input type="text" name="faseApoio" value={formData.faseApoio} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Fase de elevação: </label>
                        <input type="text" name="faseElevacao" value={formData.faseElevacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ângulo das articulações: </label>
                        <input type="text" name="anguloArticulacoes" value={formData.anguloArticulacoes} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Obs: </label>
                        <input type="text" name="segundaObservacao" value={formData.segundaObservacao} onChange={handleChange} />
                    </div>

                    <div className={styles.button_box}>
                        < VoltarWhiteButton onClick={prevStep} />
                        < ContinuarFichasGreenButton type="submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AtendimentoOrtopedico;