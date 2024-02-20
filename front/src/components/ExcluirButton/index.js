import React, { useState, useEffect, useRef } from 'react';
import styles from "./index.module.css";

function ExcluirButton({ itemId, onDelete }) {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);

    const handleExcluirClick = () => {
        onDelete(itemId);
        setShowModal(false);
    };

    const handleClickOutsideModal = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideModal);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, []);

    return (
        <div>
            <button className={styles.excluir_button} onClick={() => setShowModal(true)}>
                Excluir
            </button>
            {showModal && (
                <div className={styles.modal} ref={modalRef}>
                    <div className={styles.box1}>
                        <div>Deseja realmente excluir o animal?</div>
                        <button onClick={() => setShowModal(false)} className={styles.button_close_modal}>X</button>
                    </div>
                    <div className={styles.box2}>
                        <button className={styles.cancelar_button} onClick={() => setShowModal(false)}>Cancelar</button>
                        <button className={styles.excluir_button2} onClick={handleExcluirClick}>Excluir</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExcluirButton;
