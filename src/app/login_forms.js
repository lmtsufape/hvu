import React from 'react';
import styles from './components/login_forms.module.css'

export function LoginFormulario() {
    return (
        <form className={styles.formulario}>
            <div className={styles.informacoes}>
                <h1>Entrar</h1>
                <label for="exampleInputEmail1">E-mail</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Seu email"/>
                <label for="exampleInputPassword1">Senha</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Senha"/>
            </div>
            <div className={styles.botoes}>

            </div>
        </form>
    );
}