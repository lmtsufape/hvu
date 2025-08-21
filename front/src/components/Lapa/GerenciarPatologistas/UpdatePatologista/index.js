import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { CancelarWhiteButton } from "../../../WhiteButton";
import { updatePatologista, getPatologistaById } from "../../../../../services/patologistaService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import EspecialidadeList from "@/hooks/useEspecialidadeList";
import Alert from "../../../Alert";
import ErrorAlert from "../../../ErrorAlert";

function UpdatePatologista() {
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
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true); 

    const [patologista, setPatologista] = useState({
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
                    const patologistaData = await getPatologistaById(id);
                    setPatologista(patologistaData);
                    setSelectedEspecialidades(patologistaData.especialidade);
                } catch (error) {
                    console.error('Erro ao buscar informações do(a) patologista:', error);
                } finally {
                    setLoading(false); 
                }
            };
            fetchData();
        }
    }, [id]);

    const handleEspecialidadeSelection = (event) => {
        const especialidadeId = parseInt(event.target.value);
        const especialidadeSelected = especialidades.find(espec => espec.id === especialidadeId);
    
        if (!selectedEspecialidades.some(espec => espec.id === especialidadeId)) {
            setSelectedEspecialidades(prevSelected => [...prevSelected, especialidadeSelected]);
        } else {
            setSelectedEspecialidades(prevSelected => prevSelected.filter(espec => espec.id !== especialidadeId));
        }
    };

    useEffect(() => {
        if (selectedEspecialidade.length > 0) {
            const selectedEspecialidadesData = especialidades.filter(especialidade => selectedEspecialidade.includes(especialidade.id));
            setSelectedEspecialidades(selectedEspecialidadesData);
        }
    }, [selectedEspecialidade, especialidades]);

    console.log("Especialidades:", selectedEspecialidades);


    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }


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

    const fetchCepData = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setPatologista({
                    ...patologista,
                    endereco: {
                        ...patologista.endereco,
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
        setPatologista({
            ...patologista,
            endereco: {
                ...patologista.endereco,
                cep: value
            }
        });
        fetchCepData(value);
    };

    const validateForm = () => {
        const newErrors = {};
        if (alterarSenha) {
            if (!patologista.senha) {
                newErrors.senha = "Senha é obrigatória";
            }
            if (!patologista.confirmarSenha) {
                newErrors.confirmarSenha = "Confirme sua senha";
            } else if (patologista.senha !== patologista.confirmarSenha) {
                newErrors.confirmarSenha = "As senhas não coincidem";
            }
        }
        if (!patologista.nome) {
            newErrors.nome = "Campo obrigatório";
        }
        if (!patologista.email) {
            newErrors.email = "Campo obrigatório"; 
        }
        if (!/\S+@\S+\.\S+/.test(patologista.email)) {
            newErrors.email = "E-mail inválido";
        }
        if (!patologista.cpf) {
            newErrors.cpf = "Campo obrigatório"; 
        }
        if (!patologista.telefone) {
            newErrors.telefone = "Campo obrigatório"; 
        }
        if (!patologista.crmv) {
            newErrors.crmv = "Campo obrigatório"; 
        }
        if (selectedEspecialidades.length === 0) {
            newErrors.especialidade = "Selecione pelo menos uma especialidade."; 
        }
        if (!patologista.endereco.cep) {
            newErrors.cep = "Campo obrigatório"; 
        }
        if (!patologista.endereco.rua) {
            newErrors.rua = "Campo obrigatório"; 
        }
        if (!patologista.endereco.estado) {
            newErrors.estado = "Campo obrigatório"; 
        }
        if (!patologista.endereco.cidade) {
            newErrors.cidade = "Campo obrigatório"; 
        }
        if (!patologista.endereco.numero) {
            newErrors.numero = "Campo obrigatório"; 
        }
        if (!patologista.endereco.bairro) {
            newErrors.bairro = "Campo obrigatório"; 
        }
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };

    const handlePatologistaUpdate = async () => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        const patologistaToUpdate = {
            nome: patologista.nome,
            email: patologista.email,
            senha: patologista.senha,
            cpf: patologista.cpf,
            crmv: patologista.crmv,
            telefone: patologista.telefone,
            especialidade: selectedEspecialidades,
            endereco: {
                cep: patologista.endereco.cep,
                rua: patologista.endereco.rua,
                estado: patologista.endereco.estado,
                cidade: patologista.endereco.cidade,
                numero: patologista.endereco.numero,
                bairro: patologista.endereco.bairro
            }
        };

        console.log("patologistaToUpdate:", patologistaToUpdate);

        try {
            await updatePatologista(id, patologistaToUpdate);
            setShowAlert(true); 
        } catch (error) {
            console.error("Erro ao editar patologista:", error);
            console.log("Erro ao editar informações. Por favor, tente novamente.");
            setShowErrorAlert(true);   
        }
    };

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Editar informações de Patologista</h1>

            <form className={styles.inputs_container} onSubmit={handlePatologistaUpdate}>

                <div className={styles.boxcadastro}>
                    <div className={styles.cadastrotutor}>
                        <div className={styles.titulo}>Patologista</div>
                        {renderPatologistaInput("Nome Completo", patologista.nome, "nome", patologista.nome, handlePatologistaChange, "text", errors.nome)}
                        <div className="row">
                            <div className={`col ${styles.col}`}>
                                {renderPatologistaInput("E-mail", patologista.email, "email", patologista.email, handlePatologistaChange, "email", errors.email)}
                                {renderPatologistaInput("CPF", patologista.cpf, "cpf", patologista.cpf, handlePatologistaChange, "text", errors.cpf, null, "999.999.999-99")}

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
                                {renderPatologistaInput("Telefone", patologista.telefone, "telefone", patologista.telefone, handlePatologistaChange, "tel", errors.telefone, null, "(99) 99999-9999")}
                                {renderPatologistaInput("CRMV", patologista.crmv, "crmv", patologista.crmv, handlePatologistaChange, "text", errors.crmv)}
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
                                {renderPatologistaInput("Alterar senha", "Digite sua nova senha", "senha", patologista.senha, handlePatologistaChange, "password", errors.senha, null, showSenha, setShowSenha)}
                            </div>
                            <div className={`col ${styles.col}`}>
                                {renderPatologistaInput("Confirmar senha", "Confirme sua nova senha", "confirmarSenha", patologista.confirmarSenha, handlePatologistaChange, "password", errors.confirmarSenha, null, showConfirmarSenha, setShowConfirmarSenha)}
                            </div>
                        </div>
                    )}
                </div>

                {patologista.endereco && (
                    <div className={styles.boxcadastro}>
                        <div className={styles.titulo}>Endereço</div>
                        <div className="mb-3">
                            <div className="row">
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("CEP", "cep", patologista.endereco.cep, handleCepChange, errors.cep, patologista.endereco.cep, "text", "99999-999")}
                                    {renderEnderecoInput("Rua", "rua", patologista.endereco.rua, handleEnderecoChange, errors.rua, patologista.endereco.rua)}
                                    {renderEnderecoInput("Cidade", "cidade", patologista.endereco.cidade, handleEnderecoChange, errors.cidade, patologista.endereco.cidade)}
                                </div>
                                <div className={`col ${styles.col}`}>
                                    {renderEnderecoInput("Número", "numero", patologista.endereco.numero, handleEnderecoChange, errors.numero, patologista.endereco.numero)}
                                    {renderEnderecoInput("Bairro", "bairro", patologista.endereco.bairro, handleEnderecoChange, errors.bairro, patologista.endereco.bairro)}
                                    {renderEnderecoInput("Estado", "estado", patologista.endereco.estado, handleEnderecoChange, errors.estado, patologista.endereco.estado)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.button_box}>
                    <CancelarWhiteButton />
                    <button type="submit" className={styles.criar_button} onClick={handlePatologistaUpdate}>
                        Salvar
                    </button>
                </div>

            </form>
            {<Alert message="Informações do(a) patologista editadas com sucesso!" show={showAlert} url={`/lapa/gerenciarPatologistas/getPatologistaById/${id}`} />}
            {showErrorAlert && <ErrorAlert message="Erro ao editar informações do(a) patologista, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

function renderPatologistaInput(label, placeholder, name, value, onChange, type = "text", errorMessage = null, mask = null, show = false, setShow = null) {
    const InputComponent = mask ? InputMask : 'input';

    const toggleShow = (event) => {
        event.preventDefault(); 
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

export default UpdatePatologista;
