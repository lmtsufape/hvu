import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { createTutor } from "../../../services/tutorService";
import CreateEnderecoForm from "./createEnderecoForm";
import CreateTutorForm from "./createTutorForm";
import styles from "./index.module.css";

function CreateTutorEnderecoForm() {
    const router = useRouter();

    const [errors, setErrors] = useState({});

    const [tutorFormData, setTutorFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        telefone: ""
    });

    const [ enderecoFormData, setEnderecoFormData ] = useState({
        cep: "",
        rua: "",
        municipio: "",
        cidade: "",
        numero: "",
        bairro: ""
        }
    )

    const formData = {
        ...tutorFormData,
        endereco: {...enderecoFormData}
    }

    function handleTutorChange(event) {
        const { name, value } = event.target;
        setTutorFormData({ ...tutorFormData, [name]: value });
    }

    function handleEnderecoChange(event) {
        const { name, value } = event.target;
        setEnderecoFormData({...enderecoFormData, [name]: value})
    }

    const validateForm = () => {
        const newErrors = {};

        // Validação para o campo "nome"
        if (!tutorFormData.nome) {
            newErrors.nome = "Nome é obrigatório";
        }

        // Validação para o campo "email"
        if (!tutorFormData.email) {
            newErrors.email = "E-mail é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(tutorFormData.email)) {
            newErrors.email = "E-mail inválido";
        }

        // Validação para o campo "senha"
        if (!tutorFormData.senha) {
            newErrors.senha = "Senha é obrigatória";
        }

        // Validação para o campo "cpf"
        if (!tutorFormData.cpf) {
            newErrors.cpf = "CPF é obrigatório";
        } else if (!/^\d{11}$/.test(tutorFormData.cpf)) {
            newErrors.cpf = "CPF inválido";
        }

        // Validação para o campo "rg"
        if (!tutorFormData.rg) {
            newErrors.rg = "RG é obrigatório";
        } else if (!/^\d{7}$/.test(tutorFormData.rg)) {
            newErrors.rg = "RG inválido";
        }

        // Validação para o campo "telefone"
        if (!tutorFormData.telefone) {
            newErrors.telefone = "Telefone é obrigatório";
        }        

        // Validação para o campo "rua"
        if (!enderecoFormData.rua) {
            newErrors.rua = "Rua é obrigatório";
        }

        // Validação para o campo "bairro"
        if (!enderecoFormData.bairro) {
            newErrors.bairro = "Bairro é obrigatório";
        }

        // Validação para o campo "numero"
        if (!enderecoFormData.numero) {
            newErrors.numero = "Número é obrigatório";
        }

        // Validação para o campo "cep"
        if (!enderecoFormData.cep) {
            newErrors.cep = "CEP é obrigatório";
        } else if (!/^\d{8}$/.test(enderecoFormData.cep)) {
            newErrors.cep = "CEP inválido";
        }

        // Validação para o campo "estado"
        if (!enderecoFormData.municipio) {
            newErrors.municipio = "Estado é obrigatório";
        }

        // Validação para o campo "cidade"
        if (!enderecoFormData.cidade) {
            newErrors.cidade = "Cidade é obrigatório";
        }

        // Atualiza o estado de erros
        setErrors(newErrors);

        // Retorna verdadeiro se não houver erros
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Adicione esta linha

        // Verifica se o formulário é válido antes de prosseguir
        if (validateForm()) {
            try {
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
            <form>
                <div className={styles.box}>
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
