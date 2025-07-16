import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import FinalizarFichaModal from "../../FinalizarFichaModal";
import React, { useState, useEffect } from "react";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from '../../../../../services/animalService';
import { useRouter } from 'next/router';

const FISICO_SISTEMA = [
  { key: "respiratorio", label: "Sistema respiratório (secreção, tosse, espirro, espirro reverso, cianose, dispneia, taquipnéia, respiração ruidosa)" },
  { key: "digestorio", label: "Sistema digestório (apetite, vômito, regurgitação, diarréia, sialorréia)" },
  { key: "cardiovascular", label: "Sistema cardiovascular (intolerância à atividade física, tosse, sopro, síncope, taquipnéia, dispneia, ortopnéia, cianose)" },
  { key: "nefrourinario", label: "Sistema nefrourinário (ingestão de água, aspecto, volume e frequência da urina, disúria, anúria, iscúria)" },
  { key: "pele", label: "Pele e anexos (higiene, ectoparasitas, lesões, prurido, hipotricose, alopecia, descamação, ressecamento, untuosidade)" },
  { key: "ouvidos", label: "Ouvidos (eritema, secreção, descamação, melanose, liquenificação, otalgia, meneios cefálicos, hiperplasia, estenose)" },
  { key: "neurologico", label: "Sistema neurológico (dor, tremores, marcha, convulsão, síncope, alteração comportamental)" },
  { key: "locomotor", label: "Sistema locomotor (claudicação, trauma, aumento de volume, impotência de membro)" },
  { key: "reprodutor", label: "Sistema reprodutor (secreção, cio, anticoncepcional, prenhez, mamas)" },
  { key: "olhos", label: "Olhos (secreção, olho vermelho, opacidades, blefaroespasmos, fotofobia, déficit visual)" },
  { key: "alteracoes", label: "Alterações clínicas diversas" },
  { key: "suspeita", label: "Suspeita(s) clínica(s)" }
];

const DIAGNOSTICO = [
  { key: "diagnostico", label: "Diagnóstico(s)" },
  { key: "condutaTerapeutica", label: "Conduta terapêutica" },
];

export default function ClinicaMedicaRetornoStep2({
  formData,
  setFormData,
  handleChange,
  handleCheckboxChange,
  prevStep,
  handleSubmit,
}) {

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

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha clínico médica de retorno</h1>
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
            <h2>Exame físico por sistema</h2>
            <div className="card-body">
              {FISICO_SISTEMA.map(sys => (
                <div key={sys.key} className="mb-3">
                  <label className="form-label fw-medium" htmlFor={sys.key}>
                    {sys.label}
                  </label>
                  <textarea
                    id={sys.key}
                    name={`fisicogeral.${sys.key}`}               /* dot-notation */
                    rows={4}
                    value={formData.fisicogeral?.[sys.key] || ""}
                    disabled={isReadOnly}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <div className="card-body">
              <h2>Diagnóstico e tratamento</h2>

              {DIAGNOSTICO.map(field => (
                <div key={field.key} className="mb-3">
                  <label className="form-label fw-medium" htmlFor={field.key}>
                    {field.label}
                  </label>
                  <textarea
                    id={field.key}
                    rows={4}
                    name={`diagnostico.${field.key}`}
                    value={formData.diagnostico?.[field.key] || ""}
                    disabled={isReadOnly}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.column}>
            <label>Plantonista(s) discente(s): </label>
            <textarea name="plantonistas" value={formData.plantonistas} disabled={isReadOnly} onChange={handleChange} />
          </div>
          <div className={styles.column}>
            <label>Médico(s) Veterinário(s) Responsável:</label>
            <textarea name="medicosResponsaveis" value={formData.medicosResponsaveis} disabled={isReadOnly} onChange={handleChange} />
          </div>

          {!isReadOnly && (
          <div className={styles.button_box}>
            <VoltarWhiteButton onClick={prevStep} />
            <FinalizarFichaModal onConfirm={handleSubmit} />
          </div>
          )}
        </form>

      </div>
    </div>
  );
}