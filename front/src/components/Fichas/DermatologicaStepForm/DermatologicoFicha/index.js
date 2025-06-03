import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import DrawingModal from "@/components/Fichas/DrawingModal";
import SolicitacaoDeExameAninhar from "@/components/Fichas/SolicitacaoDeExameAninhar";

function FichaDermatologica({formData, handleChange, prevStep, handleCheckboxChange, handleSubmit, 
    handleSaveDrawing, imagemDesenhada, handleChangeTratamentos, tratamentos, adicionarLinhaTratamento, 
    removerUltimaLinhaTratamento,setFormData}) {
    
    const [showDrawingModal, setShowDrawingModal] = useState(false);
    const dimensoesImagem = {
        largura: 600,
        altura: 440
    };
    const [mostrarExames, setMostrarExames] = useState(false);
    const toggleMostrarExames = () => {
        setMostrarExames((prev) => !prev);
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton onClick={prevStep}/>
            <h1>Ficha Dermatológica</h1>
                <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
                    <h2>Exame dermatológico</h2>
                    
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
                        <label>Pelagem:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Normal","Oleosa","Opaco","Resecados","Quebradiços"
                           
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["pelagem"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "pelagem")}
                                /> {item}
                            </label>
                        ))}
                    </div>
                       
                    <div className={styles.column}>
                        <label>Conduto auditivo Direito:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "S/A","Com alteração","Eritema","Cerúmen","Liquenificação","Otorréia amarelada",
                            "Descamação","Melanose","Estenose","Otorréia enegrécida"
                           
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["condutoAuditivoDireito"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "condutoAuditivoDireito")}
                                /> {item}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label>Conduto auditivo esquerdo:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "S/A","Com alteração","Eritema","Cerúmen","Liquenificação","Otorréia amarelada",
                            "Descamação","Melanose","Estenose","Otorréia enegrécida"
                           
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["condutoAuditivoEsquerdo"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "condutoAuditivoEsquerdo")}
                                /> {item}
                            </label>
                        ))}
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

                    <div className={styles.column}>
                        <label>Formações sólidas:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Mácula","Pápula","Placa","Nódulo","Tumor","Goma","Vegetação","Verrucosidade"
                           
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["formacoesSolidas"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "formacoesSolidas")}
                                /> {item}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label>Alteração de Cor:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Liquenificação","Hipergmentação","Despigmentação","Telangiectasia","Petéquias",
                           
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["alteracoesDeCor"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "alteracoesDeCor")}
                                /> {item}
                            </label>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <label>Coleções Líquidas:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Pústulas","Vesículas","Bolhas","Cistos","Abcesso","Flegmão"
                           
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["colecoesLiquidas"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "colecoesLiquidas")}
                                /> {item}
                            </label>
                        ))}
                    </div>

                     <div className={styles.column}>
                        <label>Alterações de Espessura:</label>
                    </div>
                    <div className={styles.checkbox_container}>
                        {[
                            "Liquenificação","Hiperqueratose","Cicatriz","Calcinose Cutânea"
                           
                        ].map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={formData["alteracoesEspessura"]?.includes(item)} 
                                    onChange={(e) => handleCheckboxChange(e, "alteracoesEspessura")}
                                /> {item}
                            </label>
                        ))}
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
                     <button
                        type="button"
                        onClick={toggleMostrarExames}
                        className={`${styles.toggleButton} ${
                            mostrarExames ? styles.minimize : styles.expand
                        }`}
                        >
                        {mostrarExames ? "Ocultar Exames" : "Solicitar Exame"}
                    </button>
                    {mostrarExames && (
                    <SolicitacaoDeExameAninhar
                        formData={formData.SolicitacaoDeExame}
                        setFormData={setFormData}
                    />
                    )}
                    <div className={styles.column}>
                       <h2>Diagnóstico e Tratamento</h2>
                        <label>Definitivo:
                            <input type="text" name="diagnostico.definitivo" 
                            value={formData.diagnostico.definitivo} 
                            onChange={handleChange} />
                        </label>
                    </div>
                    <div className={styles.column}>
                    <label>Observações:
                        <input type="text" name="diagnostico.observacoes" 
                        value={formData.diagnostico.observacoes} 
                        onChange={handleChange} />
                    </label>
                    </div>
                    <div className={styles.column}>
                    <label>Prognóstico:
                        <input type="text" name="diagnostico.prognostico" 
                        value={formData.diagnostico.prognostico} 
                        onChange={handleChange} />
                    </label>
                    </div>

                    <div className={styles.column}>
                        <label>Tratamento:</label>
                        <table className={styles.tabela_tratamento}>
                            <thead>
                                <tr>
                                    <th>Medicação</th>
                                    <th>Dose</th>
                                    <th>Frequência</th>
                                    <th>Período</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tratamentos.map((linha, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                            type="text"
                                            value={linha.medicacao}
                                            onChange={(e) => handleChangeTratamentos(index, "medicacao", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            value={linha.dose}
                                            onChange={(e) => handleChangeTratamentos(index, "dose", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            value={linha.frequencia}
                                            onChange={(e) => handleChangeTratamentos(index, "frequencia", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                            type="text"
                                            value={linha.periodo}
                                            onChange={(e) => handleChangeTratamentos(index, "periodo", e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.bolha_container}>
                            <div className={styles.bolha} onClick={adicionarLinhaTratamento}>
                                +
                            </div>
                            <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaLinhaTratamento}>
                                -
                            </div>
                        </div>
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
                            onChange={handleChange} />
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