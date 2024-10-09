import React from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";

function ForgotPasswordForm() {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<VoltarButton />
				<div className={styles.text_box}>
					<h1>Recuperação de senha</h1>
					<h6>
						Digite seu E-mail de cadastro. Nós enviaremos um link para
						recuperação de senha.
					</h6>
				</div>

				<div className="row">
					<div className="col">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							type="text"
							className={`form-control ${styles.input}`}
							name="email"
							placeholder="Digite seu email"
						/>
					</div>
				</div>

				<button className={styles.button}>Enviar link</button>
			</div>
		</div>
	);
}

export default ForgotPasswordForm;
