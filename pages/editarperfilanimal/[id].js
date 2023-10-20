import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../src/components/FormularioAgendarRetorno/formularioagendarretorno.module.css"
///import {Header03} from "../../src/components/Header/header";
import Footer from "../../src/components/Footer/Footer";
import EditarPerfil from "../../src/components/FormularioEditarPerfil/formularioeditarperfil"
import Calendario from "../../src/components/Calendario/calendario"

function PageEditarPerfil(){
    return(
        <div>
            {/* <Header03/> */}
            <div>
                <h1 className={styles.titulocadastro}>Editar Perfil</h1>
            </div>
        <EditarPerfil/>
        <Footer/>
        </div>
    )
}

export default PageEditarPerfil;