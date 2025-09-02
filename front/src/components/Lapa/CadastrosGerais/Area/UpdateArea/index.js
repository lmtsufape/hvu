import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import EspeciesList from "@/hooks/useEspecieList";
import { updateArea, getAreaById } from "../../../../../../services/areaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import { getToken, getRoles } from "../../../../../../services/userService";

function UpdateArea() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { especies } = EspeciesList();
    const [area, setArea] = useState({
        id: null,
        tituloArea: "", 
        especie: [{ id: null }]
    });
    const [selectedEspecie, setSelectedEspecie] = useState(null);

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
                    const areaData = await getAreaById(id);
                    setArea({
                        id: areaData.id,
                        tituloArea: areaData.tituloArea,
                        especie: areaData.especie.map(e => ({ id: e.id }))
                    });
                    setSelectedEspecie(areaData.especie[0].id);
                } catch (error) {
                    console.error('Erro ao buscar área:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    const handleEspecieSelection = (event) => {
        const selectedEspecieId = event.target.value;
        setSelectedEspecie(selectedEspecieId);
        setArea({ ...area, especie: [{ id: parseInt(selectedEspecieId) }] });
    };

    const handleAreaChange = (event) => {
        const { name, value } = event.target;
        setArea({ ...area, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (selectedEspecie === null) {
            errors.selectedEspecie = "Campo obrigatório";
        }
        if (!area.tituloArea) {
            errors.tituloArea = "Campo obrigatório";
        }
        return errors;
    };

    const handleAreaUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const areaToUpdate = {
            tituloArea: area.tituloArea,
            especie: area.especie
        };

        try {
            const response = await updateArea(area.id, areaToUpdate);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar área:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações da área</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="especie" className="form-label">Espécie</label>
                            <select
                                className={`form-select ${styles.input} ${errors.selectedEspecie ? "is-invalid" : ""}`}
                                name="especie"
                                aria-label="Selecione uma espécie"
                                value={selectedEspecie || ""}
                                onChange={handleEspecieSelection}
                            >
                                <option value="">Selecione a espécie</option>
                                {especies.map((especie) => (
                                    <option key={especie.id} value={especie.id}>
                                        {especie.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.selectedEspecie && <div className={`invalid-feedback ${styles.error_message}`}>{errors.selectedEspecie}</div>}
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="tituloArea" className="form-label">Área</label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.tituloArea ? "is-invalid" : ""}`}
                                name="tituloArea"
                                value={area.tituloArea}
                                onChange={handleAreaChange}
                            />
                            {errors.tituloArea && <div className={`invalid-feedback ${styles.error_message}`}>{errors.tituloArea}</div>}
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleAreaUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {<Alert message="Informações da área editadas com sucesso!" show={showAlert} url={`/lapa/gerenciarAreas`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações da área, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateArea;
