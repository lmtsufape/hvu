import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import React, { useState, useEffect } from "react";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { createFicha } from '../../../../../services/fichaService';
import { useRouter } from 'next/router';

import VoltarButton from "@/components/VoltarButton";
import { CancelarWhiteButton } from "@/components/WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

const ALIMENTACAO_OPTS = [" Ração", " Dieta caseira", " Ração + Dieta caseira"];
const POSTURAS = [" Estação", " Decúbito", " Cavalete", " Outras"];
const CONCIENCIA = [" Alerta", " Deprimido", " Excitado", " Ausente (COMA)"];
const SCORE_CORPORAL = [" Caquético", " Magro", " Normal", " Sobrepeso", " Obeso"];
const HIDRATACAO_OPTS = [" Normal","5%", " 6 A 8%", " 8 A 10%", " Acima de 10%", "N/D*"];

export default function Step1ClinicaMedica({
  formData,
  handleChange,
  nextStep,
  handleCheckboxChangeVacinacao,
  handleCheckboxChangeMucosas,
  handleLocationChange,
  handleLinfonodoChange,
  handleCaracteristicaChange,
  handleChangeAtualizaSelect,
  handleMucosaLocationChange,
  cleanLocalStorage
}) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [consultaId, setConsultaId] = useState(null);

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

  const handlePosturaChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  if (name === "ExameFisico.posturaOutras") {
    handleChange({
      target: {
        name: "ExameFisico.postura",
        value: value.trim() 
      }
    });
  } 
  else if (name === "ExameFisico.postura") {
    if (formData.ExameFisico.postura === value) {
      handleChange({
        target: {
          name: "ExameFisico.postura",
          value: "" 
        }
      });
    } 
    else {
      handleChange({
        target: {
          name: "ExameFisico.postura",
          value: value 
        }
      });
    }
  }
};

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha Clínica Médica  (Animais silvestres ou exóticos)</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit} >
          <div className={styles.column}>
            <div className="mb-3">
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
              <h2>Anamnese</h2>
              <label className="form-label fw-medium">
                Queixa principal (evolução, tratamentos, resultados)
              </label>
              <textarea
                name="queixaPrincipal"
                value={formData.queixaPrincipal}
                onChange={handleChange}
                rows={4}
                className="form-control"
                style={{
                  textAlign: 'left',
                  padding: '10px'
                }}
              />
            </div>
          </div>
          <div className={styles.column}>
            <div className="mb-3">
              <label className="form-label fw-medium">
                Histórico médico pregresso
              </label>
              <textarea
                name="HistoricoMedico.progresso"
                value={formData.HistoricoMedico.progresso}
                onChange={handleChange}
                rows={4}
                className="form-control"
                style={{
                  textAlign: 'left',
                  padding: '10px'
                }}
              />
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.column}>
              <label className="form-label fw-medium">Controle de ectoparasitos:
                <select name="ectoparasitosDetalhes.ectoparasitos" value={formData.ectoparasitosDetalhes.ectoparasitos} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </label>
              {formData.ectoparasitosDetalhes.ectoparasitos === 'Sim' && (
                <div>
                  <label className="form-label fw-medium">
                    Produto:
                    <input
                      type="text"
                      name="ectoparasitosDetalhes.produto"
                      value={formData.ectoparasitosDetalhes.produto}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </label>
                  <label className="form-label fw-medium">
                    Data:
                    <input
                      type="date"
                      name="ectoparasitosDetalhes.data"
                      value={formData.ectoparasitosDetalhes.data}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </label>
                </div>
              )}
            </div>
            <div className={styles.column}>
              <label className="form-label fw-medium" >Vermifugação:
                <select name="vermifugacaoDetalhes.vermifugacao" value={formData.vermifugacaoDetalhes.vermifugacao} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </label>
              {formData.vermifugacaoDetalhes.vermifugacao === 'Sim' && (
                <div>
                  <label className="form-label fw-medium">
                    Produto:
                    <input
                      type="text"
                      name="vermifugacaoDetalhes.produto"
                      value={formData.vermifugacaoDetalhes.produto}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </label>
                  <label className="form-label fw-medium">
                    Data:
                    <input
                      type="date"
                      name="vermifugacaoDetalhes.data"
                      value={formData.vermifugacaoDetalhes.data}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className={styles.column}>
            <label className="form-label fw-medium">Observações:
              <input type="text" name="observacoes" value={formData.observacoes} onChange={handleChange}
                className="form-control" />
            </label>
          </div>
          <h2>Exame físico geral</h2>
          <div className={styles.column}>
            <label className="form-label fw-medium">Postura</label>
          </div>
          <div className={styles.checkbox_container}>
            {POSTURAS.map(opt => (
              <div key={opt} className="d-flex align-items-center mb-2">
                <label className="me-3">
                  <input
                    type="checkbox"
                    name="ExameFisico.postura"
                    value={opt}
                    checked={formData.ExameFisico.postura === opt || (opt === " Outras" && !POSTURAS.includes(formData.ExameFisico.postura) && formData.ExameFisico.postura !== "")}
                    onChange={handlePosturaChange}
                  /> {opt}
                </label>

                {opt === " Outras" && (
                  (formData.ExameFisico.postura === " Outras" || 
                  !POSTURAS.includes(formData.ExameFisico.postura)) && 
                  formData.ExameFisico.postura !== "" && (
                    <input
                      type="text"
                      name="ExameFisico.posturaOutras"
                      value={formData.ExameFisico.postura === " Outras" ? "" : formData.ExameFisico.postura}
                      onChange={handlePosturaChange}
                      className="form-control"
                      placeholder="Especifique a postura"
                    />
                ))}
              </div>
            ))}
          </div>
          <div className={styles.column}>
            <label className="form-label fw-medium">Nível de consciência</label>
          </div>
          <div className={styles.checkbox_container}>
            {CONCIENCIA.map(opt => (
              <label key={opt}>
                <input
                  type="checkbox"
                  name="ExameFisico.nivelConsciencia"
                  value={opt}
                  checked={formData.ExameFisico.nivelConsciencia === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>
          <div className={styles.column}>
            <label className="form-label fw-medium">Score corporal</label>
          </div>
          <div className={styles.checkbox_container}>
            {SCORE_CORPORAL.map(opt => (
              <label key={opt} >
                <input
                  type="checkbox"
                  name="ExameFisico.score"
                  value={opt}
                  checked={formData.ExameFisico.score === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>
          <div className={styles.column}>
            <label className="form-label fw-medium">Hidratação</label>
          </div>
          <div className={styles.checkbox_container}>
            {HIDRATACAO_OPTS.map(opt => (
              <label key={opt} >
                <input
                  type="checkbox"
                  name="ExameFisico.hidratacao"
                  value={opt}
                  checked={formData.ExameFisico.hidratacao === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>
          <div className={styles.box}>
            <div className={styles.column}>
              <label className="form-label fw-medium">Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                name="ExameFisico.temperatura"
                value={formData.ExameFisico.temperatura || ""}
                onChange={handleChange}
                className="form-control" />
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.column}>
              <label className="form-label fw-medium">Frequência cardíaca (BPM):
                <input type="text" name="freqCardiaca" value={formData.freqCardiaca} onChange={handleChange}
                  className="form-control"
                />
              </label>
            </div>
            <div className={styles.column}>
              <label className="form-label fw-medium">Frequência Respiratória (RPM):
                <input type="text" name="freqRespiratoria" value={formData.freqRespiratoria} onChange={handleChange}
                  className="form-control"
                />
              </label>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.column}>
              <label htmlFor="turgorCutaneo" className="form-label fw-medium">Turgor Cutâneo:</label>
              <select
                id="turgorCutaneo"
                name="turgorCutaneo"
                value={formData.turgorCutaneo}
                onChange={handleChangeAtualizaSelect}
                className="form-control"
              >
                <option value="">Selecione</option>
                <option value="Normal">Normal</option>
                <option value="Reduzido">Reduzido</option>
              </select>
            </div>
            <div className={styles.column}>
              <label htmlFor="tpc">TPC:</label>
              <select
                id="tpc"
                name="tpc"
                value={formData.tpc}
                onChange={handleChangeAtualizaSelect}
                className="form-control"
              >
                <option value="">Selecione</option>
                <option value="2 segundos">2 segundos</option>
                <option value="2-4 segundos">2-4 segundos</option>
                <option value="> 5 segundos">menor que 5 segundos</option>
              </select>
            </div>
          </div>
          <div className="row fw-medium mb-2">
            <div className="col-3 mb-3 mt-4">Mucosas</div>
            <div className="col mt-4 mb-3">
              Localização (oculopalpebral, nasal, bucal, vulvar, prepucial ou anal)
            </div>
            <div>
              {Object.keys(formData.option).map((option) => (
                <div key={option} className="row align-items-start mb-2">
                  <div className="col-3">
                    <label className={`${styles.radio_container} d-flex align-items-center`}>
                      <input
                        type="checkbox"
                        name={option}
                        checked={formData.option[option]}
                        onChange={handleCheckboxChangeMucosas}
                        className="me-2"
                      />
                      {option === "roseas" && "Róseas"}
                      {option === "roseasPalidas" && "Róseas-pálidas"}
                      {option === "porcelanicas" && "Porcelânicas"}
                      {option === "hiperemicas" && "Hiperêmicas"}
                      {option === "cianoticas" && "Cianóticas"}
                      {option === "ictaricas" && "Ictéricas"}
                      {option === "naoAvaliado" && "Não-avaliado"}
                    </label>
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      name={option}
                      value={formData.mucosas[option]}
                      onChange={handleMucosaLocationChange}
                      disabled={!formData.option[option]}
                      className="form-control"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.button_box}>
            <CancelarWhiteButton onClick={cleanLocalStorage} />
            <ContinuarFichasGreenButton type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}