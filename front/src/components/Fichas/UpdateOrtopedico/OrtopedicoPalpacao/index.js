import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';
import { is } from "date-fns/locale";

function AtendimentoOrtopedico({ formData, handleChange, handleRadioAninhado, handleSubmit, prevStep, setFormData,
  selecionados, ladosVisiveis, toggleItem, toggleLadoVisivel, }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [consultaId, setConsultaId] = useState(null);
  const { id, modo } = router.query; 
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  useEffect(() => {
  // Se o modo for 'visualizar', define o estado para somente leitura
     if (modo === 'visualizar') {
        setIsReadOnly(true);
          }
     }, [modo]);

  useEffect(() => {
    if (router.isReady) {
      const id = router.query.fichaId;
      const animalId = router.query.animalId;
      if (id) {
        setConsultaId(id);
      }
      if (animalId) {
        setAnimalId(animalId);
      }
    }
  }, [router.isReady, router.query.fichaId]);

  useEffect(() => {
    if (!animalId) return;

    const fetchData = async () => {
      try {
        const animalData = await getAnimalById(animalId);
        setAnimal(animalData);
      } catch (error) {
        console.error('Erro ao buscar animal:', error);
      }

      try {
        const tutorData = await getTutorByAnimal(animalId);
        setTutor(tutorData);
      } catch (error) {
        console.error('Erro ao buscar tutor do animal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animalId]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  useEffect(() => {
    const novosLadosVisiveis = {};
    const novosSelecionados = [];
    for (const grupoTitulo in formData) {
      const grupoData = formData[grupoTitulo]; 
      if (typeof grupoData === 'object' && grupoData !== null) {
        for (const itemKey in grupoData) {
          const itemData = grupoData[itemKey];
          if (itemData) {
            novosSelecionados.push(itemKey);
            if (typeof itemData === 'object' && itemData !== null) {
              novosLadosVisiveis[itemKey] = {}; 
              if (itemData.Direito) {
                novosLadosVisiveis[itemKey].Direito = true;
              }
              if (itemData.Esquerdo) {
                novosLadosVisiveis[itemKey].Esquerdo = true;
              }
            }
          }
        }
      }
    }
    if (setFormData) {
        setFormData(prev => ({
            ...prev,
            _initialState: {
                selecionados: novosSelecionados,
                ladosVisiveis: novosLadosVisiveis
            }
        }));
    }


  }, [formData]); // Roda sempre que o formData for carregado/atualizado


  return (
    <div className={styles.container}>
      <VoltarButton onClick={prevStep} />
      <h1>Ficha de atendimento ortopédico</h1>

      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
          <div className={styles.box_ficha_toggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
              onClick={() => setShowButtons(prev => !prev)}
            >
              Dados do animal
            </button>
            {showButtons && (
              <div className={styles.container_toggle}>
                <ul>
                  {animal && (
                    <li key={animal.id} className={styles.infos_box}>
                      <div className={styles.identificacao}>
                        <div className={styles.nome_animal}>{animal.nome}</div>
                        <div className={styles.especie_animal}>Nome</div>
                      </div>
                      <div className={styles.form}>
                        <div className={styles["animal-data-box"]}>
                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Espécie</h6>
                              <p>{animal.raca && animal.raca.especie && animal.raca.especie.nome}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Sexo</h6>
                              <p>{animal.sexo}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Peso</h6>
                              <p>{animal.peso === 0 || animal.peso === '' ? 'Não definido' : animal.peso}</p>
                            </div>
                          </div>

                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Raça</h6>
                              <p>{animal.raca && animal.raca.nome}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Porte</h6>
                              <p>{animal.raca && animal.raca.porte ? animal.raca && animal.raca.porte : 'Não definido'}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Data de nascimento</h6>
                              <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : 'Não definida'}</p>
                            </div>
                          </div>

                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Alergias</h6>
                              <p>{animal.alergias ? animal.alergias : 'Não definidas'}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Número da ficha</h6>
                              <p>{animal.numeroFicha ? animal.numeroFicha : 'Não definido'}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Tutor</h6>
                              <p>{tutor.nome ? tutor.nome : 'Não definido'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className={styles.column}>
            <label>Outros exames:
              <input type="text" name="outrosExames"
                value={formData.outrosExames}
                disabled={isReadOnly}
                onChange={handleChange} />
            </label>
          </div>
          <h2>Palpação Membro Torácico</h2>
          <div className={styles.two_columns}>
            <div>
              <GrupoExame
                titulo="digitosMetacarpos"
                label="Dígitos/Metacarpos"
                itens={[
                  { key: "flexaoMetacarpos", label: "Flexão" },
                  { key: "extensaoMetacarpos", label: "Extensão" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="carpo"
                label="Carpo"
                itens={[
                  { key: "hiperextensao", label: "Hiperextensão" },
                  { key: "flexaoCarpo", label: "Flexão" },
                  { key: "extensaoCarpo", label: "Extensão" },
                  { key: "instabilidadeMedial", label: "Instabilidade medial/lateral" },
                  { key: "rotacaoCarpo", label: "Rotação" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="radioUlna"
                label="Rádio / Ulna"
                itens={[
                  { key: "olecrano", label: "Olécrano" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
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
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="umero"
                label="Úmero"
                itens={[
                  { key: "ladoUmero", label: "Lado" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
              />
            </div>
            <div>
              <GrupoExame
                titulo="ombro"
                label="Ombro"
                itens={[
                  { key: "flexaoOmbro", label: "Flexão" },
                  { key: "extensaoOmbro", label: "Extensão" },
                  { key: "rotacaoOmbro", label: "Rotação" },
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
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="axilarSubescapular"
                label="Área axilar/subescapular"
                itens={[
                  { key: "ladoSubescapular", label: "Lado" },
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
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
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="articulacaoCubital"
                label="Articulação Cubital"
                itens={[
                  { key: "flexaoCubital", label: "Flexão" },
                  { key: "extensaoCubital", label: "Extensão" },
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
                isReadOnly={isReadOnly}
              />
            </div>
          </div>
          <div className={styles.column}>
            <label>Achados exames de imagem:
              <textarea type="text" name="achadosImagem"
                value={formData.achadosImagem}
                disabled={isReadOnly}
                onChange={handleChange}
                rows="4" cols="50" />
            </label>
          </div>
          <div className={styles.column}>
            <label>Outros exames:
              <input type="text" name="outrosExames"
                value={formData.outrosExames}
                disabled={isReadOnly}
                onChange={handleChange} />
            </label>
          </div>

          <h2>Palpação Membro Pélvico</h2>
          <div className={styles.two_columns}>
            <div>
              <GrupoExame
                titulo="digitosMetatarsos"
                label="Dígitos / Metatarsos"
                itens={[
                  { key: "flexaoMetatarsos", label: "Flexão" },
                  { key: "extensaoMetatarsos", label: "Extensão" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="tarso"
                label="Tarso"
                itens={[
                  { key: "calcaneoTendao", label: "Calcâneo / Tendão" },
                  { key: "flexaoTarso", label: "Flexão" },
                  { key: "extensaoTarso", label: "Extensão" },
                  { key: "instabilidadeMedialLateralTarso", label: "Instabilidade medial/lateral" },
                  { key: "rotacaoTarso", label: "Rotação" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="tibiaFibula"
                label="Tíbia / Fíbula"
                itens={[
                  { key: "cristaTibia", label: "Crista da tíbia" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="articulacaoJoelho"
                label="Articulação do Joelho"
                itens={[
                  { key: "ligamentoElevacaoPatelar", label: "Ligamento/elevação patelar" },
                  { key: "luxacaoPatelarMedialLateral", label: "Luxação patelar M ou L" },
                  { key: "sentar", label: "Sentar" },
                  { key: "flexaoArticulacaoJoelho", label: "Flexão" },
                  { key: "extensaoArticulacaoJoelho", label: "Extensão" },
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
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="femur"
                label="Fêmur"
                itens={[
                  { key: "ladoFemur", label: "Lado" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
              />
            </div>
            <div>
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
                isReadOnly={isReadOnly}
              />
              <GrupoExame
                titulo="articulacaoSacroiliaca"
                label="Articulação Sacroilíaca"
                itens={[
                  { key: "ladoSacroiliaca", label: "Lado" }
                ]}
                formData={formData}
                setFormData={setFormData}
                handleRadioAninhado={handleRadioAninhado}
                selecionados={selecionados}
                ladosVisiveis={ladosVisiveis}
                toggleItem={toggleItem}
                toggleLadoVisivel={toggleLadoVisivel}
                isReadOnly={isReadOnly}
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
                isReadOnly={isReadOnly}
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
                isReadOnly={isReadOnly}
              />
            </div>
          </div>
          <div className={styles.column}>
            <label>Diagnótico:
              <input type="text" name="diagnotico"
                value={formData.diagnotico}
                disabled={isReadOnly}
                onChange={handleChange} />
            </label>
          </div>
          <div className={styles.column}>
            <label>Tratamento:
              <textarea type="text" name="tratamento"
                value={formData.tratamento}
                disabled={isReadOnly}
                onChange={handleChange}
                rows="4" cols="50" />
            </label>
          </div>
          <div className={styles.column}>
            <label>Plantonista(s) discente(s):
              <input type="text" name="plantonistas"
                value={formData.plantonistas}
                disabled={isReadOnly}
                onChange={handleChange} />
            </label>
          </div>
          <div className={styles.column}>
            <label>Médico(s) Veterinário(s) Responsável:</label>
            <input
            type="text"
            name="medicosResponsaveis"
            value={formData.medicosResponsaveis || ''} 
            readOnly
            className="form-control"
            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
            />
          </div>

          {!isReadOnly && (
          <div className={styles.button_box}>
            < VoltarWhiteButton onClick={prevStep} />
            < FinalizarFichaModal onConfirm={handleSubmit} />
          </div>
          )}
        </form>
      </div>
    </div>
  );
}

function GrupoExame({ titulo, label, itens, formData, selecionados,
  ladosVisiveis, toggleItem, toggleLadoVisivel, handleRadioAninhado, isReadOnly }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const temItemSelecionado = itens.some(item => selecionados.includes(item.key));
    if (temItemSelecionado) {
      setAberto(true);
    }
  }, [selecionados, itens]);

  const handleToggleItem = (key) => {
    toggleItem(titulo, key);
  };

  const handleToggleLadoVisivel = (key, lado) => {
    toggleLadoVisivel(titulo, key, lado);
  };

  return (
    <div className={styles.accordionContainer}>
      <div
        onClick={() => setAberto((o) => !o)}
        className={styles.accordionHeader}
      >
        {aberto ? "-" : "+"} {label}
      </div>

      {aberto && (
        <div className={styles.accordionContent}>
          {itens.map(({ key, label }) => (
            <div key={key} className={styles.itemContainer}>
              <label className={styles.labelCheckbox}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(key)}
                  disabled={isReadOnly}
                  onChange={() => handleToggleItem(key)}
                />
                {label}
              </label>

              {selecionados.includes(key) && (
                <div className={styles.subOptions}>
                  {["Direito", "Esquerdo"].map((lado) => (
                    <div key={lado}>
                      <label className={styles.label_checkbox_circle}>
                        <input
                          id="checkbox_circle"
                          type="checkbox"
                          checked={ladosVisiveis[key]?.[lado] ?? false}
                          disabled={isReadOnly}
                          onChange={() => handleToggleLadoVisivel(key, lado)}
                        />
                        {lado}
                      </label>

                      {ladosVisiveis[key]?.[lado] && (
                        <div className={styles.textInputContainer}>
                          <input
                            type="text"
                            className={styles.textInput}
                            placeholder="Descrição..."
                            name={`${titulo}.${key}.${lado}`}
                            value={formData[titulo]?.[key]?.[lado] || ""}
                            onChange={handleRadioAninhado}
                          />
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
