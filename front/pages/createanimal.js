import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../src/components/CreateTutorEnderecoForm/index.module.css";
import {Header04} from "../src/components/Header/header";
import Footer from "../src/components/Footer/Footer";
import CreateAnimalForm from "@/components/CreateAnimalForm";

function PageCadastroAnimal(){
    return(
        <div>
            <Header04/>
        <div>
            <h1 className={styles.titulocadastro}>Cadastro</h1>
        </div>
        <CreateAnimalForm/>
        <Footer/>
        </div>
    )
}

export default PageCadastroAnimal;
