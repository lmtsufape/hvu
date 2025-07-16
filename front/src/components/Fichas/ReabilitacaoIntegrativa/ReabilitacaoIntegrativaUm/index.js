import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { createFicha } from '../../../../../services/fichaService';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react";

function ReabilitacaoIntegrativa({ formData, handleChange, nextStep, cleanLocalStorage }) {

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
            <VoltarButton />
            <h1>Ficha de Reabilitação Integrativa</h1>
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

                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Nº Prontuário: </label>
                            <input type="text" name="numeroProntuario" value={formData.numeroProntuario} onChange={handleChange} />
                        </div>
                        <div className={styles.column}>
                            <label>Peso: </label>
                            <input type="text" name="peso" value={formData.peso} onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Queixa Principal: </label>
                        <input type="text" name="queixaPrincipal" value={formData.queixaPrincipal} onChange={handleChange} />
                    </div>

                    <h2>Histórico clínico especial</h2>

                    <div className={styles.column}>
                        <label>Histórico Ortopédico:</label>
                        <input type="text" name="historicoClinico.ortopedico" value={formData.historicoClinico.ortopedico} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Histórico Neurológico:</label>
                        <input type="text" name="historicoClinico.neurologico" value={formData.historicoClinico.neurologico} onChange={handleChange} />
                    </div >
                    <div className={styles.column}>
                        <label>Histórico Oncológico:</label>
                        <input type="text" name="historicoClinico.oncologico" value={formData.historicoClinico.oncologico} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Outros:</label>
                        <input type="text" name="historicoClinico.outros" value={formData.historicoClinico.outros} onChange={handleChange} />
                    </div>

                    <h2>Exame clínico especial</h2>
                    <p>Ortopédico</p>

                    <div className={styles.column}>
                        <label>Palpação de membros e articulações: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.palpacaoMembrosArticulacao" value={formData.exameClinicoEspecialOrtpedico.palpacaoMembrosArticulacao} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Palpação de coluna: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.palpacaoColuna" value={formData.exameClinicoEspecialOrtpedico.palpacaoColuna} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Teste Ortolani: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.testeOrtolani" value={formData.exameClinicoEspecialOrtpedico.testeOrtolani} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Teste de gaveta: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.testeDeGaveta" value={formData.exameClinicoEspecialOrtpedico.testeDeGaveta} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Teste de compressão tibial: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.testeDeCompressaoTibial" value={formData.exameClinicoEspecialOrtpedico.testeDeCompressaoTibial} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Instabilidade medial de ombro: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.instabilidadeMedialDeOmbro" value={formData.exameClinicoEspecialOrtpedico.instabilidadeMedialDeOmbro} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Palpação do tendão bicipital: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.palpacaoDoTendaoBicipital" value={formData.exameClinicoEspecialOrtpedico.palpacaoDoTendaoBicipital} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Avaliação de massa muscular: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.avaliacaoDeMassaMuscular" value={formData.exameClinicoEspecialOrtpedico.avaliacaoDeMassaMuscular} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Avaliação da capacidade de movimento: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.avaliacaoDaCapacidadeDeMovimento" value={formData.exameClinicoEspecialOrtpedico.avaliacaoDaCapacidadeDeMovimento} onChange={handleChange} />
                    </div>

                    <h2>Neurológico</h2>
                    <div className={styles.column}>
                        <label>Estado Mental: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.estadoMental" value={formData.exameClinicoEspecialNeurologico.estadoMental} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Postura: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.postura" value={formData.exameClinicoEspecialNeurologico.postura} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Locomoção: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.locomocao" value={formData.exameClinicoEspecialNeurologico.locomocao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Nervos Cranianos: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.nervosCranianos" value={formData.exameClinicoEspecialNeurologico.nervosCranianos} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Reações Posturais: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.reacoesPosturais" value={formData.exameClinicoEspecialNeurologico.reacoesPosturais} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Refleções Segmentares: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.reflexoesSegmentares" value={formData.exameClinicoEspecialNeurologico.reflexoesSegmentares} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Avaliação Sensitiva: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.avaliacaoSensitiva" value={formData.exameClinicoEspecialNeurologico.avaliacaoSensitiva} onChange={handleChange} />
                    </div>

                    <h2>Exame clínico especial / Outros</h2>
                    <div className={styles.column}>
                        <label>Observações: </label>
                        <input type="text" name="exameClinicoEspecialOutros.observacoes" value={formData.exameClinicoEspecialOutros.observacoes} onChange={handleChange} />
                    </div>

                    <h2>Queixa Principal</h2>
                    <div className={styles.column}>
                        <label>Sinais clínicos: </label>
                        <input type="text" name="queixaPrincipal2.sinaisClinicos" value={formData.queixaPrincipal2.sinaisClinicos} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Quando Ocorreu pela 1º vez: </label>
                        <input type="text" name="queixaPrincipal2.primeiraOcorrencia" value={formData.queixaPrincipal2.primeiraOcorrencia} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Evolução: </label>
                        <input type="text" name="queixaPrincipal2.evolucao" value={formData.queixaPrincipal2.evolucao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Medicação Administradas: </label>
                        <input type="text" name="medicacaoAdministrada" value={formData.medicacaoAdministrada} onChange={handleChange} />
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage} />
                        < ContinuarFichasGreenButton type="submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReabilitacaoIntegrativa;