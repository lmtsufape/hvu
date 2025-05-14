import React, { useState } from "react";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";

function AtendimentoOrtopedico({formData, handleChange, handleRadioAninhado, handleSubmit, prevStep, setFormData, 
  selecionados, ladosVisiveis, toggleItem, toggleLadoVisivel,}) {

  return (
    <div className={styles.container}>
        <VoltarButton onClick={prevStep}/>
        <h1>Ficha de atendimento ortopédico</h1>

        <div className={styles.form_box}>
            <form onSubmit={handleSubmit}>
                <h2>Palpação Membro Torácico</h2> 
                <GrupoExame
                    titulo="digitosMetacarpos"
                    label="Dígitos/Metacarpos"
                    itens={[
                      {key:"flexao", label:"Flexão"},
                      {key:"extensao", label:"Extensão"}
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="carpo"
                    label="Carpo"
                    itens={[
                      { key: "hiperextensao", label: "Hiperextensão" },
                      { key: "flexao", label: "Flexão" },
                      { key: "extensao", label: "Extensão" },
                      { key: "instabilidadeMedial", label: "Instabilidade medial/lateral" },
                      { key: "rotacao", label: "Rotação" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                 />
                <GrupoExame
                    titulo="radioUlna"
                    label="Rádio / Ulna"
                    itens={[
                      {key:"olecrano", label:"Olécrano"}
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="musculosTendoes"
                    label="Músculos e tendões"
                    itens={[
                      { key: "hipertonia", label: "Hipertonia" },
                      { key: "hipotonia", label: "Hipotonia" },
                      { key: "hipertrofia", label: "Hipertrofia" },
                      { key: "atrofia", label: "Atrofia" },
                      { key: "contraturaFibrose", label: "Contratura/fibrose" },
                      { key: "enrijecimento", label: "Enrijecimento" },
                      { key: "restricaoMovArticular", label: "Restrição mov. Articular" },
                      { key: "ampliacaoMovArticular", label: "Ampliação mov. Articular" },
                      { key: "dorInchaco", label: "Dor/Inchaço" },
                      { key: "hematoma", label: "Hematoma" },
                      { key: "laceracoesRuptura", label: "Lacerações/ruptura" },
                      { key: "tremoresMioclonias", label: "Tremores/mioclonias" },
                      { key: "caibra", label: "Cãibra" },
                      { key: "depressaoMiotonicaPercussao", label: "Depressão miotônica à percussão" },
                      { key: "higroma", label: "Higroma" },
                      { key: "tumor", label: "Tumor" },
                      { key: "posturaCaranguejo", label: "Postura de caranguejo (t. calcanear)" },
                      { key: "outros", label: "Outros" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="umero"
                    label="Úmero *implementar*"
                    itens={[
                      { key:"lado", label:"Lado" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="ombro"
                    label="Ombro"
                    itens={[
                      { key: "flexao", label: "Flexão" },
                      { key: "extensao", label: "Extensão" },
                      { key: "rotacao", label: "Rotação" },
                      { key: "aducaoAbducao", label: "Adução/Abdução" },
                      { key: "palpacaoGlenoideCaudal", label: "Palpação Glenóidea caudal" },
                      { key: "compressaoUmeral", label: "Compressão umeral (abdução, adução, rotação)" },
                      { key: "origemBiceps", label: "Origem tendão do m. bíceps" },
                      { key: "retracaoBiceps", label: "Retração manual do m. bíceps" },
                      { key: "estiramentoBiceps", label: "Estiramento do m. bíceps" },
                      { key: "relAcromioTuberculoMaior", label: "Rel. Acrômio : Tubérculo maior" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="axilarSubescapular"
                    label="Área axilar/subescapular *implementar*"
                    itens={[
                      { key: "lado", label: "Lado" },
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="escapula"
                    label="Escápula"
                    itens={[
                      { key: "corpoEspinha", label: "Corpo/Espinha" },
                      { key: "colo", label: "Colo" },
                      { key: "acromio", label: "Acrômio" },
                      { key: "luxacaoDorsal", label: "Luxação dorsal" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="articulacaoCubital"
                    label="Articulação Cubital"
                    itens={[
                      { key: "flexao", label: "Flexão" },
                      { key: "extensao", label: "Extensão" },
                      { key: "instabilidadeMedialLateral", label: "Instabilidade medial/lateral" },
                      { key: "processoAnconeo", label: "Processo ânconeo" },
                      { key: "processoCoronoide", label: "Processo coronóide" },
                      { key: "efusaoArticular", label: "Efusão articular" },
                      { key: "palpacaoTensaoLigColMed", label: "Palpação/Tensão lg. Col. Med." },
                      { key: "epicondiloMedial", label: "Epicôndilo Medial" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <div className={styles.column}>
                    <label>Achados exames de imagem:
                        <textarea type="text" name="achadosImagem" 
                        value={formData.achadosImagem} 
                        onChange={handleChange} 
                        rows="4" cols="50" />
                    </label>
                </div>
                <div className={styles.column}>
                  <label>Outros exames:
                    <input type="text" name="outrosExames"
                      value={formData.outrosExames} 
                      onChange={handleChange} />
                  </label>
                </div>

                <h2>Palpação Membro Pélvico</h2> 
                <GrupoExame
                    titulo="digitosMetatarsos"
                    label="Dígitos / Metatarsos"
                    itens={[
                      { key: "flexao", label: "Flexão" },
                      { key: "extensao", label: "Extensão" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="tarso"
                    label="Tarso"
                    itens={[
                      { key: "calcaneoTendao", label: "Calcâneo / Tendão" },
                      { key: "flexao", label: "Flexão" },
                      { key: "extensao", label: "Extensão" },
                      { key: "instabilidadeMedialLateral", label: "Instabilidade medial/lateral" },
                      { key: "rotacao", label: "Rotação" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="tibiaFibula"
                    label="Tíbia / Fíbula"
                    itens={[
                      { key:"cristaTibia", label:"Crista da tíbia" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="articulacaoJoelho"
                    label="Articulação do Joelho"
                    itens={[
                      { key: "ligamentoElevacaoPatelar", label: "Ligamento/elevação patelar" },
                      { key: "luxacaoPatelarMedialLateral", label: "Luxação patelar M ou L" },
                      { key: "sentar", label: "Sentar" },
                      { key: "flexao", label: "Flexão" },
                      { key: "extensao", label: "Extensão" },
                      { key: "posicaoRotacaoCristaTibial", label: "Posição/Rotação M Crista Tibial" },
                      { key: "instabilidadeCraniomedial", label: "Instabilidade Craniomedial" },
                      { key: "gavetaCranial", label: "Gaveta Cranial (normal/extensão/flexão)" },
                      { key: "gavetaCaudal", label: "Gaveta Caudal (normal/extensão/flexão)" },
                      { key: "compressaoTibial", label: "Compressão Tibial" },
                      { key: "gavetaMedialLateral", label: "Gaveta Medial / Lateral" },
                      { key: "menisco", label: "Menisco" },
                      { key: "clickMeniscal", label: "Click Meniscal" },
                      { key: "clickTendaoExtensorDigitalLongo", label: "Click tendão ext. dig. Longo" },
                      { key: "efusaoArticular", label: "Efusão articular" },
                      { key: "coximAdiposo", label: "Coxim Adiposo" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                  titulo="femur"
                  label="Fêmur *implementar*"
                  itens={[
                    { key: "lado", label: "Lado" }
                  ]}
                  formData={formData}
                  setFormData={setFormData}
                  handleRadioAninhado={handleRadioAninhado}
                  selecionados={selecionados}
                  ladosVisiveis={ladosVisiveis}
                  toggleItem={toggleItem}
                  toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="articulacaoCoxal"
                    label="Articulação Coxal"
                    itens={[
                      { key: "conformacaoBase", label: "Conformação/base" },
                      { key: "clunck", label: "“Clunck”" },
                      { key: "stand", label: "“Stand”" },
                      { key: "abducaoRotacaoExterna", label: "Abdução com Rotação externa" },
                      { key: "simetriaReacaoExtensao", label: "Simetria/Reação extensão" },
                      { key: "testeSubluxacao", label: "Teste Subluxação" },
                      { key: "testeIliopsoas", label: "Teste Iliopsoas" },
                      { key: "anguloSubluxacao", label: "Ângulo de Subluxação" },
                      { key: "anguloReducao", label: "Ângulo de Redução" },
                      { key: "sinalOrtolani", label: "Sinal de Ortolani" },
                      { key: "sinalBarlow", label: "Sinal de Barlow" },
                      { key: "testeBardens", label: "Teste de Bardens" },
                      { key: "compressaoTrocanterica", label: "Compressão Trocantérica" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="articulacaoSacroiliaca"
                    label="Articulação Sacroilíaca *implementar*"
                    itens={[
                      { key: "lado", label: "Lado" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="pelve"
                    label="Pelve"
                    itens={[
                      { key: "cristaIliaca", label: "Crista ilíaca" },
                      { key: "tuberosidadeIsquiatica", label: "Tuberosidade Isquiática" },
                      { key: "relacaoTrocanterMaior", label: "Relação com Trocânter Maior" },
                      { key: "exameRetal", label: "Exame Retal" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <GrupoExame
                    titulo="cabecaEsqueletoAxial"
                    label="Cabeça e Esqueleto Axial"
                    itens={[
                      { key: "cranio", label: "Crânio" },
                      { key: "maxila", label: "Maxila" },
                      { key: "ramosMandibulares", label: "Ramos mandibulares" },
                      { key: "sinfiseMandibular", label: "Sínfise mandibular" },
                      { key: "atm", label: "ATM" },
                      { key: "colunaCervical", label: "Coluna cervical" }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    handleRadioAninhado={handleRadioAninhado}
                    selecionados={selecionados}
                    ladosVisiveis={ladosVisiveis}
                    toggleItem={toggleItem}
                    toggleLadoVisivel={toggleLadoVisivel}
                />
                <div className={styles.column}>
                  <label>Diagnótico:
                    <input type="text" name="diagnotico"
                      value={formData.diagnotico} 
                      onChange={handleChange} />
                  </label>
                </div>
                <div className={styles.column}>
                    <label>Tratamento:
                        <textarea type="text" name="tratamento" 
                        value={formData.tratamento} 
                        onChange={handleChange} 
                        rows="4" cols="50" />
                    </label>
                </div>
                <div className={styles.column}>
                  <label>Plantonista(s) discente(s):
                    <input type="text" name="plantonistas"
                      value={formData.plantonistas} 
                      onChange={handleChange} />
                  </label>
                </div>
                <div className={styles.column}>
                  <label>Médico(s) Veterinário(s) Responsável:
                    <input type="text" name="medicosResponsaveis"
                      value={formData.medicosResponsaveis} 
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
  );
}

function GrupoExame({ titulo, label, itens, formData, selecionados,
                      ladosVisiveis, toggleItem, toggleLadoVisivel, handleRadioAninhado }) {
  const [aberto, setAberto] = useState(false);

  const handleToggleItem = (key) => {
    toggleItem(titulo, key);
  };

  const handleToggleLadoVisivel = (key, lado) => {
    toggleLadoVisivel(titulo, key, lado);
  };

  return (
    <div style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10, borderRadius: 5 }}>
      <div
        onClick={() => setAberto((o) => !o)}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {aberto ? "▼ " : "▶ "} {label}
      </div>

      {aberto && (
        <div style={{ marginTop: 10 }}>
          {itens.map(({ key, label }) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label>
                <input
                  type="checkbox"
                  checked={selecionados.includes(key)}
                  onChange={() => handleToggleItem(key)}
                />
                {label}
              </label>

              {selecionados.includes(key) && (
                <div style={{ marginLeft: 20 }}>
                  {["Direito", "Esquerdo"].map((lado) => (
                    <div key={lado} style={{ marginTop: 5 }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={ladosVisiveis[key]?.[lado] ?? false}
                          onChange={() => handleToggleLadoVisivel(key, lado)}
                        />
                        {lado}
                      </label>

                      {ladosVisiveis[key]?.[lado] && (
                        <div>
                          <label>
                            <input
                              type="text"
                              placeholder="Descrição..."
                              name={`${titulo}.${key}.${lado}`}
                              value={formData[titulo]?.[key]?.[lado] || ""}
                              onChange={handleRadioAninhado}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AtendimentoOrtopedico;
