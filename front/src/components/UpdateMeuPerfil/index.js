import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateUsuario, getUsuarioById } from "../../../services/userService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateMeuPerfil() {
    const router = useRouter();
    const { id } = router.query;
    const [errors, setErrors] = useState({});
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
    const [alterarSenha, setAlterarSenha] = useState(false);
    const [senhaErro, setSenhaErro] = useState("");
    const [confirmarSenhaErro, setConfirmarSenhaErro] = useState("");
    
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true); 

    const [usuario, setUsuario] = useState({
        id: null,
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        telefone: "",
        confirmarSenha: "",
        endereco: {
            id: null,
            cep: "",
            rua: "",
            estado: "",
            cidade: "",
            numero: "",
            bairro: ""
        }
    });

        // Substitua sua função validarCPF por esta
    const validarCPF = (cpf) => {
    if (!cpf) return false;

    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se tem 11 dígitos e não é uma sequência repetida
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    // Validação dos dois dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
    };


        // Substitua sua função validarTelefone por esta
    const validarTelefone = (telefone) => {
    if (!telefone) return false;

    // Remove tudo que não for número
    const numeroLimpo = telefone.replace(/\D/g, '');

    // Deve ter 10 ou 11 dígitos
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) return false;

    const ddd = numeroLimpo.substring(0, 2);
    const numero = numeroLimpo.substring(2);

    // Verifica DDD válido (de 11 a 99)
    if (parseInt(ddd) < 11 || parseInt(ddd) > 99) return false;

    // Validação para celular: 11 dígitos e começa com 9
    if (numeroLimpo.length === 11 && numero[0] !== '9') return false;

    // Validação para fixo: 10 dígitos e começa com 2, 3, 4 ou 5
    if (numeroLimpo.length === 10 && !['2', '3', '4', '5'].includes(numero[0])) return false;

    return true;
    };


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const usuarioData = await getUsuarioById(id);
                    setUsuario(usuarioData);
                } catch (error) {
                    console.error('Erro ao buscar informações de usuario:', error);
                } finally {
                    setLoading(false); // Marcar como carregado após buscar os dados
                }
            };
            fetchData();
        }
    }, [id]);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("secretario") && !roles.includes("tutor") && !roles.includes("medico")) {
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

    const handleUsuarioChange = (event) => {
        const { name, value } = event.target;
        setUsuario({ ...usuario, [name]: value });
        
        // Validação em tempo real para CPF
        if (name === "cpf") {
            const cpfLimpo = value.replace(/[^\d]/g, '');
            if (cpfLimpo.length === 11 && !validarCPF(value)) {
                setErrors(prev => ({ ...prev, cpf: "CPF inválido" }));
            } else {
                setErrors(prev => ({ ...prev, cpf: "" }));
            }
        }
        
        // Validação em tempo real para telefone
        if (name === "telefone") {
            if (!validarTelefone(value)) {
                setErrors(prev => ({ ...prev, telefone: "Telefone inválido" }));
            } else {
                setErrors(prev => ({ ...prev, telefone: "" }));
            }
        }
    };

    const handleEnderecoChange = (event) => {
        const { name, value } = event.target;
        setUsuario({
            ...usuario,
            endereco: {
                ...usuario.endereco,
                [name]: value
            }
        });
    };

    const fetchCepData = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setUsuario({
                    ...usuario,
                    endereco: {
                        ...usuario.endereco,
                        estado: data.uf,
                        cidade: data.localidade,
                        rua: data.logradouro,
                        bairro: data.bairro,
                        cep: cep
                    }
                });
            } else {
                console.error("CEP não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };

    const handleCepChange = (event) => {
        const { value } = event.target;
        setUsuario({
            ...usuario,
            endereco: {
                ...usuario.endereco,
                cep: value
            }
        });
        fetchCepData(value);
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validação de CPF
        if (!usuario.cpf) {
            newErrors.cpf = "Campo obrigatório";
        } else if (!validarCPF(usuario.cpf)) {
            newErrors.cpf = "CPF inválido";
        }
        
        // Validação de telefone
        if (!usuario.telefone) {
            newErrors.telefone = "Campo obrigatório";
        } else if (!validarTelefone(usuario.telefone)) {
            newErrors.telefone = "Telefone inválido";
        }
        
        if (alterarSenha) {
            if (!usuario.senha) {
                newErrors.senha = "Senha é obrigatória";
            }
            if (!usuario.confirmarSenha) {
                newErrors.confirmarSenha = "Confirme sua senha";
            } else if (usuario.senha !== usuario.confirmarSenha) {
                newErrors.confirmarSenha = "As senhas não coincidem";
            }
        }
        if (!usuario.nome) {
            newErrors.nome = "Campo obrigatório";
        }
        if (!usuario.email) {
            newErrors.email = "Campo obrigatório";
        }
        if (!usuario.endereco.cep) {
            newErrors.cep = "Campo obrigatório";
        }
        if (!usuario.endereco.rua) {
            newErrors.rua = "Campo obrigatório";
        }
        if (!usuario.endereco.estado) {
            newErrors.estado = "Campo obrigatório";
        }
        if (!usuario.endereco.cidade) {
            newErrors.cidade = "Campo obrigatório";
        }
        if (!usuario.endereco.numero) {
            newErrors.numero = "Campo obrigatório";
        }
        if (!usuario.endereco.bairro) {
            newErrors.bairro = "Campo obrigatório";
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleUsuarioUpdate = async () => {
        if (!validateForm()) {
            return;
        }

        const usuarioToUpdate = {
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            cpf: usuario.cpf,
            telefone: usuario.telefone,
            endereco: {
                id: usuario.endereco.id,
                cep: usuario.endereco.cep,
                rua: usuario.endereco.rua,
                estado: usuario.endereco.estado,
                cidade: usuario.endereco.cidade,
                numero: usuario.endereco.numero,
                bairro: usuario.endereco.bairro
            }
        };
        console.log("usuarioToUpdate:", usuarioToUpdate);
        try {
            await updateUsuario(usuario.id, usuarioToUpdate);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar usuario:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar meu Perfil</h1>

            <form className={styles.inputs_container}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Minhas informações</div>
                        {renderUsuarioInput("Nome Completo", usuario.nome, "nome", usuario.nome, handleUsuarioChange, "text", errors.nome)}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {/* {renderUsuarioInput("E-mail", usuario.email, "email", usuario.email, handleUsuarioChange, "email", errors.email)} */}
                                {renderUsuarioInput("CPF", usuario.cpf, "cpf", usuario.cpf, handleUsuarioChange, "text", errors.cpf, "999.999.999-99")}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderUsuarioInput("Telefone", usuario.telefone, "telefone", usuario.telefone, handleUsuarioChange, "tel", errors.telefone, "(99) 99999-9999")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* opção de alterar senha */}
                
                {/* <div className={styles.boxcadastro}>
                    <div className={styles.input_space}>
                        <div className="form-label">Deseja alterar sua senha?</div>
                        <input
                            type="checkbox"
                            className={`form-check-input ${styles.checkbox}`}
                            checked={alterarSenha}
                            onChange={() => setAlterarSenha(!alterarSenha)}
                        />
                    </div>
                    {alterarSenha && (
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderUsuarioInput("Alterar senha", "Digite sua nova senha", "senha", usuario.senha, handleUsuarioChange, "password", errors.senha, null, showSenha, setShowSenha)}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderUsuarioInput("Confirmar senha", "Confirme sua nova senha", "confirmarSenha", usuario.confirmarSenha, handleUsuarioChange, "password", errors.confirmarSenha, null, showConfirmarSenha, setShowConfirmarSenha)}
                            </div>
                        </div>
                    )}
                </div> */}

                {usuario.endereco && (
                    <div className={styles.boxcadastro}>
                        <div className={styles.titulo}>Endereço</div>
                        <div className="mb-3">
                            <div className="row">
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("CEP", "cep", usuario.endereco.cep, handleCepChange, errors.cep, usuario.endereco.cep, "text", "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", usuario.endereco.rua, handleEnderecoChange, errors.rua, usuario.endereco.rua,)}
                                    {renderEnderecoInput("Cidade", "cidade", usuario.endereco.cidade, handleEnderecoChange, errors.cidade, usuario.endereco.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", usuario.endereco.numero, handleEnderecoChange, errors.numero, usuario.endereco.numero,)}
                                    {renderEnderecoInput("Bairro", "bairro", usuario.endereco.bairro, handleEnderecoChange, errors.bairro, usuario.endereco.bairro,)}
                                    {renderEnderecoInput("Estado", "estado", usuario.endereco.estado, handleEnderecoChange, errors.estado, usuario.endereco.estado)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.button_box}>
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleUsuarioUpdate}>
                        Salvar
                    </button>
                </div>

            </form>
            {<Alert message="Informações editadas com sucesso!" show={showAlert} url={`/meuPerfil/${id}`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

function renderUsuarioInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask = null, show = false, setShow = null) {
    const InputComponent = mask ? InputMask : 'input';
    const inputType = type === "password" ? (show ? "text" : "password") : type;
    //função modificada para aceitar o evento
    const toggleShow = (event) => {
        event.preventDefault(); //impede o comportamento padrão do botão submeter o formulario
        setShow(!show);
    };

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label}</label>
            <div className="input-group">
                <InputComponent
                    mask={mask}
                    type={inputType}
                    className={`form-control ${styles.input} ${errorMessage ? "is-invalid" : ""}`}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {errorMessage && <div className={`invalid-feedback ${styles.error_message}`}>{errorMessage}</div>}
                {type === "password" && (
                    <div className={styles.input_group_append}>
                        <button className="btn btn-outline-secondary" type="button" onClick={toggleShow}>
                            <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function renderEnderecoInput(label, name, value, onChange, errorMessage = null, placeholder, type = "text", mask) {
    const InputComponent = mask ? InputMask : 'input';
    const inputProps = mask ? { mask } : {};

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label}</label>
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

export default UpdateMeuPerfil;