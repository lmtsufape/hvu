import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import FinalizarFichaModal from "../FinalizarFichaModal";
import { CancelarWhiteButton } from "../../WhiteButton";
import DrawingModal from "@/components/Fichas/DrawingModal";
import FichaSolicitacaoCitologiaPDF from './FichaSolicitacaoCitologiaPDF';

import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from '../../../../services/animalService';
import { getFichaById, updateFicha, createFicha } from "../../../../services/fichaService";
import { getCurrentUsuario } from "../../../../services/userService";
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
        <FichaSolicitacaoCitologiaPDF 
          ficha={ficha} 
          animal={animal} 
          tutor={tutor} 
          medicoLogado={medicoLogado} 
        />
      }
      fileName={`SolicitacaoCitologia_${animal?.nome ? animal.nome.replace(/\s/g, '_') : 'animal'}.pdf`}
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
    </PDFLink>
  </button>
);

function FichaSolicitacaoCitologia() {
  const router = useRouter();
  const { modo, animalId: queryAnimalId, fichaId: queryFichaId, agendamentoId: queryAgendamentoId, consultaId: queryConsultaId } = router.query;

  const [showAlert, setShowAlert] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [showOtherInputLesao, setShowOtherInputLesao] = useState(false);
  const [otherValueLesao, setOtherValueLesao] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const dimensoesImagem = { largura: 700, altura: 360 };
  const [imagemDesenhada, setImagemDesenhada] = useState(null);
  const [consultaId, setConsultaId] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState("");
  const [agendamentoId, setAgendamentoId] = useState(null);

  const [animalId, setAnimalId] = useState(null);
  const [animal, setAnimal] = useState({});
  const [showButtons, setShowButtons] = useState(false);
  const [tutor, setTutor] = useState({});
  const [medicoLogado, setMedicoLogado] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [formData, setFormData] = useState({
    anamnese: [],
    dataColheita: "",
    historicoExameFisico: "",
    localizacaoLesao: "",
    imagemLesao: {
      imagem: "",
      linhasDesenhadas: [],
    },
    caracteristicasLesao: {
      selecionadas: [],
      descricao: "",
      cor: "",
      consistencia: "",
      bordas: "",
      ulceracao: "",
      dorPalpacao: "",
      temperaturaLocal: "",
      relacaoTecidosVizinhos: ""
    },
    citologia: {
      descricao: "",
      metodo: "",
      numeroLaminas: "",
      resultado: "",
      conclusao: "",
      comentarios: ""
    }
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
        console.error('Erro ao buscar médico:', error);
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
          const conteudo = typeof fichaResponse.conteudo === 'string'
            ? JSON.parse(fichaResponse.conteudo)
            : fichaResponse.conteudo;
          setFormData(conteudo);
          if (conteudo?.imagemLesao?.imagem) {
            setImagemDesenhada(conteudo.imagemLesao.imagem);
          }
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

  const handleSaveDrawing = (imagemFinal, linhasDesenhadas) => {
    setFormData((prev) => ({
      ...prev,
      imagemLesao: {
        imagem: imagemFinal,
        linhasDesenhadas: linhasDesenhadas
      }
    }));
    setImagemDesenhada(imagemFinal);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.includes(".")) {
      const nameParts = name.split(".");
      setFormData((prev) => {
        const updatedFormData = structuredClone(prev);
        let current = updatedFormData;
        for (let i = 0; i < nameParts.length - 1; i++) {
          if (!current[nameParts[i]]) current[nameParts[i]] = {};
          current = current[nameParts[i]];
        }
        current[nameParts[nameParts.length - 1]] = value;
        return updatedFormData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (event, field, setShowOther, setOther) => {
    const { value, checked } = event.target;

    if (value === "Outros(s):") {
      setShowOther(checked);
      if (!checked) setOther("");
    }

    setFormData((prev) => {
      if (field === "anamnese") {
        return {
          ...prev,
          anamnese: checked
            ? [...(prev.anamnese || []), value]
            : (prev.anamnese || []).filter((item) => item !== value)
        };
      }

      if (field === "caracteristicasLesao") {
        return {
          ...prev,
          caracteristicasLesao: {
            ...prev.caracteristicasLesao,
            selecionadas: checked
              ? [...(prev.caracteristicasLesao?.selecionadas || []), value]
              : (prev.caracteristicasLesao?.selecionadas || []).filter((item) => item !== value)
          }
        };
      }

      return prev;
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

    let anamneseFinal = Array.isArray(formData.anamnese) ? [...formData.anamnese] : [];
    let caracteristicasFinal = Array.isArray(formData.caracteristicasLesao?.selecionadas) ? [...formData.caracteristicasLesao.selecionadas] : [];

    if (anamneseFinal.includes("Outros(s):") && otherValue.trim() !== "") {
      anamneseFinal = anamneseFinal.filter(item => item !== "Outros(s):");
      anamneseFinal.push(otherValue.trim());
    }

    if (caracteristicasFinal.includes("Outros(s):") && otherValueLesao.trim() !== "") {
      caracteristicasFinal = caracteristicasFinal.filter(item => item !== "Outros(s):");
      caracteristicasFinal.push(otherValueLesao.trim());
    }

    const fichaData = {
      nome: "Ficha de solicitação de citologia",
      conteudo: {
        anamnese: anamneseFinal,
        dataColheita: formData.dataColheita,
        historicoExameFisico: formData.historicoExameFisico,
        localizacaoLesao: formData.localizacaoLesao,
        imagemLesao: formData.imagemLesao,
        caracteristicasLesao: {
          ...formData.caracteristicasLesao,
          selecionadas: caracteristicasFinal
        },
        citologia: formData.citologia
      },
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
      setErrorMessage(error?.response?.data?.message || error?.response?.data?.error || (currentModo === "criar" || !currentFichaId ? "Erro ao criar ficha" : "Erro ao editar ficha"));
      setShowErrorAlert(true);
    }
  };

  const renderImagemLesao = () => {
    if (imagemDesenhada) {
      return (
        <img
          src={imagemDesenhada}
          alt="Localização das lesões com marcações"
          style={{ maxWidth: '500px', border: '1px solid #ccc' }}
        />
      );
    }
    return (
      <img
        src="/images/localizacao_lesao_citologia.png"
        alt="Localização das lesões"
        style={{ maxWidth: '500px', border: '1px solid #ccc' }}
      />
    );
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
      <h1>Ficha de Solicitação de Citologia</h1>

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

          <div className={styles.box}>
            <div className={styles.column}>
              <label>Data da colheita</label>
              <input
                type="date"
                name="dataColheita"
                value={formData.dataColheita}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.column}>
            <label>Histórico/Exame físico:</label>
            <input
              type="text"
              name="historicoExameFisico"
              value={formData.historicoExameFisico}
              disabled={isReadOnly}
              onChange={handleChange}
            />
          </div>

          <div className={styles.column}>
            <label>Localização da lesão:</label>
            <input
              type="text"
              name="localizacaoLesao"
              value={formData.localizacaoLesao}
              disabled={isReadOnly}
              onChange={handleChange}
            />
          </div>

          <div className={styles.column}>
            <label>Descrição das lesões:</label>
            <div
              onClick={() => setShowDrawingModal(true)}
              style={{ cursor: 'pointer', textAlign: 'center' }}
            >
              {renderImagemLesao()}
              <p style={{ color: 'black' }}>Clique para desenhar sobre a imagem</p>
            </div>
          </div>

          <DrawingModal
            show={showDrawingModal}
            onHide={() => setShowDrawingModal(false)}
            backgroundImage="/images/localizacao_lesao_citologia.png"
            disabled={isReadOnly}
            onSave={handleSaveDrawing}
            showDrawingModal={showDrawingModal}
            dimensoesImagem={dimensoesImagem}
            linhasEditadas={formData.imagemLesao?.linhasDesenhadas}
          />

          <div className={styles.column}>
            <label>Método de colheita</label>
          </div>
          <div className={styles.checkbox_container}>
            {["PAAF", "Swab", "Capilaridade", "Imprint", "Escarificação", "Outros(s):"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={formData.anamnese?.includes(item)}
                  disabled={isReadOnly}
                  onChange={(e) => handleCheckboxChange(e, "anamnese", setShowOtherInput, setOtherValue)}
                />
                {item}
              </label>
            ))}
          </div>
          {showOtherInput && (
            <input
              type="text"
              placeholder="Digite aqui..."
              value={otherValue}
              disabled={isReadOnly}
              onChange={(e) => setOtherValue(e.target.value)}
              className="form-control"
            />
          )}

          <div className={styles.column}>
            <label>Características da Lesão / Material</label>
          </div>
          <div className={styles.checkbox_container}>
            {["Nódulo", "Pápula", "Vesícula", "Tumefação", "Tumoração", "Outros(s):"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={formData.caracteristicasLesao?.selecionadas?.includes(item)}
                  disabled={isReadOnly}
                  onChange={(e) => handleCheckboxChange(e, "caracteristicasLesao", setShowOtherInputLesao, setOtherValueLesao)}
                />
                {item}
              </label>
            ))}
          </div>

          {showOtherInputLesao && (
            <input
              type="text"
              placeholder="Digite aqui..."
              value={otherValueLesao}
              disabled={isReadOnly}
              onChange={(e) => setOtherValueLesao(e.target.value)}
              className="form-control"
            />
          )}

          <div className={styles.box}>
            <div className={styles.column}>
              <label>Descrição:</label>
              <input
                type="text"
                name="caracteristicasLesao.descricao"
                value={formData.caracteristicasLesao?.descricao || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>

            <div className={styles.column}>
              <label>Cor:</label>
              <input
                type="text"
                name="caracteristicasLesao.cor"
                value={formData.caracteristicasLesao?.cor || ""}
                disabled={isReadOnly}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={styles.column}>
              <label>Consistência:</label>
              <input
                type="text"
                name="caracteristicasLesao.consistencia"
                value={formData.caracteristicasLesao?.consistencia || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>

            <div className={styles.column}>
              <label>Bordas:</label>
              <input
                type="text"
                name="caracteristicasLesao.bordas"
                value={formData.caracteristicasLesao?.bordas || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>

            <div className={styles.column}>
              <label>Ulceração:</label>
              <select
                name="caracteristicasLesao.ulceracao"
                value={formData.caracteristicasLesao?.ulceracao || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>

            <div className={styles.column}>
              <label>Dor à palpação:</label>
              <select
                name="caracteristicasLesao.dorPalpacao"
                value={formData.caracteristicasLesao?.dorPalpacao || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>

            <div className={styles.column}>
              <label>Temperatura local:</label>
              <select
                name="caracteristicasLesao.temperaturaLocal"
                value={formData.caracteristicasLesao?.temperaturaLocal || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="elevada">elevada</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div className={styles.column}>
              <label>Relação com os tecidos vizinhos:</label>
              <select
                name="caracteristicasLesao.relacaoTecidosVizinhos"
                value={formData.caracteristicasLesao?.relacaoTecidosVizinhos || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Móvel">móvel</option>
                <option value="Fixo">Fixo</option>
              </select>
            </div>
          </div>

          <h2>Citologia</h2>
          <div className={styles.box}>
            <div className={styles.column}>
              <label>Descrição:</label>
              <input
                type="text"
                name="citologia.descricao"
                value={formData.citologia?.descricao || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
            <div className={styles.column}>
              <label>Método:</label>
              <input
                type="text"
                name="citologia.metodo"
                value={formData.citologia?.metodo || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
            <div className={styles.column}>
              <label>Número de Lâminas:</label>
              <input
                type="number"
                name="citologia.numeroLaminas"
                value={formData.citologia?.numeroLaminas || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
            <div className={styles.column}>
              <label>Resultado:</label>
              <input
                type="text"
                name="citologia.resultado"
                value={formData.citologia?.resultado || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
            <div className={styles.column}>
              <label>Conclusão:</label>
              <input
                type="text"
                name="citologia.conclusao"
                value={formData.citologia?.conclusao || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
            <div className={styles.column}>
              <label>Comentários:</label>
              <input
                name="citologia.comentarios"
                value={formData.citologia?.comentarios || ""}
                disabled={isReadOnly}
                onChange={handleChange}
              />
            </div>
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

export default FichaSolicitacaoCitologia;