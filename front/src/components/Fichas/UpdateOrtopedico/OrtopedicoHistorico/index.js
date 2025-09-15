import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

function AtendimentoOrtopedico({ formData, handleChange, nextStep }) {

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
            <VoltarButton />
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

                    <h2>Histórico</h2>
                    <div className={styles.column}>
                        <label>Queixa principal: </label>
                        <input type="text" name="queixaPrincipal" value={formData.queixaPrincipal} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ocorrência de trauma: </label>
                        <input type="text" name="ocorrenciaTrauma" value={formData.ocorrenciaTrauma} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Duração do problema: </label>
                        <input type="text" name="duracaoProblema" value={formData.duracaoProblema} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Evolução do quadro: </label>
                        <input type="text" name="evolucaoQuadro" value={formData.evolucaoQuadro} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ocorrência de claudicação (frio/quente, ocasional/frequente/constante, caminhada/ subida/
                            salto, influência do clima e evolução): </label>
                        <input type="text" name="ocorrenciaClaudicacao" value={formData.ocorrenciaClaudicacao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Tolerância ao exercício: </label>
                        <input type="text" name="toleranciaExercicio" value={formData.toleranciaExercicio} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Indícios de dor: </label>
                        <input type="text" name="indiciosDor" value={formData.indiciosDor} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Acidentes/doenças anteriores: </label>
                        <input type="text" name="acidentesAnteriores" value={formData.acidentesAnteriores} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Tratamentos: </label>
                        <input type="text" name="Tratamentos" value={formData.Tratamentos} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Alimentação (tipo, quantidade, frequência): </label>
                        <input type="text" name="Alimentacao" value={formData.Alimentacao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Vitaminas/minerais (quantidade, período): </label>
                        <input type="text" name="vitaminas" value={formData.vitaminas} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ambiente: </label>
                        <input type="text" name="ambiente" value={formData.ambiente} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Obs: </label>
                        <input type="text" name="observacao" value={formData.observacao} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    {!isReadOnly && (
                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        < ContinuarFichasGreenButton type="submit" />
                    </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default AtendimentoOrtopedico;