import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

const POSTURAS = ["Estação", "Decúbito", "Cavalete", "Outras"];
const CONCIENCIA = ["Alerta", "Deprimido", "Excitado", "Ausente (Coma)"];
const SCORE_CORPORAL = ["Caquético", "Magro", "Normal", "Sobrepeso", "Obeso"];
const HIDRATACAO_OPTS = ["Normal", "6 a 8%", "8 a 10%", "Acima de 10%"];

function AtendimentoCardiologico({
  formData,
  handleChange,
  nextStep,
  prevStep,
  handleCheckboxChangeMucosas,
  handleLinfonodoChange,
  handleCaracteristicaChange,
  handleChangeAtualizaSelect,
  handleMucosaLocationChange,
}) {
  const [showButtons, setShowButtons] = useState(false);
  const [animal, setAnimal] = useState(null);
  const [tutor, setTutor] = useState({ nome: '' });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      getAnimalById(id).then(data => {
        setAnimal(data);
        getTutorByAnimal(id).then(tutorData => {
          setTutor(tutorData || { nome: 'Não definido' });
        }).catch(() => setTutor({ nome: 'Não definido' }));
      }).catch(() => setAnimal(null));
    }
  }, [id]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Não definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handlePosturaChange = (e) => {
    const { value } = e.target;
    handleChange({ target: { name: "ExameFisico.postura", value } });
    if (value !== "Outras") {
      handleChange({ target: { name: "ExameFisico.posturaOutras", value: "" } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If "Outras" is selected, replace postura with posturaOutras value
    if (formData.ExameFisico.postura === "Outras" && formData.ExameFisico.posturaOutras) {
      handleChange({ target: { name: "ExameFisico.postura", value: formData.ExameFisico.posturaOutras } });
    }
    // Clear posturaOutras to prevent it from being sent
    handleChange({ target: { name: "ExameFisico.posturaOutras", value: "" } });
    console.log("Formulário válido. Dados prontos para envio:", formData);
    nextStep();
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha de Atendimento Cardiológico</h1>
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
                        <div className={styles.box}>
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
                              <p>{animal.raca && animal.raca.porte ? animal.raca.porte : 'Não definido'}</p>
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

          <div className={styles.column}>
            <label className="form-label fw-medium">Postura</label>
          </div>
          <div className={styles.checkbox_container}>
            {POSTURAS.map(opt => (
              <div key={opt}>
                <label>
                  <input
                    type="radio"
                    name="ExameFisico.postura"
                    value={opt}
                    checked={formData.ExameFisico.postura === opt}
                    onChange={handlePosturaChange}
                  /> {opt}
                </label>
                {opt === "Outras" && formData.ExameFisico.postura === "Outras" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="ExameFisico.posturaOutras"
                      value={formData.ExameFisico.posturaOutras || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Especifique a outra postura"
                    />
                  </div>
                )}
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
                  type="radio"
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
              <label key={opt}>
                <input
                  type="radio"
                  name="ExameFisico.score"
                  value={opt}
                  checked={formData.ExameFisico.score === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>

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
              className="form-control"
            />
          </div>

          <div className={styles.column}>
            <label className="form-label fw-medium">Grau de Desidratação:</label>
          </div>
          <div className={styles.checkbox_container}>
            {HIDRATACAO_OPTS.map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name="ExameFisico.hidratacao"
                  value={opt}
                  checked={formData.ExameFisico.hidratacao === opt}
                  onChange={handleChange}
                /> {opt}
              </label>
            ))}
          </div>

          <div className={styles.column}>
            <label className="form-label fw-medium">Narinas/Traqueia/Tireóide</label>
            <input
              type="text"
              name="ExameFisico.narinasEOutros"
              value={formData.ExameFisico.narinasEOutros || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className={styles.column}>
            <label className="form-label fw-medium">Abdômen</label>
            <input
              type="text"
              name="ExameFisico.abdomem"
              value={formData.ExameFisico.abdomem || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className={styles.box}>
            <div className={styles.column}>
              <label className="form-label fw-medium">ACP</label>
              <input
                type="text"
                name="ExameFisico.acp"
                value={formData.ExameFisico.acp}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className={styles.column}>
              <label className="form-label fw-medium">Pulso arterial</label>
              <input
                type="text"
                name="ExameFisico.pulsoArterial"
                value={formData.ExameFisico.pulsoArterial}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.column}>
              <label className="form-label fw-medium">Frequência cardíaca (BPM)</label>
              <input
                type="text"
                name="ExameFisico.freqCardiaca"
                value={formData.ExameFisico.freqCardiaca}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className={styles.column}>
              <label className="form-label fw-medium">Frequência Respiratória (RPM)</label>
              <input
                type="text"
                name="ExameFisico.freqRespiratoria"
                value={formData.ExameFisico.freqRespiratoria}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.column}>
              <label htmlFor="turgorCutaneo" className="form-label fw-medium">Turgor Cutâneo</label>
              <select
                id="turgorCutaneo"
                name="ExameFisico.turgorCutaneo"
                value={formData.ExameFisico.turgorCutaneo}
                onChange={handleChangeAtualizaSelect}
                className="form-control"
              >
                <option value="">Selecione</option>
                <option value="Normal">Normal</option>
                <option value="Reduzido">Reduzido</option>
              </select>
            </div>
            <div className={styles.column}>
              <label htmlFor="tpc" className="form-label fw-medium">TPC:</label>
              <select
                id="tpc"
                name="ExameFisico.tpc"
                value={formData.ExameFisico.tpc}
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
              {Object.keys(formData.option || {}).map((option) => (
                <div key={option} className="row align-items-start mb-2">
                  <div className={`${styles.checkbox_container} ${styles.checkbox_square} col-3`}>
                    <label className="d-flex align-items-center">
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
                      className="form-control"
                      name={option}
                      value={formData.mucosas[option]}
                      onChange={handleMucosaLocationChange}
                      disabled={!formData.option[option]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.column}>
              <label>Linfonodos</label>
            </div>

            <div className={`${styles.checkbox_container} ${styles.checkbox_square}`}>
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
                    <div className={styles.options_border}>
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

          <div className={styles.button_box}>
            <VoltarWhiteButton onClick={prevStep} />
            <ContinuarFichasGreenButton type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AtendimentoCardiologico;