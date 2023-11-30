import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import tutorStyles from "./formulariocadastrotutor.module.css";
import enderecoStyles from "./formulariocadastroendereco.module.css";
import { useRouter } from "next/router";
import { createTutor } from "../../../services/tutorService";
import { VoltarWhiteButton } from "../WhiteButton/white_button"

function FormularioCadastroTutor() {
    const router = useRouter();

    const [formularioTutor, setFormularioTutor] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        telefone: "",
        endereco: {
            cep: "",
            rua: "",
            municipio: "",
            cidade: "",
            numero: "",
            bairro: ""
          }
    });

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormularioTutor({ ...formularioTutor, [name]: value });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await createTutor(formularioTutor);
            console.log(response);
            //router.push(`/cadastroendereco/${tutorId}`);
        } catch (error) {
            console.error("Erro ao cadastrar tutor:", error);
        }
    }

    return (
        <div className={`${tutorStyles.boxcadastrotutor} ${tutorStyles.container}`}>
            <form onSubmit={handleSubmit}>
                <div className={tutorStyles.cadastrotutor}>
                    <div className={tutorStyles.titulo}>Informações do Tutor</div>
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
                    <div className={enderecoStyles.espacodosforms}>
                        <div class="row">
                        <div class="col ">
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
                        <div class="col">
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
                        </div>
                    </div>
                    <div className={enderecoStyles.espacodosforms}>
                        <div class="row">
                        <div class="col ">
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
                        <div class="col">
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
                        </div>
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
                </div>
                <div className={enderecoStyles.cadastroendereco}>
                    <div className={tutorStyles.titulo}>Informações do endereço</div>
                    <div class="mb-3">
                        <label for="rua" class="form-label">Rua</label>
                        <input type="text" 
                        class="form-control" 
                        name="rua"
                        placeholder="Ex: Avenida Bom Pastor"
                        value={formularioTutor.endereco.rua}
                        onChange={handleInputChange}>
                        </input>
                    </div>

                    <div class="mb-3">
                    <label for="bairro" class="form-label">Bairro</label>
                    <input type="text" 
                        class="form-control" 
                        name="bairro" 
                        placeholder="Ex: Centro"
                        value={formularioTutor.endereco.bairro}
                        onChange={handleInputChange}>
                    </input>
                    </div>

                    <div class="mb-3">
                    <div class="row">
                        <div class="col ">
                            <label for="estado" class="form-label">Número</label>
                            <input type="text" 
                            class="form-control" 
                            name="numero"
                            placeholder="Ex: 140" 
                            value={formularioTutor.endereco.numero}
                            onChange={handleInputChange}>
                            </input>
                        </div>
                        <div class="col">
                            <label for="cidade" class="form-label">CEP</label>
                            <input type="text" 
                            class="form-control" 
                            name="cep"
                            placeholder="Ex: 55250-000" 
                            value={formularioTutor.endereco.cep}
                            onChange={handleInputChange}>
                            </input>
                        </div>
                        </div>
                    
                    <div className={enderecoStyles.espacodosforms}>
                        <div class="row">
                        <div class="col ">
                            <label for="municipio" class="form-label">Município</label>
                            <input type="text" 
                            class="form-control" 
                            name="municipio"
                            placeholder="Ex: Pernambuco" 
                            value={formularioTutor.endereco.municipio}
                            onChange={handleInputChange}>
                            </input>
                        </div>
                        <div class="col">
                            <label for="cidade" class="form-label">Cidade</label>
                            <input type="text" 
                            class="form-control" 
                            name="cidade"
                            placeholder="Ex: Garanhuns" 
                            value={formularioTutor.endereco.cidade}
                            onChange={handleInputChange}>
                            </input>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className={enderecoStyles.continuarbotao}>
                    <VoltarWhiteButton/>
                    <button type="submit" className={enderecoStyles.green_button}>
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioCadastroTutor;
