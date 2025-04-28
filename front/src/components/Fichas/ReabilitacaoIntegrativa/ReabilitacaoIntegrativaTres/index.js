import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";

function ReabilitacaoIntegrativa({formData, handleChange,handlePreferenciasChange,handleSubmit, prevStep, handleSelectChange,handlePrincipiosChange}) {

    
    return(
        <div className={styles.container}>
            <VoltarButton onClick={prevStep}/>
            <h1>Ficha de Reabilitacao Integrativa</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    
                    <div className={styles.column}>
                        <label>Sensibilidade pontos Mu: </label>
                        <input type="text" name="sensibilidadePontosMu" value={formData.SensibilidadePontosMu} onChange={handleChange} />
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
                    

                    {/*aqui vai ficar a seguda imagem*/}
                    <img
                        src="/images/imgReabilitacaoIntegrativa.png"
                        alt="imgReabilitacao"
                        height={200}
                        width={200}
                    />

                    <h1>Perguntas Adicionais - MTC</h1>
              
                    <div className={styles.column}>
                        <label>Historico Ancestral: </label>
                        <input type="text" name="perguntasAdicionaisMTC.historicoAncestral" value={formData.perguntasAdicionaisMTC.historicoAncestral} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Comportamento: </label>
                        <input type="text" name="perguntasAdicionaisMTC.comportamento" value={formData.perguntasAdicionaisMTC.comportamento} onChange={handleChange} />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>Preferências:</label>
                        <div className={styles.checkboxRow}>
                            <label>
                                <input type="checkbox"name="preferencias"value="sol"checked={formData.preferencias?.includes("sol")}onChange={handlePreferenciasChange}/> Sol
                            </label>
                            <label>
                                <input type="checkbox" name="preferencias" value="dormeEncolhido" checked={formData.preferencias?.includes("dormeEncolhido")} onChange={handlePreferenciasChange}/> Dorme encolhido
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
                                <input type="checkbox" name="preferencias" value="dormeEsparramado" checked={formData.preferencias?.includes("dormeEsparramado")} onChange={handlePreferenciasChange} /> Dorme esparramado/ barriga no chão
                            </label>
                        </div>
                    </div>
                    <div className={styles.fieldsContainer}>
                        <div className={styles.column}><label>Latido/ Miado:</label>
                            <select name="perguntasAdicionaisMTC.latidoMiado" value={formData.perguntasAdicionaisMTC.latidoMiado} onChange={handleChange} >
                                <option value="">Selecione</option>
                                <option value="forte">forte</option>
                                <option value="fraco">fraco</option>
                            </select>
                        </div>
                        <div className={styles.column}><label>Sono:</label>
                            <select name="perguntasAdicionaisMTC.sono" value={formData.perguntasAdicionaisMTC.sono} onChange={handleChange} >
                                <option value="">Selecione</option>
                                <option value="forte">agitado</option>
                                <option value="fraco">tranquilo</option>
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

                    <h1>Diagnóstico MTC</h1>
                    <div className={styles.column}>
                        <label>Órgãos envolvimento/ substâncias envolvidas: </label>
                        <input type="text" name="diagnosticoMTC.orgaosSubstacias" value={formData.diagnosticoMTC.orgaosSubstacias} onChange={handleChange} />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>Principíos:</label>
                        <div className={styles.checkboxRow}>
                            <label>
                                <input type="checkbox"name="principios"value="yin"checked={formData.principios?.includes("yin")}onChange={handlePrincipiosChange}/> yin
                            </label>
                            <label>
                                <input type="checkbox" name="principios" value="yang" checked={formData.principios?.includes("yang")} onChange={handlePrincipiosChange}/> yang
                            </label>
                            <label>
                                <input type="checkbox" name="principios" value="frio" checked={formData.principios?.includes("frio")} onChange={handlePrincipiosChange} /> frio
                            </label>
                            <label>
                                <input type="checkbox" name="principios" value="quente" checked={formData.principios?.includes("quente")} onChange={handlePrincipiosChange} /> quente
                            </label>
                            <label>
                                <input type="checkbox" name="principios" value="interno" checked={formData.principios?.includes("interno")} onChange={handlePrincipiosChange} /> interno
                            </label>
                            <label>
                                <input type="checkbox" name="principios" value="externo" checked={formData.principios?.includes("externo")} onChange={handlePrincipiosChange} /> externo
                            </label>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <label>WU XING :</label>
                        <input type="text" name="diagnosticoMTC.wuXing" value={formData.diagnosticoMTC.wuXing} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>ZANG FU :</label>
                        <input type="text" name="diagnosticoMTC.zangFu" value={formData.diagnosticoMTC.zangFu} onChange={handleChange} />
                    </div>
                    
                    <img
                        src="/images/imgReabilitacaoIntegrativa2.png"
                        alt="imgReabilitacao2"
                        height={300}
                        width={500}
                    />

                    {/*dados*/}
                    <div className={styles.column}>
                        <label>Médica(o) Veterinária(o) responsável :</label>
                        <input type="text" name="responsavel" value={formData.responsavel} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Estagiarios/ Nome :</label>
                        <input type="text" name="estagiario" value={formData.estagiario} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>CPF :</label>
                        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
                    </div>

                    {/*aqui vai ficar a seguda imagem*/}

                    
                    <div className={styles.button_box}>
                        < VoltarButton onClick={prevStep}/>
                         < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div> 
                </form>
            </div>
        </div>
    )
}

export default ReabilitacaoIntegrativa;