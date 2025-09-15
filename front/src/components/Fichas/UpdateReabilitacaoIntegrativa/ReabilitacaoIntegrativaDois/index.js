import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react";

function ReabilitacaoIntegrativa({ formData, handleChange, nextStep, prevStep }) {

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


                    <div className={styles.column}>
                        <label>Nº Prontuário: </label>
                        <input type="text" name="numeroProntuario" value={formData.numeroProntuario} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Sistema Digestório</h2>
                    <div className={styles.column}>
                        <label>Alimentação: </label>
                        <input type="text" name="sistemaDigestorio.alimentacao" value={formData.sistemaDigestorio.alimentacao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Apetite/ Deglutição: </label>
                        <input type="text" name="sistemaDigestorio.apetiteDeglutinacao" value={formData.sistemaDigestorio.apetiteDeglutinacao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Êmese/ Regurgitação/ Refluxo/ Eructação/ Flatulência: </label>
                        <input type="text" name="sistemaDigestorio.tipo" value={formData.sistemaDigestorio.tipo} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Dentição (tártaro, perda de dentes): </label>
                        <input type="text" name="sistemaDigestorio.denticao" value={formData.sistemaDigestorio.denticao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Fezes/ defecação (cor, odor, aparência): </label>
                        <input type="text" name="sistemaDigestorio.fezes" value={formData.sistemaDigestorio.fezes} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Obesidade: </label>
                        <input type="text" name="sistemaDigestorio.obesidade" value={formData.sistemaDigestorio.obesidade} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Consumo de água: </label>
                        <input type="text" name="sistemaDigestorio.ConsumoDeAgua" value={formData.sistemaDigestorio.ConsumoDeAgua} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Sistema  Cardiorespiratório</h2>
                    <div className={styles.column}>
                        <label>Respiração: </label>
                        <input type="text" name="sistemaCardiorespiratorio.respiracao" value={formData.sistemaCardiorespiratorio.respiracao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Tosse/ espirros: </label>
                        <input type="text" name="sistemaCardiorespiratorio.tosseEspirros" value={formData.sistemaCardiorespiratorio.tosseEspirros} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Secreções(nasais/ oculares): </label>
                        <input type="text" name="sistemaCardiorespiratorio.secrecao" value={formData.sistemaCardiorespiratorio.secrecao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Intolerância ao exercício/ cianose: </label>
                        <input type="text" name="sistemaCardiorespiratorio.intoleranciaExercicio" value={formData.sistemaCardiorespiratorio.intoleranciaExercicio} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Cardiopatia: </label>
                        <input type="text" name="sistemaCardiorespiratorio.cardiopatia" value={formData.sistemaCardiorespiratorio.cardiopatia} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Aumento de volume (membros/ ascite): </label>
                        <input type="text" name="sistemaCardiorespiratorio.aumentoDeVolume" value={formData.sistemaCardiorespiratorio.aumentoDeVolume} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Sistema Geniturinário</h2>
                    <div className={styles.column}>
                        <label>Micção (dor/odor/ coloração): </label>
                        <input type="text" name="sistemaGeniturinario.miccao" value={formData.sistemaGeniturinario.miccao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Castrado/ inteiro: </label>
                        <input type="text" name="sistemaGeniturinario.castradoInteiro" value={formData.sistemaGeniturinario.castradoInteiro} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Cruzamentos/ cios/ pseudociese/contraceptivos/corrimentos/secreções/partos/ abortos: </label>
                        <input type="text" name="sistemaGeniturinario.tipo1" value={formData.sistemaGeniturinario.tipo1} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Infecções-inflamações/ secreçõesgenitais/ cálculos: </label>
                        <input type="text" name="sistemaGeniturinario.tipo2" value={formData.sistemaGeniturinario.tipo2} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Sistema Nervoso</h2>
                    <div className={styles.column}>
                        <label>Convulsões/ desequilíbrios: </label>
                        <input type="text" name="sistemaNervoso.convulsoesDesequilibrios" value={formData.sistemaNervoso.convulsoesDesequilibrios} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Alterações comportamentais (distrações/ centrado...): </label>
                        <input type="text" name="sistemaNervoso.alteracoesComportamentais" value={formData.sistemaNervoso.alteracoesComportamentais} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Nistagmo/ mioclonias: </label>
                        <input type="text" name="sistemaNervoso.nistagmoMioclonias" value={formData.sistemaNervoso.nistagmoMioclonias} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Dor de cabeça: </label>
                        <input type="text" name="sistemaNervoso.dorDeCabeca" value={formData.sistemaNervoso.dorDeCabeca} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Sinais neurológicos: </label>
                        <input type="text" name="sistemaNervoso.sinaisNeurologicos" value={formData.sistemaNervoso.sinaisNeurologicos} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Sistema Osteoarticular/ Locomotor</h2>
                    <div className={styles.column}>
                        <label>Postura/ marcha: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.posturaMarcha" value={formData.sistemaOsteoarticularLocomotor.posturaMarcha} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Claudicação: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.claudinacao" value={formData.sistemaOsteoarticularLocomotor.claudinacao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Paralisia/ paresia/ ataxia: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.tipo3" value={formData.sistemaOsteoarticularLocomotor.tipo3} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Atonia/ hipotonia/ hipertonia: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.tipo4" value={formData.sistemaOsteoarticularLocomotor.tipo4} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Sistema Tegumentar e Anexos</h2>
                    <div className={styles.column}>
                        <label>Pruridos/ lambedura - alergias: </label>
                        <input type="text" name="sistemaTegumentarAnexos.tipo5" value={formData.sistemaTegumentarAnexos.tipo5} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Descamações/ lesões/ nódulos/ cistos: </label>
                        <input type="text" name="sistemaTegumentarAnexos.tipo6" value={formData.sistemaTegumentarAnexos.tipo6} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Odores/ secreções: </label>
                        <input type="text" name="sistemaTegumentarAnexos.odoresSecrecoes" value={formData.sistemaTegumentarAnexos.odoresSecrecoes} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Qualidade/ coloração pelos: </label>
                        <input type="text" name="sistemaTegumentarAnexos.qualidade" value={formData.sistemaTegumentarAnexos.qualidade} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Acusia: </label>
                        <input type="text" name="sistemaTegumentarAnexos.acusia" value={formData.sistemaTegumentarAnexos.acusia} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Unhas - Crescimento/ quebra-queda: </label>
                        <input type="text" name="sistemaTegumentarAnexos.unhas" value={formData.sistemaTegumentarAnexos.unhas} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Sistema Visual</h2>
                    <div className={styles.column}>
                        <label>Opacificação de cristalino: </label>
                        <input type="text" name="sistemaVisual.opacificacaoDeCristalino" value={formData.sistemaVisual.opacificacaoDeCristalino} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Perda da visão: </label>
                        <input type="text" name="sistemaVisual.perdaDaVisao" value={formData.sistemaVisual.perdaDaVisao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Secreções: </label>
                        <input type="text" name="sistemaVisual.secrecao2" value={formData.sistemaVisual.secrecao2} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    <h2>Manejos gerais</h2>
                    <div className={styles.column}>
                        <label>Vacinação: </label>
                        <input type="text" name="manejosGerais.vacinacao" value={formData.manejosGerais.vacinacao} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Desverminização: </label>
                        <input type="text" name="manejosGerais.desverminizacao" value={formData.manejosGerais.desverminizacao} disabled={isReadOnly} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Ambiente: </label>
                        <input type="text" name="manejosGerais.ambiente" value={formData.manejosGerais.ambiente} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Banhos: </label>
                        <input type="text" name="manejosGerais.banhos" value={formData.manejosGerais.banhos} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Contactantes: </label>
                        <input type="text" name="manejosGerais.contactantes" value={formData.manejosGerais.contactantes} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    {!isReadOnly && (
                    <div className={styles.button_box}>
                        < VoltarWhiteButton onClick={prevStep} />
                        < ContinuarFichasGreenButton type="submit" />
                    </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ReabilitacaoIntegrativa;