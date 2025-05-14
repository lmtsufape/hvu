import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function ReabilitacaoIntegrativa({formData, handleChange, nextStep}) {

    const handleSubmit = (event) => {
        event.preventDefault();
        nextStep(); 
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Reabilitacao Integrativa</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    
                    <div className={styles.column}>
                        <label>Nº Prontuário: </label>
                        <input type="text" name="numeroProntuario" value={formData.numeroProntuario} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>peso: </label>
                        <input type="text" name="peso" value={formData.peso} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>queixa Principal: </label>
                        <input type="text" name="queixaPrincipal" value={formData.queixaPrincipal} onChange={handleChange} />
                    </div>

                    <h2>Histórico clínico especial</h2>
              
                    <div className={styles.column}> 
                        <label>Histórico Ortopédico:</label>
                        <input type="text" name="historicoClinico.ortopedico" value={formData.historicoClinico.ortopedico} onChange={handleChange}/>
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
                        <input type="text" name="historicoClinico.outros" value={formData.historicoClinico.outros} onChange={handleChange}/>
                    </div>

                    <h2>Exame clínico especial</h2>
                    <p>Ortopédico</p>

                    <div className={styles.column}>
                        <label>Palpação de membros e articulações: </label>
                        <input type="text" name="exameClinicoEspecialOrtpedico.palpacaoMembrosArticulacao" value={formData.exameClinicoEspecialOrtpedico.palpacaoMembrosArticulacao} onChange={handleChange} />
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
                        <input type="text" name="exameClinicoEspecialNeurologico.nervosCranianos" value={formData.exameClinicoEspecialNeurologico.nervosrCranianos} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Reaçoes Posturais: </label>
                        <input type="text" name="exameClinicoEspecialNeurologico.reacoesPosturais" value={formData.exameClinicoEspecialNeurologico.reacoesPosturais} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Reflecões Segmentares: </label>
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

                    <h2>queixa Principal</h2>
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
                        < CancelarWhiteButton />
                        < ContinuarFichasGreenButton type="submit"/>
                    </div> 
                </form>
            </div>
        </div>
    )
}

export default ReabilitacaoIntegrativa;