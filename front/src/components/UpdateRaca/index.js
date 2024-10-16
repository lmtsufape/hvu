import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import EspeciesList from "@/hooks/useEspecieList";
import { updateRaca, getRacaById } from "../../../services/racaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateRaca() {
    const router = useRouter();
    const { id } = router.query;

    const [errors, setErrors] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { especies } = EspeciesList();
    const [raca, setRaca] = useState({
        id: null,
        nome: "",
        porte: "",
        descricao: "", 
        especie: { id: null }
    });
    const [selectedEspecie, setSelectedEspecie] = useState(null);

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
                    const racaData = await getRacaById(id);
                    setRaca({
                        id: racaData.id,
                        nome: racaData.nome,
                        porte: racaData.porte,
                        descricao: racaData.descricao,
                        especie: { id: racaData.especie.id }
                    });
                    setSelectedEspecie(racaData.especie.id);

                    console.log("racaData:", racaData)
                } catch (error) {
                    console.error('Erro ao buscar raça:', error);
                } finally {
                    setLoading(false); // Marcar como carregado após buscar os dados
                }
            };
            fetchData();
        }
    }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario")) {
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

    const handleEspecieSelection = (event) => {
        const selectedEspecieId = event.target.value;
        setSelectedEspecie(selectedEspecieId);
    };

    const handleRacaChange = (event) => {
        const { name, value } = event.target;
        setRaca({ ...raca, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (selectedEspecie === null) {
          errors.selectedEspecie = "Campo obrigatório";
        }
        if (!raca.nome) {
          errors.nome = "Campo obrigatório";
        }
        return errors;
      };

    const handleRacaUpdate = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }
    
        const racaToUpdate = {
            nome: raca.nome,
            porte: raca.porte,
            descricao: raca.descricao,
            especie: { 
                id: parseInt(selectedEspecie) 
            }
        };

        console.log("racaToUpdate:",racaToUpdate);

        try {
            const response = await updateRaca(raca.id, racaToUpdate);
            console.log("response:",response);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar raça:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações da raça</h1>
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
                                // disabled
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
                            <label htmlFor="nome" className="form-label">Raça</label>
                            <input
                                type="text"
                                className={`form-control ${styles.input} ${errors.nome ? "is-invalid" : ""}`}
                                name="nome"
                                value={raca.nome}
                                onChange={handleRacaChange}
                            />
                            {errors.nome && <div className={`invalid-feedback ${styles.error_message}`}>{errors.nome}</div>}
                        </div>
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="porte" className="form-label">Porte</label>
                            <input
                                type="text"
                                className={`form-control ${styles.input}`}
                                name="porte"
                                value={raca.porte}
                                onChange={handleRacaChange}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleRacaUpdate}>
                        Salvar
                    </button>
                </div>
            </form>
            {<Alert message="Informações da raça editadas com sucesso!" show={showAlert} url={`/gerenciarRacas`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações da raça, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default UpdateRaca;
