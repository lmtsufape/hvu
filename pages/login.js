"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image';
import {Header02} from '../src/app/header';
import Text from '../src/app/texto_login_page';
import Footer from "../src/app/components/Footer";
import styles from "../src/app/components/login.module.css"
import {EntrarGreenButton} from '../src/app/green_button'

function pageLogin() {
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
        
        axios.get("http://localhost:3000/tutor", login) //substituir o localhost pelo caminho corerto do back 
        //na minha cabeça isso vai pegar o que o usuário digitar e ver se existe algum cadastrato no bd, se não houver cadastro com as mesmas informações, retorna o "erro" 
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

        <div>
            <Header02 />
        </div>
        <div class={styles.container}>

            <div class={styles.text_box}>
                <Text />
            </div>

            <div class={styles.form_box}>
                <h1>Entrar</h1>

                <form class={styles.form}>
                    <div class="form-group">
                        <label for="exampleInputEmail1">E-mail</label>
                        <input 
                            type="email" 
                            class="form-control" 
                            id="exampleInputEmail1" 
                            aria-describedby="emailHelp" 
                            placeholder="Seu email" 
                            required 
                            value={login.email} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Senha</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="exampleInputPassword1" 
                            placeholder="Senha" 
                            required
                            value={login.senha} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <button type="button" class="btn btn-link">Esqueceu a senha?</button>
                </form>

                <div class={styles.button_box}>
                    <button type="submit" class="btn btn-primary" id={styles.entrar_button}>Entrar</button>
                    <div class={styles.criar_button_box}>
                        <h6>Não possui conta? </h6>
                        <button type="button" class="btn btn-link">Crie agora</button>
                    </div>
                </div>

            </div>
        </div>

        <div>
            <Footer />
        </div>

        </>       
    );
}

export default pageLogin
