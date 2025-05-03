import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

function FichaDermatologicaStep2({formData, handleChange, nextStep, prevStep}) {

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
                    <h1 className={styles.title}>Exame físico geral</h1>
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Comportamento:
                                <select name="comportamento" 
                                value={formData.comportamento} 
                                onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Apático">Apático</option>
                                    <option value="Sonolento">Sonolento</option>
                                    <option value="Termofilia">Termofilia</option>
                                    <option value="Hiperativo">Hiperativo</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Score corporal:
                                <select name="scoreCorporal" value={formData.scoreCorporal} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Temperatura:
                                <input type="text" name="temperatura" value={formData.temperatura} onChange={handleChange} placeholder="Digite a temperatura" />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Mucosas:
                                <select name="mucosas" value={formData.mucosas} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Róseas">Róseas</option>
                                    <option value="Ictéricas">Ictéricas</option>
                                    <option value="Róseas pálidas">Róseas pálidas</option>
                                    <option value="Porcelanas">Porcelanas</option>
                                    <option value="Congestas">Congestas</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Linfonodos:
                                <textarea type="text" name="linfonodos" value={formData.linfonodos} onChange={handleChange} rows="4" cols="50" />
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Alterações clínicas diversas:
                                <textarea type="text" name="alteracoesClinicas" value={formData.alteracoesClinicas} onChange={handleChange} rows="4" cols="50" />
                            </label>
                        </div>
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