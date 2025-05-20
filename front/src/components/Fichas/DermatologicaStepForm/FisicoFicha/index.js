import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function FichaDermatologicaStep2({formData, handleChange, nextStep, prevStep,handleChangeSelect, handleCheckboxChangeMucosas, handleLocationChange, handleLinfonodoChange, handleCaracteristicaChange}) {
    const linfonodos = [
    { value: "mandibularD", label: "Mandibular D" },
    { value: "mandibularE", label: "Mandibular E" },
    { value: "cervicalSuperiorD", label: "Cervical superior D" },
    { value: "cervicalSuperiorE", label: "Cervical superior E" },
    { value: "axilarD", label: "Axilar D" },
    { value: "axilarE", label: "Axilar E" },
    { value: "inguinalD", label: "Inguinal D" },
    { value: "inguinalE", label: "Inguinal E" },
    { value: "popliteoD", label: "Poplíteo D" },
    { value: "popliteoE", label: "Poplíteo E" }
  ];

  const caracteristicas = [
    { value: "sa", label: "S/A" },
    { value: "aumentado", label: "Aumentado" },
    { value: "doloroso", label: "Doloroso" },
    { value: "aderido", label: "Aderido" },
    { value: "naoAvaliado", label: "Não avaliado" }
  ];
    const handleSubmit = (event) => {
        event.preventDefault();
        nextStep(); 
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton onClick={prevStep} />
            <h1>Ficha Dermatológica</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    <h2>Exame físico geral</h2>
                    
                    <div className={styles.box}>
                        <div className={styles.column}>
                        
                            <label htmlFor="postura">Postura:</label>
                            <select
                                id="postura"
                                name="postura"
                                value={formData.tipo.postura}
                                onChange={handleChangeSelect}
                            >
                                <option value="">Selecione</option>
                                <option value="Estacao">Estação</option>
                                <option value="Decubito">Decúbito</option>
                                <option value="Cavalete">Cavalete</option>
                                <option value="Ortopneica">Ortopnéica</option>
                                <option value="Outros">Outros</option>
                            </select>

                            {formData.tipo.postura === "Outros" && (
                                <div>
                                <label htmlFor="outrosDetalhes">Especifique a postura:</label>
                                <input
                                    id="outrosDetalhes"
                                    type="text"
                                    name="outrosDetalhes"
                                    value={formData.tipo.outrosDetalhes}
                                    onChange={handleChangeSelect}
                                    placeholder="Digite a postura"
                                />
                                </div>
                            )}
                        </div>
                       
                        <div className={styles.column}>
                                <label>Nível de consciência:
                                    <select name="nivelDeConsciencia" value={formData.nivelDeConsciencia} onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        <option value="Alerta">Alerta</option>
                                        <option value="Deprimido">Deprimido</option>
                                        <option value="Excitado">Excitado</option>
                                        <option value="AusenteComa">Ausente (coma)</option>
                                    </select>
                                </label>
                        </div>

                        <div className={styles.column}>
                                <label>Score corporal:
                                    <select name="scoreCorporal" value={formData.scoreCorporal} onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        <option value="Caquetico">Caquetico</option>
                                        <option value="Magro">Magro</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Sobrepeso">Sobrepeso</option>
                                        <option value="Obeso">Obeso</option>
                                    </select>
                                </label>
                        </div>
                        
                    
                        <div className={styles.column}>
                            <label>Temperatura:
                                <input type="text" name="temperatura" value={formData.temperatura} onChange={handleChange} placeholder="Digite a temperatura" />
                            </label>
                        </div>
                        

                        <div className={styles.column}>
                            <label>Turgor cutâneo:
                                <input type="text" name="turgorCutaneo" value={formData.TurgorCutaneo} onChange={handleChange} placeholder="Turgor cutâneo" />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>TPC:
                                <input type="text" name="tpc" value={formData.tpc} onChange={handleChange} placeholder="Digite o TPC" />
                            </label>
                        </div>
                     </div>
                        <div>
                        <div className={styles.column}>
                         <label>Mucosas</label>
                        </div>
                        
                        <p>Localização (oculopalpebral, nasal, bucal, vulvar, prepúcial ou anal)</p>
                         <div className={styles.checkbox_container}>
                            {Object.keys(formData.options).map((option) => (
                            <div key={option}>
                                <label>
                                <input
                                    type="checkbox"
                                    name={option}
                                    checked={formData.options[option]}
                                    onChange={handleCheckboxChangeMucosas}
                                />
                                {option === "roseas" && "Róseas"}
                                {option === "roseasPalidas" && "Róseas pálidas"}
                                {option === "porcelanicas" && "Porcelânicas"}
                                {option === "hiperemicas" && "Hiperêmicas"}
                                {option === "cianoticas" && "Cianóticas"}
                                {option === "ictaricas" && "Ictéricas"}
                                {option === "naoAvaliado" && "Não avaliado"}
                                </label>
                                {formData.options[option] && (
                                <div className={styles.location_input}>
                                    <input
                                    type="text"
                                    name={option}
                                    value={formData.locations[option]}
                                    onChange={handleLocationChange}
                                    placeholder="Digite a localização"
                                    />
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        </div>
                       <div>
                        <div className={styles.column}>
                        <label>Linfonodos</label>
                        </div>
                        <div className={styles.checkbox_container}>
                            {linfonodos.map((linfonodo) => (
                            <div key={linfonodo.value}>
                                <label>
                                <input
                                    type="checkbox"
                                    name={linfonodo.value}
                                    checked={linfonodo.value in formData.linfonodos}
                                    onChange={(e) => handleLinfonodoChange(e, linfonodo.value)}
                                />
                            
                                {linfonodo.label}
                                </label>
                                
                                {formData.linfonodos[linfonodo.value] && (
                                <div>
                                    {caracteristicas.map((caracteristica) => (
                                    <label key={caracteristica.value}>
                                        <input
                                        type="checkbox"
                                        name={caracteristica.value}
                                        checked={formData.linfonodos[linfonodo.value]?.includes(caracteristica.value) || false}
                                        onChange={(e) => handleCaracteristicaChange(e, linfonodo.value)}
                                        />
                                        {caracteristica.label}
                                    </label>
                                    ))}
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        </div>
                        
                        <div className={styles.column}>
                            <label>Alterações clínicas diversas:
                                <textarea type="text" name="alteracoesClinicas" value={formData.alteracoesClinicas} onChange={handleChange} rows="4" cols="50" />
                            </label>
                        </div>
                   

                    <div className={styles.button_box}>
                        <VoltarWhiteButton onClick={prevStep}/>
                        <ContinuarFichasGreenButton type="submit"/>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default FichaDermatologicaStep2;