import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';

import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import FinalizarFichaModal from "../FinalizarFichaModal";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import FichaRetornoClinicoSilPDF from './FichaRetornoClinicoSilPDF';

import { getCurrentUsuario } from '../../../../services/userService';
import { getAnimalById } from '../../../../services/animalService';
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getMedicoById } from "../../../../services/medicoService";

// Dynamic import fora do componente
const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas}>
    <PDFLink
      document={
        <FichaRetornoClinicoSilPDF 
          ficha={ficha} 
          animal={animal} 
          tutor={tutor} 
          medicoLogado={medicoLogado} 
        />
      }
      fileName={`RetornoClinicoSilvestres_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`}
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function UpdateFichaRetornoClinicoSil() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [consultaId, setConsultaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState("");
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [medicoLogado, setMedicoLogado] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [formData, setFormData] = useState({
    numeroSessao: "",
    sessaoData: "",
    anamnese: "",
    exameclinico: "",
    tratamento: "",
    exames: [],
    rg: "",
    estagiario: "",
    medicoresponsavel: "",
    outros_texto: ""
  });

  useEffect(() => {
    if (modo === 'visualizar') {
      setIsReadOnly(true);
    }
  }, [modo]);

  useEffect(() => {
    if (router.isReady) {
      if (queryConsultaId) setConsultaId(queryConsultaId);
      if (queryAnimalId) setAnimalId(queryAnimalId);
      if (queryFichaId) setFichaId(queryFichaId);
      if (queryAgendamentoId) setAgendamentoId(queryAgendamentoId);
    }
  }, [router.isReady, queryConsultaId, queryAnimalId, queryFichaId, queryAgendamentoId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedRoles = JSON.parse(localStorage.getItem('roles') || "[]");
      setToken(storedToken || "");
      setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    const fetchMedicoData = async () => {
      try {
        const userData = await getCurrentUsuario();
        const medicoId = userData?.usuario?.id;
        if (medicoId) {
          const medicoCompletoData = await getMedicoById(medicoId);
          setMedicoLogado(medicoCompletoData);
        }
      } catch (error) {
        console.error('Erro ao buscar médico logado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicoData();
  }, []);

  useEffect(() => {
    if (!animalId) return;

    const fetchAnimalAndTutor = async () => {
      try {
        const [animalData, tutorData] = await Promise.all([
          getAnimalById(animalId),
          getTutorByAnimal(animalId)
        ]);
        setAnimal(animalData || {});
        setTutor(tutorData || {});
      } catch (error) {
        console.error('Erro ao buscar animal ou tutor:', error);
      }
    };

    fetchAnimalAndTutor();
  }, [animalId]);

  useEffect(() => {
    if (modo === "criar") {
      setLoading(false);
      return;
    }

    if (!fichaId) return;

    const fetchFichaData = async () => {
      try {
        const fichaResponse = await getFichaById(fichaId);
        if (fichaResponse?.conteudo) {
          setFormData(typeof fichaResponse.conteudo === 'string'
            ? JSON.parse(fichaResponse.conteudo)
            : fichaResponse.conteudo);
        }
        setData(fichaResponse?.dataHora);
      } catch (error) {
        console.error('Erro ao buscar dados da ficha:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFichaData();
  }, [fichaId, modo]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prevState) => {
      const examesAtual = Array.isArray(prevState.exames) ? prevState.exames : [];
      const exames = checked
        ? [...examesAtual, value]
        : examesAtual.filter((item) => item !== value);
      return { ...prevState, exames };
    });
  };

  const handleSubmit = async (event) => {
    if (event?.preventDefault) event.preventDefault();
    setShowErrorAlert(false);

    const currentModo = modo || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('modo'));
    const currentFichaId = fichaId || queryFichaId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fichaId'));
    const currentAgendamentoId = agendamentoId || queryAgendamentoId || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('agendamentoId'));

    const dataFormatada = moment(data).isValid() 
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss") 
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    const fichaData = {
      nome: "Ficha de Retorno Clínico de Animais Silvestres e Exóticos",
      conteudo: {
        numeroSessao: formData.numeroSessao,
        sessaoData: formData.sessaoData,
        anamnese: formData.anamnese,
        exameclinico: formData.exameclinico,
        tratamento: formData.tratamento,
        exames: formData.exames,
        rg: formData.rg,
        estagiario: formData.estagiario,
        medicosResponsaveis: formData.medicosResponsaveis,
        outros_texto: formData.outros_texto
      },
      dataHora: dataFormatada,
      agendamento: { id: Number(currentAgendamentoId) }
    };

    try {
      if (currentModo === "criar" || !currentFichaId || currentFichaId === "null") {
        await createFicha(fichaData);
      } else {
        await updateFicha(fichaData, currentFichaId);
      }
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      setErrorMessage(error?.response?.data?.message || (currentModo === "criar" || !currentFichaId ? "Erro ao criar ficha" : "Erro ao editar ficha"));
      setShowErrorAlert(true);
    }
  };

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    );
  }

  if (!roles.includes("medico") && !roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha clínico médica de retorno de animais silvestres e exóticos</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
          <div id="flex-grid" className={styles.column}>
            <div id="flex-column" className={styles.column}>
              <label>RG:</label>
              <input
                id="meia-caixa"
                type="text"
                name="numeroSessao"
                value={formData.numeroSessao}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
            <div id="flex-column" className={styles.column}>
              <label>Data:</label>
              <input
                id="meia-caixa"
                type="date"
                name="sessaoData"
                value={formData.sessaoData}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
          </div>

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
                        <div className={styles.box}>
                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Espécie</h6>
                              <p>{animal.raca?.especie?.nome}</p>
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
                              <p>{animal.raca?.nome}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Porte</h6>
                              <p>{animal.raca?.porte || 'Não definido'}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Data de nascimento</h6>
                              <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : 'Não definida'}</p>
                            </div>
                          </div>

                          <div className={styles.lista}>
                            <div className={styles.infos}>
                              <h6>Alergias</h6>
                              <p>{animal.alergias || 'Não definidas'}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Número de prontuário</h6>
                              <p>{animal.codigoProntuario || 'Não definido'}</p>
                            </div>
                            <div className={styles.infos}>
                              <h6>Tutor</h6>
                              <p>{tutor.nome || 'Não definido'}</p>
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

          <div className={styles.titulo}>Retorno – Acompanhamento Clínico</div>
          <div className={styles.column}>
            <label>Anamnese:</label>
            <textarea
              id="text"
              name="anamnese"
              value={formData.anamnese}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="10"
              cols="50"
            />
          </div>

          <div className={styles.column}>
            <label>Exame Clínico:</label>
            <textarea
              id="text"
              name="exameclinico"
              value={formData.exameclinico}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="10"
              cols="50"
            />
          </div>

          <div className={styles.column}>
            <label>Tratamento:</label>
            <textarea
              id="text"
              name="tratamento"
              value={formData.tratamento}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="10"
              cols="50"
            />
          </div>

          <div className={styles.titulo}>Exames Complementares</div>

          <div className={styles.checkbox_container}>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="hemograma"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('hemograma')}
                /> Hemograma
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="alt_tgp"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('alt_tgp')}
                /> ALT/TGP
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="ast_tgo"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('ast_tgo')}
                /> AST/TGO
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="creatinina"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('creatinina')}
                /> Creatinina
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="ureia"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('ureia')}
                /> Uréia
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="proteinas_totais"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('proteinas_totais')}
                /> Proteínas Totais
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="albumina"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('albumina')}
                /> Albumina
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="globulina"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('globulina')}
                /> Globulina
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="fa"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('fa')}
                /> FA
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="ggt"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('ggt')}
                /> GGT
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="glicose"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('glicose')}
                /> Glicose
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="triglicerides"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('triglicerides')}
                /> Triglicerídes
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="colesterol_total"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('colesterol_total')}
                /> Colesterol Total
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="urinalise"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('urinalise')}
                /> Urinálise
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="bilirrubina_total"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('bilirrubina_total')}
                /> Bilirrubina Total e Frações
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="tricograma"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('tricograma')}
                /> Tricograma
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="citologia_cutanea"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('citologia_cutanea')}
                /> Citologia Cutânea
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="raspado_cutaneo"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('raspado_cutaneo')}
                /> Raspado Cutâneo
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="citologia_oncologica"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('citologia_oncologica')}
                /> Citologia Oncológica
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="histopatologico"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('histopatologico')}
                /> Histopatológico
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="ultrassonografia"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('ultrassonografia')}
                /> Ultrassonografia
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="raio_x"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes('raio_x')}
                /> Raio X
              </label>
              <label>
                <input
                  type="checkbox"
                  name="exames"
                  value="outros"
                  disabled={isReadOnly}
                  onChange={handleCheckboxChange}
                  checked={formData.exames?.includes("outros")}
                /> Outros:
              </label>
              {formData.exames?.includes("outros") && (
                <input
                  type="text"
                  name="outros_texto"
                  value={formData.outros_texto || ''}
                  onChange={handleChange}
                  disabled={!formData.exames?.includes("outros")}
                  placeholder="Especifique"
                />
              )}
            </div>
          </div>

          <div className={styles.column}>
            <label>Estagiário:</label>
            <input
              type="text"
              name="estagiario"
              value={formData.estagiario}
              disabled={isReadOnly}
              onChange={handleChange}
            />
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
            {!loading && animal?.id && tutor?.id && medicoLogado && (
              <DownloadPdfStyledButton
                ficha={formData}
                animal={animal}
                tutor={tutor}
                medicoLogado={medicoLogado}
              />
            )}

            {!isReadOnly && (
              <>
                <CancelarWhiteButton />
                <FinalizarFichaModal onConfirm={handleSubmit} />
              </>
            )}
          </div>
        </form>

        {showAlert && (
          <div className={styles.alert}>
            <Alert
              message={modo === "criar" ? "Ficha criada com sucesso!" : "Ficha editada com sucesso!"}
              show={showAlert}
              url={consultaId ? `/createConsulta/${consultaId}` : (animalId ? `/getAllConsultas/${animalId}` : `/getAllConsultas`)}
            />
          </div>
        )}

        {showErrorAlert && (
          <ErrorAlert
            message={errorMessage || (modo === "criar" ? "Erro ao criar ficha" : "Erro ao editar ficha")}
            show={showErrorAlert}
          />
        )}
      </div>
    </div>
  );
}

export default UpdateFichaRetornoClinicoSil;