
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { createFicha } from '../../../../../services/fichaService';
import { useRouter } from 'next/router';

function FichaNeurologica({ formData, handleChange, nextStep, prevStep }) {
    const [fields, setFields] = useState({
        ameaca: false,
        tamanhoSimetria: false,
        reflexoPupilar: false,
        posturaOcular: false,
        reflexoOculocefalico: false,
        nistagmoPatologico: false,
        reflexoPalpebral: false,
        sensibilidadeNasal: false,
        historicoDisfoniaDisfagia: false,
        simetriaLingua: false,
        estrabismoPosicional: false,
        simetriaFace: false,
        propriocepcaoConsciente: false,
        saltitar: false,
        posicionamentoTatil: false,
        hemiestacao: false,
        hemilocomocao: false,
        carrinhoDeMao: false,
        correcaoTatil: false,
        tonoMuscular: false,
        patelar: false,
        flexor: false,
        perineal: false,
        reflexoCutaneo: false,
        reflexoToracicoLateral: false,
        tonoDaCalda: false,
        miccao: false,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulário válido. Dados prontos para envio:", formData);
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

    const handleFieldToggle = (field) => {
        setFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className={styles.container}>
            <VoltarButton onClick={prevStep} />

            <h1>Ficha Neurológica</h1>
            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.box_ficha_toggle}>
                        <button
                            type="button"
                            className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
                            disabled={isReadOnly}
                            onClick={() => setShowButtons((prev) => !prev)}
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
                                                            <p>{animal.raca && animal.raca.porte ? animal.raca.porte : 'Não definido'}</p>
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

                    <div className={styles.titulo}>
                        Nervos cranianos
                    </div>

                    <h2 className={styles.title}>Reflexos e reações (0 - ausente, 1 - diminuído, 2 - normal, 3 - aumentado)</h2>
                    <div className={styles.box}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.ameaca}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('ameaca')}
                                />
                                Ameaça (II, VII, córtex, cerebelo)
                            </label>
                            {fields.ameaca && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.ameaca.Esq" value={formData.nervosCranianos.ameaca.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.ameaca.Dir" value={formData.nervosCranianos.ameaca.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.tamanhoSimetria}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('tamanhoSimetria')}
                                />
                                Tamanho e simetria pupilar (II, III)
                            </label>
                            {fields.tamanhoSimetria && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.tamanhoSimetria.Esq" value={formData.nervosCranianos.tamanhoSimetria.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.tamanhoSimetria.Dir" value={formData.nervosCranianos.tamanhoSimetria.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.reflexoPupilar}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('reflexoPupilar')}
                                />
                                Reflexo pupilar fotomotor (II, IIIPS)
                            </label>
                            {fields.reflexoPupilar && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.reflexoPupilar.Esq" value={formData.nervosCranianos.reflexoPupilar.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.reflexoPupilar.Dir" value={formData.nervosCranianos.reflexoPupilar.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.posturaOcular}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('posturaOcular')}
                                />
                                Posição ocular (VIII, III, IV, VI)
                            </label>
                            {fields.posturaOcular && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.posturaOcular.Esq" value={formData.nervosCranianos.posturaOcular.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.posturaOcular.Dir" value={formData.nervosCranianos.posturaOcular.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.reflexoOculocefalico}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('reflexoOculocefalico')}
                                />
                                Reflexo oculocefálico (VIII, III, IV, VI)
                            </label>
                            {fields.reflexoOculocefalico && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.reflexoOculocefalico.Esq" value={formData.nervosCranianos.reflexoOculocefalico.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.reflexoOculocefalico.Dir" value={formData.nervosCranianos.reflexoOculocefalico.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.nistagmoPatologico}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('nistagmoPatologico')}
                                />
                                Nistagmo patológico (VIII)
                            </label>
                            {fields.nistagmoPatologico && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.nistagmoPatologico.Esq" value={formData.nervosCranianos.nistagmoPatologico.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.nistagmoPatologico.Dir" value={formData.nervosCranianos.nistagmoPatologico.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.reflexoPalpebral}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('reflexoPalpebral')}
                                />
                                Reflexo palpebral
                            </label>
                            {fields.reflexoPalpebral && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.reflexoPalpebral.Esq" value={formData.nervosCranianos.reflexoPalpebral.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.reflexoPalpebral.Dir" value={formData.nervosCranianos.reflexoPalpebral.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.sensibilidadeNasal}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('sensibilidadeNasal')}
                                />
                                Sensibilidade nasal (V, córtex)
                            </label>
                            {fields.sensibilidadeNasal && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.sensibilidadeNasal.Esq" value={formData.nervosCranianos.sensibilidadeNasal.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.sensibilidadeNasal.Dir" value={formData.nervosCranianos.sensibilidadeNasal.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.historicoDisfoniaDisfagia}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('historicoDisfoniaDisfagia')}
                                />
                                Histórico disfonia, disfagia (IX, X)
                            </label>
                            {fields.historicoDisfoniaDisfagia && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.historicoDisfoniaDisfagia.Esq" value={formData.nervosCranianos.historicoDisfoniaDisfagia.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.historicoDisfoniaDisfagia.Dir" value={formData.nervosCranianos.historicoDisfoniaDisfagia.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.simetriaLingua}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('simetriaLingua')}
                                />
                                Simetria de língua (XII)
                            </label>
                            {fields.simetriaLingua && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.simetriaLingua.Esq" value={formData.nervosCranianos.simetriaLingua.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.simetriaLingua.Dir" value={formData.nervosCranianos.simetriaLingua.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.estrabismoPosicional}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('estrabismoPosicional')}
                                />
                                Estrabismo posicional
                            </label>
                            {fields.estrabismoPosicional && (
                                <div className={styles.bilateralInputGroup}>
                                    <label>Esquerdo:
                                        <input type="text" name="nervosCranianos.estrabismoPosicional.Esq" value={formData.nervosCranianos.estrabismoPosicional.Esq} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>Direito:
                                        <input type="text" name="nervosCranianos.estrabismoPosicional.Dir" value={formData.nervosCranianos.estrabismoPosicional.Dir} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <div className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    checked={fields.simetriaFace}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('simetriaFace')}
                                />
                                <span className={styles.checkboxTitle}>Simetria da face</span>
                                </div>
                                <div className={styles.checkboxDetails}>
                                Mm. Temporal/masseter (V)<br />
                                Mm. Expressão facial (VII)
                                </div>
                            </label>

                            {fields.simetriaFace && (
                                <div className={styles.bilateralInputGroup}>
                                <label>
                                    Esquerdo:
                                    <input
                                    type="text"
                                    name="nervosCranianos.simetriaFace.Esq"
                                    value={formData.nervosCranianos.simetriaFace.Esq}
                                    disabled={isReadOnly}
                                    onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Direito:
                                    <input
                                    type="text"
                                    name="nervosCranianos.simetriaFace.Dir"
                                    value={formData.nervosCranianos.simetriaFace.Dir}
                                    disabled={isReadOnly}
                                    onChange={handleChange}
                                    />
                                </label>
                                </div>
                            )}
                            </div>

                    </div>

                    <div className={styles.titulo}>Reações posturais (Circular)</div>
                    <h2 className={styles.title}>(0 - ausente, 1 - diminuído, 2 - normal)</h2>
                    <div className={styles.singleColumn}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.propriocepcaoConsciente}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('propriocepcaoConsciente')}
                                />
                                Propriocepção consciente
                            </label>
                            {fields.propriocepcaoConsciente && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reacoesPosturais.propriocepcaoConsciente.MTD" value={formData.reacoesPosturais.propriocepcaoConsciente.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reacoesPosturais.propriocepcaoConsciente.MTE" value={formData.reacoesPosturais.propriocepcaoConsciente.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reacoesPosturais.propriocepcaoConsciente.MPD" value={formData.reacoesPosturais.propriocepcaoConsciente.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reacoesPosturais.propriocepcaoConsciente.MPE" value={formData.reacoesPosturais.propriocepcaoConsciente.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.saltitar}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('saltitar')}
                                />
                                Saltitar
                            </label>
                            {fields.saltitar && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reacoesPosturais.saltitar.MTD" value={formData.reacoesPosturais.saltitar.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reacoesPosturais.saltitar.MTE" value={formData.reacoesPosturais.saltitar.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reacoesPosturais.saltitar.MPD" value={formData.reacoesPosturais.saltitar.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reacoesPosturais.saltitar.MPE" value={formData.reacoesPosturais.saltitar.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.posicionamentoTatil}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('posicionamentoTatil')}
                                />
                                Posicionamento tátil
                            </label>
                            {fields.posicionamentoTatil && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reacoesPosturais.posicionamentoTatil.MTD" value={formData.reacoesPosturais.posicionamentoTatil.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reacoesPosturais.posicionamentoTatil.MTE" value={formData.reacoesPosturais.posicionamentoTatil.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reacoesPosturais.posicionamentoTatil.MPD" value={formData.reacoesPosturais.posicionamentoTatil.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reacoesPosturais.posicionamentoTatil.MPE" value={formData.reacoesPosturais.posicionamentoTatil.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.hemiestacao}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('hemiestacao')}
                                />
                                Hemiestação
                            </label>
                            {fields.hemiestacao && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reacoesPosturais.hemiestacao.MTD" value={formData.reacoesPosturais.hemiestacao.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reacoesPosturais.hemiestacao.MTE" value={formData.reacoesPosturais.hemiestacao.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reacoesPosturais.hemiestacao.MPD" value={formData.reacoesPosturais.hemiestacao.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reacoesPosturais.hemiestacao.MPE" value={formData.reacoesPosturais.hemiestacao.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.hemilocomocao}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('hemilocomocao')}
                                />
                                Hemilocomoção
                            </label>
                            {fields.hemilocomocao && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reacoesPosturais.hemilocomocao.MTD" value={formData.reacoesPosturais.hemilocomocao.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reacoesPosturais.hemilocomocao.MTE" value={formData.reacoesPosturais.hemilocomocao.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reacoesPosturais.hemilocomocao.MPD" value={formData.reacoesPosturais.hemilocomocao.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reacoesPosturais.hemilocomocao.MPE" value={formData.reacoesPosturais.hemilocomocao.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.carrinhoDeMao}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('carrinhoDeMao')}
                                />
                                Carrinho de mão (com e sem visão)
                            </label>
                            {fields.carrinhoDeMao && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reacoesPosturais.carrinhoDeMao.MTD" value={formData.reacoesPosturais.carrinhoDeMao.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reacoesPosturais.carrinhoDeMao.MTE" value={formData.reacoesPosturais.carrinhoDeMao.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reacoesPosturais.carrinhoDeMao.MPD" value={formData.reacoesPosturais.carrinhoDeMao.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reacoesPosturais.carrinhoDeMao.MPE" value={formData.reacoesPosturais.carrinhoDeMao.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.correcaoTatil}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('correcaoTatil')}
                                />
                                Correção tátil (com e sem visão)
                            </label>
                            {fields.correcaoTatil && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reacoesPosturais.correcaoTatil.MTD" value={formData.reacoesPosturais.correcaoTatil.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reacoesPosturais.correcaoTatil.MTE" value={formData.reacoesPosturais.correcaoTatil.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reacoesPosturais.correcaoTatil.MPD" value={formData.reacoesPosturais.correcaoTatil.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reacoesPosturais.correcaoTatil.MPE" value={formData.reacoesPosturais.correcaoTatil.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.titulo}>Reflexos segmentares</div>
                    <h2 className={styles.title}>(0 – ausente, 1 – diminuído, 2 – normal, 3 – aumentado, 4 - clono)</h2>
                    <div className={styles.singleColumn}>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.tonoMuscular}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('tonoMuscular')}
                                />
                                Tono muscular
                            </label>
                            {fields.tonoMuscular && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reflexosSegmentares.tonoMuscular.MTD" value={formData.reflexosSegmentares.tonoMuscular.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reflexosSegmentares.tonoMuscular.MTE" value={formData.reflexosSegmentares.tonoMuscular.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reflexosSegmentares.tonoMuscular.MPD" value={formData.reflexosSegmentares.tonoMuscular.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reflexosSegmentares.tonoMuscular.MPE" value={formData.reflexosSegmentares.tonoMuscular.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.patelar}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('patelar')}
                                />
                                Patelar (Nervo femoral)
                            </label>
                            {fields.patelar && (
                                <div className={styles.posturalInputGroup}>
                                <label>MTD:
                                    <input type="text" name="reflexosSegmentares.patelar.MTD" value={formData.reflexosSegmentares.patelar.MTD} disabled={isReadOnly} onChange={handleChange} />
                                </label>
                                <label>MTE:
                                    <input type="text" name="reflexosSegmentares.patelar.MTE" value={formData.reflexosSegmentares.patelar.MTE} disabled={isReadOnly} onChange={handleChange} />
                                </label>
                                <label>MPD:
                                    <input type="text" name="reflexosSegmentares.patelar.MPD" value={formData.reflexosSegmentares.patelar.MPD} disabled={isReadOnly} onChange={handleChange} />
                                </label>
                                <label>MPE:
                                    <input type="text" name="reflexosSegmentares.patelar.MPE" value={formData.reflexosSegmentares.patelar.MPE} disabled={isReadOnly} onChange={handleChange} />
                                </label>
                            </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.flexor}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('flexor')}
                                />
                                Flexor (Nervo ciático)
                            </label>
                            {fields.flexor && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reflexosSegmentares.flexor.MTD" value={formData.reflexosSegmentares.flexor.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reflexosSegmentares.flexor.MTE" value={formData.reflexosSegmentares.flexor.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reflexosSegmentares.flexor.MPD" value={formData.reflexosSegmentares.flexor.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reflexosSegmentares.flexor.MPE" value={formData.reflexosSegmentares.flexor.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.perineal}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('perineal')}
                                />
                                Perineal (Nervo pudendo)
                            </label>
                            {fields.perineal && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reflexosSegmentares.perineal.MTD" value={formData.reflexosSegmentares.perineal.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reflexosSegmentares.perineal.MTE" value={formData.reflexosSegmentares.perineal.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reflexosSegmentares.perineal.MPD" value={formData.reflexosSegmentares.perineal.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reflexosSegmentares.perineal.MPE" value={formData.reflexosSegmentares.perineal.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.reflexoCutaneo}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('reflexoCutaneo')}
                                />
                                Reflexo cutâneo
                            </label>
                            {fields.reflexoCutaneo && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reflexosSegmentares.reflexoCutaneo.MTD" value={formData.reflexosSegmentares.reflexoCutaneo.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reflexosSegmentares.reflexoCutaneo.MTE" value={formData.reflexosSegmentares.reflexoCutaneo.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reflexosSegmentares.reflexoCutaneo.MPD" value={formData.reflexosSegmentares.reflexoCutaneo.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reflexosSegmentares.reflexoCutaneo.MPE" value={formData.reflexosSegmentares.reflexoCutaneo.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.reflexoToracicoLateral}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('reflexoToracicoLateral')}
                                />
                                Reflexo torácico lateral
                            </label>
                            {fields.reflexoToracicoLateral && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reflexosSegmentares.reflexoToracicoLateral.MTD" value={formData.reflexosSegmentares.reflexoToracicoLateral.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reflexosSegmentares.reflexoToracicoLateral.MTE" value={formData.reflexosSegmentares.reflexoToracicoLateral.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reflexosSegmentares.reflexoToracicoLateral.MPD" value={formData.reflexosSegmentares.reflexoToracicoLateral.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reflexosSegmentares.reflexoToracicoLateral.MPE" value={formData.reflexosSegmentares.reflexoToracicoLateral.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.tonoDaCalda}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('tonoDaCalda')}
                                />
                                Tono da cauda
                            </label>
                            {fields.tonoDaCalda && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reflexosSegmentares.tonoDaCalda.MTD" value={formData.reflexosSegmentares.tonoDaCalda.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reflexosSegmentares.tonoDaCalda.MTE" value={formData.reflexosSegmentares.tonoDaCalda.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reflexosSegmentares.tonoDaCalda.MPD" value={formData.reflexosSegmentares.tonoDaCalda.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reflexosSegmentares.tonoDaCalda.MPE" value={formData.reflexosSegmentares.tonoDaCalda.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={fields.miccao}
                                    disabled={isReadOnly}
                                    onChange={() => handleFieldToggle('miccao')}
                                />
                                Micção
                            </label>
                            {fields.miccao && (
                                <div className={styles.posturalInputGroup}>
                                    <label>MTD:
                                        <input type="text" name="reflexosSegmentares.miccao.MTD" value={formData.reflexosSegmentares.miccao.MTD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MTE:
                                        <input type="text" name="reflexosSegmentares.miccao.MTE" value={formData.reflexosSegmentares.miccao.MTE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPD:
                                        <input type="text" name="reflexosSegmentares.miccao.MPD" value={formData.reflexosSegmentares.miccao.MPD} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                    <label>MPE:
                                        <input type="text" name="reflexosSegmentares.miccao.MPE" value={formData.reflexosSegmentares.miccao.MPE} disabled={isReadOnly} onChange={handleChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.titulo}>Avaliação sensitiva</div>
                    <div className={styles.column}>
                        <label>Palpação epaxial</label>
                        <input type="text"
                            name="avaliacaoSensitiva.palpacaoEpaxial"
                            value={formData.avaliacaoSensitiva.palpacaoEpaxial}
                            disabled={isReadOnly}
                            onChange={handleChange}
                            className={styles.inputLargo} />
                    </div>
                    <div className={styles.column}>
                        <label>Dor cervical</label>
                        <input type="text"
                            name="avaliacaoSensitiva.dorCervical"
                            value={formData.avaliacaoSensitiva.dorCervical}
                            disabled={isReadOnly}
                            onChange={handleChange}
                            className={styles.inputLargo} />
                    </div>
                    <div className={styles.column}>
                        <label>Sensibilidade dos membros</label>
                        <input type="text"
                            name="avaliacaoSensitiva.sensibilidadeDosMembros"
                            value={formData.avaliacaoSensitiva.sensibilidadeDosMembros}
                            disabled={isReadOnly}
                            onChange={handleChange}
                            className={styles.inputLargo} />
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
    );
}

export default FichaNeurologica;
