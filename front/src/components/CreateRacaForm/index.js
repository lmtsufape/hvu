import React, { useState } from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";

function CreateRaca() {
    const [showModal, setShowModal] = useState(false);

    const handleExcluirClick = () => {
        // Lógica para exclusão aqui
        setShowModal(false);
    };

    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Adicionar raça</h1>
            <div className={styles.inputs_container}>
                <div className={styles.inputs_box}>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="especie" className="form-label">Espécie</label>
                            <select 
                                className={"form-select"}
                                name="especie"
                                aria-label="Selecione uma espécie"
                            >
                                <option value="">Selecione a espécie</option>
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="raca" className="form-label">Raça</label>
                            <input
                                type="text"
                                className={"form-control"}
                                name="raca"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button className={styles.criar_button} onClick={() => setShowModal(true)}>
                        Criar
                    </button>
                    <button className={styles.excluir_button} onClick={() => setShowModal(true)}>
                        Excluir
                    </button>
                </div>
            </div>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <p>Deseja realmente excluir?</p>
                        <button onClick={handleExcluirClick}>Sim</button>
                        <button onClick={() => setShowModal(false)}>Não</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateRaca;
