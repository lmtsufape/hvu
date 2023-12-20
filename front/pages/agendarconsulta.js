import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../src/components/FormularioAgendarRetorno/formularioagendarretorno.module.css"
import {Header03} from "../src/components/Header";
import Footer from "../src/components/Footer";
import AgendarConsulta from "../src/components/AgendarConsulta/calendarioconsulta"
import Calendario from "../src/components/Calendario/calendario"

function PageAgendarRetorno(){
    return(
        <div>
            <Header03/>
            <div>
                <h1 className={styles.titulocadastro}>Agendar Consulta</h1>
            </div>
            <AgendarConsulta/>
            <Footer/>
        </div>
    )
}

export default PageAgendarRetorno;