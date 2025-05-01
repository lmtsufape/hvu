import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function AtendimentoOrtopedico({formData, handleChange, nextStep, prevStep}) {

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
                    
                    <h1>Inspeção visual</h1>
                    <div className={styles.column}>
                        <label>Condição corporal: </label>
                        <input type="text" name="condicaoCorporal" value={formData.condicaoCorporal} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Comportamento: </label>
                        <input type="text" name="comportamento" value={formData.comportamento} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Postura: </label>
                        <input type="text" name="postura" value={formData.postura} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Capacidade de sustentar o peso: </label>
                        <input type="text" name="capacidadePeso" value={formData.capacidadePeso} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Tumefação: </label>
                        <input type="text" name="tumefacao" value={formData.tumefacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Assimetrias, desvios: </label>
                        <input type="text" name="assimetriaDesvio" value={formData.assimetriaDesvio} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Atrofia muscular: </label>
                        <input type="text" name="atrofiaMuscular" value={formData.atrofiaMuscular} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Escoriações, fístulas: </label>
                        <input type="text" name="escoriacoesFistulas" value={formData.escoriacoesFistulas} onChange={handleChange} />
                    </div>
             
                    <h1>Marcha</h1>
                    <h2>(Ante-si, Contra-se, Lareral, Passo-trote, Círculos, Inclinado)</h2>
                
                    <div className={styles.column}>
                        <label>Características: </label>
                        <input type="text" name="caracteristicas" value={formData.caracteristicas} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Claudicação (tipo e grau): </label>
                        <input type="text" name="claudicacao" value={formData.claudicacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Fase de apoio: </label>
                        <input type="text" name="faseApoio" value={formData.faseApoio} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Fase de elevação: </label>
                        <input type="text" name="faseElevacao" value={formData.faseElevacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ângulo das articulações: </label>
                        <input type="text" name="anguloArticulacoes" value={formData.anguloArticulacoes} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Obs: </label>
                        <input type="text" name="segundaObservacao" value={formData.segundaObservacao} onChange={handleChange} />
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

export default AtendimentoOrtopedico;