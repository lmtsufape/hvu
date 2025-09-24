import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';
import { getCurrentUsuario } from "../../../../../services/userService";
import { getMedicoById } from "../../../../../services/medicoService";

function AtendimentoOrtopedico({ formData, handleChange, handleRadioAninhado, handleSubmit, prevStep, setFormData,
  selecionados, ladosVisiveis, toggleItem, toggleLadoVisivel, }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [consultaId, setConsultaId] = useState(null);
  const [medicoLogado, setMedicoLogado] = useState(null);

  
  const [nomeMedico, setNomeMedico] = useState("Carregando...");
    useEffect(() => {
      if (router.isReady) {
        const medicoFromQuery = router.query.medico;
  
        if (medicoFromQuery) {
          setNomeMedico(decodeURIComponent(medicoFromQuery));
        } else {
          setNomeMedico("Médico não informado");
        }
      }
    }, [router.isReady, router.query.medico]);


    useEffect(() => {
    const fetchMedicoData = async () => {
        try {
            const userData = await getCurrentUsuario();
            const medicoId = userData.usuario.id;

            if (medicoId) {
                const medicoCompletoData = await getMedicoById(medicoId);
                
                //Armazena o objeto COMPLETO (que tem o CRMV) no estado
                setMedicoLogado(medicoCompletoData);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do médico logado:', error);
        }
    };

    fetchMedicoData();
  }, []);

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

  return (
    <div className={styles.container}>
      <VoltarButton onClick={prevStep} />
      <h1>Ficha de Atendimento Ortopédico</h1>

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
              />
            </div>
          </div>
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
            </div>
          </div>
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
          <div className={styles.assinaturaSombreada}>
                  {medicoLogado ? (
                  <p style={{ margin: 0 }}>
                  Assinado eletronicamente por <strong>Dr(a). {medicoLogado.nome}</strong>, CRMV {medicoLogado.crmv}
                </p>
                ) : (
                <p style={{ margin: 0 }}>Carregando dados do médico...</p>
                )}
            </div>

          <div className={styles.button_box}>
            < VoltarWhiteButton onClick={prevStep} />
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
