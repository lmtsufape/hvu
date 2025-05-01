import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';

function ConfirmarEnvioButton({ onConfirm, type="button", disabled }) {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);

    const handleConfirm = () => {
        onConfirm(); 
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
            <div onClick={() => setShowModal(true)}>
                <button className={styles.green_buttonFichas} type={type} disabled={disabled}>
                    Finalizar
                </button>
            </div>
            {showModal && (
                <div className={styles.modal} ref={modalRef}>
                    <div className={styles.box1}>
                        <div>Deseja finalizar o formulário?</div>
                        <button onClick={() => setShowModal(false)} className={styles.button_close_modal}>X</button>
                    </div>
                    <div className={styles.box2}>
                        <button className={styles.cancelar_button} 
                            onClick={() => setShowModal(false)}>Cancelar</button>
                        <button className={styles.confirmar_button} 
                            onClick={handleConfirm}>
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConfirmarEnvioButton;
