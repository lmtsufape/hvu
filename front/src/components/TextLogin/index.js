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
						<p className={styles.avisoTexto}>
							O HVU <strong>NÃO ESTÁ REALIZANDO CASTRAÇÕES NO MOMENTO!</strong>
						</p>
						<button className={styles.closeButton} onClick={() => setShowPopup(false)}>OK</button>
					</div>
				</div>
			)}
		</div>
	);
}
