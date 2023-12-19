import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import qs from 'qs';
import axios from "axios";
import { headers } from "../../../next.config";
import {getAllUsuarios} from "../../../services/userService";

function FormularioLogin() {

    const login = async (e) => {
        e.preventDefault();
        try{
        const response = await getAllUsuarios();
        console.log(response);
      }catch(error){
        console.log(error);
      }
    }

    const usuario = async (e) => {
        e.preventDefault();
       
        const options = {
            method: 'POST',
            url: 'http://localhost:8080/realms/lmts/protocol/openid-connect/token',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              username: 'admin@admin.com',
              password: 'admin',
              client_id: 'app_lmts',
              grant_type: 'password',
              client_secret: '8S5xt4pa7tG4ynmnMX44mE063dKF890V'
            }
          };
          
          axios.request(options).then(function (response) {
            const token = response.data.access_token;
            const refresh_token = response.data.refresh_token;
            console.log(response.data);
            localStorage.setItem('token', token);
            localStorage.setItem('refresh_token', refresh_token);
            console.log(token);
            console.log(refresh_token);
          }).catch(function (error) {
            console.error(error);
            
          });    
    }

    return (
        <>
        <form className={styles.form} >
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
                />
            </div>
            <button type="button" className="btn btn-link">Esqueceu a senha? </button>
        </form>

        <div className={styles.button_box}>
            <button onClick={ (e) => login(e)}  type="submit" className="btn btn-primary" id={styles.entrar_button}>Entrar</button>
            <div className={styles.criar_button_box}>
                <h6>Não possui conta? </h6>
                <button type="button" onClick={ (e) => usuario(e)} className="btn btn-link">Crie agora</button>
            </div>
        </div>

        </>       
    );
}

export default FormularioLogin
