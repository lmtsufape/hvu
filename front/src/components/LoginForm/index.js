import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { postLogin } from "../../../common/postLogin";
import { useState } from "react";
//icone do olho importacao
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUsuario } from '../../../services/userService';


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
        try {
            const response = await postLogin(login, senha);
         {/*}   if (response.status !== 200) {
                setErrors({senha: "Email ou senha inválidos. Verifique seus dados.", login:"." });
                return;
            } */}
            
            const userData = await getCurrentUsuario();
            if (userData.roles && Array.isArray(userData.roles)) {
                if (userData.roles.includes("secretario")) {
                    router.push('/mainSecretario');
                } else if (userData.roles.includes("medico")) {
                    router.push('/mainMedico');
                } else if (userData.roles.includes("tutor")) {
                    router.push('/mainTutor');
                }
            }
        } catch (error) {
            console.log(error);
      //      setErrors({login: "Erro ao fazer login. Verifique seus dados.", senha });
        }
    }
  }

  //Funcao para validar o formulario de login
  const validateForm = () => {
      const newErrors = {};

      if (!login) {
          newErrors.login = "Email é obrigatório";
      }
      if (!senha) {
          newErrors.senha = "Senha é obrigatória";
      } 

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
  };

    //estado para controlar a visibilidade da senha
    const [showPassword, setShowPassword] = useState(false);

    //função para alternar a visibilidade da senha
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    //retono do componente
    return (
        <>
        <div className={styles.form}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">E-mail<span className={styles.obrigatorio}>*</span></label>
            <input
              type="email"
              className={`form-control ${styles.input} ${errors.login ? "is-invalid" : ""}`}
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Digite seu email"
              name="email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            {errors.login && <div className={`invalid-feedback ${styles.error_message}`}>{errors.login}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Senha<span className={styles.obrigatorio}>*</span></label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${styles.input} ${errors.senha ? "is-invalid" : ""}`}
                id="exampleInputPassword1"
                placeholder="Digite sua senha"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <span className={`input-group-text ${styles.eyeIcon}`} onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              {errors.senha && <div className={`invalid-feedback ${styles.error_message}`}>{errors.senha}</div>}
            </div>
          </div>

          <div className={styles.input}>{errors.login && <div className={`invalid-feedback ${styles.error_message}`}>{errors.login}</div>}</div>
          
          <button type="button" className="btn btn-link" onClick={() => router.push("/forgotPassword")}>Esqueceu a senha? </button>
        </div>    
          <div className={styles.button_box}>
            <button onClick={logged} type="submit" className="btn btn-primary" id={styles.entrar_button}>Entrar</button>
            <div className={styles.criar_button_box}>
              <h6>Não possui conta? </h6>
              <button type="button" onClick={() => router.push("/createTutor")} className="btn btn-link">Crie agora</button>
            </div>
          </div>
        </>
      );
    }
    
    export default FormularioLogin;