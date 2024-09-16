import React from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";

const ModalAgendamento = ({
	tutor,
	selectedVaga,
	isOpen,
	closeModal,
	descricaoCancelamento,
	setDescricaoCancelamento,
	handleCancelarConsulta,
}) => {
	const router = useRouter();

	if (!isOpen) return null;

	console.log("selectedVaga:", selectedVaga);

	return (
		<div>
			<div className={styles.modalOverlay}>
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<div className={styles.container1}>
							<div className={styles.box}>
								<div className={styles.title}>
									{selectedVaga?.agendamento?.animal?.nome || ""}
								</div>
								<div className={styles.subtitle}>
									{selectedVaga?.agendamento?.animal?.raca?.especie?.nome || ""}
								</div>
							</div>
							<div className={styles.div_button1}>
								<button
									onClick={closeModal}
									className={styles.button_close_modal}
								>
									X
								</button>
							</div>
						</div>
						<div className={styles.container2}>
							<div className={styles.box}>
								<div className={styles.title}>Tutor</div>
								<div className={styles.subtitle}>{tutor?.nome || "Não há"}</div>
							</div>
							<div className={styles.box}>
								<div className={styles.title}>Especialidade</div>
								<div className={styles.subtitle}>
									{selectedVaga?.especialidade?.nome}
								</div>
							</div>
						</div>
						<div className={styles.box}>
							<div className={styles.title}>Descrição do Cancelamento</div>
							<input
								type="text"
								value={descricaoCancelamento}
								onChange={(e) => setDescricaoCancelamento(e.target.value)}
								className={styles.input}
								placeholder="Digite a descrição do cancelamento"
							/>
						</div>
						<div className={styles.div_button2}>
							{selectedVaga && selectedVaga.agendamento && (
								<button
									onClick={() =>
										router.push(
											`/reagendarConsulta/${selectedVaga?.agendamento?.id}`
										)
									}
									className={styles.button_reagendar_consulta}
								>
									Reagendar
								</button>
							)}
							<button
								onClick={handleCancelarConsulta}
								className={styles.button_cancelar_consulta}
								disabled={!descricaoCancelamento.trim()}
							>
								Cancelar consulta
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalAgendamento;
