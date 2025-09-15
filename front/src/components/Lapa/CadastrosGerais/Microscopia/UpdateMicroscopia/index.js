import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import {
  updateCampoLaudoMicroscopia,
  getCampoLaudoMicroscopiaById,
} from "../../../../../../services/campoLaudoMicroscopiaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import OrgaosList from "@/hooks/useOrgaoList";
import { getToken, getRoles } from "../../../../../../services/userService";

function UpdateMicroscopia() {
  const router = useRouter();
  const { id } = router.query;

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [microscopia, setMicroscopia] = useState({
    descricao: "",
    processamento: "",
    orgao: { id: null },
  });

  const { orgaos, error } = OrgaosList();
  const roles = getRoles();
  const token = getToken();

  if (!token) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Faça login para acessar esta página.
        </h3>
      </div>
    );
  }

  if (!roles.includes("patologista")) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Você não tem permissão para acessar esta página.
        </h3>
      </div>
    );
  }

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await getCampoLaudoMicroscopiaById(id);
          setMicroscopia({
            descricao: data.descricao || "",
            processamento: data.processamento || "",
            orgao: { id: data.orgao?.id || null },
          });
        } catch (err) {
          console.error("Erro ao buscar Microscopia:", err);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleMicroscopiaChange = (event) => {
    const { name, value } = event.target;
    setMicroscopia({ ...microscopia, [name]: value });
  };

  const handleOrgaoChange = (event) => {
    setMicroscopia({
      ...microscopia,
      orgao: { id: Number(event.target.value) },
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!microscopia.descricao) errors.descricao = "Campo obrigatório";
    if (!microscopia.processamento)
      errors.processamento = "Campo obrigatório";
    if (!microscopia.orgao.id) errors.orgao = "Selecione um órgão";
    return errors;
  };

  const handleMicroscopiaUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      await updateCampoLaudoMicroscopia(id, microscopia);
      setShowAlert(true);
    } catch (err) {
      console.error("Erro ao editar Microscopia:", err);
      setShowErrorAlert(true);
    }
  };

  if (error) {
    return <div>Erro ao carregar órgãos: {error.message}</div>;
  }

  const processamentoOptions = [
    "CLIVAGEM",
    "EMBLOCAMENTO",
    "MICROTOMIA",
    "DESPARAFINIZACAO",
    "COLORACAO",
    "PERDAMATERIAL",
  ];

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Editar informações da Microscopia</h1>
      <form className={styles.inputs_container}>
        <div className={styles.inputs_box}>
          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="descricao" className="form-label">
                Descrição <span className={styles.obrigatorio}>*</span>
              </label>
              <input
                type="text"
                className={`form-control ${styles.input} ${
                  errors.descricao ? "is-invalid" : ""
                }`}
                name="descricao"
                value={microscopia.descricao}
                onChange={handleMicroscopiaChange}
              />
              {errors.descricao && (
                <div className={`invalid-feedback ${styles.error_message}`}>
                  {errors.descricao}
                </div>
              )}
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="processamento" className="form-label">
                Processamento <span className={styles.obrigatorio}>*</span>
              </label>
              <select
                className={`form-select ${styles.input} ${
                  errors.processamento ? "is-invalid" : ""
                }`}
                name="processamento"
                value={microscopia.processamento}
                onChange={handleMicroscopiaChange}
              >
                <option value="" disabled>
                  Selecione o processamento
                </option>
                {processamentoOptions.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {errors.processamento && (
                <div className={`invalid-feedback ${styles.error_message}`}>
                  {errors.processamento}
                </div>
              )}
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="orgao" className="form-label">
                Órgão <span className={styles.obrigatorio}>*</span>
              </label>
              <select
                className={`form-select ${styles.input} ${
                  errors.orgao ? "is-invalid" : ""
                }`}
                name="orgao"
                value={microscopia.orgao?.id || ""}
                onChange={handleOrgaoChange}
              >
                <option value="" disabled>
                  Selecione um órgão
                </option>
                {orgaos.map((orgao) => (
                  <option key={orgao.id} value={orgao.id}>
                    {orgao.nome}
                  </option>
                ))}
              </select>
              {errors.orgao && (
                <div className={`invalid-feedback ${styles.error_message}`}>
                  {errors.orgao}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.button_box}>
          <CancelarWhiteButton />
          <button
            type="button"
            className={styles.criar_button}
            onClick={handleMicroscopiaUpdate}
          >
            Salvar
          </button>
        </div>
      </form>

      {showAlert && (
        <Alert
          message="Informações da Microscopia editadas com sucesso!"
          show={showAlert}
          url={`/lapa/gerenciarMicroscopias`}
        />
      )}
      {showErrorAlert && (
        <ErrorAlert
          message="Erro ao editar informações da Microscopia, tente novamente."
          show={showErrorAlert}
        />
      )}
    </div>
  );
}

export default UpdateMicroscopia;
