import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import FinalizarFichaModal from "../FinalizarFichaModal";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import FichaDermatologicaRetornoPDF from './FichaDermatologicaRetornoPDF';

import { getCurrentUsuario } from '../../../../services/userService';
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from "../../../../services/animalService";
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
        <FichaDermatologicaRetornoPDF 
          ficha={ficha} 
          animal={animal} 
          tutor={tutor} 
          medicoLogado={medicoLogado} 
        />
      }
      fileName={`FichaDermatologicaRetorno_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`}
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function FichaDermatologicaRetorno() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState("");
  const [consultaId, setConsultaId] = useState(null);
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [medicoLogado, setMedicoLogado] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [formData, setFormData] = useState({
    anamnese: "",
    tratamentos: "",
    resultados: "",
    locaisAfetados: "",
    condutaTerapeutica: "",
    estagiarios: "",
    peso: "",
    medicoResponsavel: "",
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
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUsuario();
        const medicoId = userData?.usuario?.id;
        if (medicoId) {
          const medicoCompletoData = await getMedicoById(medicoId);
          setMedicoLogado(medicoCompletoData);
        }
      } catch (error) {
        console.error('Erro ao buscar médico:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
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

  const cleanLocalStorage = () => {
    localStorage.removeItem("fichaCardiologicaFormData");
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
      nome: "Ficha dermatológica de retorno",  
      conteudo: { ...formData },
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
      <h1>Ficha clínica dermatológica de retorno</h1>
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

          <div className={styles.titulo}>Anamnese</div>
          
          <div className={styles.column}>
            <div id="flex-column" className={styles.column}>
              <label>peso:</label>
              <input
                id="meia-caixa"
                type="text"
                name="peso"
                value={formData.peso}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.column}>
            <label>Anamnese/Histórico clínico</label>
            <textarea
              name="anamnese"
              value={formData.anamnese}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
          </div>

          <div className={styles.column}>
            <label>Tratamentos realizados (Início/Término/Resposta terapêutica)</label>
            <textarea
              name="tratamentos"
              value={formData.tratamentos}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
          </div>

          <div className={styles.column}>
            <label>Resultados dos exames realizados</label>
            <textarea
              name="resultados"
              value={formData.resultados}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
          </div>

          <div className={styles.titulo}>
            Exame físico dermatológico/Descrição lesional
          </div>

          <div className={styles.column}>
            <label>Locais afetados</label>
            <textarea
              name="locaisAfetados"
              value={formData.locaisAfetados}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
          </div>

          <div className={styles.column}>
            <label>Conduta terapêutica</label>
            <textarea
              name="condutaTerapeutica"
              value={formData.condutaTerapeutica}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
          </div>
          
          <div className={styles.column}>
            <label>Plantonista(s) discente(s):</label>
            <textarea
              name="estagiarios"
              value={formData.estagiarios}
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
                <CancelarWhiteButton onClick={cleanLocalStorage} />
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

export default FichaDermatologicaRetorno;