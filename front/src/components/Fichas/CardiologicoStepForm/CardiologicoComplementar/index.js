import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";

function AtendimentoCardiologico({formData, handleChange, prevStep, handleCheckboxChange, handleSubmit}) {

    return (
        <div className={styles.container}>
            <VoltarButton onClick={prevStep}/>
            <h1>Ficha de atendimento cardiológico</h1>
            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Exames complementares</h1>
                    <h1 className={styles.title}>Aferição de pressão</h1>
                    <div className={styles.column}>
                        <label>Métodos utilizado</label>
                        <div className={styles.checkbox_container}>
                            {[
                                "Oscilométrico", 
                                "Doppler"
                            ].map((item) => (
                                <label key={item}>
                                    <input
                                        type="checkbox"
                                        value={item}
                                        checked={formData.afericaoPressao.metodoUtilizado.includes(item)}
                                        onChange={(e) => handleCheckboxChange(e, "afericaoPressao.metodoUtilizado")}
                                    /> {item.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Tamanho do manguito:
                            <input type="text" name="afericaoPressao.tamanhoManguito"
                            value={formData.afericaoPressao.tamanhoManguito} 
                            onChange={handleChange}/>
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Nº de aferições:
                            <input name="afericaoPressao.numeroAfericoes" 
                            value={formData.afericaoPressao.numeroAfericoes} 
                            onChange={handleChange}/>
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Comportamento do paciente:
                            <input name="afericaoPressao.comportamentoPaciente" 
                            value={formData.afericaoPressao.comportamentoPaciente} 
                            onChange={handleChange}/>
                        </label>
                    </div>
                    <div className={styles.checkbox_container}> 
                        {[
                            "Normotenso < 140mmHg",
                            "Pré-Hipertenso 140 - 159 mmHg",
                            "Hipertenso 160 - 179 mmHg",
                            "Hipertenso severo ≥ 180 mmHg",
                            "Hipotenso PAS < 90 mmHG e PAM < 60 mmHg"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.afericaoPressao.classificacaoPressao.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "afericaoPressao.classificacaoPressao")}
                                /> {item}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label>Conclusões:
                            <textarea name="afericaoPressao.conclusoes" 
                            value={formData.afericaoPressao.conclusoes} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <h1 className={styles.title}>Eletrocardiograma</h1>
                    
                    <div className={styles.inputs_three_columns}>
                        <div className={styles.column}>
                            <label>Ritmo:
                                <input type="text" name="eletrocardiograma.ritmo" 
                                value={formData.eletrocardiograma.ritmo} 
                                onChange={handleChange}/>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>FC:
                                <input type="text" name="eletrocardiograma.fc" 
                                value={formData.eletrocardiograma.fc} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Eixo de onda P:
                                <input type="text" name="eletrocardiograma.eixoOndaP" 
                                value={formData.eletrocardiograma.eixoOndaP} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Eixo QRS:
                                <input type="text" name="eletrocardiograma.eixoQRS" 
                                value={formData.eletrocardiograma.eixoQRS} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Duração de P:
                                <input type="text" name="eletrocardiograma.duracaoP" 
                                value={formData.eletrocardiograma.duracaoP} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Amplitude de P:
                                <input type="text" name="eletrocardiograma.amplitudeP" 
                                value={formData.eletrocardiograma.amplitudeP} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Intervalo PR:
                                <input type="text" name="eletrocardiograma.intervaloPR" 
                                value={formData.eletrocardiograma.intervaloPR} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Duração do QRS:
                                <input type="text" name="eletrocardiograma.duracaoQRS" 
                                value={formData.eletrocardiograma.duracaoQRS} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Amplitude de R:
                                <input type="text" name="eletrocardiograma.amplitudeR" 
                                value={formData.eletrocardiograma.amplitudeR} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Intervalo QT:
                                <input type="text" name="eletrocardiograma.intervaloQT" 
                                value={formData.eletrocardiograma.intervaloQT} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Desnível de ST:
                                <input type="text" name="eletrocardiograma.desnivelST" 
                                value={formData.eletrocardiograma.desnivelST} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Amplitude de T:
                                <input type="text" name="eletrocardiograma.amplitudeT" 
                                value={formData.eletrocardiograma.amplitudeT} 
                                onChange={handleChange} />
                            </label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Conclusões:
                            <textarea name="eletrocardiograma.conclusoes" 
                            value={formData.eletrocardiograma.conclusoes} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <h1>Ecocardiograma</h1>
                    <div className={styles.inputs_four_columns}>
                        <div className={styles.column}>
                            <label>AE/Ao:
                                <input type="text" name="ecocardiograma.aeAo" 
                                value={formData.ecocardiograma.aeAo} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>DIVEdn:
                                <input type="text" name="ecocardiograma.divEdn" 
                                value={formData.ecocardiograma.divEdn} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>DIVEs:
                                <input type="text" name="ecocardiograma.divEs" 
                                value={formData.ecocardiograma.divEs} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>FS (%):
                                <input type="text" name="ecocardiograma.fs" 
                                value={formData.ecocardiograma.fs} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>FE (%):
                                <input type="text" name="ecocardiograma.fe" 
                                value={formData.ecocardiograma.fe} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>MAPSE:
                                <input type="text" name="ecocardiograma.mapse" 
                                value={formData.ecocardiograma.mapse} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>E-Septo:
                                <input type="text" name="ecocardiograma.eSepto" 
                                value={formData.ecocardiograma.eSepto} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>TAPSE:
                                <input type="text" name="ecocardiograma.tapse" 
                                value={formData.ecocardiograma.tapse} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Fluxo transmitral:
                                <input type="text" name="ecocardiograma.fluxoTransmitral" 
                                value={formData.ecocardiograma.fluxoTransmitral} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>E/TRIV:
                                <input type="text" name="ecocardiograma.eTriv" 
                                value={formData.ecocardiograma.eTriv} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Aótico:
                                <input type="text" name="ecocardiograma.aortico" 
                                value={formData.ecocardiograma.aortico} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Pulmonar:
                                <input type="text" name="ecocardiograma.pulmonar" 
                                value={formData.ecocardiograma.pulmonar} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Tecidual - Vel. E lateral:
                                <input type="text" name="ecocardiograma.velELateral" 
                                value={formData.ecocardiograma.velELateral} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Vel. A lateral:
                                <input type="text" name="ecocardiograma.velALateral" 
                                value={formData.ecocardiograma.velALateral} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Vel E Septal:
                                <input type="text" name="ecocardiograma.velESeptal" 
                                value={formData.ecocardiograma.velESeptal} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Vel A Septal:
                                <input type="text" name="ecocardiograma.velASeptal" 
                                value={formData.ecocardiograma.velASeptal} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>E/E':
                                <input type="text" name="ecocardiograma.eeLinha" 
                                value={formData.ecocardiograma.eeLinha} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Tricuspídeo:
                                <input type="text" name="ecocardiograma.tricuspide" 
                                value={formData.ecocardiograma.tricuspide} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>GPVD:
                                <input type="text" name="ecocardiograma.gpvd" 
                                value={formData.ecocardiograma.gpvd} 
                                onChange={handleChange} />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Distensibilidade do RDPA:
                                <input type="text" name="ecocardiograma.indiceDistensibilidadeRdpa" 
                                value={formData.ecocardiograma.indiceDistensibilidadeRdpa} 
                                onChange={handleChange} />
                            </label>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <label>Conclusões:
                            <textarea name="conclusoes" 
                            value={formData.conclusoes} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <div className={styles.column}>
                        <label>Exames anteriores e solicitados:
                            <textarea name="examesAnteriores" 
                            value={formData.examesAnteriores} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Diagnóstico/Prognótico:
                            <textarea name="diagnosticoPrognostico" 
                            value={formData.diagnosticoPrognostico} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Tratamento instituído:
                            <textarea name="tratamentoInstituido" 
                            value={formData.tratamentoInstituido} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Plantonista(s) discentes:
                            <input type="text" name="plantonistasDiscentes" 
                            value={formData.plantonistasDiscentes} 
                            onChange={handleChange}/>
                        </label>
                    </div>

                    <div className={styles.button_box}>
                        < VoltarWhiteButton onClick={prevStep}/>
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AtendimentoCardiologico;
