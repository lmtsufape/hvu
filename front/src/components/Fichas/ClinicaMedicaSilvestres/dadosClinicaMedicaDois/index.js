/* components/Fichas/ClinicaMedica/Step2ExamesEtc.jsx
   ────────────────────────────────────────────────── */
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { VoltarWhiteButton } from "../../../WhiteButton";
import React, { useState, useEffect } from "react";
import { getTutorByAnimal } from "../../../../../services/tutorService";
import { getAnimalById } from "../../../../../services/animalService";
import { createFicha } from "../../../../../services/fichaService";
import { useRouter } from "next/router";
import { CancelarWhiteButton } from "@/components/WhiteButton";
import { ContinuarFichasGreenButton } from "@/components/GreenButton";

/* ---------- listas estáticas ---------- */
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
  { key: "observacoes", label: "Observações" },
  { key: "prognostico", label: "Prognóstico" },
  { key: "peso", label: "Peso (kg)" }
];

const EXAMES_COMPLEMENTARES = [
  { key: "hemograma", label: "Hemograma" },
  { key: "alt_tgp", label: "ALT/TGP" },
  { key: "ast_tgo", label: "AST/TGO" },
  { key: "creatinina", label: "Creatinina" },
  { key: "ureia", label: "Ureia" },
  { key: "fa", label: "Fosfatase Alcalina (FA)" },
  { key: "ggt", label: "Gama-Glutamiltransferase (GGT)" },
  { key: "urinálise_cutanea", label: "Urinálise Cutânea" },
  { key: "histopatologico", label: "Histopatológico" },
  { key: "ultrassonografia", label: "Ultrassonografia" },
  { key: "raio_x", label: "Raio X" },
  { key: "outros", label: "Outros(s):" }
];

export default function Step2ClinicaMedica({
  formData,
  setFormData,
  handleChange,
  prevStep,
  cleanLocalStorage,
  nextStep,
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [consultaId, setConsultaId] = useState(null);

  // Estados para gerenciar os exames complementares
  const [examesComplementares, setExamesComplementares] = useState(
    formData.examesComplementares || []
  );
  const [otherExameValue, setOtherExameValue] = useState(
    formData.otherExameValue || ""
  );
  const [showOtherExameInput, setShowOtherExameInput] = useState(
    formData.examesComplementares?.includes("Outros(s):") || false
  );

  useEffect(() => {
    if (router.isReady) {
      const id = router.query.fichaId;
      const animalId = router.query.animalId;
      console.log("router.isReady:", router.isReady, "fichaId:", id, "animalId:", animalId);
      if (id) {
        setConsultaId(id);
      }
      if (animalId) {
        setAnimalId(animalId);
      } else {
        console.log("animalId não encontrado, definindo loading como false");
        setLoading(false);
      }
    }
  }, [router.isReady, router.query.fichaId, router.query.animalId]);

  useEffect(() => {
    if (!animalId) {
      console.log("animalId não definido, saindo do useEffect");
      setLoading(false);
      return;
    }

    console.log("Iniciando fetchData para animalId:", animalId);
    const fetchData = async () => {
      try {
        const animalData = await getAnimalById(animalId);
        console.log("Dados do animal:", animalData);
        setAnimal(animalData);
      } catch (error) {
        console.error("Erro ao buscar animal:", error);
      }

      try {
        const tutorData = await getTutorByAnimal(animalId);
        console.log("Dados do tutor:", tutorData);
        setTutor(tutorData);
      } catch (error) {
        console.error("Erro ao buscar tutor do animal:", error);
      } finally {
        console.log("Finalizando carregamento, setting loading para false");
        setLoading(false);
      }
    };

    fetchData();
  }, [animalId]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  // Função para lidar com mudanças nos checkboxes dos Exames Complementares
  const handleExameChange = (event) => {
    const { value, checked } = event.target;

    setShowOtherExameInput((prev) => (value === "Outros(s):" ? checked : prev));

    if (value === "Outros(s):" && !checked) {
      setOtherExameValue("");
    }

    const updatedExames = checked
      ? [...examesComplementares, value]
      : examesComplementares.filter((item) => item !== value);
    setExamesComplementares(updatedExames);

    // Atualiza formData apenas com examesComplementares, sem otherExameValue
    setFormData((prev) => ({
      ...prev,
      examesComplementares: updatedExames,
    }));
  };

  // Função para lidar com mudanças no campo "Outros"
  const handleOtherExameChange = (event) => {
    const value = event.target.value;
    setOtherExameValue(value);

    // Não atualiza formData.otherExameValue aqui, apenas mantém no estado local
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Substitui "Outros(s):" pelo valor digitado, se existir
    let finalExames = [...examesComplementares];
    if (finalExames.includes("Outros(s):") && otherExameValue.trim() !== "") {
      finalExames = finalExames.filter((item) => item !== "Outros(s):");
      finalExames.push(otherExameValue.trim());
    } else if (finalExames.includes("Outros(s):") && otherExameValue.trim() === "") {
      finalExames = finalExames.filter((item) => item !== "Outros(s):");
    }

    // Atualiza formData apenas com examesComplementares limpos
    setFormData((prev) => ({
      ...prev,
      examesComplementares: finalExames,
    }));

    nextStep();
  };

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  return (
    <div className={styles.container}>
      <VoltarButton onClick={prevStep} />
      <h1>Ficha Clínica Médica (Animais silvestres ou exóticos)</h1>

      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
          <div className={styles.box_ficha_toggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
              onClick={() => setShowButtons((prev) => !prev)}
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
                              <p>{animal.peso === 0 || animal.peso === "" ? "Não definido" : animal.peso}</p>
                            </div>
                          </div>

                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Raça</h6>
                              <p>{animal.raca && animal.raca.nome}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Porte</h6>
                              <p>{animal.raca && animal.raca.porte ? animal.raca.porte : "Não definido"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Data de nascimento</h6>
                              <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : "Não definida"}</p>
                            </div>
                          </div>

                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Alergias</h6>
                              <p>{animal.alergias ? animal.alergias : "Não definidas"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Número da ficha</h6>
                              <p>{animal.numeroFicha ? animal.numeroFicha : "Não definido"}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Tutor</h6>
                              <p>{tutor.nome ? tutor.nome : "Não definido"}</p>
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

          {/* ================= EXAME FÍSICO POR SISTEMA ================= */}
          <div className={styles.column}>
            <h2>Exame físico Especial</h2>
            <div className="card-body">
              {FISICO_SISTEMA.map((sys) => (
                <div key={sys.key} className="mb-3">
                  <label className="form-label fw-medium" htmlFor={sys.key}>
                    {sys.label}
                  </label>
                  <textarea
                    id={sys.key}
                    name={`fisicogeral.${sys.key}`} // dot-notation
                    rows={4}
                    className="form-control"
                    value={formData.fisicogeral?.[sys.key] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ================= EXAMES COMPLEMENTARES ================= */}
          <div className={styles.column}>
            <h2>Exames Complementares</h2>
            <div className="card-body">
              <div className={styles.checkbox_container}>
                {EXAMES_COMPLEMENTARES.map((exame) => (
                  <label key={exame.key}>
                    <input
                      type="checkbox"
                      value={exame.label}
                      checked={examesComplementares.includes(exame.label)}
                      onChange={handleExameChange}
                      className="form-control"
                    />
                    {exame.label}
                  </label>
                ))}
                {showOtherExameInput && (
                  <input
                    type="text"
                    placeholder="Digite aqui..."
                    value={otherExameValue}
                    onChange={handleOtherExameChange}
                    className="form-control"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ================= BOTÕES FINAIS ================= */}
          <div className={styles.button_box}>
            <VoltarWhiteButton onClick={prevStep} />
            <ContinuarFichasGreenButton type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}