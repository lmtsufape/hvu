import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import "react-datepicker/dist/react-datepicker.css";
import VoltarButton from "../VoltarButton";
import EspecialidadeList from "@/hooks/useEspecialidadeList"
import { createConsulta } from "../../../services/consultaService";
import { getVagaById } from "../../../services/vagaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";
import { getFichaById } from "../../../services/fichaService";
import { deleteFicha } from "../../../services/fichaService";


// Hook personalizado para gerenciar fichaIds
const useFichaManager = () => {
  const [fichaIds, setFichaIds] = useState([]);

  // Carrega IDs existentes ao iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIds = localStorage.getItem('fichaIds');
      if (storedIds) {
        try {
          const parsedIds = JSON.parse(storedIds);
          if (Array.isArray(parsedIds)) {
            setFichaIds(parsedIds.filter(id => id && id !== "null"));
            console.log("parsedIds:", parsedIds);
          }
        } catch (error) {
          console.error("Erro ao ler fichaIds:", error);
        }
      }
    }
  }, []);

    useEffect(() => {
    console.log("Ficha IDs atualizados:", fichaIds);
  }, [fichaIds]);

  // Adiciona novo ID ao array
const addFichaId = (newId) => {
  if (!newId) return;

  setFichaIds(prevIds => {
    if (prevIds.includes(newId)) return prevIds;

    const updatedIds = [...prevIds, newId];
    localStorage.setItem('fichaIds', JSON.stringify(updatedIds));
    return updatedIds;
  });
};

  return { fichaIds, addFichaId };
};

function CreateConsulta() {
  const router = useRouter();
  const { id } = router.query;

    // Usa o hook personalizado
  const { fichaIds, addFichaId } = useFichaManager();

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [showAlertFicha, setShowAlertFicha] = useState(false);

  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});

  const [animalId, setAnimalId] = useState(null);
  const [medicoId, setMedicoId] = useState(null);

  console.log("medicoId:", medicoId);
  console.log("animalId:", animalId);

  const [consulta, setConsulta] = useState({
    pesoAtual: null,
    idadeAtual: null,
    queixaPrincipal: "",
    alteracoesClinicasDiversas: "",
    suspeitasClinicas: "",
    alimentacao: "",
    medico: { id: null },
    parecer: null,
    proximaConsulta: false,
    encaminhamento: null,
    animal: { id: null },
    dataVaga: "",
    fichaIds: fichaIds
  });

  const [vagaData, setVagaData] = useState({});

  const { especialidades, error: especialidadesError } = EspecialidadeList();
  const [especialidade, setEspecialidade] = useState(null);
  const handleEspecialidadeSelection = (event) => {
    const selectedEspecialidadeId = event.target.value;
    setEspecialidade(selectedEspecialidadeId);
  };

  const [fichasDados, setFichas] = useState([]);

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const fetchedFichas = await Promise.all(
          fichaIds.map(id => getFichaById(id))
        );

        // Parseando o campo conteudo de cada ficha
        const fichasComConteudo = fetchedFichas.map(ficha => ({
          ...ficha,
          conteudo: JSON.parse(ficha.conteudo),
        }));
        setFichas(fichasComConteudo);
      } catch (error) {
        console.error("Erro ao buscar fichas:", error);
      }
    };

    if (fichaIds.length > 0) {
      fetchFichas();
    }
  }, [fichaIds]);


    // Captura o ID individual e adiciona ao array
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentFichaId = localStorage.getItem('fichaId');
      if (currentFichaId) {
        console.log("currentFichaId:", currentFichaId);
        addFichaId(currentFichaId);
        // Limpa o ID individual após uso
        localStorage.removeItem('fichaId');
      }
    }
  }, [addFichaId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        const storedRoles = JSON.parse(localStorage.getItem('roles'));
        setToken(storedToken || "");
        setRoles(storedRoles || []);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const vagaJson = await getVagaById(id);
          setVagaData(vagaJson);
          setAnimalId(vagaJson.agendamento.animal.id);
          setMedicoId(vagaJson.medico.id);
        } catch (error) {
          console.error('Erro ao buscar vaga:', error);
        } finally {
          setLoading(false); // Marcar como carregado após buscar os dados
        }
      };
      fetchData();
    }
  }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
      return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

  // Verifica se o usuário tem permissão
  if (!roles.includes("medico")) {
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

  const handleConsultaChange = (event) => {
    const { name, value } = event.target;
    setConsulta({ ...consulta, [name]: value });
  };

  function handleProximaConsultaChange(event) {
    const { value } = event.target;
    setConsulta({ ...consulta, proximaConsulta: value === "true" });
  }

  const validateFields = (consulta) => {
    const errors = {};
    if (!consulta.pesoAtual) {
      errors.pesoAtual = "Campo obrigatório";
    }
    if (!consulta.idadeAtual) {
      errors.idadeAtual = "Campo obrigatório";
    }
    if (consulta.queixaPrincipal == "") {
      errors.queixaPrincipal = "Campo obrigatório";
    }
    if (consulta.alteracoesClinicasDiversas == "") {
      errors.alteracoesClinicasDiversas = "Campo obrigatório";
    }
    if (consulta.suspeitasClinicas == "") {
      errors.suspeitasClinicas = "Campo obrigatório";
    }
    if (consulta.alimentacao == "") {
      errors.alimentacao = "Campo obrigatório";
    }
    
    return errors;
  };

  console.log("consulta:", consulta);
  console.log("vagaData:", vagaData);
  console.log("especialidade:", especialidade);

  const consultaToCreate = {
    pesoAtual: parseFloat(consulta.pesoAtual),
    idadeAtual: parseFloat(consulta.idadeAtual),
    queixaPrincipal: consulta.queixaPrincipal,
    alteracoesClinicasDiversas: consulta.alteracoesClinicasDiversas,
    suspeitasClinicas: consulta.suspeitasClinicas,
    alimentacao: consulta.alimentacao,
    medico: {id: medicoId},
    proximaConsulta: consulta.proximaConsulta,
    encaminhamento: {id: especialidade},
    animal: {id: animalId},
    dataVaga: vagaData.dataHora,
    ficha: fichaIds.map(id => ({ id: Number(id) }))
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields(consulta);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      console.log("Criando consulta com os dados:", consultaToCreate);
      await createConsulta(consultaToCreate, id);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      setShowErrorAlert(true);
    }
  };

  const handleClick = (path, id) => {
    router.push(`${path}?fichaId=${id}`);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deletando id:', id, 'do tipo', typeof id);
      await deleteFicha(id);
      setFichas(prev => prev.filter(ficha => ficha.id !== id));

      const fichaIdsStr = localStorage.getItem('fichaIds');
      if (fichaIdsStr) {
        const fichaIds = JSON.parse(fichaIdsStr);
        const novaLista = fichaIds.filter(fichaId => fichaId !== id.toString());
        localStorage.setItem('fichaIds', JSON.stringify(novaLista));
      }

      setShowAlertFicha(true);
    } catch (error) {
      console.error('Erro ao deletar ficha:', error);
      alert('Não foi possível excluir a ficha.');
    }
  };

  const handleCloseAlertFicha = () => {
    setShowAlertFicha(false);
  };

  return (
    <>
      <VoltarButton />
      <div>
        <h1 className={styles.titulocadastro}>Criar consulta</h1>
      </div>

      <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="animal" className="form-label">Paciente<span className={styles.obrigatorio}>*</span></label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={vagaData.agendamento && vagaData.agendamento.animal && vagaData.agendamento.animal.nome || "Carregando..."}
                disabled
              />
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;<span className={styles.obrigatorio}>*</span></label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={vagaData.medico && vagaData.medico.nome || "Carregando..."}
                disabled
              />
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="pesoAtual" className="form-label">Peso atual<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.pesoAtual ? "is-invalid" : ""}`}
                  name="pesoAtual"
                  placeholder="Digite o peso do animal"
                  value={consulta.pesoAtual || ""}
                  onChange={handleConsultaChange}
                />
                {errors.pesoAtual && <div className={`invalid-feedback ${styles.error_message}`}>{errors.pesoAtual}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="idadeAtual" className="form-label">Idade atual<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.idadeAtual ? "is-invalid" : ""}`}
                  name="idadeAtual"
                  placeholder="Digite a idade do animal"
                  value={consulta.idadeAtual || ""}
                  onChange={handleConsultaChange}
                />
                {errors.idadeAtual && <div className={`invalid-feedback ${styles.error_message}`}>{errors.idadeAtual}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="medico" className="form-label">Especialidade</label>
                <select 
                  className={`form-select ${styles.input}`}
                  name="encaminhamento"
                  aria-label="Selecione uma especialidade"
                  value={especialidade || ""}
                  onChange={handleEspecialidadeSelection}
                >
                  <option value="">Selecione uma especialidade</option>
                  {especialidades.map((especialidade) => (
                    <option key={especialidade.id} value={especialidade.id}>
                      {especialidade.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="queixaPrincipal" className="form-label">Queixa principal</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.queixaPrincipal ? "is-invalid" : ""}`}
                  name="queixaPrincipal"
                  placeholder="Digite a queixa principal"
                  value={consulta.queixaPrincipal || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="alteracoesClinicasDiversas" className="form-label">Alterações clínicas diversas</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.alteracoesClinicasDiversas ? "is-invalid" : ""}`}
                  name="alteracoesClinicasDiversas"
                  placeholder="Digite as alterações clínicas diversas"
                  value={consulta.alteracoesClinicasDiversas || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="suspeitasClinicas" className="form-label">Suspeitas clínicas</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.suspeitasClinicas ? "is-invalid" : ""}`}
                  name="suspeitasClinicas"
                  placeholder="Digite as suspeitas clínicas"
                  value={consulta.suspeitasClinicas || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="alimentacao" className="form-label">Alimentação</label>
                <textarea
                  className={`form-control ${styles.input} ${errors.alimentacao ? "is-invalid" : ""}`}
                  name="alimentacao"
                  placeholder="Digite a alimentação"
                  value={consulta.alimentacao || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50" 
                />
                </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col_radio}`}>
                <label htmlFor="tipoEspecial" className="form-label">
                  Retorno?
                </label>
                <div>
                  <input
                    type="radio"
                    className={`form-check-input ${styles.checkbox}`}
                    id="sim"
                    name="proximaConsulta"
                    value="true"
                    checked={consulta.proximaConsulta === true}
                    onChange={handleProximaConsultaChange}
                  />
                  <label htmlFor="sim" className={styles.input}>
                    Sim
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    className={`form-check-input ${styles.checkbox}`}
                    id="nao"
                    name="proximaConsulta"
                    value="false"
                    checked={consulta.proximaConsulta === false}
                    onChange={handleProximaConsultaChange}
                  />
                  <label htmlFor="nao" className={styles.input}>
                    Não
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.box_ficha_buttons}>

            <button className={styles.ficha_button} type="button"
            onClick={() => handleClick('/fichaAtoCirurgico', id)}>
              Ficha de ato cirúrgico
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaAnestesiologia')}>
              Ficha de anestesiológia
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaCardiologica')}>
              Ficha cardiológica
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaAtendimentoOrtopedico')}>
              Ficha ortopédica
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaClinicaMedica')}>
              Ficha clínica médica
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaMedicaRetorno')}>
              Ficha clínica médica de retorno
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaDermatologica')}>
              Ficha dermatológica
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaDermatologicaRetorno')}>
              Ficha dermatológica de retorno
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaNeurologica')}>
              Ficha neurológica
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaReabilitacaoIntegrativa')}>
              Ficha de reabilitação integrativa
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => handleClick('/fichaSessao', id)}>
              Ficha de sessão
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaSolicitacaoCitologia')}>
              Ficha de solicitação de citologia
            </button>
            <button className={styles.ficha_button} type="button"
            onClick={() => router.push('/fichaSolicitacaoExame')}>
              Ficha de solicitação de exame
            </button>
          </div>

          {fichasDados.map(ficha => (
            <div key={ficha.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <p><strong>ID:</strong> {ficha.id}</p>
              <p><strong>Data de criação:</strong> {new Date(ficha.dataHora).toLocaleString()}</p>
              <p><strong>Nome:</strong> {ficha.nome}</p>

              <div>
                {Object.entries(ficha.conteudo).map(([chave, valor]) => (
                  <p key={chave}>
                    <strong>{chave.charAt(0).toUpperCase() + chave.slice(1)}:</strong> {String(valor)}
                  </p>
                ))}
              </div>

              <button type="button" onClick={() => handleDelete(ficha.id)} style={{ marginTop: '10px', color: 'red' }}>
                Excluir ficha
              </button>
            </div>
          ))}

          <div className={styles.continuarbotao}>
            <button className={styles.voltarButton}>Cancelar</button>
            <button type="button" className={styles.continuarButton} onClick={handleSubmit}>
              Criar
            </button>
          </div>
        </form>
        
        {showAlert && <Alert message="Consulta criada com sucesso!" show={showAlert} url={`/getAllConsultas/${vagaData.agendamento.animal.id}`} />}
        {showAlertFicha && <Alert message="Ficha excluída com sucesso!" show={showAlertFicha} onClose={handleCloseAlertFicha} />}
        {vagaData.consulta === null ? (
          showErrorAlert && <ErrorAlert message="Erro ao criar consulta, tente novamente." show={showErrorAlert} />
        ) : (
          showErrorAlert && <ErrorAlert message="Consulta já foi criada, tente editá-la." show={showErrorAlert} />
        )}
        
      </div>
    </>
  );
}

export default CreateConsulta;
