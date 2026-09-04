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
import FichaSessaoPDF from './FichaSessaoPDF';

import { getCurrentUsuario } from '../../../../services/userService';
import { getAnimalById } from '../../../../services/animalService';
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getMedicoById } from '../../../../services/medicoService';

// PDFDownloadLink fora do componente
const PdfDownloadButton = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>Carregando...</p>,
  }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas}>
    <PdfDownloadButton
      document={
        <FichaSessaoPDF 
          ficha={ficha} 
          animal={animal} 
          tutor={tutor} 
          medicoLogado={medicoLogado} 
        />
      }
      fileName={`FichaSessao_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}_${ficha?.sessaoData || ''}.pdf`}
      style={{
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PdfDownloadButton>
  </button>
);

function UpdateFichaSessao() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados de alerta e mensagem de erro definidos corretamente
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [consultaId, setConsultaId] = useState(null);
  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [medicoLogado, setMedicoLogado] = useState(null);

  const [formData, setFormData] = useState({
    numeroSessao: "",
    sessaoData: "",
    anotacao: "",
    estagiario: "",
    rg: "",
    medicosResponsaveis: ""
  });

  useEffect(() => {
    if (modo === 'visualizar') {
      setIsReadOnly(true);
    }
  }, [modo]);

  useEffect(() => {
    if (router.isReady) {
      if (queryConsultaId) setConsultaId(queryConsultaId);
      if (queryAgendamentoId) setAgendamentoId(queryAgendamentoId);
      if (queryAnimalId) setAnimalId(queryAnimalId);
      if (queryFichaId) setFichaId(queryFichaId);
    }
  }, [router.isReady, queryConsultaId, queryAgendamentoId, queryAnimalId, queryFichaId]);

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
        console.error('Erro ao buscar usuário médico:', error);
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
      nome: "Ficha de sessão",  
      conteudo: { ...formData },
      dataHora: dataFormatada,
      agendamento: {
        id: Number(currentAgendamentoId)
      }
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
      <h1>Ficha de sessão</h1>
      <div className={styles.form_box}>
        <form onSubmit={handleSubmit}>
          <div id="flex-grid" className={styles.column}>
            <div id="flex-column" className={styles.column}>
              <label>Sessão nº:</label>
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

          <div className={styles.titulo}>Anotação</div>
          <div className={styles.column}>
            <textarea
              id="caixa-alta"
              name="anotacao"
              value={formData.anotacao}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="10"
              cols="50"
            />
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
          <div className={styles.column}>
            <label>RG:</label>
            <input
              type="text"
              name="rg"
              value={formData.rg}
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
          <Alert
            message={modo === "criar" ? "Ficha criada com sucesso!" : "Ficha editada com sucesso!"}
            show={showAlert}
            url={consultaId ? `/createConsulta/${consultaId}` : (animalId ? `/getAllConsultas/${animalId}` : `/getAllConsultas`)}
          />
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

export default UpdateFichaSessao;