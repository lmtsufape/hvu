import React, { useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import EspeciesList from "@/hooks/useEspecieList";
import { createArea } from "../../../../../../services/areaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";

function CreateArea() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errors, setErrors] = useState({});
    const { especies } = EspeciesList();
    const [selectedEspecie, setSelectedEspecie] = useState("");
    const [area, setArea] = useState({
        tituloArea: "", 
        especie: []
    });

    const handleEspecieSelection = (event) => {
        const selectedEspecieId = event.target.value;
        setSelectedEspecie(selectedEspecieId);
        setArea(prevState => ({
            ...prevState,
            especie: [{ id: selectedEspecieId }]
        }));
    };

    const handleAreaChange = (event) => {
        const { name, value } = event.target;
        setArea(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!selectedEspecie) {
          errors.selectedEspecie = "Campo obrigatório";
        }
        if (!area.tituloArea) {
          errors.tituloArea = "Campo obrigatório";
        }
        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }

        const areaToCreate = {
            tituloArea: area.tituloArea,
            especie: [{ id: parseInt(selectedEspecie) }]
        };

        console.log('Payload:', areaToCreate);

        try {
            const newArea = await createArea(areaToCreate);
            console.log("new area: ", newArea);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar area:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar área</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="especie" className="form-label">Espécie <span className={styles.obrigatorio}>*</span></label>
                            <select
                                className={`form-select ${styles.input} ${errors.selectedEspecie ? "is-invalid" : ""}`}
                                name="especie"
                                aria-label="Selecione uma espécie"
                                value={selectedEspecie}
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
                            <label htmlFor="tituloArea" className="form-label">Área <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                placeholder="Digite a Área"
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
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleSubmit}>
                        Criar
                    </button>
                </div>
            </form>
            {<Alert message="Área cadastrada com sucesso!" show={showAlert} url={`/lapa/gerenciarAreas`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao cadastrar área, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateArea;
