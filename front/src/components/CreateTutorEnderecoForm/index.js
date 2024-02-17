import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { createTutor } from "../../../services/tutorService";
import CreateEnderecoForm from "./createEnderecoForm";
import CreateTutorForm from "./createTutorForm";
import styles from "./index.module.css";
import { postRegister } from "../../../common/postRegister";
import { postLogin } from "../../../common/postLogin";
import VoltarButton from "../VoltarButton";

function CreateTutorEnderecoForm() {
    const router = useRouter();

    const [errors, setErrors] = useState({});

    const [tutorFormData, setTutorFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        telefone: "",
        confirmarSenha: ""
    });

    const [ enderecoFormData, setEnderecoFormData ] = useState({
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
        rg: tutorFormData.rg,
        telefone: tutorFormData.telefone,
        endereco: {...enderecoFormData}
    }

    function handleTutorChange(event) {
        const { name, value } = event.target;
        setTutorFormData({ ...tutorFormData, [name]: value });
        localStorage.setItem(name, value); 
    }
    
    function handleEnderecoChange(event) {
        const { name, value } = event.target;
        setEnderecoFormData({ ...enderecoFormData, [name]: value });
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
        if (!tutorFormData.rg) {
            newErrors.rg = "RG é obrigatório";
        } else if (!/^\d{2}\.\d{3}\.\d{3}-\d{1}$/.test(tutorFormData.rg)) {
            newErrors.rg = "RG inválido";
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
                const responseRegister = await postRegister( tutorFormData.email,tutorFormData.nome,tutorFormData.senha, "tutor");
                console.log(responseRegister);
                await postLogin(tutorFormData.email,tutorFormData.senha);
                const response = await createTutor(formData);
                console.log(response);
                router.push('/getAllAnimalTutor');
            } catch (error) {
                console.error("Erro ao cadastrar tutor:", error);
            }
        } else {
            console.log("Formulário inválido. Corrija os erros.");
        }
    };

    return (
        <div className={styles.container}>
            < VoltarButton />
            <h1>Cadastro</h1>
            <form>
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
                        />
                    </div>
                    <div className={styles.box_button}>
                        <button type="submit" className={styles.button} onClick={handleSubmit}>
                            Cadastrar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateTutorEnderecoForm;