import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header04 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import CreateTutorEnderecoForm from "../../src/components/CreateTutorEnderecoForm";
import "@/styles/styles.css";

function PageCadastroTutor() {
	return (
		<div className="divPai">
			<Header04 />
			<div className="flexStyles">
				<CreateTutorEnderecoForm />
			</div>
			<Footer />
		</div>
	);
}

export default PageCadastroTutor;
