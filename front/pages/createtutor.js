import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header04} from "../src/components/Header/header";
import Footer from "../src/components/Footer/Footer";
import CreateTutorEnderecoForm from "../src/components/CreateTutorEnderecoForm";


function PageCadastroTutor(){
    return(
        <div>
            <Header04/>
            <CreateTutorEnderecoForm/>
            <Footer/>
        </div>
    )
}

export default PageCadastroTutor;
