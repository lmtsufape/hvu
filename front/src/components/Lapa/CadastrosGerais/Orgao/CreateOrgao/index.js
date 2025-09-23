"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { createOrgao } from "../../../../../../services/orgaoService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import FotosList from "@/hooks/useFotoList";
import AreaList from "@/hooks/useAreaList";
import { getToken, getRoles } from "../../../../../../services/userService";

function CreateOrgao() {
  const router = useRouter();

  const [orgao, setOrgao] = useState({
    //image_path: "",
    nome: "",
    sexoMacho: false,
    sexoFemea: false,
    foto: null ,
    area: [{ id: null }],
  });

  const [image, setImage] = useState(null); 
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [hasAccess, setHasAccess] = useState(true);

  const { fotos, error: fotosError } = FotosList();
  const { areas, error: areasError } = AreaList();

  useEffect(() => {
    setToken(getToken());
    setRoles(getRoles());
  }, []);

  useEffect(() => {
    if (token && roles.length > 0 && !roles.includes("patologista")) {
      setHasAccess(false);
    }
  }, [token, roles]);

  if (!token || !hasAccess) {
    return (
      <div className={styles.container}>
        <h3 className={styles.message}>
          Acesso negado: Faça login ou verifique suas permissões.
        </h3>
      </div>
    );
  }

  const handleOrgaoChange = (event) => {
    const { name, checked } = event.target;

    if (name === "sexoMacho") {
        setOrgao({ ...orgao, sexoMacho: checked, sexoFemea: checked ? false : orgao.sexoFemea });
    } else if (name === "sexoFemea") {
        setOrgao({ ...orgao, sexoFemea: checked, sexoMacho: checked ? false : orgao.sexoMacho });
    } else {
        setOrgao({ ...orgao, [name]: event.target.value });
    }
  };

  const handleFotoChange = (event) => {
    const selectedFotoId = event.target.value ? Number(event.target.value) : null;
    setOrgao({ ...orgao, foto: selectedFotoId ? { id: selectedFotoId } : null });
  };

  const handleAreaChange = (event) => {
    const selectedAreaId = Number(event.target.value);
    setOrgao({ ...orgao, area: [{ id: selectedAreaId }] });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setOrgao({ ...orgao, image_path: file.name });
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!orgao.nome) validationErrors.nome = "Campo obrigatório";
    if (!orgao.area[0].id) validationErrors.area = "Campo obrigatório";
    return validationErrors;
  };

  const handleOrgaoCreate = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("orgaoToCreate:", orgao)
    try {
      await createOrgao(orgao);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao criar órgão:", error);
      setShowErrorAlert(true);
    }
  };

  return (
    <div className={styles.container}>
      <VoltarButton />
      <h1>Adicionar Órgão</h1>

      <div className={styles.inputs_container}>
        <div className={styles.inputs_box}>
          <div className="row">
            {/*<div className={`col ${styles.col}`}>
              <label htmlFor="image_path" className="form-label">Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`form-control ${styles.input}`}
              />
            </div>*/}

            <div className={`col ${styles.col}`}>
              <label htmlFor="nome" className="form-label">Nome <span className={styles.obrigatorio}>*</span></label>
              <input
                type="text"
                className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
                name="nome"
                value={orgao.nome}
                onChange={handleOrgaoChange}
              />
              {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
            </div>

                        <div className={`col ${styles.col}`}>
              <div className={styles.checkboxContainer}>
                <label>
                  <input
                    type="checkbox"
                    name="sexoMacho"
                    checked={orgao.sexoMacho}
                    onChange={handleOrgaoChange}
                  />
                  Macho
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="sexoFemea"
                    checked={orgao.sexoFemea}
                    onChange={handleOrgaoChange}
                  />
                  Fêmea
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className={`col ${styles.col}`}>
              <label htmlFor="foto" className="form-label">Selecionar Foto</label>
              <select
                onChange={handleFotoChange}
                className={`form-select ${styles.input} ${errors.foto ? "is-invalid" : ""}`}
              >
                <option value="">Selecione uma foto</option>
                {fotos.map(foto => (
                  <option key={foto.id} value={foto.id}>{foto.titulo}</option>
                ))}
              </select>
              {errors.foto && <div className={`invalid-feedback ${styles.error_message}`}>{errors.foto}</div>}
              {fotosError && <div className={styles.error_message}>Erro ao carregar fotos.</div>}
            </div>

            <div className={`col ${styles.col}`}>
              <label htmlFor="area" className="form-label">Selecionar Área <span className={styles.obrigatorio}>*</span></label>
              <select
                onChange={handleAreaChange}
                className={`form-select ${styles.input} ${errors.area ? "is-invalid" : ""}`}
              >
                <option value="">Selecione uma área</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.tituloArea}</option>
                ))}
              </select>
              {errors.area && <div className={`invalid-feedback ${styles.error_message}`}>{errors.area}</div>}
              {areasError && <div className={styles.error_message}>Erro ao carregar áreas.</div>}
            </div>
          </div>
        </div>

        <div className={styles.button_box}>
          <CancelarWhiteButton />
          <button type="button" className={styles.criar_button} onClick={handleOrgaoCreate}>
            Criar
          </button>
        </div>
      </div>

      {showAlert && <Alert message="Órgão criado com sucesso!" show={showAlert} url={`/lapa/gerenciarOrgaos`} />}
      {showErrorAlert && <ErrorAlert message="Erro ao criar órgão, tente novamente." show={showErrorAlert} />}
    </div>
  );
}

export default CreateOrgao;
