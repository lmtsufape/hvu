import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import DrawingModal from "@/components/Fichas/DrawingModal";

function FichaDermatologica({formData, handleChange, prevStep, handleCheckboxChange, handleSubmit, handleSaveDrawing, imagemDesenhada}) {
    
    const [showDrawingModal, setShowDrawingModal] = useState(false);
    const dimensoesImagem = {
        largura: 600,
        altura: 440
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton onClick={prevStep}/>
            <h1>Ficha Dermatológica</h1>
            <div className={styles.form_box}>

                <form onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Exame dermatológico</h1>
                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Ectoparasitas:
                                <select name="ectoparasitas" 
                                value={formData.ectoparasitas} 
                                onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Pelagem:
                                <select name="pelagem" value={formData.pelagem} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Opacos">Opacos</option>
                                    <option value="Oleosa">Oleosa</option>
                                    <option value="Ressecados">Ressecados</option>
                                    <option value="Quebradiços">Quebradiços</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Descamação:
                                <select name="descamacao" value={formData.descamacao} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Farinácea">Farinácea</option>
                                    <option value="Furfurácea">Furfurácea</option>
                                    <option value="Micácea">Micácea</option>
                                    <option value="Ausente">Ausente</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Untuosidade:
                                <select name="untuosidade" value={formData.untuosidade} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Presente">Presente</option>
                                    <option value="Ausente">Ausente</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Conduto auditivo direito:
                                <select name="condutoAuditivoDireito" value={formData.condutoAuditivoDireito} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Eritema">Eritema</option>
                                    <option value="Cerúmen">Cerúmen</option>
                                    <option value="Liquenificação">Liquenificação</option>
                                    <option value="Otorréia amarelada">Otorréia amarelada</option>
                                    <option value="Descamação">Descamação</option>
                                    <option value="Melanose">Melanose</option>
                                    <option value="Estenose">Estenose</option>
                                    <option value="Otorréia enegrécida">Otorréia enegrécida</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Conduto auditivo esquerdo:
                                <select name="condutoAuditivoEsquerdo" value={formData.condutoAuditivoEsquerdo} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Eritema">Eritema</option>
                                    <option value="Cerúmen">Cerúmen</option>
                                    <option value="Liquenificação">Liquenificação</option>
                                    <option value="Otorréia amarelada">Otorréia amarelada</option>
                                    <option value="Descamação">Descamação</option>
                                    <option value="Melanose">Melanose</option>
                                    <option value="Estenose">Estenose</option>
                                    <option value="Otorréia enegrécida">Otorréia enegrécida</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    
                    <div className={styles.column}>
                        <label>Localização/Descrição das lesões:
                            <div 
                                onClick={() => setShowDrawingModal(true)}
                                style={{cursor: 'pointer', textAlign: 'center'}}
                            >
                                {imagemDesenhada ? (
                                    <img 
                                    src={imagemDesenhada} 
                                    alt="Localização das lesões com marcações" 
                                    style={{maxWidth: '500px'}}
                                    />
                                ) : (
                                    <img
                                    src="/images/localizacao_lesoes.png"
                                    alt="Localização das lesões"
                                    style={{ maxWidth: '500px'}}
                                    />
                                )}
                                <p style={{color: 'black'}}>Clique para desenhar sobre a imagem</p>
                            </div>
                        </label>
                    </div>

                    <DrawingModal 
                        show={showDrawingModal}
                        onHide={() => setShowDrawingModal(false)}
                        backgroundImage="/images/localizacao_lesoes.png"
                        onSave={handleSaveDrawing}
                        showDrawingModal={showDrawingModal}
                        dimensoesImagem={dimensoesImagem}
                    />

                    <div className={styles.box}>
                        <div className={styles.column}>
                            <label>Formações sólidas:
                                <select name="formacoesSolidas" value={formData.formacoesSolidas} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Macula">Macula</option>
                                    <option value="Pápula">Pápula</option>
                                    <option value="Placa">Placa</option>
                                    <option value="Nódulo">Nódulo</option>
                                    <option value="Tumor">Tumor</option>
                                    <option value="Goma">Goma</option>
                                    <option value="Vegetação">Vegetação</option>
                                    <option value="Verrucosidade">Verrucosidade</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Alterações de cor:
                                <select name="alteracoesDeCor" value={formData.alteracoesDeCor} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Eritema">Eritema</option>
                                    <option value="Hiperpigmentação">Hiperpigmentação</option>
                                    <option value="Despigmentação">Despigmentação</option>
                                    <option value="Telangiectasia">Telangiectasia</option>
                                    <option value="Feotriquia">Feotriquia</option>
                                    <option value="Petéquias">Petéquias</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Coleções Líquidas:
                                <select name="colecoesLiquidas" value={formData.colecoesLiquidas} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Pústulas">Pústulas</option>
                                    <option value="Vesículas">Vesículas</option>
                                    <option value="Bolhas">Bolhas</option>
                                    <option value="Cistos">Cistos</option>
                                    <option value="Abcesso">Abscesso</option>
                                    <option value="Flegmão">Flegmão</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Alterações de Espessura:
                                <select name="alteracoesEspessura" value={formData.alteracoesEspessura} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Liquenificação">Liquenificação</option>
                                    <option value="Hiperqueratose">Hiperqueratose</option>
                                    <option value="Cicatriz">Cicatriz</option>
                                    <option value="Calcinose Cutânea">Calcinose Cutânea</option>
                                </select>
                            </label>
                        </div>
                        <div className={styles.column}>
                            <label>Perdas Teciduais e Reparações:
                                <select name="perdasTeciduais" value={formData.perdasTeciduais} onChange={handleChange}>
                                    <option value="">Selecione</option>
                                    <option value="Disqueratose">Disqueratose</option>
                                    <option value="Hipotricose">Hipotricose</option>
                                    <option value="Alopecia">Alopecia</option>
                                    <option value="Comedos">Comedos</option>
                                    <option value="Crostas H/M">Crostas H/M</option>
                                    <option value="Colaretes Epiderm">Colaretes Epiderm</option>
                                    <option value="Escoriação">Escoriação</option>
                                    <option value="Úlceras">Úlceras</option>
                                    <option value="Fístula">Fístula</option>
                                </select>
                            </label>
                        </div>
                 
                    </div>
                    <div className={styles.column}>
                        <label>Descrição lesional(Locais afetados):
                            <textarea type="text" name="descricaoLesional" value={formData.descricaoLesional} 
                            onChange={handleChange} rows="4" cols="100" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Critérios de Favrot:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Prurido inicia antes de 3 anos de idade",
                            "Prurido melhora com o uso de corticóides",
                            "Cão domiciliado (tem contato com a poeira domiciliar?)",
                            "Prurido alesional (prurido ocorre antes das lesões?)",
                            "Prurido em dígitos torácicos",
                            "Otite frequente",
                            "Bordas dos pavilhões auriculares não afetadas",
                            "Região dorsolombar não afetada"
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["criteriosFavrot"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "criteriosFavrot")}
                                /> {item}
                            </label>
                        ))}
                    </div>
                    <div className={styles.column}>
                        <label>Obs:
                            <textarea type="text" name="observacao" 
                            value={formData.observacao} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Diagnóstico: </label>
                        <label>Presuntivo:
                            <input type="text" name="diagnostico.presuntivo" 
                            value={formData.diagnostico.presuntivo} 
                            onChange={handleChange} />
                        </label>
                        <label>Definitivo:
                            <input type="text" name="diagnostico.definitivo" 
                            value={formData.diagnostico.definitivo} 
                            onChange={handleChange} />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Tratamento:
                            <textarea type="text" name="tratamento" 
                            value={formData.tratamento} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Médico veterinário:
                        <input type="text" name="medico" 
                        value={formData.medico} 
                        onChange={handleChange} />
                        </label>
                    </div>
                    <div className={styles.column}>
                        <label>Estágiarios:
                            <textarea type="text" name="estagiarios" 
                            value={formData.estagiarios} 
                            onChange={handleChange} rows="4" cols="50" />
                        </label>
                    </div>

                    <div className={styles.button_box}>
                        < VoltarWhiteButton onClick={prevStep}/>
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FichaDermatologica;