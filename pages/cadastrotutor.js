import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import styles from "../src/app/components/formulariocadastrotutor.module.css"
import Header from "../src/app/header";
import Footer from "../src/app/components/Footer";
import FormularioCadastroTutor from "@/app/components/formulariocadastrotutor";


function pagecadastrotutor(){
    return(
        <div>
            <Header/>
        <div>
            <h1 className={styles.titulocadastro}>Cadastro</h1>
        </div>
        <div>
            <ul className={styles.barradeprogresso}>
                <h1 className={`${styles.textobarradeprogresso} ${styles.corverdedabarra}`}>1.Dados do tutor</h1>
                <h1 className={`${styles.textobarradeprogresso} ${styles.textodocentro}`}>2.Endereço</h1>
                <h1 className={styles.textobarradeprogresso}>3.Dados do animal</h1>
            </ul>
        </div>
        <FormularioCadastroTutor/>
        <Footer/>
        </div>
    )
}

export default pagecadastrotutor