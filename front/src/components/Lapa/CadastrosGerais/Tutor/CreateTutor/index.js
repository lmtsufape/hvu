import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { createTutor } from "../../../../../../services/tutorService";
import CreateEnderecoForm from "./createEnderecoForm";
import CreateTutorForm from "./createTutorForm";
import styles from "./index.module.css";
import { postRegister } from "../../../../../../common/postRegister";
import { postLogin } from "../../../../../../common/postLogin";
import VoltarButton from "@/components/VoltarButton";
import { CancelarWhiteButton } from "@/components/WhiteButton";
import Alert from "@/components/Alert";
import ErrorAlert from "@/components/ErrorAlert";

function CreateTutorEnderecoFormLapa() {
    const router = useRouter();
    const [laiChecked, setLaiChecked] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [tutorFormData, setTutorFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        telefone: "",
        confirmarSenha: ""
    });

    const [enderecoFormData, setEnderecoFormData] = useState({
        cep: "",
        rua: "",
        estado: "",
        cidade: "",
        numero: "",
        bairro: ""
    }
    );

    const formData = {
        nome: tutorFormData.nome,
        email: tutorFormData.email,
        senha: tutorFormData.senha,
        cpf: tutorFormData.cpf,
        telefone: tutorFormData.telefone,
        endereco: { ...enderecoFormData }
    }

    const handleCheckboxChange = (event) => {
        setLaiChecked(event.target.checked);
    };

    function handleTutorChange(event) {
        const { name, value } = event.target;
        setTutorFormData({ ...tutorFormData, [name]: value });
        localStorage.setItem(name, value);
    }

    function handleEnderecoChange(event) {
        const { name, value } = event.target;
        setEnderecoFormData(prevData => ({ ...prevData, [name]: value }));
        localStorage.setItem(name, value);
    }

    const validateForm = () => {
        const newErrors = {};
        if (!tutorFormData.nome) {
            newErrors.nome = "Nome é obrigatório";
        } else if (tutorFormData.nome.trim().split(' ').length < 2) {
            newErrors.nome = "Digite seu nome completo";
        }
        if (!tutorFormData.email) {
            newErrors.email = "E-mail é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(tutorFormData.email)) {
            newErrors.email = "E-mail inválido";
        }
        if (!tutorFormData.senha) {
            newErrors.senha = "Senha é obrigatória";
        }
        if (!tutorFormData.confirmarSenha) {
            newErrors.confirmarSenha = "Confirme sua senha";
        } else if (tutorFormData.senha !== tutorFormData.confirmarSenha) {
            newErrors.confirmarSenha = "As senhas não coincidem";
        }
        if (!tutorFormData.cpf) {
            newErrors.cpf = "CPF é obrigatório";
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(tutorFormData.cpf)) {
            newErrors.cpf = "CPF inválido";
        }
        if (!tutorFormData.telefone) {
            newErrors.telefone = "Telefone é obrigatório";
        }
        if (!enderecoFormData.rua) {
            newErrors.rua = "Rua é obrigatório";
        }
        if (!enderecoFormData.bairro) {
            newErrors.bairro = "Bairro é obrigatório";
        }
        if (!enderecoFormData.numero) {
            newErrors.numero = "Número é obrigatório";
        }
        if (!enderecoFormData.cep) {
            newErrors.cep = "CEP é obrigatório";
        } else if (!/^\d{5}-?\d{3}$/.test(enderecoFormData.cep)) {
            newErrors.cep = "CEP inválido";
        }
        if (!enderecoFormData.estado) {
            newErrors.estado = "Estado é obrigatório";
        }
        if (!enderecoFormData.cidade) {
            newErrors.cidade = "Cidade é obrigatório";
        }
        if (!laiChecked) {
            newErrors.lai = "É necessário concordar com o termo acima!";
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        // Carrega os dados do localStorage quando o componente é montado
        const storedTutorFormData = {};
        const storedEnderecoFormData = {};

        Object.keys(tutorFormData).forEach((key) => {
            const storedValue = localStorage.getItem(key);
            if (storedValue) {
                storedTutorFormData[key] = storedValue;
            }
        });

        Object.keys(enderecoFormData).forEach((key) => {
            const storedValue = localStorage.getItem(key);
            if (storedValue) {
                storedEnderecoFormData[key] = storedValue;
            }
        });

        setTutorFormData((prevData) => ({ ...prevData, ...storedTutorFormData }));
        setEnderecoFormData((prevData) => ({ ...prevData, ...storedEnderecoFormData }));

        // Limpa os dados do localStorage quando o componente é desmontado
        return () => {
            Object.keys(tutorFormData).forEach((key) => localStorage.removeItem(key));
            Object.keys(enderecoFormData).forEach((key) => localStorage.removeItem(key));
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const responseRegister = await postRegister(tutorFormData.email, tutorFormData.nome, tutorFormData.senha, "tutor");
                console.log(responseRegister);
    
                await postLogin(tutorFormData.email, tutorFormData.senha);
                const response = await createTutor(formData);
                console.log(response);
    
                setShowAlert(true);
            } catch (error) {
                console.error("Erro ao cadastrar tutor:", error);
                if (error.response) {
                    // Exibe mensagens de erro específicas do servidor
                    if (error.response.status === 409) {
                        // Exemplo de mensagem de erro para CPF ou e-mail duplicado
                        setShowErrorAlert(true);
                    }
                } else {
                    // Lida com erros não relacionados à resposta do servidor
                    setShowErrorAlert(true);
                }
            }
        } else {
            console.log("Formulário inválido. Corrija os erros.");
        }
    };
    

    return (
        <div className={styles.container}>
            < VoltarButton />
            <h1>Cadastrar tutor&#40;a&#41;</h1>
            <form autoComplete="off">
                <div className={styles.form_box}>
                    <div>
                        <CreateTutorForm
                            tutorFormData={tutorFormData}
                            handleTutorChange={handleTutorChange}
                            errors={errors}
                        />
                    </div>
                    <div>
                        <CreateEnderecoForm
                            enderecoFormData={enderecoFormData}
                            handleEnderecoChange={handleEnderecoChange}
                            errors={errors}
                            laiChecked={laiChecked}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    </div>

                    <div className={styles.box_button}>
                        <CancelarWhiteButton />
                        <button type="button" className={styles.criar_button} onClick={handleSubmit}>
                            Cadastrar
                        </button>
                    </div>
                </div>
            </form>
            {<Alert message="Cadastro realizado com sucesso!" show={showAlert} url='/lapa/mainTutor' />}
            {showErrorAlert && <ErrorAlert message="Erro ao realizar cadastro, tente novamente." show={showErrorAlert} />}
        </div>
    );
}

export default CreateTutorEnderecoFormLapa;