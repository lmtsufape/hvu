import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image';
import {Header02} from '../src/app/header';
import Text from '../src/app/texto_login_page';
import Footer from "../src/app/components/Footer";
import styles from "../src/app/components/login.module.css"
import {EntrarGreenButton} from '../src/app/green_button'

function pageLogin() {

    useClient();

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {
            login, 
            senha
        }
        console.log(data);
    }


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
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Seu email" required 
                            value={login} onChange={(e) => setLogin(e.target.value)} 
                        />
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Senha</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Senha" required
                            value={senha} onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    <button type="button" class="btn btn-link">Esqueceu a senha?</button>
                </form>

                <div class={styles.button_box}>
                    <button type="button" class="btn btn-primary" id={styles.entrar_button} onSubmit={onSubmit}>Entrar</button>
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
