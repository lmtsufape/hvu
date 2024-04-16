import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateMedico, getMedicoById } from "../../../services/medicoService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import EspecialidadeList from "@/hooks/useEspecialidadeList";

function UpdateMedico() {
    const router = useRouter();
    const { id } = router.query;
    const [errors, setErrors] = useState({});
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
    const [alterarSenha, setAlterarSenha] = useState(false);
    const [senhaErro, setSenhaErro] = useState("");
    const [confirmarSenhaErro, setConfirmarSenhaErro] = useState("");
    const { especialidades } = EspecialidadeList();
    const [selectedEspecialidade, setSelectedEspecialidade] = useState([]);
    const [selectedEspecialidades, setSelectedEspecialidades] = useState([]);


    const [medico, setMedico] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        crmv: "",
        telefone: "",
        confirmarSenha: "",
        especialidade: [],
        endereco: {
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
                    const MedicoData = await getMedicoById(id);
                    setMedico(MedicoData);
                    setSelectedEspecialidade(MedicoData.especialidade.map(espec => espec.id)); // Mapeia para pegar apenas os IDs
                } catch (error) {
                    console.error('Erro ao buscar informações do(a) veterinário(a):', error);
                }
            };
            fetchData();
        }
    }, [id]);

    const handleEspecialidadeSelection = (event) => {
        const especialidadeId = parseInt(event.target.value);
        if (!selectedEspecialidades.find(espec => espec.id === especialidadeId)) {
            const especialidadeSelected = especialidades.find(espec => espec.id === especialidadeId);
            setSelectedEspecialidades([...selectedEspecialidades, especialidadeSelected]);
        } else {
            setSelectedEspecialidades(selectedEspecialidades.filter(espec => espec.id !== especialidadeId));
        }
    };

    console.log("espec", selectedEspecialidade);

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

    const fetchCepData = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setMedico({
                    ...medico,
                    endereco: {
                        ...medico.endereco,
                        estado: data.uf,
                        cidade: data.localidade,
                        rua: data.logradouro,
                        bairro: data.bairro
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
        setMedico({
            ...medico,
            endereco: {
                ...medico.endereco,
                cep: value
            }
        });
        fetchCepData(value);
    };

    const validateForm = () => {
        const newErrors = {};
        if (alterarSenha) {
            if (!medico.senha) {
                newErrors.senha = "Senha é obrigatória";
            }
            if (!medico.confirmarSenha) {
                newErrors.confirmarSenha = "Confirme sua senha";
            } else if (medico.senha !== medico.confirmarSenha) {
                newErrors.confirmarSenha = "As senhas não coincidem";
            }
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleMedicoUpdate = async () => {
        if (!validateForm()) {
            return;
        }

        const MedicoToUpdate = {
            nome: medico.nome,
            email: medico.email,
            senha: medico.senha,
            cpf: medico.cpf,
            crmv: medico.crmv,
            telefone: medico.telefone,
            especialidade: selectedEspecialidades.map(espec => ({ id: espec.id })),
            endereco: {
                cep: medico.endereco.cep,
                rua: medico.endereco.rua,
                estado: medico.endereco.estado,
                cidade: medico.endereco.cidade,
                numero: medico.endereco.numero,
                bairro: medico.endereco.bairro
            }
        };

        try {
            await updateMedico(medico.id, MedicoToUpdate);
            console.log("MedicoToUpdate:", MedicoToUpdate);
            alert("Informações editadas com sucesso!");
            router.push(`getMedicoById/${medico.id}`);
        } catch (error) {
            console.log("MedicoToUpdate:", MedicoToUpdate);
            console.error("Erro ao editar medico:", error);
            alert("Erro ao editar informações. Por favor, tente novamente.");
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar Perfil</h1>

            <form className={styles.inputs_container}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Veterinário&#40;a&#41;</div>
                        {renderMedicoInput("Nome Completo", medico.nome, "nome", medico.nome, handleMedicoChange, "text")}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderMedicoInput("E-mail", medico.email, "email", medico.email, handleMedicoChange, "email")}
                                {renderMedicoInput("CPF", medico.cpf, "cpf", medico.cpf, handleMedicoChange, "text", null, "999.999.999-99")}

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
                                </div>
                                <div>
                                    {selectedEspecialidades.map(especialidade => (
                                        <div key={especialidade.id}>
                                            <input
                                                type="checkbox"
                                                checked
                                                onChange={() => handleEspecialidadeSelection({ target: { value: especialidade.id } })}
                                            />
                                            <label>{especialidade.nome}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderMedicoInput("Telefone", medico.telefone, "telefone", medico.telefone, handleMedicoChange, "tel", null, "(99) 99999-9999")}
                                {renderMedicoInput("CRMV", medico.crmv, "crmv", medico.crmv, handleMedicoChange, "text")}
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
                                {renderMedicoInput("Alterar senha", "Digite sua nova senha", "senha", medico.senha, handleMedicoChange, "password", errors.senha, null, showSenha, setShowSenha)}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderMedicoInput("Confirmar senha", "Confirme sua nova senha", "confirmarSenha", medico.confirmarSenha, handleMedicoChange, "password", errors.confirmarSenha, null, showConfirmarSenha, setShowConfirmarSenha)}
                            </div>
                        </div>
                    )}
                </div>

                {medico.endereco && (
                    <div className={styles.boxcadastro}>
                        <div className={styles.titulo}>Endereço</div>
                        <div className="mb-3">
                            <div className="row">
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("CEP", "cep", medico.endereco.cep, handleCepChange, medico.endereco.cep, "text", "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", medico.endereco.rua, handleEnderecoChange, medico.endereco.rua)}
                                    {renderEnderecoInput("Cidade", "cidade", medico.endereco.cidade, handleEnderecoChange, medico.endereco.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", medico.endereco.numero, handleEnderecoChange, medico.endereco.numero)}
                                    {renderEnderecoInput("Bairro", "bairro", medico.endereco.bairro, handleEnderecoChange, medico.endereco.bairro)}
                                    {renderEnderecoInput("Estado", "estado", medico.endereco.estado, handleEnderecoChange, medico.endereco.estado)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleMedicoUpdate}>
                        Salvar
                    </button>
                </div>

            </form>
        </div>
    );
}

function renderMedicoInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask = null, show = false, setShow = null) {
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
            {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
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

export default UpdateMedico;
