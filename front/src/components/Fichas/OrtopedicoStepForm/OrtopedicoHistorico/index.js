import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function AtendimentoOrtopedico({formData, handleChange, nextStep}) {

    const handleSubmit = (event) => {
        event.preventDefault();
        nextStep(); 
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de atendimento ortopédico</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    
                    <h1>Histórico</h1>
                    <div className={styles.column}>
                        <label>Queixa principal: </label>
                        <input type="text" name="queixaPrincipal" value={formData.queixaPrincipal} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ocorrência de trauma: </label>
                        <input type="text" name="ocorrenciaTrauma" value={formData.ocorrenciaTrauma} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Duração do problema: </label>
                        <input type="text" name="duracaoProblema" value={formData.duracaoProblema} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Evolução do quadro: </label>
                        <input type="text" name="evolucaoQuadro" value={formData.evolucaoQuadro} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ocorrência de claudicação (frio/quente, ocasional/frequente/constante, caminhada/ subida/
                               salto, influência do clima e evolução): </label>
                        <input type="text" name="ocorrenciaClaudicacao" value={formData.ocorrenciaClaudicacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Tolerância ao exercício: </label>
                        <input type="text" name="toleranciaExercicio" value={formData.toleranciaExercicio} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Indícios de dor: </label>
                        <input type="text" name="indiciosDor" value={formData.indiciosDor} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Acidentes/doenças anteriores: </label>
                        <input type="text" name="acidentesAnteriores" value={formData.acidentesAnteriores} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Tratamentos: </label>
                        <input type="text" name="Tratamentos" value={formData.Tratamentos} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Alimentação (tipo, quantidade, frequência): </label>
                        <input type="text" name="Alimentacao" value={formData.Alimentacao} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Vitaminas/minerais (quantidade, período): </label>
                        <input type="text" name="vitaminas" value={formData.vitaminas} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Ambiente: </label>
                        <input type="text" name="ambiente" value={formData.ambiente} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Obs: </label>
                        <input type="text" name="observacao" value={formData.observacao} onChange={handleChange} />
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

export default AtendimentoOrtopedico;