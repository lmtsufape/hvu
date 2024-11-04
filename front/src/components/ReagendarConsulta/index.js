import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { reagendamento } from "../../../services/agendamentoService";
import { getAllVaga } from "../../../services/vagaService";
import { CancelarWhiteButton } from "../WhiteButton";
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";
import TabelaAgendamento from "../TabelaAgendamento";

function ReagendarConsulta() {
	const router = useRouter();
	const { id } = router.query;

	const [showAlert, setShowAlert] = useState(false);
	const [showErrorAlert, setShowErrorAlert] = useState(false);
	const [vagas, setVagas] = useState([]);
	const [vagasFiltradas, setVagasFiltradas] = useState([]);
	const [novaData, setNovaData] = useState("");
	const [selectedVaga, setSelectedVaga] = useState(null); // Alterado para null inicialmente
	const [roles, setRoles] = useState([]);
	const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

	console.log("vagas:", vagas);
	console.log("novaData:", novaData);
	console.log("vagasFiltradas:", vagasFiltradas);
	console.log("selectedVaga:", selectedVaga); // Log da vaga selecionada

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const vagasList = await getAllVaga();
				console.log("vagasList:", vagasList);

				// Função para normalizar strings removendo acentos e convertendo para minúsculas
				const normalizeString = (str) =>
					str
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.toLowerCase();

				// Filtrando vagas com status "disponível" (normalizado)
				setVagas(
					vagasList.filter(
						(vaga) => normalizeString(vaga.status) === "disponivel"
					)
				);
			} catch (error) {
				console.error("Erro ao buscar vagas:", error);
			} finally {
				setLoading(false); // Marcar como carregado após buscar os dados
			}
		};

		if (id) {
			fetchData();
		}
	}, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message_message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

	if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

	const handleNovaDataChange = (event) => {
		const novaDataSelecionada = event.target.value;
		setNovaData(novaDataSelecionada);

		if (vagas.length > 0) {
			const vagasDisponiveisNaData = vagas.filter((vaga) =>
				vaga.dataHora.startsWith(novaDataSelecionada)
			);
			setVagasFiltradas(vagasDisponiveisNaData);
		}
	};

	// const formatarData = (dataSemFormato) => {
	// 	const data = new Date(dataSemFormato);

	// 	// Extrair dia, mês e ano
	// 	const dia = data.getDate().toString().padStart(2, "0");
	// 	const mes = (data.getMonth() + 1).toString().padStart(2, "0"); // Mês começa em 0
	// 	const ano = data.getFullYear();

	// 	// Extrair horas e minutos
	// 	const horas = data.getHours().toString().padStart(2, "0");
	// 	const minutos = data.getMinutes().toString().padStart(2, "0");

	// 	// Retornar a string formatada
	// 	return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
	// };

	// Função que recebe o objeto da vaga e o define como a vaga selecionada
	// const handleVagaSelection = (event, vaga) => {
	// 	event.preventDefault(); // Evita o recarregamento da página
	// 	setSelectedVaga(vaga); // Define a vaga selecionada
	// };

	return (
		<div className={styles.container}>
			<VoltarButton />
			<h1>Reagendar consulta</h1>
			<form className={styles.inputs_container}>
				<div className={styles.dateWrapper}>
					<label htmlFor="data" className="form-label">
						Data para consulta:
					</label>
					<input
						type="date"
						className={styles.input}
						value={novaData}
						onChange={handleNovaDataChange}
					/>
				</div>

				<TabelaAgendamento
					vagas={vagasFiltradas}
					dataSelecionada={novaData}
					setShowErrorAlert={setShowErrorAlert}
					setShowAlert={setShowAlert}
				/>

				{/* <div className={styles.button_box}>
					<CancelarWhiteButton />
					<button
						className={styles.criar_button}
						onClick={handleReagendarVaga}
						disabled={!selectedVaga}
					>
						Confirmar
					</button>
				</div> */}
			</form>

			<Alert
				message="Reagendamento concluído com sucesso!"
				show={showAlert}
				url={`/agendamentosDia`}
			/>
			{showErrorAlert && (
				<ErrorAlert
					message="Erro ao realizar reagendamento, tente novamente."
					show={showErrorAlert}
				/>
			)}
		</div>
	);
}

export default ReagendarConsulta;
