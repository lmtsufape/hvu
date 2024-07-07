import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import "react-datepicker/dist/react-datepicker.css";
import VoltarButton from "../VoltarButton";
import useMedicoList from "@/hooks/useMedicoList";
import { createConsulta } from "../../../services/consultaService";
import { getAnimalById } from "../../../services/animalService";
import { getMedicoById } from "../../../services/medicoService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";
import { getCurrentUsuario } from '../../../services/userService';

function CreateConsulta() {
  const router = useRouter();
  const { id } = router.query;

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [errors, setErrors] = useState({});

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
    animal: { id: null }
  });

  const [animalData, setAnimalData] = useState({});
  const [medicoData, setMedicoData] = useState({});

  const { medicos, error: medicosError } = useMedicoList();
  const [medicoEncaminhamento, setMedicoEncaminhamento] = useState(null);
  const [medicoEncaminhamentoId, setMedicoEncaminhamentoId] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const animal = await getAnimalById(id);
          setAnimalData(animal);
        } catch (error) {
          console.error('Erro ao buscar animal:', error);
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
          setMedicoEncaminhamento(medico);
        } catch (error) {
          console.error('Erro ao buscar veterinário(a):', error);
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medico = await getCurrentUsuario();
        setMedicoData(medico.usuario);
      } catch (error) {
        console.error('Erro ao buscar veterinário(a):', error);
      }
    };
    fetchData();
  }, []);

  const handleConsultaChange = (event) => {
    const { name, value } = event.target;
    setConsulta({ ...consulta, [name]: value });
  };

  const handleMedicoSelection = (event) => {
    const selectedMedico = event.target.value;
    setMedicoEncaminhamentoId(selectedMedico);
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
  console.log("animalData:", animalData);
  console.log("medicoData:", medicoData);
  console.log("medicoEncaminhamento:", medicoEncaminhamento);

  const handleSubmit = async () => {
    const validationErrors = validateFields(consulta);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const consultaToCreate = {
      pesoAtual: parseFloat(consulta.pesoAtual),
      idadeAtual: parseFloat(consulta.idadeAtual),
      queixaPrincipal: consulta.queixaPrincipal,
      alteracoesClinicasDiversas: consulta.alteracoesClinicasDiversas,
      suspeitasClinicas: consulta.suspeitasClinicas,
      alimentacao: consulta.alimentacao,
      medico: medicoData,
      proximaConsulta: consulta.proximaConsulta,
      encaminhamento: medicoEncaminhamento,
      animal: animalData
    };

    console.log("consultaToCreate:", consultaToCreate);

    try {
      await createConsulta(consultaToCreate);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      setShowErrorAlert(true);
    }
  };

  return (
    <>
      <div className={styles.voltarButtonHeader}>
        <VoltarButton />
      </div>
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
                placeholder={animalData.nome || "Carregando..."}
                disabled
              />
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="medico" className="form-label">Veterinário&#40;a&#41;<span className={styles.obrigatorio}>*</span></label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                placeholder={medicoData.nome || "Carregando..."}
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
                <label htmlFor="medico" className="form-label">Encaminhado por:</label>
                <select 
                  className={`form-select ${styles.input}`}
                  name="encaminhamento"
                  aria-label="Selecione um(a) veterinário(a)"
                  value={medicoEncaminhamento || ""}
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
                <label htmlFor="queixaPrincipal" className="form-label">Queixa principal<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.queixaPrincipal ? "is-invalid" : ""}`}
                  name="queixaPrincipal"
                  placeholder="Digite a queixa principal"
                  value={consulta.queixaPrincipal || ""}
                  onChange={handleConsultaChange}
                />
                {errors.queixaPrincipal && <div className={`invalid-feedback ${styles.error_message}`}>{errors.queixaPrincipal}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="alteracoesClinicasDiversas" className="form-label">Alterações clínicas diversas<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.alteracoesClinicasDiversas ? "is-invalid" : ""}`}
                  name="alteracoesClinicasDiversas"
                  placeholder="Digite as alterações clínicas diversas"
                  value={consulta.alteracoesClinicasDiversas || ""}
                  onChange={handleConsultaChange}
                />
                {errors.alteracoesClinicasDiversas && <div className={`invalid-feedback ${styles.error_message}`}>{errors.alteracoesClinicasDiversas}</div>}
              </div>
            </div>
          </div>

          <div className={styles.espacodosforms}>
            <div className="row">
              <div className={`col ${styles.col}`}>
                <label htmlFor="suspeitasClinicas" className="form-label">Suspeitas clínicas<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.suspeitasClinicas ? "is-invalid" : ""}`}
                  name="suspeitasClinicas"
                  placeholder="Digite as suspeitas clínicas"
                  value={consulta.suspeitasClinicas || ""}
                  onChange={handleConsultaChange}
                />
                {errors.suspeitasClinicas && <div className={`invalid-feedback ${styles.error_message}`}>{errors.suspeitasClinicas}</div>}
              </div>

              <div className={`col ${styles.col}`}>
                <label htmlFor="alimentacao" className="form-label">Alimentação<span className={styles.obrigatorio}>*</span></label>
                <input
                  type="text"
                  className={`form-control ${styles.input} ${errors.alimentacao ? "is-invalid" : ""}`}
                  name="alimentacao"
                  placeholder="Digite a alimentação"
                  value={consulta.alimentacao || ""}
                  onChange={handleConsultaChange}
                />
                {errors.alimentacao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.alimentacao}</div>}
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

          <div className={styles.continuarbotao}>
            <button className={styles.voltarButton}>Cancelar</button>
            <button type="button" className={styles.continuarButton} onClick={handleSubmit}>
              Criar
            </button>
          </div>
        </form>
        {showAlert && <Alert message="Consulta criada com sucesso!" show={showAlert} url={`/getAllConsultas/${animalData.id}`} />}
        {showErrorAlert && <ErrorAlert message="Erro ao criar consulta, tente novamente." show={showErrorAlert} />}
      </div>
    </>
  );
}

export default CreateConsulta;
