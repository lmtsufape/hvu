import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import "react-datepicker/dist/react-datepicker.css";
import VoltarButton from "../VoltarButton";
import useMedicoList from "@/hooks/useMedicoList";
import { getConsultaById, updateConsulta } from "../../../services/consultaService";
import { getMedicoById } from "../../../services/medicoService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateConsulta() {
  const router = useRouter();
  const { id } = router.query;

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [errors, setErrors] = useState({});
  const [consulta, setConsulta] = useState({});
  const { medicos } = useMedicoList();
  const [medicoEncaminhamentoId, setMedicoEncaminhamentoId] = useState(null);

  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

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
          const consultaData = await getConsultaById(id);
          setConsulta(consultaData);
          if (consultaData.encaminhamento) {
            setMedicoEncaminhamentoId(consultaData.encaminhamento.id);
          }
        } catch (error) {
          console.error('Erro ao buscar consulta:', error);
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (medicoEncaminhamentoId) {
      const fetchData = async () => {
        try {
          const medico = await getMedicoById(medicoEncaminhamentoId);
          setConsulta((prevConsulta) => ({
            ...prevConsulta,
            encaminhamento: medico,
          }));
        } catch (error) {
          console.error('Erro ao buscar veterinário(a):', error);
        } finally {
          setLoading(false); // Marcar como carregado após buscar os dados
        }
      };
      fetchData();
    }
  }, [medicoEncaminhamentoId]);

    // Verifica se os dados estão carregando
    if (loading) {
      return <div>Carregando dados do usuário...</div>;
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

  const handleMedicoSelection = (event) => {
    const selectedMedicoId = event.target.value;
    setMedicoEncaminhamentoId(selectedMedicoId);
  };

  const handleProximaConsultaChange = (event) => {
    const { value } = event.target;
    setConsulta({ ...consulta, proximaConsulta: value === "true" });
  };

  console.log("consulta:", consulta);

  const handleSubmit = async () => {
    try {
      await updateConsulta(id, consulta);

      console.log("consultaToUpdate:", consulta);
      
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao editar consulta:", error);
      setShowErrorAlert(true);
    }
  };

  return (
    <>
      <div className={styles.voltarButtonHeader}>
        <VoltarButton />
      </div>
      <div>
        <h1 className={styles.titulocadastro}>Editar consulta</h1>
      </div>
      <div className={`${styles.boxagendarconsulta} ${styles.container}`}>
        <form>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="animal" className="form-label">Paciente</label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={consulta.animal && consulta.animal.nome}
                disabled
              />
            </div>
            <div className={`col ${styles.col}`}>
              <label htmlFor="medico" className="form-label">Veterinário(a)</label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={consulta.medico && consulta.medico.nome}
                disabled
              />
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="pesoAtual" className="form-label">Peso atual</label>
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
                <label htmlFor="idadeAtual" className="form-label">Idade atual</label>
                <input
                  className={`form-control ${styles.input} ${errors.idadeAtual ? "is-invalid" : ""}`}
                  name="idadeAtual"
                  placeholder="Digite a idade do animal"
                  value={consulta.idadeAtual || ""}
                  onChange={handleConsultaChange}
                  rows="4"
                  cols="50"
                />
                </div>
              <div className={`col ${styles.col}`}>
                <label htmlFor="medico" className="form-label">Encaminhado por:</label>
                <select 
                  className={`form-select ${styles.input}`}
                  name="encaminhamento"
                  aria-label="Selecione um(a) veterinário(a)"
                  value={medicoEncaminhamentoId || ""}
                  onChange={handleMedicoSelection}
                >
                  <option value="">Selecione um(a) veterinário(a)</option>
                  {medicos.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                      {medico.nome}
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
                <label htmlFor="tipoEspecial" className="form-label">Retorno?</label>
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
                  <label htmlFor="sim" className={styles.input}>Sim</label>
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
                  <label htmlFor="nao" className={styles.input}>Não</label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.continuarbotao}>
            <button type="button" className={styles.voltarButton} onClick={() => router.back()}>Cancelar</button>
            <button type="button" className={styles.continuarButton} onClick={handleSubmit}>Editar</button>
          </div>
        </form>
        {showAlert && <Alert message="Consulta editada com sucesso!" show={showAlert} url={`/getConsultaById/${id}`} />}
        {showErrorAlert && <ErrorAlert message="Erro ao editar consulta, tente novamente." show={showErrorAlert} />}
      </div>
    </>
  );
}

export default UpdateConsulta;
