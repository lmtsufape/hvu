import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../../WhiteButton";
import { updateCampoLaudoMicroscopia, getCampoLaudoMicroscopiaById } from "../../../../../../services/campoLaudoMicroscopiaService";
import Alert from "../../../../Alert";
import ErrorAlert from "../../../../ErrorAlert";
import OrgaosList from "@/hooks/useOrgaoList";

function UpdateMicroscopia() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [microscopia, setMicroscopia] = useState({});
    const { orgaos, error } = OrgaosList(); // Usando o hook para obter órgãos

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const microscopiaData = await getCampoLaudoMicroscopiaById(id);
                    setMicroscopia(microscopiaData);
                } catch (error) {
                    console.error('Erro ao buscar Microscopia:', error);
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
        const selectedId = event.target.value;
        setMicroscopia({ ...microscopia, orgao: { id: selectedId } });
    };

    const validateForm = () => {
        const errors = {};
        if (!microscopia.descricao) {
            errors.descricao = "Campo obrigatório";
        }
        if (!microscopia.orgao.id) {
            errors.orgao = "Selecione um órgão";
        }
        return errors;
    };

    const handleMicroscopiaUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            await updateCampoLaudoMicroscopia(microscopia.id, microscopia);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar Microscopia:", error);
            setShowErrorAlert(true);
        }
    };

    if (error) {
        return <div>Erro ao carregar órgãos: {error.message}</div>; // Tratamento de erro ao buscar órgãos
    }

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações da Microscopia</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="descricao" className="form-label">Descrição</label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.descricao ? "is-invalid" : ""}`}
                                name="descricao"
                                value={microscopia.descricao || ""}
                                onChange={handleMicroscopiaChange}
                            />
                            {errors.descricao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.descricao}</div>}
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="orgao" className="form-label">Órgão</label>
                            <select
                                className={`form-select ${styles.input} ${errors.orgao ? "is-invalid" : ""}`}
                                name="orgao"
                                onChange={handleOrgaoChange}
                                value={microscopia.orgao?.id || ""}
                            >
                                <option value="" disabled>Selecione um órgão</option>
                                {orgaos.map(orgao => (
                                    <option key={orgao.id} value={orgao.id}>{orgao.nome}</option>
                                ))}
                            </select>
                            {errors.orgao && <div className={`invalid-feedback ${styles.error_message}`}>{errors.orgao}</div>}
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleMicroscopiaUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {showAlert && <Alert message="Informações da Microscopia editadas com sucesso!" show={showAlert} url={`/gerenciarMicroscopia`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações da Microscopia, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateMicroscopia;
