import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function AtendimentoCardiologico({formData, handleChange, nextStep, handleCheckboxChange, cleanLocalStorage}) {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Formulário válido. Dados prontos para envio:", formData);
        nextStep(); 
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Atendimento Cardiologico</h1>
            <div className={styles.form_box}>
                
                <form onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Anamnese</h1>
                    <div className={styles.anamnesecontainer}>
                        {[
                            "NãoVacinado", "Vacinado", "DietaCaseira", "RaçãoManutenção",
                            "RaçãoComidaCaseira", "RaçãoTerapêutica", "AnimalDomiciliado",
                            "AnimalSemiDomiciliado", "ÁreaEndêmicaDirofilariose", "Profilaxias",
                            "IntolerânciaAtividadeFísica", "Dispneia", "InquietaçãoNoturna",
                            "PréSíncope", "Síncope", "Tosse", "EspirroReverso", "Epistaxe",
                            "PerdaVisão", "Cianose", "AumentoVolumeAbdominal", "EdemaPeriférico",
                            "Polifagia", "Poliúria", "Polidipsia", "Oligúria", "Oligodipsia",
                            "Adipsia", "Anúria", "SemAlterações"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData.anamnese.includes(item)}
                                    onChange={(e) => handleCheckboxChange(e, "anamnese")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                    <div className={styles.column}>
                        <label>Antecedentes familiares / Histórico de doenças e tratamentos / Respostas (anterior e atual):
                            <textarea name="antecedentesHistorico" 
                            value={formData.antecedentesHistorico} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    
                    <h1 className={styles.title}>Exame Físico</h1>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <div className="exameFisico">
                                <label>Nível de consciência: 
                                    <input type="text" 
                                    name="exameFisico.nivelConsciencia" 
                                    value={formData.exameFisico.nivelConsciencia} 
                                    onChange={handleChange} />
                                </label>
                                <label>Atitude/Postura: 
                                    <input type="text" 
                                    name="exameFisico.atitudePostura"
                                    value={formData.exameFisico.atitudePostura} 
                                    onChange={handleChange} />
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label>ACP: 
                                    <input type="text" 
                                    name="exameFisico.acp" 
                                    value={formData.exameFisico.acp} 
                                    onChange={handleChange} />
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label>Pulso arterial: 
                                    <input type="text" 
                                    name="exameFisico.pulsoArterial" 
                                    value={formData.exameFisico.pulsoArterial} 
                                    onChange={handleChange} />
                                </label>
                                <label>Distensão/Pulso Jugular:
                                    <input type="text" 
                                    name="exameFisico.distensaoPulsoJugular" 
                                    value={formData.exameFisico.distensaoPulsoJugular} 
                                    onChange={handleChange} />
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label>FC: 
                                    <input type="text" name="exameFisico.fc"
                                    value={formData.exameFisico.fc} 
                                    onChange={handleChange} />
                                </label>
                                <label>FR: 
                                    <input type="text" name="exameFisico.fr" 
                                    value={formData.exameFisico.fr} 
                                    onChange={handleChange} />
                                </label>
                                <label>Respiração: 
                                    <input type="text" name="exameFisico.respiracao" 
                                    value={formData.exameFisico.respiracao} 
                                    onChange={handleChange} />
                                </label>
                                <label>Mucosas: 
                                    <input type="text" name="exameFisico.mucosas" 
                                    value={formData.exameFisico.mucosas} 
                                    onChange={handleChange} />
                                </label>
                                <label>TPC: 
                                    <input type="text" name="exameFisico.tpc" 
                                    value={formData.exameFisico.tpc} 
                                    onChange={handleChange} />
                                </label>
                                <label>Hidratação: 
                                    <input type="text" name="exameFisico.hidratacao" 
                                    value={formData.exameFisico.hidratacao} 
                                    onChange={handleChange} />
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label>Narinas/Traqueia/Tireóide: 
                                    <input type="text" name="exameFisico.narinasTraqueiaTireoide" 
                                    value={formData.exameFisico.narinasTraqueiaTireoide} 
                                    onChange={handleChange} />
                                </label>
                                <label>Abdome: 
                                    <input type="text" name="exameFisico.abdome" 
                                    value={formData.exameFisico.abdome} 
                                    onChange={handleChange} />
                                </label>
                            </div>
                        </div>
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

export default AtendimentoCardiologico;
