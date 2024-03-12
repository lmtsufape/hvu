import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { postLogin } from "../../../common/postLogin";
import { useState } from "react";


function FormularioLogin() {

  const router = useRouter();

  const [errors, setErrors] = useState({
    login: "",
    senha:""
  });

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

    const logged = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try{
                await postLogin(login, senha);
                router.push('/mainTutor');
            }catch(error){
                console.log(error);
            }  
        } 
    }

    const validateForm = () => {
        const newErrors = {};

        if (!login) {
            newErrors.login = "Email é obrigatório";
        } 
        // else if (login != ){
        //     newErrors.login = "Email inválido. Digite novamente.";
        // }
        if (!senha) {
            newErrors.senha = "Senha é obrigatória";
        } 
        // else if (senha != ) {
        //     newErrors.senha = "Senha incorreta. Digite Novamente.";
        // }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <>
        <div className={styles.form} >
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">E-mail</label>
                <input 
                    type="email" 
                    className={`form-control ${errors.login ? "is-invalid" : ""}`}
                    id="exampleInputEmail1" 
                    aria-describedby="emailHelp" 
                    placeholder="Seu email"
                    name="email"
                    value={login} 
                    onChange={(e) => setLogin( e.target.value)}
                    required 
                />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Senha</label>
                <input 
                    type="password" 
                    className={`form-control ${errors.senha ? "is-invalid" : ""}`}
                    id="exampleInputPassword1" 
                    placeholder="Sua senha" 
                    name="senha"
                    value={senha} 
                    onChange={(e) => setSenha( e.target.value)}
                    errors={errors}
                    required
                />
            </div>
            <button type="button" className="btn btn-link" onClick={(e) => router.push("/forgotPassword")}>Esqueceu a senha? </button>
        </div>

        <div className={styles.button_box}>
            <button onClick={ (e) => logged(e)}  type="submit" className="btn btn-primary" id={styles.entrar_button}>Entrar</button>
            <div className={styles.criar_button_box}>
                <h6>Não possui conta? </h6>
                <button type="button" onClick={(e) => router.push("/createTutor")} className="btn btn-link">Crie agora</button>
            </div>
        </div>
        </>       
    );
}

export default FormularioLogin
