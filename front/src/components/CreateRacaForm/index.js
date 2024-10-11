import { React, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import EspeciesList from "@/hooks/useEspecieList";
import { createRaca } from "../../../services/racaService";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function CreateRaca() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const [roles, setRoles] = useState([]);

    const { especies } = EspeciesList();
    const [selectedEspecie, setSelectedEspecie] = useState(null);

    const [raca, setRaca] = useState({
        nome: "",
        porte: "",
        descricao: "", 
        especie: { id: null }
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setRoles(storedRoles || []);
        }
    }, []);

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    const handleEspecieSelection = (event) => {
        const selectedEspecieId = event.target.value;
        setSelectedEspecie(selectedEspecieId);
    };

    console.log(selectedEspecie);

    const handleRacaChange = (event) => {
        const { name, value } = event.target;
        setRaca({ ...raca, [name]: value });
    };
    console.log(raca);

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

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }

        const racaToCreate = {
            nome: raca.nome,
            porte: raca.porte,
            descricao: raca.descricao,
            especie: { 
                id: parseInt(selectedEspecie) 
            }
        };

        try {
            const newRaca = await createRaca(racaToCreate);
            console.log("new raça: ", newRaca);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar raça:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar raça</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className={`col ${styles.col}`}>
                            <label htmlFor="especie" className="form-label">Espécie <span className={styles.obrigatorio}>*</span></label>
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
                            <label htmlFor="nome" className="form-label">Raça <span className={styles.obrigatorio}>*</span></label>
                            <input
                                type="text"
                                placeholder="Digite a raça"
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
                                placeholder="Digite o porte"
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
                    <button type="button" className={styles.criar_button} onClick={handleSubmit}>
                        Criar
                    </button>
                </div>
            </form>
            {<Alert message="Raça cadastrada com sucesso!" show={showAlert} url={`/gerenciarRacas`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao cadastrar raça, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateRaca;
