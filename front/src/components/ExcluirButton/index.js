import React, { useState } from 'react';
import styles from "./index.module.css";

function ExcluirButton({ itemId, onDelete }) {
    const [showModal, setShowModal] = useState(false);

    const handleExcluirClick = () => {
        onDelete(itemId);
        setShowModal(false);
    };

    return (
        <div>
            <button className={styles.excluir_button} onClick={() => setShowModal(true)}>
                Excluir
            </button>
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

export default ExcluirButton;
