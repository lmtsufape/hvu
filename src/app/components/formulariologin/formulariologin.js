"use client"

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import styles from "./login.module.css"
import axios from "axios";
import { useRouter } from "next/router";

function FormularioLogin() {
    const [login, setLogin] = useState({
        email: "",
        senha: "",
    });

    const router = useRouter();

    function handleInputChange(event){
        const { name, value } = event.target;
        setLogin({...login, [name]: value});
    };

    function handleSubmit(event){
        event.preventDefault();

        axios.post("http://localhost:3000/tutor", login) //substituir o localhost pelo caminho corerto do back 
        //na minha cabeça isso vai pegar o que o usuário digitar e ver se existe algum cadastrato no bd, se não houver cadastro com as mesmas informações, retorna o "erro" 
        //isso eh tratado no back?
        .then(response => {
            console.log(response.data);

            router.push('../pages/agendarconsulta');
        })

        .catch(error => {
            if (error.response) {
                // Erro de resposta do servidor (por exemplo, código de status HTTP não 2xx)
                console.error('Erro na resposta do servidor:', error.response.data);
            } else if (error.request) {
                // Erro de rede (por exemplo, não foi possível fazer a solicitação)
                console.error('Erro de rede:', error.request);
            } else {
                // Erro desconhecido
                console.error('Erro desconhecido:', error.message);
            }
        });
    };

    return (
        <>
        <form className={styles.form}>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">E-mail</label>
                <input 
                    type="email" 
                    className="form-control" 
                    id="exampleInputEmail1" 
                    aria-describedby="emailHelp" 
                    placeholder="Seu email"
                    name="email" 
                    required 
                    value={login.email} 
                    onChange={handleInputChange} 
                />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Senha</label>
                <input 
                    type="password" 
                    className="form-control" 
                    id="exampleInputPassword1" 
                    placeholder="Senha" 
                    name="senha"
                    required
                    value={login.senha} 
                    onChange={handleInputChange} 
                />
            </div>
            <button type="button" className="btn btn-link">Esqueceu a senha?</button>
        </form>

        <div className={styles.button_box}>
            <button type="submit" className="btn btn-primary" id={styles.entrar_button} onClick={handleSubmit}>Entrar</button>
            <div className={styles.criar_button_box}>
                <h6>Não possui conta? </h6>
                <button type="button" className="btn btn-link">Crie agora</button>
            </div>
        </div>

        </>       
    );
}

export default FormularioLogin
