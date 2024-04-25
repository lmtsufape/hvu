import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateUsuario, getUsuarioById } from "../../../services/userService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function UpdateMeuPerfil() {
    const router = useRouter();
    const { id } = router.query;
    const [errors, setErrors] = useState({});
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
    const [alterarSenha, setAlterarSenha] = useState(false);
    const [senhaErro, setSenhaErro] = useState("");
    const [confirmarSenhaErro, setConfirmarSenhaErro] = useState("");

    const [tutor, setTutor] = useState({
        id: null,
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        // rg: "",
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

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const TutorData = await getUsuarioById(id);
                    setTutor(TutorData);
                } catch (error) {
                    console.error('Erro ao buscar informações de tutor:', error);
                }
            };
            fetchData();
        }
    }, [id]);

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
            // rg: tutor.rg,
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
        console.log("TutorToUpdate:", TutorToUpdate);
        try {
            await updateUsuario(tutor.id, TutorToUpdate);
            alert("Informações editadas com sucesso!");
            router.push(`/meuPerfil/${tutor.id}`);
        } catch (error) {
            console.log("TutorToUpdate:", TutorToUpdate);
            console.error("Erro ao editar tutor:", error);
            alert("Erro ao editar tutor. Por favor, tente novamente.");
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar Perfil</h1>

            <form className={styles.inputs_container}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Tutor&#40;a&#41;</div>
                        {renderTutorInput("Nome Completo", tutor.nome, "nome", tutor.nome, handleTutorChange, "text")}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderTutorInput("E-mail", tutor.email, "email", tutor.email, handleTutorChange, "email")}
                                {renderTutorInput("CPF", tutor.cpf, "cpf", tutor.cpf, handleTutorChange, "text", null, "999.999.999-99")}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderTutorInput("Telefone", tutor.telefone, "telefone", tutor.telefone, handleTutorChange, "tel", null, "(99) 99999-9999")}
                                {/* {renderTutorInput("RG", tutor.rg, "rg", tutor.rg, handleTutorChange, "text", null, "99.999.999-9")} */}
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
                                    {renderEnderecoInput("CEP", "cep", tutor.endereco.cep, handleCepChange, tutor.endereco.cep, "text", "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", tutor.endereco.rua, handleEnderecoChange, tutor.endereco.rua,)}
                                    {renderEnderecoInput("Cidade", "cidade", tutor.endereco.cidade, handleEnderecoChange, tutor.endereco.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", tutor.endereco.numero, handleEnderecoChange, tutor.endereco.numero,)}
                                    {renderEnderecoInput("Bairro", "bairro", tutor.endereco.bairro, handleEnderecoChange, tutor.endereco.bairro,)}
                                    {renderEnderecoInput("Estado", "estado", tutor.endereco.estado, handleEnderecoChange, tutor.endereco.estado)}
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
        </div>
    );
}

function renderTutorInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask = null, show = false, setShow = null) {
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
                {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
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

function renderEnderecoInput(label, name, value, onChange, placeholder, type = "text", mask) {
    const InputComponent = mask ? InputMask : 'input';
    const inputProps = mask ? { mask } : {};

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label}</label>
            <InputComponent
                type={type}
                className={`form-control ${styles.input}`}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...inputProps}
            />
        </div>
    );
}

export default UpdateMeuPerfil;
