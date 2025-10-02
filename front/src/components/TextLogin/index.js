import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { getAvisosHabilitados } from "../../../services/avisoService";

export default function Text() {
  const [showPopup, setShowPopup] = useState(true);
  const [avisos, setAvisos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const avisosData = await getAvisosHabilitados();
        setAvisos(avisosData);
      } catch (error) {
        console.error("Erro ao buscar avisos:", error);
      }
    };
  
    fetchData();
  }, []);
  console.log("Avisos:", avisos);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false); // Fecha automaticamente após 10 segundos
    }, 25000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className={styles.texto_box}>
      <div>
        <h1 className={styles.titulo}>Sistema de Gestão do HVU-UFAPE</h1>

        <p className={styles.paragrafo}>
          Toda a estrutura necessária para o seu pet, com uma equipe de
          veterinários especializados sempre à disposição!
        </p>
      </div>

      <div className={styles.lista_box}>
        <h1 className={styles.titulo}>Quadro de avisos</h1>
        <ul className={styles.lista}>
          {avisos.filter(aviso => aviso.habilitado).length > 0 ? (
            avisos
              .filter(aviso => aviso.habilitado)
              .map((aviso, index) => <li key={index}>{aviso.texto}</li>)
          ) : (
            <li className={styles.semAviso}>Nenhum aviso disponível no momento.</li>
          )}
        </ul>
      </div>

      {/* Popup de Aviso */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2 className={styles.avisoTitulo}>🚨 ATENÇÃO 🚨</h2>
            <hr />
            <p className={styles.avisoTexto}>
              O HVU <strong>NÃO ESTÁ REALIZANDO CASTRAÇÕES NO MOMENTO!</strong>
            </p>
            <hr />
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
