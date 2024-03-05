import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { CancelarWhiteButton } from "../WhiteButton";
import { updateTutor, getTutorById } from "../../../services/tutorService";

function UpdateTutor() {
    const router = useRouter();
    const { id } = router.query;

    const [tutor, setTutor] = useState({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        rg: "",
        telefone: "",
        confirmarSenha: "",
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
                    const TutorData = await getTutorById(id);
                    setTutor(TutorData);

                    console.log("TutorData:", TutorData)
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
    console.log("tutor:", tutor);

    const handleTutorUpdate = async () => {
    
        const TutorToUpdate = {
            nome: tutor.nome,
            email: tutor.email,
            senha: tutor.senha,
            cpf: tutor.cpf,
            rg: tutor.rg,
            telefone: tutor.telefone,
            endereco: {
                cep: tutor.endereco.cep,
                rua: tutor.endereco.rua,
                estado: tutor.endereco.estado,
                cidade: tutor.endereco.cidade,
                numero: tutor.endereco.numero,
                bairro: tutor.endereco.bairro
            }
        };
    
        try {
            const response = await updateTutor(tutor.id, TutorToUpdate);
            if (response.status === 200) {
                console.log("TutorToUpdate:",TutorToUpdate);
                alert("Informações editadas com sucesso!");
                router.push("/meuPerfil");
            } else {
                console.log("TutorToUpdate:",TutorToUpdate);
                console.error("Erro ao editar tutor:", response.data);
                alert("Erro ao editar tutor. Por favor, tente novamente.");
            }
        } catch (error) {
            console.log("TutorToUpdate:",TutorToUpdate);
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
                        <div className={styles.titulo}>Tutor</div>
                        {renderTutorInput("Nome Completo", tutor.nome, "nome", tutor.nome, handleTutorChange, "text")}
                        <div className="row">
                            <div className="col">
                                {renderTutorInput("E-mail", tutor.email, "email", tutor.email, handleTutorChange, "email")}
                                {renderTutorInput("CPF", tutor.cpf, "cpf", tutor.cpf, handleTutorChange, "text", "999.999.999-99")}
                                {renderTutorInput("Crie uma senha", tutor.senha, "senha", tutor.senha, handleTutorChange, "password")}
                            </div>
                            <div className="col">
                                {renderTutorInput("Telefone", tutor.telefone, "telefone", tutor.telefone, handleTutorChange, "tel", "(99) 99999-9999")}
                                {renderTutorInput("RG", tutor.rg, "rg", tutor.rg, handleTutorChange, "text", "99.999.999-9")}
                                {renderTutorInput("Confirmar senha", tutor.confirmarSenha, "confirmarSenha", tutor.confirmarSenha, handleTutorChange, "password")}
                            </div>
                        </div>
                    </div>
                </div>

                {tutor.endereco && (
                    <div className={styles.boxcadastro}>
                        <div className={styles.titulo}>Endereço</div>
                        {renderEnderecoInput("Rua", "rua", tutor.endereco.rua, handleTutorChange, tutor.endereco.rua,)}
                        {renderEnderecoInput("Bairro", "bairro", tutor.endereco.bairro, handleTutorChange, tutor.endereco.bairro,)}
                        <div className="mb-3">
                            <div className="row">
                            <div className="col">
                                {renderEnderecoInput("Número", "numero", tutor.endereco.numero, handleTutorChange, tutor.endereco.numero,)}
                                {renderEnderecoInput("CEP", "cep", tutor.endereco.cep, handleTutorChange, tutor.endereco.cep, "text", "99999-999")}
                            </div>
                            <div className="col">
                                {renderEnderecoInput("Estado", "estado", tutor.endereco.estado, handleTutorChange, tutor.endereco.estado)}
                                {renderEnderecoInput("Cidade", "cidade", tutor.endereco.cidade, handleTutorChange, tutor.endereco.cidade)}
                            </div>
                            </div>
                        </div>
                    </div>                
                )}

                <div className={styles.button_box}>
                    < CancelarWhiteButton />
                    <button type="button" className={styles.criar_button} onClick={handleTutorUpdate}>
                        Editar
                    </button>
                </div>

            </form>
        </div>
    );
}

function renderTutorInput(label, placeholder, name, value, onChange, type = "text", mask = null) {
    const InputComponent = mask ? InputMask : 'input';

    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
            <InputComponent
                mask={mask}
                type={type}
                className="form-control"
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

function renderEnderecoInput(label, name, value, onChange, placeholder, type = "text", mask) {
    const InputComponent = mask ? InputMask : 'input';
    const inputProps = mask ? { mask } : {};
  
    return (
      <div className="mb-3">
        <label htmlFor={name} className="form-label">{label} <span className={styles.obrigatorio}>*</span></label>
        <InputComponent
          type={type}
          className="form-control"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
      </div>
    );
  }

export default UpdateTutor;
