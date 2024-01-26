import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { createTutor } from "../../../services/tutorService";
import CreateEnderecoForm from "./createEnderecoForm";
import CreateTutorForm from "./createTutorForm";
import styles from "./index.module.css";
import { postRegister } from "../../../common/postRegister";
import { postLogin } from "../../../common/postLogin";

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
    );

    

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
        if (!tutorFormData.nome) {
            newErrors.nome = "Nome é obrigatório";
        }
        if (!tutorFormData.email) {
            newErrors.email = "E-mail é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(tutorFormData.email)) {
            newErrors.email = "E-mail inválido";
        }
        if (!tutorFormData.senha) {
            newErrors.senha = "Senha é obrigatória";
        }
        if (!tutorFormData.cpf) {
            newErrors.cpf = "CPF é obrigatório";
        } else if (!/^\d{11}$/.test(tutorFormData.cpf)) {
            newErrors.cpf = "CPF inválido";
        }
        if (!tutorFormData.rg) {
            newErrors.rg = "RG é obrigatório";
        } else if (!/^\d{7}$/.test(tutorFormData.rg)) {
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
        } else if (!/^\d{8}$/.test(enderecoFormData.cep)) {
            newErrors.cep = "CEP inválido";
        }
        if (!enderecoFormData.municipio) {
            newErrors.municipio = "Estado é obrigatório";
        }
        if (!enderecoFormData.cidade) {
            newErrors.cidade = "Cidade é obrigatório";
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

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
