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
        <FormularioCadastroTutor/>
        <Footer/>
        </div>
    )
}

export default pagecadastrotutor