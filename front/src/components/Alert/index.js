import React from "react";
import styles from "./index.module.css";

function Alert({ message, show }) {
    return (
        <>
            {show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h1 className={styles.title}>{message}</h1>
                            <div className={styles.div_button2}>
                                <button className={styles.button_cancelar_consulta}>
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
