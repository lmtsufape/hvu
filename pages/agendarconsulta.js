import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../src/app/components/formulariocadastrotutor.module.css"
import {Header04} from "../src/app/header";
import Footer from "../src/app/components/Footer";
import FormularioAgendarRetorno from "../src/app/components/formularioagendarretorno"
import AgendarRetorno from "../src/app/components/formularioagendarretorno"
import Calendario from "../src/app/components/calendario"

function PageAgendarConsulta(){
    return(
        <div>
            <Header04/>
            <div>
                <h1 className={styles.titulocadastro}>Agendar Retorno</h1>
            </div>
        <AgendarRetorno/>
        <Footer/>
        </div>
    )
}

export default PageAgendarConsulta;