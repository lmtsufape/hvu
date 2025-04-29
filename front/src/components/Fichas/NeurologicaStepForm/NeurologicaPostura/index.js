import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function FichaNeurologica({formData, handleChange, nextStep, handleCheckboxChange}) {

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
                    <h1 className={styles.title}>Estado mental</h1>
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
            

                    <h1 className={styles.title}>Postura(Circular)</h1>
                    <div className={styles.checkbox_container}>
                        {[
                            "Estação", "cabeça inclinada (D/E)", "cabeça virada (D/E)", "queda",
                            "tetania", "tremor", "descerebrada", "descerebelada",
                            "Schiff-sherrington", "decubito",  "Outro"
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

                    <h1 className={styles.title}>Locomoção</h1>
                    <label>Descrição e membros afetados:</label>
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
                    <label>Tipo de ataxia: </label>
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
                        <label>Andar compulsivo?
                            <input type="text" name="andarCompulsivo" value={formData.andarCompulsivo} onChange={handleChange} />
                        </label>
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

export default FichaNeurologica;