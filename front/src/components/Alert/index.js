import React from "react";
import { useRouter } from 'next/router';
import styles from "./index.module.css";

function Alert({ message, show, url, onClose }) {
    const router = useRouter();

    const handleOkClick = () => {
        if (url) {
            router.push(url);
        }
        else if (onClose) {
            closeModal();
        }
    };

    const closeModal = () => {
        if (onClose) {
            onClose();  
        }
    };

    return (
        <>
            {show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h1 className={styles.title}>{message}</h1>
                            <div className={styles.div_button2}>
                                <button className={styles.button_cancelar_consulta} onClick={handleOkClick} >
                                    Ok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Alert;