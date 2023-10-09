import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../src/components/FormularioAgendarRetorno/formularioagendarretorno.module.css"
import {Header04} from "../src/components/Header/header";
import Footer from "../src/components/Footer/Footer";
import AgendarConsulta from "../src/components/FormularioAgendarRetorno/formularioagendarretorno"
import Calendario from "../src/components/Calendario/calendario"

function PageAgendarConsulta(){
    return(
        <div>
            <Header04/>
            <div>
                <h1 className={styles.titulocadastro}>Agendar Retorno</h1>
            </div>
        <AgendarConsulta/>
        <Footer/>
        </div>
    )
}

export default PageAgendarConsulta;