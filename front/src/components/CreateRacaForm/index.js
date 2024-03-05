import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import EspeciesList from "@/hooks/useEspecieList";
import { createRaca } from "../../../services/racaService";

function CreateRaca() {
    const router = useRouter();

    const { especies } = EspeciesList();
    const [raca, setRaca] = useState({
        nome: "",
        porte: "",
        descricao: "", 
        especie: { id: null }
    });
    const [selectedEspecie, setSelectedEspecie] = useState(null);

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

    const handleSubmit = async () => {
        if (!selectedEspecie || !raca.nome || !raca.porte) {
            console.log("Erro: Espécie, nome e porte são obrigatórios.");
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
            router.push("/gerenciarRacas");
            alert("Raça cadastrada com sucesso!");
        } catch (error) {
            console.error("Erro ao criar raça:", error);
            console.log("Detalhes do erro:", error.response);
            alert("Erro ao criar raça, tente novamente.");
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar raça</h1>
            <form className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="especie" className="form-label">Espécie</label>
                            <select
                                className={"form-select"}
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
                        </div>
                        <div className="col">
                            <label htmlFor="nome" className="form-label">Raça</label>
                            <input
                                type="text"
                                className={"form-control"}
                                name="nome"
                                value={raca.nome}
                                onChange={handleRacaChange}
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="porte" className="form-label">Porte</label>
                            <input
                                type="text"
                                className={"form-control"}
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
        </div>
    );
}

export default CreateRaca;
