import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

const ALIMENTACAO_OPTS  = [" Ração", " Dieta caseira", " Ração + Dieta caseira"];
const ESTILO_VIDA_OPTS  = [" Domiciliado", " Extradomiciliado", " Área endêmica para Dirofilariose"];
function AtendimentoCardiologico({
    formData, 
    handleChange, 
    nextStep, 
    cleanLocalStorage, 
    handleCheckboxChangeVacinacao, 
    handleLocationChange,
    handleCheckboxChange
}) {

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
                    <h2 className={styles.title}>Anamnese</h2>

                    <div className={styles.column}>
                        <label>Peso:</label>
                        <input
                        type="text"
                        name="peso"
                        value={formData.peso}
                        onChange={handleChange}
                        style={{
                            width: "310px", // Define uma largura menor
                        }}
                        />
                    </div>

                    <div className="row fw-medium mb-2">
                        <div className="col-3 mb-3 mt-4">Vacinação</div>
                        <div className="col mt-4 mb-3">
                            Produto e data de aplicação:
                        </div>

                        <div >
                        {formData.opc && Object.keys(formData.opc).map((opc) => (
                        <div key={opc} className="row align-items-start mb-2">
                            <div className={`${styles.checkbox_container} ${styles.checkbox_square} col-3`}>
                            <label className="d-flex align-items-center">
                            <input
                                type="checkbox"
                                name={opc}
                                checked={formData.opc[opc]}
                                onChange={handleCheckboxChangeVacinacao}
                                className="me-2"
                            />
                            {opc === "antiRabica" && "anti-Rábica"}
                            {opc === "giardia" && "Giardia"}
                            {opc === "leishmaniose" && "Leishmaniose"}
                            {opc === "tosseDosCanis" && "Tose dos Canis"}
                            {opc === "polivalenteCanina" && "Polivalente Canina"}
                            {opc === "polivalenteFelina" && "Polivalente Felina"}
                            {opc === "outros" && "Outros"}
                            {opc === "naoInformado" && "Não informados"}
                            {opc === "naoVacinado" && "Não vacinado"}
                            </label>
                            </div>
                            
                            <div className="col">
                                <input
                                type="text"
                                name={opc}
                                value={formData.vacinacao[opc]}
                                onChange={handleLocationChange}
                                disabled={!formData.opc[opc]}
                                className="form-control"
                                />
                            </div>
                        </div>
                        ))}
                        </div>
                    </div>

                    <div className={styles.column}>
                        <label className="form-label fw-medium">Alimentação</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {ALIMENTACAO_OPTS.map(opt => (
                        <label key={opt} >
                            <input
                            type="radio"
                            name="alimentacao"
                            value={opt}
                            checked={formData.alimentacao === opt}
                            onChange={handleChange}
                            /> {opt}
                        </label>
                        ))}
                    </div>

                     <div className={styles.column}>
                        <label className="form-label fw-medium">Estilo de Vida</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {ESTILO_VIDA_OPTS.map(opt => (
                        <label key={opt} >
                            <input
                            type="radio"
                            name="estiloVida"
                            value={opt}
                            checked={formData.estiloVida === opt}
                            onChange={handleChange}
                            /> {opt}
                        </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label className="form-label fw-medium">Contactantes/Ambiente/Manejo domissanitário/Tabagismo passivo</label>
                        <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        name="contactantes"
                        value={formData?.contactantes || ""}
                        onChange={handleChange}
                        className="form-control"/>
                    </div>

                    <div className={styles.column}>
                        <label>Sinais Clinicos</label>
                    </div>
                    <div className={`${styles.checkbox_container} ${styles.checkbox_square} ${styles.inputs_three_columns}`}>
                        {[
                            "Cansaço facil/Intolerância à atividade física", " Inquietação noturna/ortopnéica", 
                            "Síncope", "Espirro/Espirro reverso", "Perda aguda de visão",
                            "Aumento de volume abdominal", "Edema periférico", "Paralisia",
                            "Polifagia", "Polidipsia", "Oligodipsia", "Anúria",
                            "Dispinéia", " Pré-síncope", 
                            "Tosse", "Epistaxe", "Cianose",
                            "Paresia", "Poliúria", "Oligúria",
                            "Adipisia", "Sem alterações",
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["sinaisClinicos"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "sinaisClinicos")}
                                /> {item.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                    
                    <div className={styles.column}>
                        <label>Antecedentes familiares / Histórico de doenças e tratamentos / Respostas (anterior e atual)</label>
                            <textarea name="antecedentesHistorico" 
                            value={formData.antecedentesHistorico} 
                            onChange={handleChange} rows="4" cols="50" />
                        
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
