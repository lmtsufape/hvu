import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { updateFoto, getFotoById } from "../../../../../../services/fotoService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function UpdateFoto() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [foto, setFoto] = useState({});
    const [fotoFile, setFotoFile] = useState(null);
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

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const fotoData = await getFotoById(id);
                    setFoto(fotoData);
                } catch (error) {
                    console.error('Erro ao buscar foto:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    const handleFotoChange = (event) => {
        const { name, value } = event.target;
        setFoto({ ...foto, [name]: value });
    };

    const handleFileChange = (event) => {
        setFotoFile(event.target.files[0]);
    };

    const validateForm = () => {
        const errors = {};
        if (!foto.titulo) {
            errors.titulo = "Campo obrigatório";
        }
        return errors;
    };

    const handleFotoUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const formData = new FormData();
        formData.append('titulo', foto.titulo);
        if (fotoFile) {
            formData.append('foto', fotoFile);
        }

        try {
            await updateFoto(id, formData);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar foto:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar Informações da Foto</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="titulo" className="form-label">Título</label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.titulo ? "is-invalid" : ""}`}
                                name="titulo"
                                value={foto.titulo || ''}
                                onChange={handleFotoChange}
                            />
                            {errors.titulo && <div className={`invalid-feedback ${styles.error_message}`}>{errors.titulo}</div>}
                        </div>
                    </div>
                    <div className={`col ${styles.col}`}>
                        <label htmlFor="foto" className="form-label">Foto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleFotoUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {showAlert && <Alert message="Informações da foto editadas com sucesso!" show={showAlert} url={`/lapa/gerenciarFotos`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações da foto, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateFoto;
