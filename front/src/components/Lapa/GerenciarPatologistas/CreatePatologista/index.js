import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { createPatologista } from "../../../../../services/patologistaService";
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import axios from "axios";
import Alert from "../../../Alert";
import ErrorAlert from "../../../ErrorAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function CreatePatologista() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { especialidades } = EspecialidadeList();
    const [selectEspecialidade, setSelectEspecialidade] = useState(null);
    const [errors, setErrors] = useState({});
    const [cityStateLoading, setCityStateLoading] = useState(false);
    const [selectedEspecialidades, setSelectedEspecialidades] = useState([]);

    const [patologista, setPatologista] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        telefone: "",
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
        especialidade: []
    });

    console.log("patologista:", patologista);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

    if (!roles.includes("admin_lapa")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
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

    const handleEspecialidadeSelection = (event) => {
        const especialidadeId = parseInt(event.target.value);
        if (!selectedEspecialidades.find(espec => espec.id === especialidadeId)) {
            const especialidadeSelected = especialidades.find(espec => espec.id === especialidadeId);
            setSelectedEspecialidades([...selectedEspecialidades, especialidadeSelected]);
        } else {
            setSelectedEspecialidades(selectedEspecialidades.filter(espec => espec.id !== especialidadeId));
        }
    };

    const handlePatologistaChange = (event) => {
        const { name, value } = event.target;
        setPatologista({ ...patologista, [name]: value });
    };

    const handleEnderecoChange = (event) => {
        const { name, value } = event.target;
        setPatologista({
            ...patologista,
            endereco: {
                ...patologista.endereco,
                [name]: value
            }
        });
    };

    const handleCreatePatologista = async () => {
        event.preventDefault();

       {/*} const validationErrors = validateFields(patologista);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } */}

        const PatologistaToCreate = {
            nome: patologista.nome,
            email: patologista.email,
            senha: patologista.senha,
            cpf: patologista.cpf,
            telefone: patologista.telefone,
            crmv: patologista.crmv,
            endereco: {
                cep: patologista.endereco.cep,
                rua: patologista.endereco.rua,
                estado: patologista.endereco.estado,
                cidade: patologista.endereco.cidade,
                numero: patologista.endereco.numero,
                bairro: patologista.endereco.bairro
            },
            especialidade: selectedEspecialidades.map(espec => ({ id: espec.id }))
        };

        console.log("PatologistaToCreate:", PatologistaToCreate);

        try {
            await createPatologista(PatologistaToCreate);
            localStorage.setItem("token", token);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar patologista:", error);
            setShowErrorAlert(true);
        }
    };

    const isValidCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11) return false;

        // Elimina CPFs inválidos conhecidos
        if (/^(\d)\1+$/.test(cpf)) return false;

        // Valida 1o digito
        let add = 0;
        for (let i = 0; i < 9; i++) {
            add += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;

        // Valida 2o digito
        add = 0;
        for (let i = 0; i < 10; i++) {
            add += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;

        return true;
    };

    const validateFields = (patologista) => {
        const errors = {};
        if (!patologista.nome) {
            errors.nome = "Campo obrigatório";
        }
        if (!patologista.email) {
            errors.email = "Campo obrigatório";
        }
        if (!/\S+@\S+\.\S+/.test(patologista.email)) {
            errors.email = "E-mail inválido";
        }
        if (!patologista.senha) {
            errors.senha = "Campo obrigatório";
        } else if (patologista.senha.length < 8) {
            errors.senha = "A senha deve ter pelo menos 8 caracteres.";
        }
        if (!patologista.cpf) {
            errors.cpf = "Campo obrigatório";
        } else if (!isValidCPF(patologista.cpf)) {
            errors.cpf = "CPF inválido";
        }
        if (!patologista.telefone) {
            errors.telefone = "Campo obrigatório";
        }
        if (!patologista.crmv) {
            errors.crmv = "Campo obrigatório";
        }
        if (!patologista.confirmarSenha) {
            errors.confirmarSenha = "Campo obrigatório";
        } else if (patologista.confirmarSenha !== patologista.senha) {
            errors.confirmarSenha = "As senhas não coincidem.";
        }
        if (selectedEspecialidades.length === 0) {
            errors.especialidade = "Selecione pelo menos uma especialidade.";
        }
        if (!patologista.endereco.cep) {
            errors.cep = "Campo obrigatório";
        }
        if (!patologista.endereco.rua) {
            errors.rua = "Campo obrigatório";
        }
        if (!patologista.endereco.estado) {
            errors.estado = "Campo obrigatório";
        }
        if (!patologista.endereco.cidade) {
            errors.cidade = "Campo obrigatório";
        }
        if (!patologista.endereco.numero) {
            errors.numero = "Campo obrigatório";
        }
        if (!patologista.endereco.bairro) {
            errors.bairro = "Campo obrigatório";
        }

        return errors;
    };

    const handleCEPChange = async (event) => {
        let cep = event.target.value;
        cep = cep.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
        setPatologista({
            ...patologista,
            endereco: {
                ...patologista.endereco,
                cep: cep
            }
        });
        if (/^\d{8}$/.test(cep)) { // Verifica se a string do CEP tem exatamente 8 dígitos
            try {
                setCityStateLoading(true);
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const { localidade, uf, logradouro, bairro } = response.data;
                setPatologista({
                    ...patologista,
                    endereco: {
                        ...patologista.endereco,
                        cep: cep,
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Cadastro de Patologista</h1>

            <form className={styles.inputs_container} onSubmit={handleCreatePatologista}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Profissional</div>
                        {renderPatologistaInput("Nome Completo", "Digite o nome completo", "nome", patologista.nome, handlePatologistaChange, "text", errors.nome)}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderPatologistaInput("E-mail", "Digite o email", "email", patologista.email, handlePatologistaChange, "email", errors.email)}
                                {renderPatologistaInput("CPF", "Digite o CPF", "cpf", patologista.cpf, handlePatologistaChange, "text", errors.cpf, "999.999.999-99")}
                                {renderPatologistaInput("Crie uma senha", "Digite uma senha", "senha", patologista.senha, handlePatologistaChange, "password", errors.senha, null, showPassword, togglePasswordVisibility)}
                                {renderPatologistaInput("Confirmar senha", "Confirme a senha", "confirmarSenha", patologista.confirmarSenha, handlePatologistaChange, "password", errors.confirmarSenha, null, showConfirmPassword, toggleConfirmPasswordVisibility)}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderPatologistaInput("Telefone", "Digite o telefone", "telefone", patologista.telefone, handlePatologistaChange, "tel", errors.telefone, "(99) 99999-9999")}
                                {renderPatologistaInput("CRMV", "Conselho Federal de Medicina Veterinária", "crmv", patologista.crmv, handlePatologistaChange, "text", errors.crmv)}

                                <div className="mb-3">
                                    <label htmlFor="especialidade" className="form-label">Especialidade <span className={styles.obrigatorio}>*</span></label>
                                    <select
                                        className={`form-select ${styles.input} ${errors.especialidade ? "is-invalid" : ""}`}
                                        name="especialidade"
                                        aria-label="Selecione uma especialidade"
                                        value={selectEspecialidade || ""}
                                        onChange={handleEspecialidadeSelection}
                                    >
                                        <option value="">Selecione a especialidade</option>
                                        {especialidades.map((especialidade) => (
                                            <option key={especialidade.id} value={especialidade.id}>
                                                {especialidade.nome}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.especialidade && <div className={`invalid-feedback ${styles.error_message}`}>{errors.especialidade}</div>}
                                </div>
                                <div>
                                    {selectedEspecialidades.map(especialidade => (
                                        <div key={especialidade.id}>
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${styles.checkbox}`}
                                                checked
                                                onChange={() => handleEspecialidadeSelection({ target: { value: especialidade.id } })}
                                            />
                                            <label className={styles.input}>{especialidade.nome}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {patologista.endereco && (
                    <div className={styles.boxcadastro}>
                        <div className={styles.titulo}>Endereço</div>
                        <div className="mb-3">
                            <div className="row">
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("CEP", "cep", patologista.endereco.cep, handleCEPChange, "Digite o CEP", "text", errors.cep, "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", patologista.endereco.rua, handleEnderecoChange, "", "text", errors.rua)}
                                    {renderEnderecoInput("Cidade", "cidade", patologista.endereco.cidade, handleEnderecoChange, "", "text", errors.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", patologista.endereco.numero, handleEnderecoChange, "Digite o número do endereço", "text", errors.numero)}
                                    {renderEnderecoInput("Bairro", "bairro", patologista.endereco.bairro, handleEnderecoChange, "", "text", errors.bairro)}
                                    {renderEnderecoInput("Estado", "estado", patologista.endereco.estado, handleEnderecoChange, "", "text", errors.estado)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="submit" className={styles.criar_button} onClick={handleCreatePatologista}>
                        {cityStateLoading ? "Aguarde..." : "Cadastrar"}
                    </button>
                </div>

            </form>
            {<Alert message="Patologista cadastrado(a) com sucesso!" show={showAlert} url={`/lapa/gerenciarPatologistas/getAllPatologista`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao cadastrar patologista, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

function renderPatologistaInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask = null, showPassword = false, togglePasswordVisibility = null) {
    const InputComponent = mask ? InputMask : 'input';

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
            <div className="input-group">
                <InputComponent
                    mask={mask}
                    type={showPassword ? 'text' : type}
                    className={`form-control ${styles.input} ${errorMessage ? "is-invalid" : ""}`}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {type === 'password' && (
                    <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                )}
            </div>
            {errorMessage && <div className={`invalid-feedback ${styles.error_message}`}>{errorMessage}</div>}
        </div>
    );
}

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
            {errorMessage && <div className={`invalid-feedback ${styles.error_message}`}>{errorMessage}</div>}
        </div>
    );
}

export default CreatePatologista;
