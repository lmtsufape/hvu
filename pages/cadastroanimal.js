import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import styles from "../src/app/components/formulariocadastrotutor.module.css"
import Header from "../src/app/header";
import Footer from "../src/app/components/Footer";
import FormularioCadastroAnimal from "@/app/components/formulariocadastroanimal";


function PageCadastroAnimal(){
    return(
        <div>
            <Header/>
        <div>
            <h1 className={styles.titulocadastro}>Cadastro</h1>
        </div>
        <div>
            <ul className={styles.barradeprogresso}>
                <h1 className={`${styles.textobarradeprogresso} ${styles.corverdedabarra}`}>1.Dados do tutor</h1>
                <h1 className={`${styles.textobarradeprogresso} ${styles.textodocentro} ${styles.corverdedabarra}`}>2.Endereço</h1>
                <h1 className={styles.textobarradeprogresso}>3.Dados do animal</h1>
            </ul>
        </div>
        <FormularioCadastroAnimal/>
        <Footer/>
        </div>
    )
}

export default PageCadastroAnimal