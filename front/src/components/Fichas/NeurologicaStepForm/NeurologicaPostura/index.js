import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function FichaNeurologica({formData, handleChange, nextStep, handleCheckboxChange, cleanLocalStorage}) {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulário válido. Dados prontos para envio:", formData);
        nextStep(); 
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha Neurológica</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    <button className={styles.dados_ocultos} type="button">
                        Dados do animal
                        <span>+</span>
                    </button>

                    <div className={styles.titulo}>
                        Estado mental
                    </div>

                    <div className={styles.column}>
                        <label>Nível de consciência ( Troco encefálico e córtex - SARA): 
                            <textarea name="nivelConsciencia" value={formData.nivelConsciencia} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Resultados dos exames realizados:
                            <textarea name="resultadoExame" value={formData.resultadoExame} onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
            
                    <div className={styles.titulo}>
                         Postura (Circular)
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Estação", "Cabeça inclinada (D/E)", "Cabeça virada (D/E)", "Queda",
                            "Tetania", "Tremor", "Descerebrada", "Descerebelada",
                            "Schiff-sherrington", "Decubito",  "Outro"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["postura"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "postura")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                    
                    <div className={styles.titulo}>
                        Locomoção (Integração entre visão, equilíbrio, propriocepção e função motora)
                    </div>
                    <div className={styles.column}>
                        <label>Descrição e membros afetados:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Normal", "Claudicação", "Ataxia",  "Paresia"
                            ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["descricaoLocomocao"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "descricaoLocomocao")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                    
                    <div className={styles.titulo}>
                        Tipo de ataxia
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "vestibular", "cerebelar", "proprioceptiva"
                            ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["tipoAtaxia"]?.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "tipoAtaxia")}
                                    /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
          
                    <div className={styles.column}>
                        <label>Andar compulsivo?</label>
                        <select id="meia-caixa" name="andarCompulsivo" value={formData.andarCompulsivo} onChange={handleChange} >
                            <option value="">Selecione</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage}/>
                        < ContinuarFichasGreenButton type="submit"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FichaNeurologica;