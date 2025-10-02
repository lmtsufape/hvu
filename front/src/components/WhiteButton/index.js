import React from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";

const text_white_button = {
	login: "Login",
	adicionar_animal: "Adicionar animal",
	adicionar_medico: "Adicionar veterinário(a)",
	adicionar_patologista: "Adicionar patologista",
	adicionar_raca: "Adicionar raça",
	cadastro: "Cadastre-se",
	cancelar: "Cancelar",
	voltar: "Voltar",
	editar: "Editar",
	criar_agendamento: "Criar agendamento",
	visualizar_agendas: "Visualizar agenda",
	adicionar_cronograma: "Adicionar agenda",
	visualizar_consultas: "Visualizar consultas",
	criar_consulta: "Criar consulta",
	visualizar_paciente: "Visualizar paciente",
};

export function LoginWhiteButton() {
	const router = useRouter();

	const handleLoginClick = () => {
		router.push("/");
	};

	return (
		<button className={styles.white_button} onClick={handleLoginClick}>
			{text_white_button.login}
		</button>
	);
}

export function AdicionarAnimalWhiteButton() {
	const router = useRouter();

	const handlAdicionarClick = () => {
		router.push("/createAnimal");
	};

	return (
		<button className={styles.white_button} onClick={handlAdicionarClick}>
			{text_white_button.adicionar_animal}
		</button>
	);
}

export function AdicionarAnimalWhiteButtonLapa() {
	const router = useRouter();

	const handlAdicionarClick = () => {
		router.push("/lapa/createAnimal");
	};

	return (
		<button className={styles.white_button} onClick={handlAdicionarClick}>
			{text_white_button.adicionar_animal}
		</button>
	);
}

export function AdicionarMedicoWhiteButton() {
	const router = useRouter();

	const handlAdicionarClick = () => {
		router.push("/createMedico");
	};

	return (
		<button className={styles.white_button} onClick={handlAdicionarClick}>
			{text_white_button.adicionar_medico}
		</button>
	);
}

export function AdicionarPatologistaWhiteButton() {
	const router = useRouter();

	const handlAdicionarClick = () => {
		router.push("/lapa/gerenciarPatologistas/createPatologista");
	};

	return (
		<button className={styles.white_button} onClick={handlAdicionarClick}>
			{text_white_button.adicionar_patologista}
		</button>
	);
}

export function AdicionarRacaWhiteButton() {
	const router = useRouter();

	const handlAdicionarClick = () => {
		router.push("/createRaca");
	};

	return (
		<button className={styles.white_button} onClick={handlAdicionarClick}>
			{text_white_button.adicionar_raca}
		</button>
	);
}

export function CadastrolWhiteButton() {
	return (
		<button className={styles.white_button}>
			{text_white_button.cadastro}
		</button>
	);
}

export function CancelarWhiteButton({ type = "button", onClick  }) {
	const router = useRouter();

	const handlCancelarClick = (e) => {
		e.preventDefault();
		if (onClick) {
			onClick(e); 
		}
		router.back();
	};

	return (
		<button type={type} className={styles.white_button} onClick={handlCancelarClick}>
			{text_white_button.cancelar}
		</button>
	);
}

export function VoltarWhiteButton({ type = "button", onClick }) {

	const handlVoltarClick = (e) => {
		e.preventDefault();
        onClick(); 
	};

	return (
		<button type={type} className={styles.white_button} onClick={handlVoltarClick}>
			{text_white_button.voltar}
		</button>
	);
}

export function EditarWhiteButton({ page, id }) {
	const router = useRouter();

	const handlEditarClick = () => {
		router.push(`/${page}/${id}`);
	};

	return (
		<button className={styles.white_button} onClick={handlEditarClick}>
			{text_white_button.editar}
		</button>
	);
}

export function ConsultasWhiteButton({ page, id }) {
	const router = useRouter();

	const handleConsultasClick = () => {
		router.push(`/${page}/${id}`);
	};

	return (
		<button className={styles.white_button} onClick={handleConsultasClick}>
			{text_white_button.visualizar_consultas}
		</button>
	);
}

export function CriarAgendamentoWhiteButton() {
	const router = useRouter();

	const handleCriarClick = () => {
		router.push("/agendarConsulta");
	};

	return (
		<button className={styles.white_button} onClick={handleCriarClick}>
			{text_white_button.criar_agendamento}
		</button>
	);
}

export function VisualizarAgendaWhiteButton({ id }) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/getAllCronograma/${id}`);
	};

	return (
		<button className={styles.white_button} onClick={handleClick}>
			{text_white_button.visualizar_agendas}
		</button>
	);
}

export function AdicionarCronograma({ page, id }) {
	const router = useRouter();

	return (
		<button
			className={styles.white_button}
			onClick={() => router.push(`/${page}`)}
		>
			{text_white_button.adicionar_cronograma}
		</button>
	);
}

export function CriarConsulta({ page, id }) {
	const router = useRouter();

	return (
		<button
			className={styles.white_button}
			onClick={() => router.push(`/${page}/${id}`)}
		>
			{text_white_button.criar_consulta}
		</button>
	);
}

export function VisualizarPaciente({ page, id }) {
	const router = useRouter();

	return (
		<button
			className={styles.white_button}
			onClick={() => router.push(`/${page}/${id}`)}
		>
			{text_white_button.visualizar_paciente}
		</button>
	);
}
