import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function ReabilitacaoIntegrativa({formData, handleChange, nextStep, prevStep}) {

    const handleSubmit = (event) => {
        event.preventDefault();
        nextStep(); 
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton onClick={prevStep}/>
            <h1>Ficha de atendimento ortopédico</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>

                    <div className={styles.column}>
                         <label>Nº Prontuário: </label>
                        <input type="text" name="numeroProntuario" value={formData.numeroProntuario} onChange={handleChange} />
                    </div>
                    
                    <h2>Sistema Digestório</h2>
                    <div className={styles.column}>
                        <label>Alimentação: </label>
                        <input type="text" name="sistemaDigestorio.alimentacao" value={formData.sistemaDigestorio.alimentacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Apetite/ Deglutição: </label>
                        <input type="text" name="sistemaDigestorio.apetiteDeglutinacao" value={formData.sistemaDigestorio.apetiteDeglutinacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Êmese/ Regurgitação/ Refluxo/ Eructação/ Flatulência: </label>
                        <input type="text" name="sistemaDigestorio.tipo" value={formData.sistemaDigestorio.tipo} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Dentição (tártaro, perda de dentes): </label>
                        <input type="text" name="sistemaDigestorio.denticao" value={formData.sistemaDigestorio.denticao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Fezes/ defecação (cor, odor, aparência): </label>
                        <input type="text" name="sistemaDigestorio.fezes" value={formData.sistemaDigestorio.fezes} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Obesidade: </label>
                        <input type="text" name="sistemaDigestorio.obesidade" value={formData.sistemaDigestorio.obesidade} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Consumo de água: </label>
                        <input type="text" name="sistemaDigestorio.ConsumoDeAgua" value={formData.sistemaDigestorio.ConsumoDeAgua} onChange={handleChange} />
                    </div>

                    <h2>Sistema  Cardiorespiratório</h2>
                    <div className={styles.column}>
                        <label>Respiração: </label>
                        <input type="text" name="sistemaCardiorespiratorio.respiracao" value={formData.sistemaCardiorespiratorio.respiracao} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Tosse/ espirros: </label>
                        <input type="text" name="sistemaCardiorespiratorio.tosseEspirros" value={formData.sistemaCardiorespiratorio.tosseEspirros} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Secreções(nasais/ oculares): </label>
                        <input type="text" name="sistemaCardiorespiratorio.secrecao" value={formData.sistemaCardiorespiratorio.secrecao} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Intolerância ao exercício/ cianose: </label>
                        <input type="text" name="sistemaCardiorespiratorio.intoleranciaExercicio" value={formData.sistemaCardiorespiratorio.intoleranciaExercicio} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Cardiopatia: </label>
                        <input type="text" name="sistemaCardiorespiratorio.cardiopatia" value={formData.sistemaCardiorespiratorio.cardiopatia} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Aumento de volume (membros/ ascite): </label>
                        <input type="text" name="sistemaCardiorespiratorio.aumentoDeVolume" value={formData.sistemaCardiorespiratorio.aumentoDeVolume} onChange={handleChange}/>
                    </div>

                    <h2>Sistema Geniturinário</h2>
                    <div className={styles.column}>
                        <label>Micção (dor/odor/ coloração): </label>
                        <input type="text" name="sistemaGeniturinario.miccao" value={formData.sistemaGeniturinario.miccao} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Castrado/ inteiro: </label>
                        <input type="text" name="sistemaGeniturinario.castradoInteiro" value={formData.sistemaGeniturinario.castradoInteiro} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Cruzamentos/ cios/ pseudociese/contraceptivos/corrimentos/secreções/partos/ abortos: </label>
                        <input type="text" name="sistemaGeniturinario.tipo1" value={formData.sistemaGeniturinario.tipo1} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Infecções-inflamações/ secreçõesgenitais/ cálculos: </label>
                        <input type="text" name="sistemaGeniturinario.tipo2" value={formData.sistemaGeniturinario.tipo2} onChange={handleChange} />
                    </div>

                    <h2>Sistema Nervoso</h2> 
                    <div className={styles.column}>
                        <label>Convulsões/ desequilíbrios: </label>
                        <input type="text" name="sistemaNervoso.convulsoesDesequilibrios" value={formData.sistemaNervoso.convulsoesDesequilibrios} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Alterações comportamentais (distrações/ centrado...): </label>
                        <input type="text" name="sistemaNervoso.alteracoesComportamentais" value={formData.sistemaNervoso.alteracoesComportamentais} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Nistagmo/ mioclonias: </label>
                        <input type="text" name="sistemaNervoso.nistagmoMioclonias" value={formData.sistemaNervoso.nistagmoMioclonias} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Dor de cabeça: </label>
                        <input type="text" name="sistemaNervoso.dorDeCabeca" value={formData.sistemaNervoso.dorDeCabeca} onChange={handleChange}/>
                    </div>
                    <div className={styles.column}>
                        <label>Sinais neurológicos: </label>
                        <input type="text" name="sistemaNervoso.sinaisNeurologicos" value={formData.sistemaNervoso.sinaisNeurologicos} onChange={handleChange} />
                    </div>

                    <h2>Sistema Osteoarticular/ Locomotor</h2>
                    <div className={styles.column}>
                        <label>Postura/ marcha: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.posturaMarcha" value={formData.sistemaOsteoarticularLocomotor.posturaMarcha} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Claudicação: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.claudinacao" value={formData.sistemaOsteoarticularLocomotor.claudinacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Paralisia/ paresia/ ataxia: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.tipo3" value={formData.sistemaOsteoarticularLocomotor.tipo3} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Atonia/ hipotonia/ hipertonia: </label>
                        <input type="text" name="sistemaOsteoarticularLocomotor.tipo4" value={formData.sistemaOsteoarticularLocomotor.tipo4} onChange={handleChange} />
                    </div>

                    <h2>Sistema Tegumentar e Anexos</h2>
                    <div className={styles.column}>
                        <label>Pruridos/ lambedura - alergias: </label>
                        <input type="text" name="sistemaTegumentarAnexos.tipo5" value={formData.sistemaTegumentarAnexos.tipo5} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Descamações/ lesões/ nódulos/ cistos: </label>
                        <input type="text" name="sistemaTegumentarAnexos.tipo6" value={formData.sistemaTegumentarAnexos.tipo6} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Odores/ secreções: </label>
                        <input type="text" name="sistemaTegumentarAnexos.odoresSecrecoes" value={formData.sistemaTegumentarAnexos.odoresSecrecoes} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Qualidade/ coloração pelos: </label>
                        <input type="text" name="sistemaTegumentarAnexos.qualidade" value={formData.sistemaTegumentarAnexos.qualidade} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Acusia: </label>
                        <input type="text" name="sistemaTegumentarAnexos.acusia" value={formData.sistemaTegumentarAnexos.acusia} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Unhas - Crescimento/ quebra-queda: </label>
                        <input type="text" name="sistemaTegumentarAnexos.unhas" value={formData.sistemaTegumentarAnexos.unhas} onChange={handleChange} />
                    </div>

                    <h2>Sistema Visual</h2> 
                    <div className={styles.column}>
                        <label>Opacificação de cristalino: </label>
                        <input type="text" name="sistemaVisual.opacificacaoDeCristalino" value={formData.sistemaVisual.opacificacaoDeCristalino} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Perda da visão: </label>
                        <input type="text" name="sistemaVisual.perdaDaVisao" value={formData.sistemaVisual.perdaDaVisao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Secreções: </label>
                        <input type="text" name="sistemaVisual.secrecao2" value={formData.sistemaVisual.secrecao2} onChange={handleChange} />
                    </div>

                    <h2>Manejos gerais</h2>
                    <div className={styles.column}>
                        <label>Vacinação: </label>
                        <input type="text" name="manejosGerais.vacinacao" value={formData.manejosGerais.vacinacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Desverminização: </label>
                        <input type="text" name="manejosGerais.desverminizacao" value={formData.manejosGerais.desverminizacao} />
                    </div>
                    <div className={styles.column}>
                        <label>Ambiente: </label>
                        <input type="text" name="manejosGerais.ambiente" value={formData.manejosGerais.ambiente} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Banhos: </label>
                        <input type="text" name="manejosGerais.banhos" value={formData.manejosGerais.banhos} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Contactantes: </label>
                        <input type="text" name="manejosGerais.contactantes" value={formData.manejosGerais.contactantes} onChange={handleChange} />
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

export default ReabilitacaoIntegrativa;