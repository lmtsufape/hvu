import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../src/components/CreateTutorEnderecoForm/index.module.css";
import {Header04} from "../src/components/Header/header";
import Footer from "../src/components/Footer/Footer";
import CreateTutorEnderecoForm from "../src/components/CreateTutorEnderecoForm";


function PageCadastroTutor(){
    return(
        <div>
            <Header04/>
        <div>
            <ul className={styles.barradeprogresso}>
                <h1 className={`${styles.textobarradeprogresso} ${styles.corverdedabarra}`}>1.Dados do tutor</h1>
                <h1 className={styles.textobarradeprogresso}>2.Dados do animal</h1>
            </ul>
        </div>
        <CreateTutorEnderecoForm/>
        <Footer/>
        </div>
    )
}

export default PageCadastroTutor;
