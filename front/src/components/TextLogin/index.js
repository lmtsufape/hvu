import React, { useState, useEffect } from "react";
import styles from "./texto_login_page.module.css";

export default function Text() {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false); // Fecha automaticamente após 10 segundos
    }, 25000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={styles.texto_box}>
      <h1 className={styles.titulo}>Sistema de Gestão do HVU-UFAPE</h1>

      <p className={styles.paragrafo}>
        Toda a estrutura necessária para o seu pet, com uma equipe de
        veterinários especializados sempre à disposição!
      </p>
      {/* Popup de Aviso */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2 className={styles.avisoTitulo}>🚨 ATENÇÃO 🚨</h2>
            <hr />
            <h5 className="text-start fw-bold">Informe: 01</h5>
            <p className={styles.avisoTexto}>
              O HVU <strong>NÃO ESTÁ REALIZANDO CASTRAÇÕES NO MOMENTO!</strong>
            </p>
            <hr />
            <h5 className="text-start fw-bold">Informe: 02</h5>
            <p style={{ textAlign: "justify" }}>
              Se você está tendo dificuldades para agendar sua consulta pelo
              sistema, fique tranquilo! Você pode comparecer ao{" "}
              <strong>
                Prédio B, Laboratório 17 (LMTS) da UFAPE, nesta sexta-feira, das
                10 às 12h e das 14h às 17h.
              </strong>{" "}
              É importante lembrar que as vagas para consulta são limitadas e
              estamos disponibilizando apenas uma pessoa para ajudá-lo a
              utilizar o sistema,{" "}
              <strong>
                mas não podemos garantir a disponibilidade de vagas para o dia e
                horário desejado.
              </strong>
            </p>

            <button
              className={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
