import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import React, { useState, useEffect } from "react";
import { ForgotPassword } from "../../../services/forgotPasswordService";

function ForgotPasswordForm() {

	const [email, setEmail] = useState(""); // Estado para armazenar o email
	const [message, setMessage] = useState(""); // Estado para mensagens de sucesso/erro
	const [loading, setLoading] = useState(false); 

	// Função para lidar com o envio do formulário
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevenir recarregamento da página
		setLoading(true);

		// Validar o email
		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			setMessage("Por favor, insira um email válido.");
			setLoading(false);
			return;
		}

		try {
			await ForgotPassword(email);
			setMessage("Link de recuperação enviado para o seu email.");
		}catch (error) {
			setMessage(error.message || "Erro ao enviar o link. Tente novamente.");
		}finally {
			setLoading(false);
		}
	};


  // Ocultar mensagem automaticamente após 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
					<form onSubmit={handleSubmit}>
						<div className="row">
							<div className="col">
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<input
									type="text"
									className={`form-control ${styles.input}`}
									id="email"
									name="email"
									placeholder="Digite seu email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</div>
					
						<button type="submit" className={styles.button} disabled={loading}>
							{loading ? "Enviando..." : "Enviar link"}
						</button>
					</form>
					{message && <p className={styles.message}>{message}</p>}
			</div>
		</div>
	);
}

export default ForgotPasswordForm;
