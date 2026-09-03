import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import moment from 'moment';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import FinalizarFichaModal from "../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from '../../../../services/animalService';
import { useRouter } from 'next/router';
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getMedicoById } from '../../../../services/medicoService';
import dynamic from 'next/dynamic';
import AtoCirurgicoPDF from './AtoCirurgicoPDF';

const PDFLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
  <button type="button" className={styles.green_buttonFichas}>
    <PDFLink
      document={
        <AtoCirurgicoPDF 
          ficha={ficha} 
          animal={animal} 
          tutor={tutor} 
          medicoLogado={medicoLogado} 
        />
      }
      fileName={`AtoCirurgico_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`}
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function UpdateAtoCirurgico() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [medicoLogado, setMedicoLogado] = useState(null); 
  const [consultaId, setConsultaId] = useState(null);

  const [formData, setFormData] = useState({
    descricaoAtoCirurgico: "",
    prognostico: "",
    protocolos: [
      { medicacao: "", dose: "", frequencia: "", periodo: "" }
    ],
    reavaliacao: "",
    equipeResponsavel: "",
    nomeDaCirurgia: "",
    data: "",
    medicosResponsaveis: "",
  });

  useEffect(() => {
    if (router.isReady) {
      if (queryFichaId) setFichaId(queryFichaId);
      if (queryAgendamentoId) setAgendamentoId(queryAgendamentoId);
      if (queryAnimalId) setAnimalId(queryAnimalId);
      if (queryConsultaId) setConsultaId(queryConsultaId);
    }
  }, [router.isReady, queryFichaId, queryAgendamentoId, queryAnimalId, queryConsultaId]);

  const { protocolos = [] } = formData;

  useEffect(() => {
    if (modo === 'visualizar') {
      setIsReadOnly(true);
    }
  }, [modo]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || "");
      setRoles(JSON.parse(localStorage.getItem('roles') || "[]"));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUsuario();
        const medicoId = userData?.usuario?.id;
        if (medicoId) {
          const medicoCompletoData = await getMedicoById(medicoId);
          setMedicoLogado(medicoCompletoData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do médico:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!animalId) return;

    const fetchAnimalAndTutor = async () => {
      try {
        const animalData = await getAnimalById(animalId);
        setAnimal(animalData || {});
      } catch (error) {
        console.error('Erro ao buscar animal:', error);
      }

      try {
        const tutorData = await getTutorByAnimal(animalId);
        setTutor(tutorData || {});
      } catch (error) {
        console.error('Erro ao buscar tutor do animal:', error);
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

    const fetchFicha = async () => {
      try {
        const fichaResponse = await getFichaById(fichaId);
        if (fichaResponse?.conteudo) {
          setFormData(typeof fichaResponse.conteudo === "string" 
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

    fetchFicha();
  }, [fichaId, modo]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return <div className={styles.message}>Carregando dados do usuário...</div>;
  }

  if (!roles.includes("medico") && !roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setShowErrorAlert(false);

    const dataFormatada = moment(data).isValid() 
      ? moment(data).format("YYYY-MM-DDTHH:mm:ss") 
      : moment().format("YYYY-MM-DDTHH:mm:ss");

    const fichaData = {
      nome: "Ficha de ato cirúrgico",
      conteudo: { ...formData },
      dataHora: dataFormatada,
      agendamento: { id: Number(agendamentoId) }
    };

    try {
      if (modo === "criar") {
        await createFicha(fichaData);
      } else {
        await updateFicha(fichaData, fichaId);
      }
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);
      setErrorMessage(error?.response?.data?.message || (modo === "criar" ? "Erro ao criar ficha" : "Erro ao editar ficha"));
      setShowErrorAlert(true);
    }
  };

  const handleChangeTratamentos = (index, campo, valor) => {
    setFormData((prev) => {
      const novosTratamentos = [...prev.protocolos];
      novosTratamentos[index][campo] = valor;
      return { ...prev, protocolos: novosTratamentos };
    });
  };

  const adicionarLinhaTratamento = () => {
    setFormData((prev) => ({
      ...prev,
      protocolos: [
        ...prev.protocolos,
        { medicacao: "", dose: "", frequencia: "", periodo: "" }
      ]
    }));
  };

  const removerUltimaLinhaTratamento = () => {
    setFormData((prev) => {
      if (prev.protocolos.length > 1) {
        return {
          ...prev,
          protocolos: prev.protocolos.slice(0, -1),
        };
      }
      return prev;
    });
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Ficha de ato cirúrgico</h1>

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

          <div className={styles.titulo}>Descrição do ato cirúrgico</div>

          <div className={styles.column}>
            <textarea
              id="caixa-alta"
              name="descricaoAtoCirurgico"
              value={formData.descricaoAtoCirurgico}
              disabled={isReadOnly}
              onChange={handleChange}
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.column}>
              <label>Nome da Cirurgia</label>
              <textarea
                name="nomeDaCirurgia"
                value={formData.nomeDaCirurgia}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
            <div className={styles.column}>
              <label>Data</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.titulo}>Prognóstico pós cirúrgico</div>

          <div className={styles.column}>
            <label>Prognóstico</label>
            <select
              id="meia-caixa"
              name="prognostico"
              value={formData.prognostico}
              disabled={isReadOnly}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="FAVORAVEL">Favorável</option>
              <option value="RESERVADO">Reservado</option>
              <option value="DESFAVORAVEL">Desfavorável</option>
            </select>
          </div>

          <div className={styles.column}>
            <label>Protocolos terapêuticos a serem instituidos</label>
            <table className={styles.tabela_tratamento}>
              <thead>
                <tr>
                  <th id="medicacao">Medicação</th>
                  <th>Dose</th>
                  <th>Frequência</th>
                  <th>Período</th>
                </tr>
              </thead>
              <tbody>
                {protocolos.map((linha, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={linha.medicacao}
                        disabled={isReadOnly}
                        onChange={(e) => handleChangeTratamentos(index, "medicacao", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={linha.dose}
                        disabled={isReadOnly}
                        onChange={(e) => handleChangeTratamentos(index, "dose", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={linha.frequencia}
                        disabled={isReadOnly}
                        onChange={(e) => handleChangeTratamentos(index, "frequencia", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={linha.periodo}
                        disabled={isReadOnly}
                        onChange={(e) => handleChangeTratamentos(index, "periodo", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.bolha_container}>
              <div className={styles.bolha} onClick={adicionarLinhaTratamento}>+</div>
              <div className={`${styles.bolha} ${styles.bolha_remover_linha}`} onClick={removerUltimaLinhaTratamento}>-</div>
            </div>
          </div>

          <div className={styles.column}>
            <label>Retorno para reavaliações</label>
            <textarea
              name="reavaliacao"
              value={formData.reavaliacao}
              disabled={isReadOnly}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
          </div>

          <div className={styles.column}>
            <label>Plantonista(s) discente(s):</label>
            <textarea
              name="equipeResponsavel"
              value={formData.equipeResponsavel}
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

export default UpdateAtoCirurgico;