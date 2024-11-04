import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateTutor, getTutorById } from "../../../services/tutorService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

function UpdateTutorBySecretario() {
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
    const [tutor, setTutor] = useState({});
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true); 

    console.log("tutor: ", tutor);

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
                    const TutorData = await getTutorById(id);
                    setTutor(TutorData);
                } catch (error) {
                    console.error('Erro ao buscar informações de tutor:', error);
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
    if (!roles.includes("secretario")) {
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

    const handleTutorChange = (event) => {
        const { name, value } = event.target;
        setTutor({ ...tutor, [name]: value });
    };

    const handleEnderecoChange = (event) => {
        const { name, value } = event.target;
        setTutor({
            ...tutor,
            endereco: {
                ...tutor.endereco,
                [name]: value
            }
        });
    };

    const fetchCepData = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setTutor({
                    ...tutor,
                    endereco: {
                        ...tutor.endereco,
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
        setTutor({
            ...tutor,
            endereco: {
                ...tutor.endereco,
                cep: value
            }
        });
        fetchCepData(value);
    };

    const validateForm = () => {
        const newErrors = {};
        if (alterarSenha) {
            if (!tutor.senha) {
                newErrors.senha = "Senha é obrigatória";
            }
            if (!tutor.confirmarSenha) {
                newErrors.confirmarSenha = "Confirme sua senha";
            } else if (tutor.senha !== tutor.confirmarSenha) {
                newErrors.confirmarSenha = "As senhas não coincidem";
            }
        }
        if (!tutor.nome) {
            newErrors.nome = "Campo obrigatório";
        }
        if (!tutor.email) {
            newErrors.email = "Campo obrigatório"; 
        }
        if (!tutor.cpf) {
            newErrors.cpf = "Campo obrigatório"; 
        }
        if (!tutor.telefone) {
            newErrors.telefone = "Campo obrigatório"; 
        }
        if (!tutor.endereco.cep) {
            newErrors.cep = "Campo obrigatório"; 
        }
        if (!tutor.endereco.rua) {
            newErrors.rua = "Campo obrigatório"; 
        }
        if (!tutor.endereco.estado) {
            newErrors.estado = "Campo obrigatório"; 
        }
        if (!tutor.endereco.cidade) {
            newErrors.cidade = "Campo obrigatório"; 
        }
        if (!tutor.endereco.numero) {
            newErrors.numero = "Campo obrigatório"; 
        }
        if (!tutor.endereco.bairro) {
            newErrors.bairro = "Campo obrigatório"; 
        }
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };

    const handleTutorUpdate = async () => {
        if (!validateForm()) {
            return;
        }

        const TutorToUpdate = {
            nome: tutor.nome,
            email: tutor.email,
            senha: tutor.senha,
            cpf: tutor.cpf,
            telefone: tutor.telefone,
            endereco: {
                id: tutor.endereco.id,
                cep: tutor.endereco.cep,
                rua: tutor.endereco.rua,
                estado: tutor.endereco.estado,
                cidade: tutor.endereco.cidade,
                numero: tutor.endereco.numero,
                bairro: tutor.endereco.bairro
            }
        };

        try {
            await updateTutor(id, TutorToUpdate);
            console.log("TutorToUpdate:", TutorToUpdate);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar tutor:", error);
            setShowErrorAlert(true);
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações do&#40;a&#41; tutor&#40;a&#41;</h1>

            <form className={styles.inputs_container}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Tutor&#40;a&#41;</div>
                        {renderTutorInput("Nome Completo", tutor.nome, "nome", tutor.nome, handleTutorChange, "text", errors.nome)}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderTutorInput("E-mail", tutor.email, "email", tutor.email, handleTutorChange, "email", errors.email)}
                                {renderTutorInput("CPF", tutor.cpf, "cpf", tutor.cpf, handleTutorChange, "text", errors.cpf, "999.999.999-99")}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderTutorInput("Telefone", tutor.telefone, "telefone", tutor.telefone, handleTutorChange, "tel", errors.telefone, "(99) 99999-9999")}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.boxcadastro}>
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
                                {renderTutorInput("Alterar senha", "Digite sua nova senha", "senha", tutor.senha, handleTutorChange, "password", errors.senha, null, showSenha, setShowSenha)}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderTutorInput("Confirmar senha", "Confirme sua nova senha", "confirmarSenha", tutor.confirmarSenha, handleTutorChange, "password", errors.confirmarSenha, null, showConfirmarSenha, setShowConfirmarSenha)}
                            </div>
                        </div>
                    )}
                </div>

                {tutor.endereco && (
                    <div className={styles.boxcadastro}>
                        <div className={styles.titulo}>Endereço</div>
                        <div className="mb-3">
                            <div className="row">
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("CEP", "cep", tutor.endereco.cep, handleCepChange, errors.cep, tutor.endereco.cep, "text", "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", tutor.endereco.rua, handleEnderecoChange, errors.rua, tutor.endereco.rua,)}
                                    {renderEnderecoInput("Cidade", "cidade", tutor.endereco.cidade, handleEnderecoChange, errors.cidade, tutor.endereco.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", tutor.endereco.numero, handleEnderecoChange, errors.numero, tutor.endereco.numero,)}
                                    {renderEnderecoInput("Bairro", "bairro", tutor.endereco.bairro, handleEnderecoChange, errors.bairro, tutor.endereco.bairro,)}
                                    {renderEnderecoInput("Estado", "estado", tutor.endereco.estado, handleEnderecoChange, errors.estado, tutor.endereco.estado)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.button_box}>
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleTutorUpdate}>
                        Salvar
                    </button>
                </div>

            </form>
            {<Alert message="Informações do(a) tutor(a) editadas com sucesso!" show={showAlert} url={`/pacientesBySecretario`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações do(a) tutor(a), tente novamente." show={showErrorAlert} />}
        </div>
    );
}

function renderTutorInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask = null, show = false, setShow = null) {
    const InputComponent = mask ? InputMask : 'input';

    //função modificada para aceitar o evento
    const toggleShow = (event) => {
        event.preventDefault(); //impede o comportamento padrão do botão submeter o formulario
        setShow(!show);
    };

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label}</label>
            <InputComponent
                mask={mask}
                type={type}
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

export default UpdateTutorBySecretario;
