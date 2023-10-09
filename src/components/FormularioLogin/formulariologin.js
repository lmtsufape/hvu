import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./login.module.css"

function FormularioLogin() {

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
            <button type="button" className="btn btn-link">Esqueceu a senha?</button>
        </form>

        <div className={styles.button_box}>
            <button type="submit" className="btn btn-primary" id={styles.entrar_button}>Entrar</button>
            <div className={styles.criar_button_box}>
                <h6>Não possui conta? </h6>
                <button type="button" className="btn btn-link">Crie agora</button>
            </div>
        </div>

        </>       
    );
}

export default FormularioLogin
