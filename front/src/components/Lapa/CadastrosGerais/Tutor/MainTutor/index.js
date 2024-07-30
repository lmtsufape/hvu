import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";

function MainScreenTutor() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(true); // Estado para controlar a visibilidade do pop-up

    useEffect(() => {
        setShowPopup(true);
    }, []);

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className={styles.container}>
            {showPopup && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <h1 className={styles.heading}>Esta é um página de cadastro dos animais de um único tutor, que está logado no sistema.</h1>
                        <h1 className={styles.heading}>Para cadastro de animais de outro tutor, volte para área de "Cadastros Gerais" e faça Login com o tutor do animal correspondente.</h1>
                        <button className={styles.closeButton} onClick={handleClosePopup}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.box_button_container}>
                <button className={styles.button} onClick={() => router.push("/lapa/meusAnimais")}>
                    <Image src="/pets.svg" alt="Cadastro de Animais" width={62} height={62} />
                    <h6>Cadastro de Animais</h6>
                </button>
                <button className={styles.button} onClick={() => router.push("/lapa/cadastrosGerais")}>
                    <Image src="/back.svg" alt="Voltar" width={62} height={62} />
                    <h6>Voltar ao Gerenciamento Geral</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenTutor;
