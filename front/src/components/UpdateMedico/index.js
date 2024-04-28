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
import Alert from "../Alert";
import ErrorAlert from "../ErrorAlert";

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
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

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
        if (!medico.nome) {
            newErrors.nome = "Campo obrigatório";
        }
        if (!medico.email) {
            newErrors.email = "Campo obrigatório"; 
        }
        if (!medico.cpf) {
            newErrors.cpf = "Campo obrigatório"; 
        }
        if (!medico.telefone) {
            newErrors.telefone = "Campo obrigatório"; 
        }
        if (!medico.crmv) {
            newErrors.crmv = "Campo obrigatório"; 
        }
        if (selectedEspecialidades.length === 0) {
            newErrors.especialidade = "Selecione pelo menos uma especialidade."; 
        }
        if (!medico.endereco.cep) {
            newErrors.cep = "Campo obrigatório"; 
        }
        if (!medico.endereco.rua) {
            newErrors.rua = "Campo obrigatório"; 
        }
        if (!medico.endereco.estado) {
            newErrors.estado = "Campo obrigatório"; 
        }
        if (!medico.endereco.cidade) {
            newErrors.cidade = "Campo obrigatório"; 
        }
        if (!medico.endereco.numero) {
            newErrors.numero = "Campo obrigatório"; 
        }
        if (!medico.endereco.bairro) {
            newErrors.bairro = "Campo obrigatório"; 
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

        console.log("MedicoToUpdate:", MedicoToUpdate);

        try {
            await updateMedico(id, MedicoToUpdate);
            setShowAlert(true); 
        } catch (error) {
            console.error("Erro ao editar medico:", error);
            console.log("Erro ao editar informações. Por favor, tente novamente.");
            setShowErrorAlert(true);   
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações do&#40;a&#41; veterinário&#40;a&#41;</h1>

            <form className={styles.inputs_container}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Veterinário&#40;a&#41;</div>
                        {renderMedicoInput("Nome Completo", medico.nome, "nome", medico.nome, handleMedicoChange, "text", errors.nome)}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderMedicoInput("E-mail", medico.email, "email", medico.email, handleMedicoChange, "email", errors.email)}
                                {renderMedicoInput("CPF", medico.cpf, "cpf", medico.cpf, handleMedicoChange, "text", errors.cpf, null, "999.999.999-99")}

                                <div className="mb-3">
                                    <label htmlFor="especialidade" className="form-label">Especialidade</label>
                                    <select
                                        className={`form-select ${styles.input} ${errors.especialidade ? "is-invalid" : ""}`}
                                        name="especialidade"
                                        aria-label="Selecione uma especialidade"
                                        value={selectedEspecialidade.length > 0 ? selectedEspecialidade[0] : ""}
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
                                                className={`form-check-input ${styles.checkbox} ${errors.especialidade ? "is-invalid" : ""}`}
                                                checked
                                                onChange={() => handleEspecialidadeSelection({ target: { value: especialidade.id } })}
                                            />
                                            <label className={styles.input}>{especialidade.nome}</label>
                                            {errors.especialidade && <div className={`invalid-feedback ${styles.error_message}`}>{errors.especialidade}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderMedicoInput("Telefone", medico.telefone, "telefone", medico.telefone, handleMedicoChange, "tel", errors.telefone, null, "(99) 99999-9999")}
                                {renderMedicoInput("CRMV", medico.crmv, "crmv", medico.crmv, handleMedicoChange, "text", errors.crmv)}
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
                                    {renderEnderecoInput("CEP", "cep", medico.endereco.cep, handleCepChange, errors.cep, medico.endereco.cep, "text", "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", medico.endereco.rua, handleEnderecoChange, errors.rua, medico.endereco.rua)}
                                    {renderEnderecoInput("Cidade", "cidade", medico.endereco.cidade, handleEnderecoChange, errors.cidade, medico.endereco.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", medico.endereco.numero, handleEnderecoChange, errors.numero, medico.endereco.numero)}
                                    {renderEnderecoInput("Bairro", "bairro", medico.endereco.bairro, handleEnderecoChange, errors.bairro, medico.endereco.bairro)}
                                    {renderEnderecoInput("Estado", "estado", medico.endereco.estado, handleEnderecoChange, errors.estado, medico.endereco.estado)}
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
            {<Alert message="Informações do(a) veterinário(a) editadas com sucesso!" show={showAlert} url={`/getMedicoById/${id}`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações do(a) veterinário(a), tente novamente." show={showErrorAlert} />}
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
                value={value || ''}
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
                value={value || ''}
                onChange={onChange}
                {...inputProps}
            />
            {errorMessage && <div className={`invalid-feedback ${styles.error_message}`}>{errorMessage}</div>}
        </div>
    );
}

export default UpdateMedico;
