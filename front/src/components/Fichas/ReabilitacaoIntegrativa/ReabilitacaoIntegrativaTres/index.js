import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { createFicha } from '../../../../../services/fichaService';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react";

function ReabilitacaoIntegrativa({ formData, handleChange, handlePreferenciasChange, handleSubmit, prevStep, handleSelectChange, handlePrincipiosChange }) {
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
                        <label>Sensibilidade pontos Mu: </label>
                        <input type="text" name="sensibilidadePontosMu" value={formData.sensibilidadePontosMu} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Sensibilidade pontos Shu: </label>
                        <input type="text" name="sensibilidadePontosShu" value={formData.sensibilidadePontosShu} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Sensibilidade/ dor corporal: </label>
                        <input type="text" name="sensibilidadeDorCorporal" value={formData.sensibilidadeDorCorporal} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Pulso: </label>
                        <input type="text" name="pulso" value={formData.pulso} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Língua: </label>
                        <input type="text" name="lingua" value={formData.lingua} onChange={handleChange} />
                    </div>

                    <div className={styles.image_container}>
                        <div className={styles.image_border}>
                            <img
                                src="/images/imgReabilitacaoIntegrativa.png"
                                alt="imgReabilitacao"
                                height={200}
                                width={200}
                            />
                        </div>
                    </div>

                    <h2>Perguntas Adicionais - MTC</h2>

                    <div className={styles.column}>
                        <label>Historico Ancestral: </label>
                        <input type="text" name="perguntasAdicionaisMTC.historicoAncestral" value={formData.perguntasAdicionaisMTC.historicoAncestral} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Comportamento: </label>
                        <input type="text" name="perguntasAdicionaisMTC.comportamento" value={formData.perguntasAdicionaisMTC.comportamento} onChange={handleChange} />
                    </div>


                    <label>Preferências:</label>
                    <div className={styles.checkbox_container}>
                        <label>
                            <input type="checkbox" name="preferencias" value="sol" checked={formData.preferencias?.includes("sol")} onChange={handlePreferenciasChange} /> Sol
                        </label>
                        <label>
                            <input type="checkbox" name="preferencias" value="dormeEncolhido" checked={formData.preferencias?.includes("dormeEncolhido")} onChange={handlePreferenciasChange} /> Dorme encolhido
                        </label>
                        <label>
                            <input type="checkbox" name="preferencias" value="alimentosQuentes" checked={formData.preferencias?.includes("alimentosQuentes")} onChange={handlePreferenciasChange} /> Alimentos quentes
                        </label>
                        <label>
                            <input type="checkbox" name="preferencias" value="sombra" checked={formData.preferencias?.includes("sombra")} onChange={handlePreferenciasChange} /> Sombra
                        </label>
                        <label>
                            <input type="checkbox" name="preferencias" value="alimentosFrios" checked={formData.preferencias?.includes("alimentosFrios")} onChange={handlePreferenciasChange} /> Alimentos frios
                        </label>
                        <label>
                            <input type="checkbox" name="preferencias" value="dormeEsparramado" checked={formData.preferencias?.includes("dormeEsparramado")} onChange={handlePreferenciasChange} /> Dorme esparramado, <br></br> barriga no chão
                        </label>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Latido/ Miado:</label>
                            <select name="perguntasAdicionaisMTC.latidoMiado" value={formData.perguntasAdicionaisMTC.latidoMiado} onChange={handleChange} >
                                <option value="">Selecione</option>
                                <option value="forte">Forte</option>
                                <option value="fraco">Fraco</option>
                            </select>
                        </div>
                        <div className={styles.column}><label>Sono:</label>
                            <select name="perguntasAdicionaisMTC.sono" value={formData.perguntasAdicionaisMTC.sono} onChange={handleChange} >
                                <option value="">Selecione</option>
                                <option value="forte">Agitado</option>
                                <option value="fraco">Tranquilo</option>
                            </select>
                        </div>
                        <div className={styles.column}>
                            <label>Constituição Corporal/ Miado:</label>
                            <select
                                value={formData.constituicaoCorporal?.[0] || ''}
                                onChange={(e) => handleSelectChange(e, 0)}
                            >
                                <option value="">Selecione</option>
                                <option value="forte">Forte</option>
                                <option value="fraco">Fraca</option>
                            </select>
                            <select
                                value={formData.constituicaoCorporal?.[1] || ''}
                                onChange={(e) => handleSelectChange(e, 1)}
                            >
                                <option value="">Selecione</option>
                                <option value="quenteAoToque">Quente ao Toque</option>
                                <option value="frioAoToque">Frio ao Toque</option>
                            </select>

                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Alguma época/ clima os sinais clínicos pioram? : </label>
                        <input type="text" name="perguntasAdicionaisMTC.descricao" value={formData.perguntasAdicionaisMTC.descricao} onChange={handleChange} />
                    </div>

                    <h2>Diagnóstico MTC</h2>
                    <div className={styles.column}>
                        <label>Órgãos envolvimento/ substâncias envolvidas: </label>
                        <input type="text" name="diagnosticoMTC.orgaosSubstacias" value={formData.diagnosticoMTC.orgaosSubstacias} onChange={handleChange} />
                    </div>


                    <label>Principíos:</label>
                    <div className={styles.checkbox_container}>
                        <label>
                            <input type="checkbox" name="principios" value="yin" checked={formData.principios?.includes("yin")} onChange={handlePrincipiosChange} /> Yin
                        </label>
                        <label>
                            <input type="checkbox" name="principios" value="yang" checked={formData.principios?.includes("yang")} onChange={handlePrincipiosChange} /> Yang
                        </label>
                        <label>
                            <input type="checkbox" name="principios" value="frio" checked={formData.principios?.includes("frio")} onChange={handlePrincipiosChange} /> Frio
                        </label>
                        <label>
                            <input type="checkbox" name="principios" value="quente" checked={formData.principios?.includes("quente")} onChange={handlePrincipiosChange} /> Quente
                        </label>
                        <label>
                            <input type="checkbox" name="principios" value="interno" checked={formData.principios?.includes("interno")} onChange={handlePrincipiosChange} /> Interno
                        </label>
                        <label>
                            <input type="checkbox" name="principios" value="externo" checked={formData.principios?.includes("externo")} onChange={handlePrincipiosChange} /> Externo
                        </label>
                    </div>


                    <div className={styles.column}>
                        <label>WU XING :</label>
                        <input type="text" name="diagnosticoMTC.wuXing" value={formData.diagnosticoMTC.wuXing} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>ZANG FU :</label>
                        <input type="text" name="diagnosticoMTC.zangFu" value={formData.diagnosticoMTC.zangFu} onChange={handleChange} />
                    </div>

                    <div className={styles.image_container}>
                        <div className={styles.image_border}>
                            <img
                                src="/images/imgReabilitacaoIntegrativa2.png"
                                alt="imgReabilitacao2"
                                height={300}
                                width={500}
                            />
                        </div>
                    </div>

                    {/*dados*/}
                    <div className={styles.column}>
                        <label>Médica(o) Veterinária(o) responsável :</label>
                        <input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Estagiários/ Nome :</label>
                        <input type="text" name="estagiario" value={formData.estagiario} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>CPF :</label>
                        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
                    </div>

                    {/*aqui vai ficar a seguda imagem*/}


                    <div className={styles.button_box}>
                        < VoltarWhiteButton onClick={prevStep} />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReabilitacaoIntegrativa;