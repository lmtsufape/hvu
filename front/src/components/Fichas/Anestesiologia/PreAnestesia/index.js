import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import React, { useState, useEffect } from "react";

import VoltarButton from "@/components/VoltarButton";
import { CancelarWhiteButton } from "@/components/WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

/* listas fixas */
const EXAMES = ["Ht", "Pt", "Alb", "Plaq", "FA", "Leuc", "ALT", "Creat"];
const ESTADOS = ["Alerta", "Tranquilo", "Deprimido", "Excitado", "Agressivo"];
const DORES = ["Sem dor", "Leve", "Moderada", "Severa"];
const DESIDRATACAO = ["Normal", "6 a 8%", "8 a 10%", "Acima de 10%"];
const MUCOSAS = ["Róseas", "Róseas pálidas", "Porcelanas", "Hiperêmicas", "Cianóticas", "Ictéricas", "Não avaliado"];
const SEDACAO = ["Nenhuma", "Leve", "Moderada", "Intenso"];



export default function PreAnestesia({
  formData,
  handleChange,
  setFormData,
  handleCheckboxChange,
  nextStep,
  cleanLocalStorage
}) {
  const [localizacao, setLocalizacao] = useState(
    formData.pre?.localizacaoMucosas ?? {
      "Róseas": "",
      "Róseas pálidas": "",
      "Porcelanas": "",
      "Hiperêmicas": "",
      "Cianóticas": "",
      "Ictéricas": "",
      "Não avaliado": ""
    });

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [consultaId, setConsultaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});

  const submitLocal = (e) => {
    e.preventDefault();
    nextStep();
  };

  /* logo depois do submitLocal ---------------------------------- */
  const handleLocalizacaoChange = (e, mucosa) => {
    const { value } = e.target;

    // grava o texto digitado no objeto localizacao
    setLocalizacao(prev => ({
      ...prev,
      [mucosa]: value            // atualiza só a linha da mucosa clicada
    }));
  };

  useEffect(() => {
    const localizacaoPreenchida = Object.fromEntries(
      Object.entries(localizacao).filter(([, v]) => v.trim() !== "")
    );

    setFormData(prev => ({
      ...prev,
      pre: {
        ...prev.pre,
        localizacaoMucosas: localizacaoPreenchida
      }
    }));
  }, [localizacao, setFormData]);


  const [farmacosPre, setFarmacosPre] = useState(
    formData.pre?.farmacosPre ??
    Array.from({ length: 5 }, () => ({ farmaco: "", dose: "", via: "" }))
  );

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      pre: { ...prev.pre, farmacosPre }
    }));
  }, [farmacosPre, setFormData]);

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
  /* handler para alteração de cada célula */
  const handleFarmacoPreChange = (idx, field, value) => {
    setFarmacosPre((prev) => {
      const copy = structuredClone(prev);
      copy[idx][field] = value;
      return copy;
    });
  };

  /* adiciona nova linha em branco */
  const addFarmacoPreRow = () => {
    setFarmacosPre((prev) => [
      ...prev,
      { farmaco: "", dose: "", via: "" }
    ]);
  }

  /* remove a última linha */
  const removerUltimaFarmacoPreRow = () => {
    setFarmacosPre((prev) => {
      if (prev.length <= 1) return prev; // não remove se só tiver uma linha
      return prev.slice(0, -1);
    });
  };
  return (
    <div className={styles.container}>
      <VoltarButton />

      <h1>Ficha de Anestesiologia Pré-Anestesia</h1>
      <div className={styles.boxBorder}>

        <form onSubmit={submitLocal}>

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

          {/* Cirurgião ------------------------------------------------------- */}
          <div className="mb-3">
            <label className="">Cirurgião</label>
            <input
              name="pre.cirurgiao"
              value={formData.pre?.cirurgiao || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Exames laboratoriais ------------------------------------------- */}
          <fieldset className="mb-3">
            <label className=" mb-2">Exames laboratoriais</label>

            {/* linha flexível de checkboxes */}
            <div className="d-flex flex-wrap gap-4 align-items-center">
              {EXAMES.map((ex) => (
                <label key={ex} className="form-check form-check-inline m-0">
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    value={ex}
                    checked={formData.pre?.exames?.includes(ex) || false}
                    onChange={(e) => handleCheckboxChange(e, "pre.exames")}
                  />
                  <span className="form-check-label">{ex}</span>
                </label>
              ))}
            </div>

            {/* campo Outros */}
            <div className="mt-3">
              <label className="form-label mb-1">Outros</label>
              <textarea
                rows={2}
                className="form-control"
                name="pre.examesOutros"
                value={formData.pre?.examesOutros || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Avaliação pré-anestésica --------------------------------------- */}
          <h5 className="p-2 rounded" style={{ backgroundColor: '#EEF8F3' }}> Avaliação Pré-Anestésica</h5>

          <div className="row mb-3">
            <div className="col-md-3">
              <label>Hora
                <input
                  type="time"
                  className="form-control"
                  name="pre.hora"
                  value={formData.pre?.hora || ""}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>


          <label className="form-label fw-medium">Estado</label>
          <div className={styles.checkbox_container}>
            {ESTADOS.map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="pre.estado"
                  value={s}
                  checked={formData.pre?.estado === s}
                  onChange={handleChange}
                /> {s}
              </label>
            ))}
          </div>

        
          <label className="form-label fw-medium">Dor</label>
          <div className={styles.checkbox_container}>
            {DORES.map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  name="pre.dor"
                  value={d}
                  checked={formData.pre?.dor === d}
                  onChange={handleChange}
                /> {d}
              </label>
            ))}
          </div>


          {/* Sinais vitais --------------------------------------------------- */}
          <div className="row mb-3">
            <div className="col">
              <label>Temperatura
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  name="pre.temperatura"
                  value={formData.pre?.temperatura || ""}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col">
              <label>Jejum
                <input
                  type="text"
                  className="form-control"
                  name="pre.jejum"
                  value={formData.pre?.jejum || ""}
                  onChange={handleChange}
                  style={{ marginTop: "0.5rem" }}
                />
              </label>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col">
              <label>Frequência Cardíaca (BPM)
                <input
                  type="number"
                  className="form-control"
                  name="pre.fc"
                  value={formData.pre?.fc || ""}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col">
              <label>Pressão arterial
                <input
                  type="text"
                  className="form-control"
                  name="pre.pa"
                  value={formData.pre?.pa || ""}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col">
              <label>Frequência Respiratória (RPM)
                <input
                  type="number"
                  className="form-control"
                  name="pre.fr"
                  value={formData.pre?.fr || ""}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Grau de Desidratação:</label><br />
            {DESIDRATACAO.map(s => (
              <label key={s} className="me-3">
                <input
                  type="radio"
                  name="pre.estado"
                  value={s}
                  checked={formData.pre?.estado === s}
                  onChange={handleChange}
                /> {s}
              </label>
            ))}
          </div>


          {/* ­­­­­­­­­­­­­­­­­­­­­ Turgor cutâneo _____________________________________ */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Turgor cutâneo</label>
            <select
              className="form-select"
              name="pre.turgor"
              value={formData.pre?.turgor || ""}
              onChange={handleChange}
            >
              <option value="">Selecione…</option>
              <option value="NORMAL">NORMAL</option>
              <option value="REDUZIDO">REDUZIDO</option>
            </select>
          </div>

          {/* TPC ---------------------------------------------------------- */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">TPC (s)</label>
            <select
              className="form-select"
              name="pre.tpc"                     /* grava em formData.pre.tpc */
              value={formData.pre?.tpc || ""}
              onChange={handleChange}
            >
              <option value="">Selecione…</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>


          <div className="row fw-medium mb-2">
            <div className="col-3 mb-3 mt-4">Mucosas</div>
            <div className="col mt-4 mb-3">
              Localização (oculopalpebral, nasal, bucal, vulvar, prepucial ou anal)
            </div>
            {MUCOSAS.map((mucosa) => (
              <div key={mucosa} className="row align-items-start mb-2">
                {/* coluna do checkbox + rótulo */}
                <div className={`${styles.checkbox_container} ${styles.checkbox_square} col-3`}>
                  <label className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      name={`pre.mucosas.${mucosa}`}
                      value={mucosa}
                      checked={formData.pre?.mucosas?.includes(mucosa) || false}
                      onChange={(e) => handleCheckboxChange(e, "pre.mucosas")}
                      className="me-2"
                    />
                    {mucosa}
                  </label>
                </div>

                {/* campo de localização */}
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    value={localizacao[mucosa]}
                    onChange={(e) => handleLocalizacaoChange(e, mucosa)}
                    disabled={!formData.pre?.mucosas?.includes(mucosa)}
                  />
                </div>
              </div>
            ))}


            {/* Medicação Pré-Anestésica --------------------------------------- */}
            <h5 className="p-2 rounded mt-4 mb-4" style={{ backgroundColor: '#EEF8F3' }}>Medicação Pré-Anestésica</h5>

            <div className="row align-items-center mb-3">
              {/* Hora ----------------------------------------------------------- */}
              <div className="col-md-3">
                <label className="form-label fw-medium w-100">
                  Hora
                  <input
                    type="time"
                    className="form-control"
                    name="pre.hora2"
                    value={formData.pre?.hora2 || ""}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* coluna das opções de sedação */}
              <div className="col-md-9">
                {/* rótulo na 1ª linha */}
                <label className="form-label fw-medium mb-2 d-block">
                  Sedação:
                </label>

                {/* opções na 2ª linha */}
                <div className="d-flex align-items-center flex-wrap">
                  {SEDACAO.map((opt) => (
                    <label
                      key={opt}
                      className="me-4 d-inline-flex align-items-center mb-1"
                    >
                      <input
                        type="radio"
                        name="pre.sedacao"
                        value={opt}
                        checked={formData.pre?.sedacao === opt}
                        onChange={handleChange}
                        className="me-1"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.column}>

            <table className={styles.tabela_tratamento}>
            <thead>
                <tr>
                  <th style={{ width: "55%" }}>Fármaco</th>
                  <th style={{ width: "25%" }}>Dose/Volume</th>
                  <th style={{ width: "15%" }}>Via</th>
                </tr>
              </thead>

              <tbody>
                {farmacosPre.map((row, idx) => (
                  <tr key={idx}>
                    {/* Fármaco ------------------------------------------------ */}
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.farmaco}
                        onChange={(e) => handleFarmacoPreChange(idx, "farmaco", e.target.value)}
                      />
                    </td>

                    {/* Dose / Volume ---------------------------------------- */}
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.dose}
                        onChange={(e) => handleFarmacoPreChange(idx, "dose", e.target.value)}
                      />
                    </td>

                    {/* Via --------------------------------------------------- */}
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={row.via}
                        onChange={(e) => handleFarmacoPreChange(idx, "via", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.bolha_container}>
              <div className={styles.bolha} onClick={addFarmacoPreRow}>
              +
              </div>
              <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaFarmacoPreRow}>
              -
            </div>
          </div>

            </div>

            {/* --------------- AINES e Antibiótico – lado a lado --------------- */}
            <div className="row mb-3">
              {/* AINES */}
              <div className="col-md-6">
                <label className="form-label fw-medium">
                  AINES&nbsp;<small>(fármaco e hora)</small>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="pre.aines"
                  value={formData.pre?.aines || ""}
                  onChange={handleChange}

                />
              </div>

              {/* Antibiótico */}
              <div className="col-md-6">
                <label className="form-label fw-medium">
                  Antibiótico&nbsp;<small>(fármaco e hora)</small>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="pre.antibiotico"
                  value={formData.pre?.antibiotico || ""}
                  onChange={handleChange}

                />
              </div>
            </div>

            {/* ------------------------ Outros – largura total ------------------------ */}
            <div className="mb-3">
              <label className="form-label fw-medium">Outros:</label>
              <input
                type="text"
                className="form-control"
                name="pre.outros"
                value={formData.pre?.outros || ""}
                onChange={handleChange}

              />
            </div>
          </div>


          {/* Botões ---------------------------------------------------------- */}
          <div className={styles.button_box}>
            <CancelarWhiteButton onClick={cleanLocalStorage} />
            <ContinuarFichasGreenButton type="submit" />
          </div>

        </form>
      </div>
    </div>
  );
}
