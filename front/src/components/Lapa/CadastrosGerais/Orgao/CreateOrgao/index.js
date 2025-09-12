import React, { useState } from "react";
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

function CreateOrgão() {
    const router = useRouter();
    
    const [orgao, setOrgao] = useState({
        image_path: "",
        nome: "",
        sexoMacho: false,
        sexoFemea: false,
        foto: { id: null },
        area: [{ id: null }]
    });

    const [image, setImage] = useState(null); 
    const [errors, setErrors] = useState({});
    const { fotos } = FotosList();
    const { areas } = AreaList();
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const roles = getRoles();
    const token= getToken();

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
        const selectedFotoId = Number(event.target.value);
        setOrgao({ ...orgao, foto: { id: selectedFotoId } });
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
        const errors = {};
        if (!orgao.nome) {
            errors.nome = "Campo obrigatório";
        }
        if (!orgao.area[0].id) {
            errors.area = "Campo obrigatório";
        }
        return errors;
    };

    const handleOrgaoCreate = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="image_path" className="form-label">Imagem</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`form-control ${styles.input}`}
                            />
                        </div>
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
                    </div>

                    <div className="row">
                        <label className="form-label"></label>
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
                        </div>
                    </div>

                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label className="form-label"></label>
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

export default CreateOrgão;
