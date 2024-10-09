import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { reagendamento } from "../../../services/agendamentoService";

export default function TabelaAgendamento({
	vagas,
	dataSelecionada,
	setShowAlert,
	setShowErrorAlert,
}) {
	const router = useRouter();
	const { id } = router.query;
	const [vagaSelecionada, setVagaSelecionada] = useState(null);

	const horarios = [
		"08:00",
		"09:00",
		"10:00",
		"11:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
	];

	const handleChangeVaga = async (e, vaga) => {
		e.preventDefault();
		setVagaSelecionada(vaga);
	};

	const handleReagendamento = async (e) => {
		e.preventDefault();
		try {
			if (!id || !vagaSelecionada) {
				throw new Error("Agendamento ID ou vaga selecionada não encontrada.");
			}

			await reagendamento(id, vagaSelecionada.id, vagaSelecionada.dataHora);

			console.log("Reagendamento concluído com sucesso!");
			setShowAlert(true);
		} catch (error) {
			console.error("Erro ao reagendar vaga:", error);
			setShowErrorAlert(true);
		}
	};

	return (
		<div className={styles.pagina}>
			<div className={styles.container}>
				<div className={styles.flexRow}>
					<div className={styles.infoWrapper}>
						{(!dataSelecionada || vagas.length == 0) && (
							<React.Fragment>
								<FontAwesomeIcon
									icon={faCircleInfo}
									color="grey"
									fontSize={"24px"}
								/>
								<p>Não há vagas para essa data.</p>
							</React.Fragment>
						)}
					</div>
					<div className={styles.buttonWrapper}>
						<button
							className={styles.confirmButton}
							disabled={!vagaSelecionada}
							onClick={(e) => handleReagendamento(e)}
						>
							Confirmar
						</button>
					</div>
				</div>
				<table className={styles.table}>
					<thead></thead>
					<tbody>
						{horarios.map((horario, index) => (
							<React.Fragment key={index}>
								<tr>
									<th className={styles.time}>{horario}</th>
									<th className={styles.th}>
										<div className={styles.cardsJuntos}>
											{vagas
												?.filter((vaga) => {
													const vagaHora = new Date(vaga.dataHora).getHours();
													const horarioHora = parseInt(
														horario.split(":")[0],
														10
													);
													return (
														vaga.dataHora.startsWith(
															dataSelecionada.slice(0, 10)
														) && vagaHora === horarioHora
													);
												})
												.map((vaga) => {
													return (
														<button
															key={vaga.id}
															className={`${styles.button} ${
																styles[`button_${vaga.status.toLowerCase()}`]
															} ${
																vagaSelecionada &&
																vagaSelecionada.id === vaga.id &&
																styles["button_selected"]
															} `}
															onClick={(e) => handleChangeVaga(e, vaga)}
														>
															<div className={styles.infos_container}>
																<div>
																	<div className={styles.infos_box1}>
																		<div className={styles.info1}>
																			{vaga.agendamento?.animal ? (
																				<>
																					{vaga.agendamento?.animal.nome} &bull;{" "}
																					{vaga.tipoConsulta?.tipo}
																				</>
																			) : (
																				<>{vaga.medico?.nome}</>
																			)}
																		</div>
																		<h2
																			className={
																				styles[
																					`status_${
																						vaga.status
																							? vaga.status.toLowerCase()
																							: ""
																					}`
																				]
																			}
																		>
																			{vaga.status === "precriada"
																				? "Pré-criada"
																				: vaga.status}
																		</h2>
																	</div>
																	<div className={styles.infos_box2}>
																		<div className={styles.info2}>
																			{vaga?.especialidade?.nome}
																		</div>
																		<div className={styles.info2}>
																			{horario} -{" "}
																			{new Date(vaga.dataHora).getHours() + 1}
																			:00
																		</div>
																	</div>
																</div>
															</div>
														</button>
													);
												})}
										</div>
									</th>
								</tr>
								{horario === "11:00" && (
									<tr key="separator" className={styles.separator}>
										<td colSpan={2} className={styles.separatorCell}></td>
									</tr>
								)}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
