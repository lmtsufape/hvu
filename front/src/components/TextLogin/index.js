import React from "react";
import styles from "./texto_login_page.module.css";

export default function Text() {
	return (
		<div className={styles.texto_box}>
			<h1 className={styles.titulo}>Sistema de Gestão do HVU-UFAPE</h1>

			<p className={styles.paragrafo}>
				Toda a estrutura necessária para o seu pet, com uma equipe de
				veterinários especializados sempre à disposição!
			</p>
		</div>
	);
}
