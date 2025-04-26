import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function FichaNeurologica({formData, handleChange, nextStep, prevStep}) {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulário válido. Dados prontos para envio:", formData);
        nextStep(); 
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton onClick={prevStep}/>
            <h1>Ficha Neurológica</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Nervos cranianos </h1>
                    <h2 className={styles.title}>Reflexos e reações ( 0 - ausente, 1 - diminuído, 2 - normal, 3 - aumentado) </h2>
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Ameaça (II, VII, córtex, cerebelo)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.ameaca.Esq" 
                                    value={formData.nervosCranianos.ameaca.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.ameaca.Dir" 
                                    value={formData.nervosCranianos.ameaca.Dir} onChange={handleChange}/>  
                                </label>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <label>Tamanho e simetria pupilar (II, III) </label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.tamanhoSimetria.Esq" 
                                    value={formData.nervosCranianos.tamanhoSimetria.Esq} onChange={handleChange}/>  
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.tamanhoSimetria.Dir" 
                                    value={formData.nervosCranianos.tamanhoSimetria.Dir} onChange={handleChange}/>  
                                </label>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <label>Reflexo pupilar fotomotor (II, IIIPS)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.reflexoPupilar.Esq" 
                                    value={formData.nervosCranianos.reflexoPupilar.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.reflexoPupilar.Dir" 
                                    value={formData.nervosCranianos.reflexoPupilar.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Posição ocular (VIII, III, IV, VI)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.posturaOcular.Esq" 
                                    value={formData.nervosCranianos.posturaOcular.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.posturaOcular.Dir" 
                                    value={formData.nervosCranianos.posturaOcular.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Reflexo oculocefálico (VIII, III, IV, VI)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.reflexoOculocefalico.Esq" 
                                    value={formData.nervosCranianos.reflexoOculocefalico.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.reflexoOculocefalico.Dir" 
                                    value={formData.nervosCranianos.reflexoOculocefalico.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Nistagmo patológico (VIII)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.nistagmoPatologico.Esq" 
                                    value={formData.nervosCranianos.nistagmoPatologico.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.nistagmoPatologico.Dir" 
                                    value={formData.nervosCranianos.nistagmoPatologico.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Reflexo palpebral</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.reflexoPalpebral.Esq" 
                                    value={formData.nervosCranianos.reflexoPalpebral.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.reflexoPalpebral.Dir" 
                                    value={formData.nervosCranianos.reflexoPalpebral.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Sensibilidade nasal (V, córtex)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.sensibilidadeNasal.Esq" 
                                    value={formData.nervosCranianos.sensibilidadeNasal.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.sensibilidadeNasal.Dir" 
                                    value={formData.nervosCranianos.sensibilidadeNasal.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Histórico disfonia, disfagia (IX, X)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.historicoDisfoniaDisfagia.Esq" 
                                    value={formData.nervosCranianos.historicoDisfoniaDisfagia.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.historicoDisfoniaDisfagia.Dir" 
                                    value={formData.nervosCranianos.historicoDisfoniaDisfagia.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Simetria de língua (XII)</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.simetriaLingua.Esq" 
                                    value={formData.nervosCranianos.simetriaLingua.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.simetriaLingua.Dir" 
                                    value={formData.nervosCranianos.simetriaLingua.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Estrabismo posicional</label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.estrabismoPosicional.Esq" 
                                    value={formData.nervosCranianos.estrabismoPosicional.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.estrabismoPosicional.Dir" 
                                    value={formData.nervosCranianos.estrabismoPosicional.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>

                        <div className={styles.column}>
                            <label>Simetria da face<br/>
                                Mm. Temporal/masseter (V)<br/>
                                Mm. Expressão facial (VII)
                            </label>
                            <div className={styles.inputGroup}>
                                <label>Esquerdo:
                                    <input type="text" name="nervosCranianos.simetriaFace.Esq" 
                                    value={formData.nervosCranianos.simetriaFace.Esq} onChange={handleChange}/>
                                </label>
                                <label>Direito:
                                    <input type="text" name="nervosCranianos.simetriaFace.Dir" 
                                    value={formData.nervosCranianos.simetriaFace.Dir} onChange={handleChange}/>
                                </label>
                            </div>
                        </div>
                    </div>
            
                    <h1 className={styles.title}>Reações posturais(Circular)</h1>
                    <h2 className={styles.title}>(0 - ausente, 1 - diminuído, 2 - normal)</h2>

                    <div className={styles.column}>
                        <label>Propriocepção consciente</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reacoesPosturais.propriocepcaoConsciente.MTD" value={formData.reacoesPosturais.propriocepcaoConsciente.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reacoesPosturais.propriocepcaoConsciente.MTE" value={formData.reacoesPosturais.propriocepcaoConsciente.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reacoesPosturais.propriocepcaoConsciente.MPD" value={formData.reacoesPosturais.propriocepcaoConsciente.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reacoesPosturais.propriocepcaoConsciente.MPE" value={formData.reacoesPosturais.propriocepcaoConsciente.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Saltitar</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reacoesPosturais.saltitar.MTD" value={formData.reacoesPosturais.saltitar.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reacoesPosturais.saltitar.MTE" value={formData.reacoesPosturais.saltitar.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reacoesPosturais.saltitar.MPD" value={formData.reacoesPosturais.saltitar.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reacoesPosturais.saltitar.MPE" value={formData.reacoesPosturais.saltitar.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Posicionamento tátil</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reacoesPosturais.posicionamentoTatil.MTD" value={formData.reacoesPosturais.posicionamentoTatil.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reacoesPosturais.posicionamentoTatil.MTE" value={formData.reacoesPosturais.posicionamentoTatil.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reacoesPosturais.posicionamentoTatil.MPD" value={formData.reacoesPosturais.posicionamentoTatil.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reacoesPosturais.posicionamentoTatil.MPE" value={formData.reacoesPosturais.posicionamentoTatil.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Hemiestação</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reacoesPosturais.hemiestacao.MTD" value={formData.reacoesPosturais.hemiestacao.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reacoesPosturais.hemiestacao.MTE" value={formData.reacoesPosturais.hemiestacao.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reacoesPosturais.hemiestacao.MPD" value={formData.reacoesPosturais.hemiestacao.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reacoesPosturais.hemiestacao.MPE" value={formData.reacoesPosturais.hemiestacao.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Hemilocomoção</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reacoesPosturais.hemilocomocao.MTD" value={formData.reacoesPosturais.hemilocomocao.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reacoesPosturais.hemilocomocao.MTE" value={formData.reacoesPosturais.hemilocomocao.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reacoesPosturais.hemilocomocao.MPD" value={formData.reacoesPosturais.hemilocomocao.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reacoesPosturais.hemilocomocao.MPE" value={formData.reacoesPosturais.hemilocomocao.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Carrinho de mão (com e sem visão)</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reacoesPosturais.carrinhoDeMao.MTD" value={formData.reacoesPosturais.carrinhoDeMao.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reacoesPosturais.carrinhoDeMao.MTE" value={formData.reacoesPosturais.carrinhoDeMao.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reacoesPosturais.carrinhoDeMao.MPD" value={formData.reacoesPosturais.carrinhoDeMao.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reacoesPosturais.carrinhoDeMao.MPE" value={formData.reacoesPosturais.carrinhoDeMao.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Correção tátil (com e sem visão)</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reacoesPosturais.correcaoTatil.MTD" value={formData.reacoesPosturais.correcaoTatil.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reacoesPosturais.correcaoTatil.MTE" value={formData.reacoesPosturais.correcaoTatil.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reacoesPosturais.correcaoTatil.MPD" value={formData.reacoesPosturais.correcaoTatil.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reacoesPosturais.correcaoTatil.MPE" value={formData.reacoesPosturais.correcaoTatil.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>

                    <h1 className={styles.title}>Reflexos segmentares</h1>
                    <h2 className={styles.title}>(0 – ausente, 1 – diminuído, 2 – normal, 3 – aumentado, 4 - clono)</h2>
                    <div className={styles.column}>
                        <label>Tono muscular</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reflexosSegmentares.tonoMuscular.MTD" value={formData.reflexosSegmentares.tonoMuscular.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reflexosSegmentares.tonoMuscular.MTE" value={formData.reflexosSegmentares.tonoMuscular.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reflexosSegmentares.tonoMuscular.MPD" value={formData.reflexosSegmentares.tonoMuscular.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reflexosSegmentares.tonoMuscular.MPE" value={formData.reflexosSegmentares.tonoMuscular.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Patelar (Nervo femoral)</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reflexosSegmentares.patelar.MTD" value={formData.reflexosSegmentares.patelar.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reflexosSegmentares.patelar.MTE" value={formData.reflexosSegmentares.patelar.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reflexosSegmentares.patelar.MPD" value={formData.reflexosSegmentares.patelar.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reflexosSegmentares.patelar.MPE" value={formData.reflexosSegmentares.patelar.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Flexor (Nervo ciático)</label>
                        <div className={styles.inputGroup}>
                            <label>MTD<input type="text" name="reflexosSegmentares.flexor.MTD" value={formData.reflexosSegmentares.flexor.MTD} onChange={handleChange}/></label>
                            <label>MTE<input type="text" name="reflexosSegmentares.flexor.MTE" value={formData.reflexosSegmentares.flexor.MTE} onChange={handleChange}/></label>
                            <label>MPD<input type="text" name="reflexosSegmentares.flexor.MPD" value={formData.reflexosSegmentares.flexor.MPD} onChange={handleChange}/></label>
                            <label>MPE<input type="text" name="reflexosSegmentares.flexor.MPE" value={formData.reflexosSegmentares.flexor.MPE} onChange={handleChange}/></label>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.column}>
                            <label>Perineal (Nervo pudendo)</label>
                            <input type="text" 
                            name="reflexosSegmentares.perineal" 
                            value={formData.reflexosSegmentares.perineal} 
                            onChange={handleChange} />
                        </div>
                        
                        <div className={styles.column}>
                            <label>Reflexo cutâneo</label>
                            <input type="text" 
                            name="reflexosSegmentares.reflexoCutaneo" 
                            value={formData.reflexosSegmentares.reflexoCutaneo} 
                            onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.column}>
                            <label>Reflexo torácico lateral</label>
                            <input type="text" 
                            name="reflexosSegmentares.reflexoToracicoLateral" 
                            value={formData.reflexosSegmentares.reflexoToracicoLateral} 
                            onChange={handleChange} />
                        </div>
                        <div className={styles.column}>
                            <label>Tono da cauda</label>
                            <input type="text" 
                            name="reflexosSegmentares.tonoDaCalda" 
                            value={formData.reflexosSegmentares.tonoDaCalda} 
                            onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Micção</label>
                        <input type="text" 
                        name="reflexosSegmentares.miccao" 
                        value={formData.reflexosSegmentares.miccao} 
                        onChange={handleChange} />
                    </div>

                    <h1 className={styles.title}>Avaliação sensitiva</h1>
                    <div className={styles.column}>
                        <label>Palpação epaxial</label>
                        <input type="text" 
                        name="avaliacaoSensitiva.palpacaoEpaxial" 
                        value={formData.avaliacaoSensitiva.palpacaoEpaxial} 
                        onChange={handleChange} 
                        className={styles.inputLargo}/>
                    </div>
                    <div className={styles.column}>
                        <label>Dor cervical</label>
                        <input type="text" 
                        name="avaliacaoSensitiva.dorCervical"
                        value={formData.avaliacaoSensitiva.dorCervical}
                        onChange={handleChange} 
                        className={styles.inputLargo}/>
                    </div>
                    <div className={styles.column}>
                        <label>Sensibilidade dos membros</label>
                        <input type="text" 
                        name="avaliacaoSensitiva.sensibilidadeDosMembros" 
                        value={formData.avaliacaoSensitiva.sensibilidadeDosMembros} 
                        onChange={handleChange} 
                        className={styles.inputLargo}/>
                    </div>

                    <div className={styles.button_box}>
                        < VoltarWhiteButton onClick={prevStep}/>
                        < ContinuarFichasGreenButton type="submit"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FichaNeurologica;