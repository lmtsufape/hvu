import {React, useState} from "react";
import styles from "./index.module.css";

function ErrorAlert({ message, show}) {

    const [showAlert, setShowAlert] = useState(show); 

    const handleClick = () => {
        setShowAlert(false)
    };

    return (
        <>
            {showAlert && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h1 className={styles.title}>{message}</h1>
                            <div className={styles.div_button2}>
                                <button className={styles.button_cancelar_consulta} onClick={handleClick} >
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

export default ErrorAlert;