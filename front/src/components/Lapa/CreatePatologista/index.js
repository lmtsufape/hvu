/* import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { createMedico } from "../../../../services/lapa/patologistaService";
import CreateEnderecoForm  from "./CreateEnderecoForm";
import CreatePatologistaForm from "./CreatePatologistaForm";
import styles from "./index.module.css";


function CreatePatologistaCadastroForm() {

    const router = useRouter();

    const [errors, setErrors] = useState({});

    const [patologistaFormData, setPatologistaFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        crmv: "",
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
        ...patologistaFormData,
        endereco: {...enderecoFormData}
    }

    function handlePatologistaChange(event) {

        const { name, value } = event.target;
        setPatologistaFormData({ ...patologistaFormData, [name]: value });
    }

    function handleEnderecoChange(event) {
        const { name, value } = event.target;
        setEnderecoFormData({...enderecoFormData, [name]: value})
    }

    const validateForm = () => {
        const newErrors = {};
        if (!patologistaFormData.nome) {
            newErrors.nome = "Nome é obrigatório";
        }
        if (!patologistaFormData.email) {
            newErrors.email = "E-mail é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(patologistaFormData.email)) {
            newErrors.email = "E-mail inválido";
        }
        if (!patologistaFormData.senha) {
            newErrors.senha = "Senha é obrigatória";
        }
        if (!patologistaFormData.cpf) {
            newErrors.cpf = "CPF é obrigatório";
        } else if (!/^\d{11}$/.test(patologistaFormData.cpf)) {
            newErrors.cpf = "CPF inválido";
        }
        if (!patologistaFormData.crmv) {
            newErrors.crmv = "CRMV é obrigatório";
        } else if (!/^\d{7}$/.test(patologistaFormData.crmv)) {
            newErrors.crmv = "CRMV inválido";
        }
        if (!patologistaFormData.telefone) {
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
                const response = await createMedico(formData);
                console.log(response);
                router.push('/getAllAnimalTutor');
            } catch (error) {
                console.error("Erro ao cadastrar Patologista:", error);
            }
        } else {
            console.log("Formulário inválido. Corrija os erros.");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Cadastro do Patologista</h1>
            <form>
                <div className={styles.form_box}>
                    <div>
                        <CreatePatologistaForm
                            patologistaFormData={patologistaFormData}
                            handlePatologistaChange={handlePatologistaChange}
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
export default CreatePatologistaCadastroForm;

*/