import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../src/components/FormularioAgendarRetorno/formularioagendarretorno.module.css"
import {Header03} from "../../src/components/Header";
import UpdateAnimalForm from "../../src/components/UpdateAnimalTutorForm"
import Footer from "../../src/components/Footer";

function UpdateAnimalPage(){
    return(
        <div>
            <Header03/> 
            <div>
                <h1 className={styles.titulocadastro}>Editar Perfil</h1>
            </div>
            <UpdateAnimalForm/>
            <Footer/>
        </div>
    )
}

export default UpdateAnimalPage;
