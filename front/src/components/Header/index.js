import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "./index.module.css";
import { LoginGreenButton } from "../GreenButton";
import { LoginWhiteButton } from "../WhiteButton";
import { getCurrentUsuario } from "../../../services/userService";
import { logout } from "../../../common/logout";
import BarraBrasil from "../BarraBrasil/BarraBrasil";


//Header com botão de login e cadastro
export function Header01() {
	const router = useRouter();

	return (
		<div>
			<BarraBrasil /> {/* Componente BarraBrasil adicionado */}

			<header className={styles.header}>
				<div className={styles.boxlogo}>
					<div>
						<Image
							src="/hvu_black_logo.svg"
							alt="Logo HVU"
							width={116.94}
							height={72.54}
						/>
					</div>
					<div>
						<h2 className={styles.hvu}>
							Hospital Veterinário Universitário da UFAPE
						</h2>
					</div>
				</div>

			<div className={styles.box_buttons}>
				<button
					type="button"
					className="btn btn-outline-success"
					id={styles.white_button}
				>
					Cadastre-se
				</button>
				<LoginGreenButton />
			</div>
		</header>
		</div>
	);
}

//Header com botão de Home e Sistema
export function Header02() {
	const router = useRouter();

	return (
		<div>
			<BarraBrasil /> {/* Adiciona a barra do GovBR no topo do Header02 */}
		<header className={styles.header}>
			<Link
				href={"/"}
				className={styles.boxlogo}
				style={{ textDecoration: "none" }}
			>
				<div>
					<Image
						src="/hvu_black_logo.svg"
						alt="Logo HVU"
						width={116.94}
						height={72.54}
					/>
				</div>
				<div>
					<h2 className={styles.hvu}>
						Hospital Veterinário Universitário da UFAPE
					</h2>
				</div>
			</Link>


			<Link href="/lapa" legacyBehavior>
							<a target="_blank" rel="noopener noreferrer">
								<div className={styles.additionalLogo}>
									<Image
										src="/images/logoLAPA.svg" // Caminho da nova logo
										alt="Logo da Patologia"
										width={200}
										height={70}
									/>
								</div>
							</a>
			</Link>



			<div className={styles.box_buttons}>
				<button
					type="button"
					className="btn btn-link"
					id={styles.black_button_decoration}
					onClick={(e) => router.push("/")}
				>
					Home
				</button>
				<button
					type="button"
					className="btn btn-link"
					id={styles.black_button_decoration}
					onClick={(e) => router.push("/system")}
				>
					Sistema
				</button>

				<button
					type="button"
					className="btn btn-link"
					id={styles.black_button_decoration}
					onClick={(e) => router.push("/contato")}
				>
					Contato
				</button>
			</div>
		</header>
		</div>
	);
}

//Header com ícone de perfil
export function Header03() {
	const router = useRouter();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(false);
	const dropdownRef = useRef(null);
	const [tutores, setTutores] = useState(null);

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownRef]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const TutoresData = await getCurrentUsuario();
				setCurrentUser(TutoresData);
				setTutores(TutoresData.usuario);
				console.log("Usuários:", TutoresData);
			} catch (error) {
				console.error("Erro ao buscar usuários:", error);
			}
		};
		fetchData();
	}, []);

	const handleGoHome = () => {
		if (currentUser.roles && Array.isArray(currentUser.roles)) {
			if (currentUser.roles.includes("secretario")) {
				router.push("/mainSecretario");
			} else if (currentUser.roles.includes("medico")) {
				router.push("/mainMedico");
			} else if (currentUser.roles.includes("tutor")) {
				router.push("/mainTutor");
			}
		}
	};

	return (
		<div>
			<BarraBrasil /> {/* Adiciona a barra do GovBR no topo do Header */}
		<header className={styles.header}>
			<div className={styles.boxlogo}>
				<div onClick={handleGoHome} style={{ cursor: "pointer" }}>
					<Image
						src="/hvu_black_logo.svg"
						alt="Logo HVU"
						width={116.94}
						height={72.54}
					/>
				</div>
				<div>
					<h2 className={styles.hvu}>
						Hospital Veterinário Universitário da UFAPE
					</h2>
				</div>
			</div>

			<div className={styles.box_buttons} ref={dropdownRef}>
				<button type="button" className="btn btn-link" onClick={toggleDropdown}>
					<Image
						src="/icone_perfil.svg"
						alt="Ícone de perfil"
						width={59.2}
						height={59.2}
					/>
				</button>
				{dropdownOpen && (
					<div className={styles.dropdown_container}>
						<div className={styles.dropdown}>
							<button
								className={styles.button1}
								style={{ cursor: "pointer" }}
								onClick={(e) => router.push(`/meuPerfil/${tutores.id}`)}
							>
								<div>
									<Image
										src="/info_icon.svg"
										alt="Ícone de perfil"
										width={18.87}
										height={18.87}
									/>
								</div>
								<div>Meu perfil</div>
							</button>
							<button className={styles.button2} onClick={(e) => logout()}>
								<div>
									<Image
										src="/left_icon.svg"
										alt="Ícone de perfil"
										width={17.88}
										height={17.88}
									/>
								</div>
								<div>Sair</div>
							</button>
						</div>
					</div>
				)}
			</div>
		</header>
		</div>
	);
}

//Header botão de login
export function Header04() {
	const router = useRouter();
	return (
		<div>
			<BarraBrasil/>
		<header className={styles.header}>
			<div className={styles.boxlogo}>
				<div>
					<Image
						src="/hvu_black_logo.svg"
						alt="Logo HVU"
						width={116.94}
						height={72.54}
					/>
				</div>
				<div>
					<h2 className={styles.hvu}>
						Hospital Veterinário Universitário da UFAPE
					</h2>
				</div>
			</div>

			<div className={styles.box_buttons}>
				<LoginWhiteButton />
			</div>
		</header>
		</div>
	);
}
