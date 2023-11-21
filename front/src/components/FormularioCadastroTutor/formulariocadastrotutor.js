import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./formulariocadastrotutor.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { createTutor } from "../../../services/tutorService"

function FormularioCadastroTutor() {
    const router = useRouter();

    const [formularioTutor, setFormularioTutor] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        telefone: ""
    });

    async function handleSubmit(event) {
        event.preventDefault();
    
        try {
            const response = await createTutor(formularioTutor);
            console.log(response);
            router.push("/cadastroendereco");
        } catch (error) {
            console.error("Erro ao cadastrar tutor:", error);
        }
    }
    

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormularioTutor({ ...formularioTutor, [name]: value });
    }

    return (
        <div className={`${styles.boxcadastrotutor} ${styles.container}`}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome Completo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        placeholder="Insira o nome completo"
                        value={formularioTutor.nome}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Insira o seu e-mail"
                        value={formularioTutor.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="senha" className="form-label">Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        name="senha"
                        placeholder="Insira uma senha"
                        value={formularioTutor.senha}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: 123.456.789-00"
                        name="cpf"
                        value={formularioTutor.cpf}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="rg" className="form-label">RG</label>
                    <input
                        type="text"
                        className="form-control"
                        name="rg"
                        placeholder="Insira o RG"
                        value={formularioTutor.rg}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="telefone" className="form-label">Telefone para contato</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="telefone"
                        placeholder="(xx) xxxxx-xxxx"
                        value={formularioTutor.telefone}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.continuarbotao}>
                    <button type="submit" className={styles.green_button}>
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioCadastroTutor;
