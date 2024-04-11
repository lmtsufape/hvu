import React, { useState } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { createMedico } from "../../../services/medicoService";
import { postRegister } from "../../../common/postRegister";
import { postLogin } from "../../../common/postLogin";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import axios from "axios";

function CreateMedico() {
    const router = useRouter();

    const { especialidades } = EspecialidadeList();
    const [selectedEspecialidade, setSelectedEspecialidade] = useState(null);
    const [errors, setErrors] = useState({});
    const [cityStateLoading, setCityStateLoading] = useState(false);
    
    const [medico, setMedico] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        telefone: "",
        instituicao: "",
        crmv: "",
        confirmarSenha: "",
        endereco: {
            cep: "",
            rua: "",
            estado: "",
            cidade: "",
            numero: "",
            bairro: ""
        },
        especialidade: {id: null}
    });

    const handleEspecialidadeSelection = (event) => {
        const selectedEspecialidadeId = event.target.value;
        setSelectedEspecialidade(selectedEspecialidadeId);
    };

    const handleMedicoChange = (event) => {
        const { name, value } = event.target;
        setMedico({ ...medico, [name]: value });
    };

    const handleEnderecoChange = (event) => {
        const { name, value } = event.target;
        setMedico({
            ...medico,
            endereco: {
                ...medico.endereco,
                [name]: value
            }
        });
    };

    const handleCreateMedico = async () => {
        const validationErrors = validateFields(medico);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const MedicoToCreate = {
            nome: medico.nome,
            email: medico.email,
            senha: medico.senha,
            cpf: medico.cpf,
            rg: medico.rg,
            telefone: medico.telefone,
            crmv: medico.crmv,
            endereco: {
                cep: medico.endereco.cep,
                rua: medico.endereco.rua,
                estado: medico.endereco.estado,
                cidade: medico.endereco.cidade,
                numero: medico.endereco.numero,
                bairro: medico.endereco.bairro
            },
            especialidade: [{id: parseInt(selectedEspecialidade) }]
        };

        console.log("MedicoToCreate:", MedicoToCreate);

        try {
            const token = localStorage.getItem("token");
            const responseRegister = await postRegister( medico.email,medico.nome,medico.senha, "medico");
            console.log(responseRegister);
            await postLogin(medico.email,medico.senha);
            await createMedico(MedicoToCreate);
            localStorage.setItem("token", token);
            alert("Médico cadastrado com sucesso!");
            // router.push("/getMedicoById");
        } catch (error) {
            console.error("Erro ao criar médico:", error);
            alert("Erro ao criar médico. Por favor, tente novamente.");
        }
    };

    const validateFields = (medico) => {
        const errors = {};
        if (!medico.nome) {
            errors.nome = "Campo obrigatório";
        }
        if (!medico.email) {
            errors.email = "Campo obrigatório";
        }
        if (!medico.senha) {
            errors.senha = "Campo obrigatório";
        }
        if (!medico.cpf) {
            errors.cpf = "Campo obrigatório";
        }
        if (!medico.rg) {
            errors.rg = "Campo obrigatório";
        }
        if (!medico.telefone) {
            errors.telefone = "Campo obrigatório";
        }
        if (!medico.crmv) {
            errors.crmv = "Campo obrigatório";
        }
        if (!medico.confirmarSenha) {
            errors.confirmarSenha = "Campo obrigatório";
        }
        if (selectedEspecialidade === null) {
            errors.especialidade = "Campo obrigatório";
        }
        if (!medico.endereco.cep) {
            errors.cep = "Campo obrigatório";
        }
        if (!medico.endereco.rua) {
            errors.rua = "Campo obrigatório";
        }
        if (!medico.endereco.estado) {
            errors.estado = "Campo obrigatório";
        }
        if (!medico.endereco.cidade) {
            errors.cidade = "Campo obrigatório";
        }
        if (!medico.endereco.numero) {
            errors.numero = "Campo obrigatório";
        }
        if (!medico.endereco.bairro) {
            errors.bairro = "Campo obrigatório";
        }
        
        return errors;
    };

    const handleCEPChange = async (event) => {
        const cep = event.target.value;
        setMedico({
            ...medico,
            endereco: {
                ...medico.endereco,
                cep: cep
            }
        });
        if (cep.length === 9) {
            try {
                setCityStateLoading(true);
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { localidade, uf, logradouro, bairro } = response.data;
                setMedico({
                    ...medico,
                    endereco: {
                        ...medico.endereco,
                        cidade: localidade,
                        estado: uf,
                        rua: logradouro,
                        bairro: bairro
                    }
                });
                setCityStateLoading(false);
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                setCityStateLoading(false);
            }
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Cadastro do&#40;a&#41; médico&#40;a&#41; veterinário&#40;a&#41;</h1>

            <form className={styles.inputs_container}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Profissional</div>
                        {renderMedicoInput("Nome Completo", "Digite o nome completo", "nome", medico.nome, handleMedicoChange, "text", errors.nome)}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderMedicoInput("E-mail", "Digite o email", "email", medico.email, handleMedicoChange, "email", errors.email)}
                                {renderMedicoInput("CPF", "Digite o CPF", "cpf", medico.cpf, handleMedicoChange, "text", errors.cpf, "999.999.999-99")}
                                {renderMedicoInput("Crie uma senha", "Digite uma senha", "senha", medico.senha, handleMedicoChange, "password", errors.senha)}
                                {renderMedicoInput("CRMV", "Conselho Federal de Medicina Veterinária", "crmv", medico.crmv, handleMedicoChange, "text", errors.crmv)}                                                              
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderMedicoInput("Telefone", "Digite o telefone", "telefone", medico.telefone, handleMedicoChange, "tel", errors.telefone, "(99) 99999-9999")}
                                {renderMedicoInput("RG", "Digite o RG", "rg", medico.rg, handleMedicoChange, "text", errors.rg, "99.999.999-9")}
                                {renderMedicoInput("Confirmar senha", "Confirme a senha", "confirmarSenha", medico.confirmarSenha, handleMedicoChange, "password", errors.confirmarSenha)}
                                
                                <div className="mb-3">
                                    <label htmlFor="especialidade" className="form-label">Especialidade <span className={styles.obrigatorio}>*</span></label>
                                    <select
                                        className={`form-select ${styles.input} ${errors.especialidade ? "is-invalid" : ""}`}
                                        name="especialidade"
                                        aria-label="Selecione uma especialidade"
                                        value={selectedEspecialidade || ""}
                                        onChange={handleEspecialidadeSelection}
                                    >
                                        <option value="">Selecione a especialidade</option>
                                        {especialidades.map((especialidade) => (
                                            <option key={especialidade.id} value={especialidade.id}>
                                                {especialidade.nome}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.especialidade && <div className="invalid-feedback">{errors.especialidade}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {medico.endereco && (
                    <div className={styles.boxcadastro}>
                        <div className={styles.titulo}>Endereço</div>
                        <div className="mb-3">
                            <div className="row">
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("CEP", "cep", medico.endereco.cep, handleCEPChange, "Digite o CEP", "text", errors.cep, "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", medico.endereco.rua, handleEnderecoChange, "Digite a rua", "text", errors.rua)}
                                    {renderEnderecoInput("Cidade", "cidade", medico.endereco.cidade, handleEnderecoChange, "Digite a cidade", "text", errors.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", medico.endereco.numero, handleEnderecoChange, "Digite o número do endereço", "text", errors.numero)}
                                    {renderEnderecoInput("Bairro", "bairro", medico.endereco.bairro, handleEnderecoChange, "Digite o bairro", "text", errors.bairro)}
                                    {renderEnderecoInput("Estado", "estado", medico.endereco.estado, handleEnderecoChange, "Digite o estado", "text", errors.estado)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleCreateMedico}>
                        {cityStateLoading ? "Aguarde..." : "Criar"}
                    </button>
                </div>

            </form>
        </div>
    );
}

function renderMedicoInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask) {
    const InputComponent = mask ? InputMask : 'input';

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
            <InputComponent
                mask={mask}
                type={type}
                className={`form-control ${styles.input} ${errorMessage ? "is-invalid" : ""}`}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
        </div>
    );
}

// Substitua a renderização das mensagens de erro nos inputs de endereço por classes Bootstrap
function renderEnderecoInput(label, name, value, onChange, placeholder, type = "text", errorMessage = null, mask) {
    const InputComponent = mask ? InputMask : 'input';
    const inputProps = mask ? { mask } : {};

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
            <InputComponent
                type={type}
                className={`form-control ${styles.input} ${errorMessage ? "is-invalid" : ""}`}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...inputProps}
            />
            {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
        </div>
    );
}

export default CreateMedico;